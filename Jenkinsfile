pipeline {
  agent any

  // Environment
  environment {
    DOCKER_HUB_USER = credentials('DOCKER_HUB_USER')
    DOCKER_HUB_PASS = credentials('DOCKER_HUB_PASS')
  }

  stages {

    stage ('Checkout') {
      steps {
        checkout scm
      }
    }
  
    stage ('Build') {
      steps {
        sh 'cd moj-fe && make build'
        sh 'cd moj-be && make build'
        sh 'cd db && make build'
      }
    }

    stage ('Test') {
      steps {
        sh 'cd moj-fe && make test'
        sh 'cd moj-be && make test'
      }
    }

    stage ('Deploy') {
      when {
        branch 'master'
      } 
      steps {
        sh 'cd moj-fe && make push'
        sh 'cd moj-be && make push'
        sh 'cd db && make push'
        sh 'echo TODO env deploy and test'
      }
    }

  }

  post {
    always {
      echo 'I have finished'
    }
    success {
      echo 'Build is full of WIN!'
      slackSend channel:'#thehubsystems',
        color: 'good',
        message: 'Build is full of WIN!'
    }
    unstable {
      echo 'I am unstable :/'
    }
    failure {
      echo 'Build is FAIL!'
      slackSend channel:'#thehubsystems',
        color: 'bad',
        message: 'Build FAIL!'
    }
    changed {
      echo 'Things are different...'
    }
  }


}
