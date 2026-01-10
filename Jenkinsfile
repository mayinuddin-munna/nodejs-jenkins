pipeline {
    agent any

    environment {
        APP_NAME = "nodejs-jenkins"
        APP_DIR  = "/var/www/nodejs-jenkins"
        NODE_ENV = "production"
        SSH_USER = "ubuntu"
        SSH_HOST = "16.112.113.14"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/mayinuddin-munna/nodejs-jenkins.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build TypeScript') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to VM with PM2') {
            steps {
                sshagent(['vm-ssh-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${SSH_USER}@${SSH_HOST} '
                        mkdir -p ${APP_DIR}
                    '

                    rsync -az --delete \
                        dist \
                        package.json \
                        package-lock.json \
                        ecosystem.config.js \
                        .env \
                        ${SSH_USER}@${SSH_HOST}:${APP_DIR}/

                    ssh ${SSH_USER}@${SSH_HOST} '
                        cd ${APP_DIR}
                        export NODE_ENV=${NODE_ENV}
                        npm ci --omit=dev
                        pm2 start ecosystem.config.js --env production || pm2 restart ${APP_NAME}
                        pm2 save
                    '
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Deployment completed successfully"
        }
        failure {
            echo "Deployment failed"
        }
    }
}
