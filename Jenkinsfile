pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = 'DockerHub-Office'
        IMAGE_NAME = 'charan208/dpt09'
        IMAGE_TAG = 'v1'
        K8S_CONTEXT = 'docker-desktop'
    }

    stages {
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
                        bat """
                            echo %DOCKER_PASSWORD% | docker login -u %DOCKER_USERNAME% --password-stdin
                        """
                    }
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    retry(3) {
                        bat "docker push %IMAGE_NAME%:%IMAGE_TAG%"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    bat "kubectl config use-context %K8S_CONTEXT%"
                    bat "kubectl apply -f k8s\\deployment.yaml"
                }
            }
        }
    }
}
