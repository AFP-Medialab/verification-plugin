pipeline {
    agent any
    environment {
        version = "${env.BRANCH_NAME}-${env.BUILD_ID}"
        CONFIG_FILE_ID = "weverify-plugin-${env.BRANCH_NAME}-env"
    }
    stages {
         stage ('Build Plugin') {
            agent {
                docker {
                    image 'node:16.13.2-slim'
                    reuseNode true
                }
            }
            when {
                anyOf {
                    branch 'pre-master';
                    branch 'master';
                }  
            }
            steps {
                configFileProvider([configFile(fileId: CONFIG_FILE_ID, targetLocation: '.env')]){
                    sh "npm ci"
                    sh "npm run build"
                }
            }
        }

        stage ('Deliver') {
            when {
                anyOf {
                    branch 'pre-master';
                    branch 'master';
                }
                
            }
            steps {
                zip zipFile: "/var/build/${env.BRANCH_NAME}/we-werify-plugin-${version}-${GIT_COMMIT}.zip", dir: "./build"
            }
        }
    }
}