
pipeline {
  agent { label 'Linux80' }
  options {
    timestamps()
    timeout(time: 20, unit: 'MINUTES')
  }
  
  stages {
    stage('Checkout') {
      steps {
        git branch: 'main',
            url: 'git@github.com:Inistate/automated-web-test02.git',
            credentialsId: 'github-deploykey-automatedweb2'
      }
    }
    
    stage('Install deps & test') {
      steps {
        sh '''
          . ~/.nvm/nvm.sh
          nvm install 20
          nvm use 20
          node -v
          npm -v
          npm ci
          npx playwright install
          npm run test:Jenkins
        '''
      }
      post {
        always {
          junit allowEmptyResults: true, testResults: 'reports/results.xml'
          archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true, onlyIfSuccessful: false
          archiveArtifacts artifacts: 'test-results/**', fingerprint: true, onlyIfSuccessful: false
        }
      }
    }
  }

  post {
    always {
      echo 'Pipeline finished.'
    }
  }
}
