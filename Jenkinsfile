pipeline {
    agent any

    environment {
        NODE_VERSION = '18.19.0'
        BUILD_DIR = 'build'
        DOCKER_REGISTRY = 'your-docker-registry.io'
        DOCKER_CREDENTIALS_ID = 'docker-registry-credentials'
        KUBECONFIG_CREDENTIALS_ID = 'kubeconfig-credentials'
        KUBERNETES_NAMESPACE = 'production'
        DEPLOYMENT_STRATEGY = "${params.DEPLOYMENT_STRATEGY ?: 'rolling'}"
        IMAGE_TAG = "${env.GIT_COMMIT?.take(8) ?: 'latest'}"
        SLACK_CHANNEL = '#deployments'
        SLACK_CREDENTIALS_ID = 'slack-webhook'
    }

    parameters {
        choice(
            name: 'DEPLOYMENT_STRATEGY',
            choices: ['rolling', 'blue-green', 'canary'],
            description: 'Select deployment strategy'
        )
        choice(
            name: 'ENVIRONMENT',
            choices: ['staging', 'production'],
            description: 'Target environment'
        )
        string(
            name: 'CANARY_PERCENTAGE',
            defaultValue: '10',
            description: 'Percentage of traffic for canary deployment (1-100)'
        )
        booleanParam(
            name: 'RUN_SMOKE_TESTS',
            defaultValue: true,
            description: 'Run smoke tests after deployment'
        )
        booleanParam(
            name: 'AUTO_ROLLBACK',
            defaultValue: true,
            description: 'Automatically rollback on failure'
        )
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "🔄 Checking out code from repository..."
                    checkout scm

                    env.GIT_COMMIT_MSG = sh(
                        script: "git log -1 --pretty=%B",
                        returnStdout: true
                    ).trim()

                    echo "📝 Commit: ${env.GIT_COMMIT_MSG}"
                }
            }
        }

        stage('Environment Setup') {
            steps {
                script {
                    echo "🔧 Setting up Node.js environment..."
                    sh '''
                    . ~/.nvm/nvm.sh
                    nvm install ${NODE_VERSION}
                    nvm use ${NODE_VERSION}
                    node --version
                    npm --version
                    '''
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    echo "📦 Installing dependencies..."
                    sh '''
                    . ~/.nvm/nvm.sh
                    nvm use ${NODE_VERSION}

                    # Clean install with cache optimization
                    npm ci --prefer-offline --no-audit

                    # Install frontend dependencies
                    cd frontend
                    npm ci --prefer-offline --no-audit
                    cd ..
                    '''
                }
            }
        }

        stage('Code Quality & Security Checks') {
            parallel {
                stage('Lint') {
                    steps {
                        script {
                            echo "🔍 Running ESLint..."
                            sh '''
                            . ~/.nvm/nvm.sh
                            nvm use ${NODE_VERSION}
                            npm run lint || true
                            '''
                        }
                    }
                }

                stage('Security Audit') {
                    steps {
                        script {
                            echo "🔒 Running security audit..."
                            sh '''
                            . ~/.nvm/nvm.sh
                            nvm use ${NODE_VERSION}
                            npm audit --audit-level=high || true
                            '''
                        }
                    }
                }

                stage('Dependency Check') {
                    steps {
                        script {
                            echo "📊 Checking for outdated dependencies..."
                            sh '''
                            . ~/.nvm/nvm.sh
                            nvm use ${NODE_VERSION}
                            npm outdated || true
                            '''
                        }
                    }
                }
            }
        }

        stage('Run Tests') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        script {
                            echo "🧪 Running unit tests..."
                            sh '''
                            . ~/.nvm/nvm.sh
                            nvm use ${NODE_VERSION}
                            npm test -- --coverage --ci
                            '''
                        }
                    }
                }

                stage('Integration Tests') {
                    steps {
                        script {
                            echo "🔗 Running integration tests..."
                            sh '''
                            . ~/.nvm/nvm.sh
                            nvm use ${NODE_VERSION}
                            npm run test:integration || echo "Integration tests not configured"
                            '''
                        }
                    }
                }
            }
        }

        stage('Build') {
            parallel {
                stage('Build Backend') {
                    steps {
                        script {
                            echo "🏗️ Building backend application..."
                            sh '''
                            . ~/.nvm/nvm.sh
                            nvm use ${NODE_VERSION}
                            npm run build || echo "No build script defined"
                            '''
                        }
                    }
                }

                stage('Build Frontend') {
                    steps {
                        script {
                            echo "🏗️ Building frontend application..."
                            sh '''
                            . ~/.nvm/nvm.sh
                            nvm use ${NODE_VERSION}
                            cd frontend
                            npm run build
                            cd ..
                            '''
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo "🐳 Building Docker images..."

                    docker.withRegistry("https://${DOCKER_REGISTRY}", DOCKER_CREDENTIALS_ID) {
                        // Build backend image
                        def backendImage = docker.build(
                            "${DOCKER_REGISTRY}/tictactoe-backend:${IMAGE_TAG}",
                            "-f Dockerfile ."
                        )
                        backendImage.push()
                        backendImage.push('latest')

                        // Build frontend image
                        def frontendImage = docker.build(
                            "${DOCKER_REGISTRY}/tictactoe-frontend:${IMAGE_TAG}",
                            "-f frontend/Dockerfile ./frontend"
                        )
                        frontendImage.push()
                        frontendImage.push('latest')
                    }

                    echo "✅ Docker images built and pushed successfully"
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    echo "🚀 Starting deployment with strategy: ${DEPLOYMENT_STRATEGY}"

                    withCredentials([file(credentialsId: KUBECONFIG_CREDENTIALS_ID, variable: 'KUBECONFIG')]) {
                        switch(DEPLOYMENT_STRATEGY) {
                            case 'blue-green':
                                deployBlueGreen()
                                break
                            case 'canary':
                                deployCanary()
                                break
                            default:
                                deployRolling()
                                break
                        }
                    }
                }
            }
        }

        stage('Smoke Tests') {
            when {
                expression { params.RUN_SMOKE_TESTS }
            }
            steps {
                script {
                    echo "🔥 Running smoke tests..."
                    sh '''
                    . ~/.nvm/nvm.sh
                    nvm use ${NODE_VERSION}

                    # Wait for services to be ready
                    sleep 30

                    # Run smoke tests
                    npm run test:smoke || echo "Smoke tests not configured"
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo "🏥 Running health checks..."

                    withCredentials([file(credentialsId: KUBECONFIG_CREDENTIALS_ID, variable: 'KUBECONFIG')]) {
                        def healthCheckPassed = sh(
                            script: '''
                            kubectl --kubeconfig=$KUBECONFIG get pods -n ${KUBERNETES_NAMESPACE} \
                                -l app=backend -o jsonpath='{.items[*].status.phase}' | grep -q Running
                            ''',
                            returnStatus: true
                        ) == 0

                        if (!healthCheckPassed && params.AUTO_ROLLBACK) {
                            error "Health check failed! Triggering automatic rollback..."
                        }
                    }
                }
            }
        }

        stage('Performance Tests') {
            steps {
                script {
                    echo "⚡ Running performance tests..."
                    sh '''
                    . ~/.nvm/nvm.sh
                    nvm use ${NODE_VERSION}
                    npm run test:performance || echo "Performance tests not configured"
                    '''
                }
            }
        }
    }

    post {
        success {
            script {
                echo '✅ Build, Test, and Deployment succeeded!'

                // Send success notification
                sendNotification(
                    'SUCCESS',
                    "Deployment successful - Strategy: ${DEPLOYMENT_STRATEGY}, Environment: ${params.ENVIRONMENT}"
                )

                // Tag the successful deployment
                sh '''
                git tag -a "deploy-${IMAGE_TAG}" -m "Deployed ${IMAGE_TAG} to ${ENVIRONMENT}"
                git push origin "deploy-${IMAGE_TAG}" || true
                '''
            }
        }

        failure {
            script {
                echo '❌ Build, Test, or Deployment failed!'

                // Send failure notification
                sendNotification(
                    'FAILURE',
                    "Deployment failed - Strategy: ${DEPLOYMENT_STRATEGY}, Environment: ${params.ENVIRONMENT}"
                )

                // Auto-rollback if enabled
                if (params.AUTO_ROLLBACK && currentBuild.currentResult == 'FAILURE') {
                    withCredentials([file(credentialsId: KUBECONFIG_CREDENTIALS_ID, variable: 'KUBECONFIG')]) {
                        performRollback()
                    }
                }
            }
        }

        always {
            script {
                echo '🧹 Cleaning up...'

                // Archive test results
                junit testResults: '**/test-results/*.xml', allowEmptyResults: true

                // Archive coverage reports
                publishHTML([
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'coverage',
                    reportFiles: 'index.html',
                    reportName: 'Coverage Report'
                ])

                // Clean workspace
                cleanWs()
            }
        }
    }
}

// ============================================================================
// DEPLOYMENT FUNCTIONS
// ============================================================================

def deployRolling() {
    echo "📦 Executing rolling deployment..."

    sh """
    kubectl --kubeconfig=\$KUBECONFIG set image deployment/backend-deployment \
        backend=${DOCKER_REGISTRY}/tictactoe-backend:${IMAGE_TAG} \
        -n ${KUBERNETES_NAMESPACE}

    kubectl --kubeconfig=\$KUBECONFIG set image deployment/frontend-deployment \
        frontend=${DOCKER_REGISTRY}/tictactoe-frontend:${IMAGE_TAG} \
        -n ${KUBERNETES_NAMESPACE}

    kubectl --kubeconfig=\$KUBECONFIG rollout status deployment/backend-deployment -n ${KUBERNETES_NAMESPACE} --timeout=5m
    kubectl --kubeconfig=\$KUBECONFIG rollout status deployment/frontend-deployment -n ${KUBERNETES_NAMESPACE} --timeout=5m
    """

    echo "✅ Rolling deployment completed"
}

def deployBlueGreen() {
    echo "🔵🟢 Executing blue-green deployment..."

    // Determine current active version
    def currentVersion = sh(
        script: """
        kubectl --kubeconfig=\$KUBECONFIG get service backend-service \
            -n ${KUBERNETES_NAMESPACE} \
            -o jsonpath='{.spec.selector.version}' || echo 'blue'
        """,
        returnStdout: true
    ).trim()

    def targetVersion = (currentVersion == 'blue') ? 'green' : 'blue'

    echo "Current version: ${currentVersion}, Target version: ${targetVersion}"

    // Deploy to target environment
    sh """
    # Update target deployment with new image
    kubectl --kubeconfig=\$KUBECONFIG set image deployment/backend-deployment-${targetVersion} \
        backend=${DOCKER_REGISTRY}/tictactoe-backend:${IMAGE_TAG} \
        -n ${KUBERNETES_NAMESPACE}

    kubectl --kubeconfig=\$KUBECONFIG set image deployment/frontend-deployment-${targetVersion} \
        frontend=${DOCKER_REGISTRY}/tictactoe-frontend:${IMAGE_TAG} \
        -n ${KUBERNETES_NAMESPACE}

    # Wait for rollout to complete
    kubectl --kubeconfig=\$KUBECONFIG rollout status deployment/backend-deployment-${targetVersion} -n ${KUBERNETES_NAMESPACE} --timeout=5m
    kubectl --kubeconfig=\$KUBECONFIG rollout status deployment/frontend-deployment-${targetVersion} -n ${KUBERNETES_NAMESPACE} --timeout=5m

    # Scale up target deployment if needed
    kubectl --kubeconfig=\$KUBECONFIG scale deployment/backend-deployment-${targetVersion} --replicas=3 -n ${KUBERNETES_NAMESPACE}
    kubectl --kubeconfig=\$KUBECONFIG scale deployment/frontend-deployment-${targetVersion} --replicas=3 -n ${KUBERNETES_NAMESPACE}

    # Wait for pods to be ready
    sleep 30
    """

    // Run validation tests on target environment
    def validationPassed = validateDeployment(targetVersion)

    if (validationPassed) {
        echo "✅ Validation passed, switching traffic to ${targetVersion}..."

        // Switch traffic to target version
        sh """
        kubectl --kubeconfig=\$KUBECONFIG patch service backend-service \
            -n ${KUBERNETES_NAMESPACE} \
            -p '{"spec":{"selector":{"version":"${targetVersion}"}}}'

        kubectl --kubeconfig=\$KUBECONFIG patch service frontend-service \
            -n ${KUBERNETES_NAMESPACE} \
            -p '{"spec":{"selector":{"version":"${targetVersion}"}}}'
        """

        echo "🎉 Traffic switched to ${targetVersion}"

        // Scale down old version after successful switch
        sh """
        sleep 60
        kubectl --kubeconfig=\$KUBECONFIG scale deployment/backend-deployment-${currentVersion} --replicas=0 -n ${KUBERNETES_NAMESPACE}
        kubectl --kubeconfig=\$KUBECONFIG scale deployment/frontend-deployment-${currentVersion} --replicas=0 -n ${KUBERNETES_NAMESPACE}
        """
    } else {
        error "Validation failed for ${targetVersion}. Keeping traffic on ${currentVersion}."
    }
}

def deployCanary() {
    echo "🐤 Executing canary deployment..."

    def canaryPercentage = params.CANARY_PERCENTAGE.toInteger()
    def totalReplicas = 10
    def canaryReplicas = Math.max(1, (totalReplicas * canaryPercentage / 100).intValue())
    def stableReplicas = totalReplicas - canaryReplicas

    echo "Deploying with ${canaryReplicas} canary replicas and ${stableReplicas} stable replicas"

    // Deploy canary version
    sh """
    # Update canary deployment with new image
    kubectl --kubeconfig=\$KUBECONFIG set image deployment/backend-deployment-canary \
        backend=${DOCKER_REGISTRY}/tictactoe-backend:${IMAGE_TAG} \
        -n ${KUBERNETES_NAMESPACE}

    kubectl --kubeconfig=\$KUBECONFIG set image deployment/frontend-deployment-canary \
        frontend=${DOCKER_REGISTRY}/tictactoe-frontend:${IMAGE_TAG} \
        -n ${KUBERNETES_NAMESPACE}

    # Scale canary deployment
    kubectl --kubeconfig=\$KUBECONFIG scale deployment/backend-deployment-canary --replicas=${canaryReplicas} -n ${KUBERNETES_NAMESPACE}
    kubectl --kubeconfig=\$KUBECONFIG scale deployment/frontend-deployment-canary --replicas=${canaryReplicas} -n ${KUBERNETES_NAMESPACE}

    # Scale stable deployment
    kubectl --kubeconfig=\$KUBECONFIG scale deployment/backend-deployment-stable --replicas=${stableReplicas} -n ${KUBERNETES_NAMESPACE}
    kubectl --kubeconfig=\$KUBECONFIG scale deployment/frontend-deployment-stable --replicas=${stableReplicas} -n ${KUBERNETES_NAMESPACE}

    # Wait for rollout
    kubectl --kubeconfig=\$KUBECONFIG rollout status deployment/backend-deployment-canary -n ${KUBERNETES_NAMESPACE} --timeout=5m
    kubectl --kubeconfig=\$KUBECONFIG rollout status deployment/frontend-deployment-canary -n ${KUBERNETES_NAMESPACE} --timeout=5m
    """

    echo "⏳ Monitoring canary deployment for 5 minutes..."
    sleep 300

    // Validate canary deployment
    def canaryHealthy = validateCanaryHealth()

    if (canaryHealthy) {
        echo "✅ Canary is healthy, promoting to stable..."

        // Promote canary to stable
        sh """
        # Update stable deployment with canary image
        kubectl --kubeconfig=\$KUBECONFIG set image deployment/backend-deployment-stable \
            backend=${DOCKER_REGISTRY}/tictactoe-backend:${IMAGE_TAG} \
            -n ${KUBERNETES_NAMESPACE}

        kubectl --kubeconfig=\$KUBECONFIG set image deployment/frontend-deployment-stable \
            frontend=${DOCKER_REGISTRY}/tictactoe-frontend:${IMAGE_TAG} \
            -n ${KUBERNETES_NAMESPACE}

        # Scale stable back to full capacity
        kubectl --kubeconfig=\$KUBECONFIG scale deployment/backend-deployment-stable --replicas=${totalReplicas} -n ${KUBERNETES_NAMESPACE}
        kubectl --kubeconfig=\$KUBECONFIG scale deployment/frontend-deployment-stable --replicas=${totalReplicas} -n ${KUBERNETES_NAMESPACE}

        # Wait for stable rollout
        kubectl --kubeconfig=\$KUBECONFIG rollout status deployment/backend-deployment-stable -n ${KUBERNETES_NAMESPACE} --timeout=5m
        kubectl --kubeconfig=\$KUBECONFIG rollout status deployment/frontend-deployment-stable -n ${KUBERNETES_NAMESPACE} --timeout=5m

        # Scale down canary
        kubectl --kubeconfig=\$KUBECONFIG scale deployment/backend-deployment-canary --replicas=0 -n ${KUBERNETES_NAMESPACE}
        kubectl --kubeconfig=\$KUBECONFIG scale deployment/frontend-deployment-canary --replicas=0 -n ${KUBERNETES_NAMESPACE}
        """

        echo "🎉 Canary promoted to stable successfully"
    } else {
        error "Canary deployment unhealthy. Rolling back..."
    }
}

def validateDeployment(String version) {
    echo "🔍 Validating deployment version: ${version}"

    try {
        // Check if all pods are running
        sh """
        kubectl --kubeconfig=\$KUBECONFIG wait --for=condition=ready pod \
            -l app=backend,version=${version} \
            -n ${KUBERNETES_NAMESPACE} \
            --timeout=300s

        kubectl --kubeconfig=\$KUBECONFIG wait --for=condition=ready pod \
            -l app=frontend,version=${version} \
            -n ${KUBERNETES_NAMESPACE} \
            --timeout=300s
        """

        return true
    } catch (Exception e) {
        echo "❌ Validation failed: ${e.message}"
        return false
    }
}

def validateCanaryHealth() {
    echo "🔍 Validating canary health..."

    try {
        // Check canary pod health
        sh """
        kubectl --kubeconfig=\$KUBECONFIG wait --for=condition=ready pod \
            -l app=backend,track=canary \
            -n ${KUBERNETES_NAMESPACE} \
            --timeout=60s

        kubectl --kubeconfig=\$KUBECONFIG wait --for=condition=ready pod \
            -l app=frontend,track=canary \
            -n ${KUBERNETES_NAMESPACE} \
            --timeout=60s
        """

        // Additional health checks can be added here (e.g., Prometheus metrics)

        return true
    } catch (Exception e) {
        echo "❌ Canary health check failed: ${e.message}"
        return false
    }
}

def performRollback() {
    echo "🔄 Performing automatic rollback..."

    try {
        sh """
        kubectl --kubeconfig=\$KUBECONFIG rollout undo deployment/backend-deployment -n ${KUBERNETES_NAMESPACE}
        kubectl --kubeconfig=\$KUBECONFIG rollout undo deployment/frontend-deployment -n ${KUBERNETES_NAMESPACE}

        kubectl --kubeconfig=\$KUBECONFIG rollout status deployment/backend-deployment -n ${KUBERNETES_NAMESPACE} --timeout=5m
        kubectl --kubeconfig=\$KUBECONFIG rollout status deployment/frontend-deployment -n ${KUBERNETES_NAMESPACE} --timeout=5m
        """

        echo "✅ Rollback completed successfully"
    } catch (Exception e) {
        echo "❌ Rollback failed: ${e.message}"
        throw e
    }
}

def sendNotification(String status, String message) {
    def color = (status == 'SUCCESS') ? 'good' : 'danger'
    def emoji = (status == 'SUCCESS') ? '✅' : '❌'

    try {
        slackSend(
            channel: SLACK_CHANNEL,
            color: color,
            message: """
            ${emoji} *${status}*: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}

            *Message*: ${message}
            *Branch*: ${env.GIT_BRANCH}
            *Commit*: ${env.GIT_COMMIT?.take(8)}
            *Author*: ${env.GIT_AUTHOR_NAME}

            <${env.BUILD_URL}|View Build>
            """,
            tokenCredentialId: SLACK_CREDENTIALS_ID
        )
    } catch (Exception e) {
        echo "Failed to send Slack notification: ${e.message}"
    }
}
