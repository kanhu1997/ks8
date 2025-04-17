pipeline {
    agent any

    environment {
        IMAGE_NAME = 'charan208/dpt09'
        IMAGE_TAG = 'v12'
        K8S_CONTEXT = 'docker-desktop'
    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    echo "📦 Building local Docker image..."
                    bat "docker build -t %IMAGE_NAME%:%IMAGE_TAG% ."
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "🚀 Deploying to Kubernetes with local image..."
                    bat "kubectl config use-context %K8S_CONTEXT%"
                    bat "kubectl apply -f k8s\\deployment.yaml"
                }
            }
        }
    }

    post {
        failure {
            echo '❌ Build or deploy failed!'
        }
        success {
            echo '✅ Successfully built and deployed!'
        }
    }
}
