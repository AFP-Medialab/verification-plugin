pipeline {
    agent none

    stages {
        stage ('Build Node') {
            agent {
                docker {
                    images 'node:16.13.2-slim'
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
            agent any
            when {
                branch 'pre-master'
            }
            steps {
                version = "${env.BRANCH_NAME}-${env.BUILD_ID}-${GIT_COMMIT}"
                zip zipFile: "/var/build/we-werify-plugin-${version}.zip", dir: "./build"
            }
        }
    }
}