pipeline {
    agent any

    environment {
        IMAGE_NAME = 'charan208/dpt09'
        IMAGE_TAG = 'v12'
        K8S_CONTEXT = 'docker-desktop'
    }

    stages {
        stage('Set Environment from Git Branch') {
            steps {
                script {
                    // Get the current Git branch
                    def branch = env.GIT_BRANCH ?: sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim()

                    // Strip origin/ if present (e.g., origin/dev becomes dev)
                    branch = branch.replaceFirst(/^origin\//, '')

                    // Set the ENV variable based on the branch
                    echo "🌿 Git branch detected: ${branch}"
                    env.ENV = branch
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "📦 Building local Docker image: ${IMAGE_NAME}:${IMAGE_TAG}"
                    bat "docker build -t %IMAGE_NAME%:%IMAGE_TAG% ."
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "🚀 Deploying to Kubernetes namespace: ${env.ENV}"
                    bat "kubectl config use-context %K8S_CONTEXT%"
                    bat "kubectl apply -f k8s\\deployment.yaml -n ${env.ENV}"
                    bat "kubectl apply -f k8s\\service.yaml -n ${env.ENV}"
                }
            }
        }
    }

    post {
        failure {
            echo '❌ Build or deploy failed!'
        }
        success {
            echo "✅ Successfully built and deployed to ${env.ENV}!"
        }
    }
}
