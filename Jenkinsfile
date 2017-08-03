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
        sh 'cd moj-fe && make build && make push'
        sh 'cd moj-be && make build && make push'
        sh 'cd db && make build && make push'
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
