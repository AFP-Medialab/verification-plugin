pipeline {
    agent any
    environment {
        version = "${env.BRANCH_NAME}-${env.BUILD_ID}"
        CONFIG_FILE_ID = "weverify-plugin-${env.BRANCH_NAME}-env"
        //Test
    }
    stages {
         stage ('Build Plugin') {
            agent {
                docker {
                    image 'node:22-alpine'
                    reuseNode true
                }
            }
            when {
                anyOf {
                    branch 'beta-master';
                    branch 'pre-master';
                    branch 'master';
                }  
            }
            steps {
                slackSend channel: 'medialab_builds', message: "Start build ${env.JOB_NAME} - ID: ${env.BUILD_ID}", tokenCredentialId: 'medialab_slack_token'
                configFileProvider([configFile(fileId: CONFIG_FILE_ID, targetLocation: '.env')]){
                    sh "npm ci"
                    sh "npm run build"
                }
            }
        }

        stage ('Deliver') {
            when {
                anyOf {
                    branch 'beta-master';
                    branch 'pre-master';
                    branch 'master';
                }
                
            }
            steps {
                zip zipFile: "/var/build/${env.BRANCH_NAME}/we-werify-plugin-${version}-${GIT_COMMIT}.zip", dir: "./build"
            }
        }
    }
    post {
        success {
                slackSend channel: 'medialab_builds', message: "Success build ${env.JOB_NAME} - ID: ${env.BUILD_ID} artefact ready: /var/build/${env.BRANCH_NAME}/we-werify-plugin-${version}-${GIT_COMMIT}.zip", tokenCredentialId: 'medialab_slack_token'
        }
        failure {
            slackSend channel: 'medialab_builds', message: "Error building project ${env.JOB_NAME} - ID: ${env.BUILD_ID}", tokenCredentialId: 'medialab_slack_token'
        }
    }

}

