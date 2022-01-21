pipeline {
 agent {
        docker {
            image 'node:16.13.2-slim'
        }
    }
    stages {
        stage ('Build Node') {
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
                version = "${env.BUILD_ID}-${GIT_COMMIT}"
                zip zipFile: "we-werify-plugin-${version}.zip", dir: "./build"
            }
        }
    }
}