pipeline {
    agent any

    environment {
        // Khai báo các biến môi trường nếu cần
        K6_REPORT_NAME = "summary.html"
    }

    stages {
        stage('Checkout') {
            steps {
                // Jenkins sẽ tự động lấy code từ Git về nếu bạn cấu hình đúng ở Bước 4
                echo 'Pulling code from Git...'
                checkout scm
            }
        }

        stage('Environment Setup') {
            steps {
                echo 'Checking k6 installation...'
                sh 'k6 version'
            }
        }

        stage('Run K6 Performance Test') {
            steps {
                echo 'Starting k6 test...'
                // Thay vì dùng docker run, hãy dùng trực tiếp lệnh k6
                sh "k6 run practice_test.js"
            }
        }

        stage('Publish Report') {
            steps {
                echo 'Archiving test results...'
                // Lưu file summary.html lại để xem sau khi chạy xong
                archiveArtifacts artifacts: '*.html', allowEmptyArchive: true
                
                // Nếu bạn có cài Plugin "HTML Publisher", dùng lệnh này để hiển thị tab Report:
                // publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: true, reportDir: '.', reportFiles: 'summary.html', reportName: 'K6 Report', reportTitles: ''])
            }
        }
    }
}