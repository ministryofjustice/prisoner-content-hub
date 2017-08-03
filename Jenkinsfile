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
      parallel {
        stage ('Build frontend') {
          steps {
            sh 'cd moj-fe && make build && make push'
          }
        }
        stage ('Build backend') {
          steps {
            sh 'cd moj-be && make build && make push'
          }
        }
        stage ('Build DB') {
          steps {
            sh 'cd db && make build && make push'
          }
        }
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
        sh 'echo TODO'
      }
    }

  }

}
