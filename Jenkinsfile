pipeline {
    agent any

    environment {
        APP_NAME = "nodejs-jenkins"
        APP_DIR  = "/var/www/nodejs-jenkins"
        NODE_ENV = "production"
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
                sh 'yarn install --frozen-lockfile'
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
                    ssh -o StrictHostKeyChecking=no ubuntu@YOUR_VM_IP '
                        mkdir -p ${APP_DIR}
                    '

                    rsync -av --delete \
                        dist package.json package-lock.json ecosystem.config.js .env \
                        ubuntu@YOUR_VM_IP:${APP_DIR}/

                    ssh ubuntu@YOUR_VM_IP '
                        cd ${APP_DIR}
                        npm install --production
                        pm2 start dist/server.js --name ${APP_NAME} || pm2 restart ${APP_NAME}
                        pm2 save
                    '
                    """
                }
            }
        }
    }
}
