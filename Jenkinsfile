pipeline {
    agent any
    environment {
        HOST = credentials('host')
        PORT = credentials('port')
        DB_HOST = credentials('db_host')
        DB_PORT = credentials('db_port')
        DB_USER = credentials('db_user')
        DB_PW = credentials('db_pw')
        DB_NAME = credentials('db_name')
        JWT_SECRET_KEY = credentials('jwt_secret_key')
        Eureka_HOST = credentials('eureka_host')
        Eureka_PORT = credentials('eureka_port')
        KAFKAJS_NO_PARTITIONER_WARNING = credentials('kafkajs_no_partitioner_warning')
        KAFKA_ENV = credentials('kafka_env')
        KAFKA_HOST = credentials('kafka_host')
        KAFKA_PORT = credentials('kafka_port')
        KAFKA_AUTO_OFFSET_RESET = credentials('kafka_auto_offset_reset')
    }

    stages {
        stage('Clone') {
            steps {
                echo 'Cloning dev.................'
                checkout scmGit(branches: [[name: '*/dev']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/O-H-A/OHA-Diary-Service.git']])
            }
        }

        stage('Deleting latest containers and images') {
            steps {
                echo 'Deleting .env file......'
                sh 'rm -f ./src/config/env/.product.env || true'
                script {
                    echo 'Deleting latest containers for diary............'
                    sh 'docker kill diary || true'  // 컨테이너가 없을 경우 에러 무시
                    sh 'docker rm diary || true'
                }
                echo 'Deleting latest images............'
                sh 'docker rmi -f $(docker images -q --filter "reference=snghyun/*") || true'
            }
        }

        stage('Build Docker images And Deploy') {
            steps {
                script {
                    echo "inserting env variables ............"
                    dir('./src/config/env') {
                        sh '''
                            echo "HOST=${HOST}" > .product.env
                            echo "PORT=${PORT}" >> .product.env
                            echo "DB_HOST=${DB_HOST}" >> .product.env
                            echo "DB_PORT=${DB_PORT}" >> .product.env
                            echo "DB_USER=${DB_USER}" >> .product.env
                            echo "DB_PW=${DB_PW}" >> .product.env
                            echo "DB_NAME=${DB_NAME}" >> .product.env
                            echo "JWT_SECRET_KEY=${JWT_SECRET_KEY}" >> .product.env
                            echo "Eureka_HOST=${Eureka_HOST}" >> .product.env
                            echo "Eureka_PORT=${Eureka_PORT}" >> .product.env
                            echo "KAFKAJS_NO_PARTITIONER_WARNING=${KAFKAJS_NO_PARTITIONER_WARNING}" >> .product.env
                            echo "KAFKA_ENV=${KAFKA_ENV}" >> .product.env
                            echo "KAFKA_HOST=${KAFKA_HOST}" >> .product.env
                            echo "KAFKA_PORT=${KAFKA_PORT}" >> .product.env
                            echo "KAFKA_AUTO_OFFSET_RESET=${KAFKA_AUTO_OFFSET_RESET}" >> .product.env
                        '''
                    }
                }
                sh 'docker build -t oha_diary .'
                sh 'mkdir -p /home/upload/diary'
                sh 'docker run -d -p 3000:3000 --name diary -v /home/upload:/home/upload oha_diary'
            }
        }

        stage('Tag and Push to Hub') {
            steps {
                echo "Tagging and pushing to hub.................."
                script {
                    stage ("diary Push") {
                        echo "diary Pushing..."
                        withCredentials([string(credentialsId: 'docker_pwd', variable: 'docker_hub_pwd')]) {
                            def imageTag = "snghyun/oha_diary:${BUILD_NUMBER}"
                            // 이미지 태깅
                            sh "docker tag oha_diary ${imageTag}"
                            // Hub에 로그인
                            sh "docker login -u snghyun331@gmail.com -p ${docker_hub_pwd}"
                            // 이미지를 허브로 푸쉬
                            sh "docker push ${imageTag}"
                        }
                    }
                }
            }
        }
    }
}