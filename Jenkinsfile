pipeline {
    agent any

    environment {
        NEO4J_USER = 'neo4j'
    }

    stages {
        stage('1. Checkout') {
            steps {
                // 깃허브에서 최신 소스코드 가져오기
                checkout scm
            }
        }

        stage('2. Build & Deploy Local Containers') {
            steps {
                // Jenkins 자격 증명에서 보안 환경변수 주입
                withCredentials([
                    string(credentialsId: 'gemini-api-key', variable: 'GEMINI_API_KEY'),
                    string(credentialsId: 'neo4j-password', variable: 'NEO4J_PASSWORD')
                ]) {
                    sh """
                    # 1. 프로덕션 환경변수 파일(.env) 로컬 워크스페이스에 생성
                    echo "GEMINI_API_KEY=${GEMINI_API_KEY}" > .env
                    echo "NEO4J_USER=${NEO4J_USER}" >> .env
                    echo "NEO4J_PASSWORD=${NEO4J_PASSWORD}" >> .env

                    # 2. 로컬 도커 컴포즈 빌드 및 백그라운드 실행
                    docker compose -f docker-compose.prod.yml up -d --build

                    # 3. 이전 빌드로 남은 미사용 찌꺼기 이미지 정리
                    docker image prune -f
                    """
                }
            }
        }

        stage('3. Health Check') {
            steps {
                script {
                    echo '컨테이너 실행 대기 및 헬스체크 진행 중...'
                    sleep 10 // 서비스 기동 대기 (초 단위)
                    
                    // 프론트엔드(3000) 및 백엔드(8000) 응답 확인
                    sh "curl -f http://localhost:3000 || exit 1"
                    sh "curl -f http://localhost:8000/api/v1/health || exit 1"
                }
            }
        }
    }

    post {
        success {
            echo '🚀 GraphRAG 로컬 배포가 성공적으로 완료되었습니다!'
        }
        failure {
            echo '❌ 배포 실패. Jenkins 빌드 콘솔 로그를 확인하세요.'
        }
    }
}