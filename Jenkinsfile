pipeline {
    agent none
    environment {
        version = "${env.BUILD_ID}-${GIT_COMMIT}"
    }
    stages {
        stage ('Build Node') {
            agent {
                docker 'node:16.13.2-slim'
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
                zip zipFile: "we-werify-plugin-${version}.zip", dir: "./build"
            }
        }
    }
}