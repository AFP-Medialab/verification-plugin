pipeline {
    agent any
    environment {
        version = "${env.BRANCH_NAME}-${env.BUILD_ID}"
    }
    stages {
        stage ('Build Test') {
            agent {
                docker {
                    image 'node:16.13.2-slim'
                    reuseNode true
                }
            }
             when {
                branch 'pre-master'
            }
            steps {
                configFileProvider([configFile(fileId: 'weverify-plugin-pre-master-env', targetLocation: '.env')]){
                    sh "npm ci"
                    sh "npm run build"
                }
            }
        }
        stage ('Build Prod') {
            agent {
                docker {
                    image 'node:16.13.2-slim'
                    reuseNode true
                }
            }
             when {
                branch 'master'
            }
            steps {
                configFileProvider([configFile(fileId: 'weverify-plugin-master-env', targetLocation: '.env')]){
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