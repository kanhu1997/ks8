pipeline {
    agent any

    parameters {
        choice(name: 'ENV', choices: ['dev', 'qa', 'uat', 'prod'], description: 'Select environment to deploy to')
    }

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
                    echo "🚀 Deploying to Kubernetes namespace: ${params.ENV}"
                    bat "kubectl config use-context %K8S_CONTEXT%"
                    bat "kubectl apply -f k8s\\deployment.yaml -n ${params.ENV}"
                    bat "kubectl apply -f k8s\\service.yaml -n ${params.ENV}"
                }
            }
        }
    }

    post {
        failure {
            echo '❌ Build or deploy failed!'
        }
        success {
            echo "✅ Successfully built and deployed to ${params.ENV}!"
        }
    }
}
