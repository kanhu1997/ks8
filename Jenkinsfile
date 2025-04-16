pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = 'DockerHub-Office'    // Jenkins DockerHub credential ID
        IMAGE_NAME = 'charan208/dpt09'
        IMAGE_TAG = 'v1'
        K8S_CONTEXT = 'docker-desktop'
    }

    stages {
        stage('Clone GitHub Repo') {
            steps {
                git 'https://github.com/kanhu1997/ks8.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: DOCKER_HUB_CREDENTIALS,
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )]) {
                        sh "echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin"
                    }
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    writeFile file: 'k8s-deployment.yaml', text: """
apiVersion: apps/v1
kind: Deployment
metadata:
  name: dpt09-deployment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: dpt09
  template:
    metadata:
      labels:
        app: dpt09
    spec:
      containers:
      - name: dpt09
        image: ${IMAGE_NAME}:${IMAGE_TAG}
        ports:
        - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: dpt09-service
spec:
  selector:
    app: dpt09
  type: NodePort
  ports:
  - port: 80
    targetPort: 3000
    nodePort: 30080
                    """
                    // Apply to Kubernetes
                    sh "kubectl config use-context ${K8S_CONTEXT}"
                    sh "kubectl apply -f k8s-deployment.yaml"
                }
            }
        }
    }
}
