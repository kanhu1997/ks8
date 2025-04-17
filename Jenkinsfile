pipeline {
    agent any

    parameters {
        choice(name: 'ENV', choices: ['dev', 'qa', 'uat', 'prod'], description: 'Select environment to deploy to')
    }

    environment {
        IMAGE_NAME = 'charan208/dpt09'
        IMAGE_TAG = 'v13'  // Update to the appropriate version
        K8S_CONTEXT = 'docker-desktop'
        DOCKER_CREDS = credentials('DockerHub-Office')  // Set up Jenkins credentials
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                script {
                    echo "🌱 Cloning GitHub repository"
                    checkout scm
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "📦 Building local Docker image..."
                    bat "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    echo "🔝 Pushing Docker image to Docker Hub..."
                    // Log in to Docker Hub using Jenkins credentials
                    bat "docker login -u ${DOCKER_CREDS_USR} -p ${DOCKER_CREDS_PSW}"
                    bat "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "🚀 Deploying to Kubernetes namespace: ${params.ENV}"
                    bat "kubectl config use-context ${K8S_CONTEXT}"
                    bat "kubectl apply -f k8s\\deployment.yaml -n ${params.ENV}"
                    bat "kubectl apply -f k8s\\service.yaml -n ${params.ENV}"

                    // Update Deployment with the new Docker image
                    bat "kubectl set image deployment/dpt09-deployment dpt09=${IMAGE_NAME}:${IMAGE_TAG} -n ${params.ENV}"
                }
            }
        }
    }

    post {
        failure {
            echo '❌ Build or deploy failed!'
        }
        success {
            echo "✅ Successfully built, pushed, and deployed to ${params.ENV}!"
        }
    }
}
