pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = 'DockerHub-Office'
        IMAGE_NAME = 'charan208/dpt09'
        IMAGE_TAG = "v${BUILD_NUMBER}"
        K8S_CONTEXT = 'docker-desktop'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/kanhu1997/ks8.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    bat "docker build -t %IMAGE_NAME%:%IMAGE_TAG% ."
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: env.DOCKER_HUB_CREDENTIALS,
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )]) {
                        bat "echo %DOCKER_PASSWORD% | docker login -u %DOCKER_USERNAME% --password-stdin"
                    }
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    bat "docker push %IMAGE_NAME%:%IMAGE_TAG%"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Replace the image tag in YAML before applying
                    bat """
                        powershell -Command "(Get-Content k8s\\deployment.yaml) -replace 'IMAGE_TAG', '%IMAGE_TAG%' | Set-Content k8s\\deployment-temp.yaml"
                        kubectl config use-context %K8S_CONTEXT%
                        kubectl apply -f k8s\\deployment-temp.yaml
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Successfully deployed: %IMAGE_NAME%:%IMAGE_TAG%"
        }
        failure {
            echo "❌ Build or deploy failed"
        }
    }
}
