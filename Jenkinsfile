pipeline {
    agent any
    environment {
        version = "${env.BRANCH_NAME}-${env.BUILD_ID}"
    }
    stages {
        stage ('Build Node') {
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
                script {
                    sh "npm ci"
                    sh "npm run build"
                }
            }
        }
        stage ('Deliver') {
            when {
                branch 'pre-master'
            }
            steps {
                
                zip zipFile: "/var/build/we-werify-plugin-${version}-${GIT_COMMIT}.zip", dir: "./build"
            }
        }
    }
}