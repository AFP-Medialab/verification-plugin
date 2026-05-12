pipeline {
    options { 
        timeout(time: 30, unit: 'MINUTES') 
    }

    agent {
        kubernetes {
            inheritFrom 'k8s-node-playwright-builder-pod'
        }
    }

    environment {
        VERSION_TAG = "${env.BRANCH_NAME}-${env.BUILD_ID}"
        S3_BUCKET = "verification-plugin-builds"
        AWS_REGION = "eu-west-1"
        CI="true"
    }

    stages {
        stage ('Build Plugin') {
            when {
                anyOf {
                    branch 'thomas-dev';
                }  
            }
            steps {
                slackSend channel: 'medialab_builds', message: "Start build ${env.JOB_NAME} - ID: ${env.BUILD_ID}", tokenCredentialId: 'medialab_slack_token'
                script {
                    if (env.BRANCH_NAME == "master" || env.BRANCH_NAME == "pre-master") {
                        env.ENV_FILE = ".env.production"
                        env.P_SCRIPT = "zip:all:production"
                    } else {
                        env.ENV_FILE = ".env.development"
                        env.P_SCRIPT = "zip:all:development"
                    }
                }
                container('aws-cli') {
                    script {
                        sh "aws s3 cp s3://${S3_BUCKET}/configuration/config-${env.BRANCH_NAME}.properties ${env.ENV_FILE}"
                    }
                }
                container('node') {
                    script {
                        sh "npm install -g pnpm"
                        sh "pnpm install --frozen-lockfile --store-dir ${WORKSPACE}/.pnpm-store"
                        
                        echo "Running build script: ${env.P_SCRIPT}"
                        sh "pnpm run ${env.P_SCRIPT}"
                    }
                }
            }
        }

        stage('Tests (Playwright)') {
            when {
                anyOf {
                    branch 'thomas-dev';
                }
            }
            steps {
                container('playwright') {
                    sh "npm install -g pnpm"
                    sh "pnpm install --frozen-lockfile --store-dir ${WORKSPACE}/.pnpm-store"
                    sh "pnpm exec playwright install --with-deps chromium"
                    echo "Component tests :"
                    sh "pnpm exec playwright test -c playwright-ct.config.js"
                    echo "E2E tests :"
                    sh "dbus-run-session -- pnpm exec playwright test"
                }
            }
            
            post {
                always {
                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright E2E Report'
                    ])
                }
            }
        }

        stage ('Deliver to s3') {
            when {
                anyOf {
                    branch 'thomas-dev';
                }  
            }
            steps {
                container('aws-cli') {
                    script {
                        echo "Uploading artifacts to S3..."
                        sh """                                                                                                                                                                                               
                            ZIP=\$(ls build/weverify-plugin-*.zip 2>/dev/null | head -1)                                                                                                                                       
                            if [ -z "\$ZIP" ]; then echo "No zip found!"; exit 1; fi                                                                                                                                           
                            aws s3 cp "\$ZIP" s3://${S3_BUCKET}/builds/${env.BRANCH_NAME}/we-verify-plugin-${VERSION_TAG}.zip                                                                                                  
                        """   
                    }
                }
            }
        }
    }
    post {
        success {
            slackSend channel: 'medialab_builds', 
                      message: "✅ SUCCESS: ${env.JOB_NAME} #${env.BUILD_ID}\nArtefact: s3://${S3_BUCKET}/builds/${env.BRANCH_NAME}/we-verify-plugin-${VERSION_TAG}.zip", 
                      tokenCredentialId: 'medialab_slack_token'
        }
        failure {
            slackSend channel: 'medialab_builds', 
                      message: "❌ FAILURE: ${env.JOB_NAME} #${env.BUILD_ID}. Vérifiez les logs et le rapport Playwright.", 
                      tokenCredentialId: 'medialab_slack_token'
        }
    }
}

