# GraphRAG Legal Interactive Presentation - 작업 진행 현황 및 개발 일지 (PROJECT_PROGRESS.md)

> 본 문서는 작업할 때마다 지속적으로 업데이트되는 단일 기준 문서(Single Source of Truth)입니다.
> 불필요한 반복 탐색 및 중복 코드 생성을 방지하여 **토큰 소모를 최소화**하고 **에러를 방지**하기 위해 항상 이 문서를 참조합니다.

---

## 📌 1. 프로젝트 핵심 요약 및 목표
- **프로젝트명**: GraphRAG Legal Interactive Presentation Web System (민법 도메인 15분 기술 발표용 라이브 데모)
- **핵심 흐름**: 연사 음성 발화 -> Groq Whisper STT 변환 -> Neo4j GraphRAG / Cypher 추론 -> WebSocket/SSE 실시간 통신 -> Three.js 3D UI 6단계 상태 전환 (새로고침 없이 동적 트랜지션)
- **필수 지침**: 모든 기능 구현 후 터미널에서 유닛 테스트 명령어를 직접 실행하고 100% 통과 확인 후 완료 보고.

---

## 🎯 2. 3D UI 6대 상태 머신 명세 (State Machine)

| 상태 (State) | 음성 트리거 / 조건 | 3D Canvas 시각적 변환 및 인터랙션 |
|---|---|---|
| `STATE_IDLE` | 기본 대기 상태 | 5,000개 초미세 노드가 구면 표면에 자연스럽게 흩뿌려져 은은한 하모닉 파동과 함께 안정적으로 자전 |
| `STATE_GALAXY_VIEW`<br/>(`STATE_GRAPH_OVERVIEW`) | "전체 데이터베이스 구조 보여줘" | 카메라 Zoom-out, 실제 데이터베이스의 그래프 구조(노드들과 노드 간을 잇는 관계 엣지들이 서로 그물망처럼 얽힌 3D 지식 그래프 네트워크)를 웅장하게 렌더링 |
| `STATE_VECTOR_SEARCH` | "기존 방식으로 제13조 검색해줘" | 자전 중단, 엣지 소멸. 1~2개 고립 노드만 빨간색으로 점멸. 한계점 경고 오버레이 팝업 |
| `STATE_GRAPH_TRAVERSAL` | "GraphRAG로 제13조 연관 구조 보여줘" | 제13조 노드로 급속 줌인, 3D 모핑. 준용(녹색), 예외(적색) 레이저 엣지가 제14·15·16조로 뻗어나감 |
| `STATE_COMPARE_ANSWERS` | "두 방식의 실제 자연어 답변 비교해줘" | 딤드(Dimmed) 3D 배경 위 Glassmorphism Split Card 오버레이 (VectorRAG vs GraphRAG 답변 비교) |
| `STATE_BENCHMARK_RADAR` | "벤치마크 성능 수치 보여줘" | 3D 레이더 차트 대시보드 팝업 (포괄성, Multi-hop 추론, 예외조항 재현율, 충실도) |

---

## 📂 3. 생성된 파일 레지스트리 (File Registry)

### Root (`/`)
- `docker-compose.yml`: Neo4j 5.19 (APOC 플러그인 포함) 및 볼륨 마운트 컨테이너 구성
- `.env`: Neo4j 계정 정보 및 AI API 키 환경 변수 (Git 무시)
- `.env.example`: 환경 변수 템플릿 파일
- `.gitignore`: node_modules, .next, .env, __pycache__ 등 제외 설정
- `package.json`: 루트 터미널에서 `npm run dev`, `npm run build`를 실행하기 위한 스크립트 래퍼
- `PROJECT_CONTEXT.md`: 프로젝트 전체 아키텍처 및 6대 상태 머신 요구사항 명세서
- `PROJECT_PROGRESS.md`: 현재 작업 진행 현황 및 파일 레지스트리 (본 문서)


### Frontend (`frontend/`)
- `package.json`: Next.js 16, Three.js, R3F, Framer Motion, Lucide, Tailwind 의존성 정의
- `src/types/graph.ts`: `GraphSystemState` (6개 상태), `GraphNodeInstance` 등 타입 정의
- `src/lib/constants/graphConfig.ts`: 3D 구체 반경, 색상, 애니메이션 파라미터 상수
- `src/lib/utils/math.ts`: 구면 좌표 및 피보나치 기하 계산 유틸
- `src/lib/utils/cn.ts`: Tailwind 클래스 병합 유틸 (`clsx` + `tailwind-merge`)
- `src/components/canvas/GraphCanvas.tsx`: R3F Canvas 루트 컨테이너 (조명, 카메라, 씬 배치)
- `src/components/canvas/MorphingGraphUniverse.tsx`: 5,000개 고밀도 입자 구체 ↔ 5-Arm 은하 ↔ 트래버설 통합 모핑 렌더러
- `src/components/canvas/LaserTraversalEdges.tsx`: 제13조 ➔ 14·15·16조 초록/빨강 3D 레이저 빔 애니메이션
- `src/components/canvas/Article3DLabels.tsx`: 3D 공간 상의 법률 조문 HTML 빌보드 라벨
- `src/components/canvas/CameraController.tsx`: 상태별 부드러운 카메라 시점 줌인/줌아웃 Lerp 제어
- `src/components/ui/GlassCard.tsx`: 글래스모피즘 컨테이너 카드
- `src/components/ui/StatusBadge.tsx`: 6대 시스템 상태 인디케이터 뱃지
- `src/components/ui/Header.tsx`: 상단 브랜드 및 시스템 텔레메트리 헤더
- `src/components/ui/ControlBar.tsx`: 하단 법률 쿼리 및 백엔드 API 연동 제어바
- `src/components/overlays/OverlayManager.tsx`: Framer-Motion 기반 오버레이 관리자
- `src/components/overlays/BenchmarkRadarOverlay.tsx`: 성능 벤치마크 레이더 차트 대시보드
- `src/app/page.tsx`: 메인 대시보드 뷰
- `src/app/layout.tsx` / `globals.css`: 다크 테마 전역 레이아웃 및 스타일


### Backend (`backend/`)
- `requirements.txt`: FastAPI, Uvicorn, Neo4j, Groq, Pydantic, Pydantic-settings, python-dotenv, httpx
- `app/main.py`: FastAPI 애플리케이션 진입점 및 CORS 설정
- `app/core/config.py`: Pydantic Settings 기반 환경 변수 설정
- `app/core/logging.py`: 표준 로깅 모듈
- `app/models/graph.py`: Node, Edge, Subgraph Pydantic 스키마
- `app/models/query.py`: QueryRequest, QueryResponse 스키마
- `app/services/neo4j_service.py`: Neo4j 드라이버 연결 및 헬스체크
- `app/services/llm_service.py`: Groq LLM 비동기 추론 서비스
- `app/api/v1/endpoints/health.py`: 헬스체크 엔드포인트
- `app/api/v1/endpoints/graph.py`: 그래프 데이터 및 쿼리 엔드포인트
- `app/api/v1/router.py`: API v1 라우터 통합
- `app/pipeline/civil_act_parser.py`: 조문 가지번호 방어, 유니코드 정규화, 계층 분할 및 Clause 서브청킹 파서
- `app/pipeline/hybrid_extractor.py`: 준용(MUTATIS_MUTANDIS), 예외(EXCEPTION_TO), 참조(REFERENCES) 관계 추출기 (고스트 노드 방어)
- `app/pipeline/neo4j_loader.py`: UNIQUE CONSTRAINT DDL 우선 실행 및 UNWIND 500건 단위 벌크 MERGE 로더
- `app/pipeline/ingest.py`: 원클릭 전체 민법 적재 CLI 실행 스크립트
- `civil_law.txt`: 대한민국 민법 원문 데이터 (375KB)
- `.env.example`: 환경 변수 템플릿

---

## 📋 4. 단계별 진행 체크리스트 (Roadmap & Progress)

- [x] **Step 1**: Next.js 16 + R3F + Tailwind CSS 기본 프론트엔드 환경 구축
- [x] **Step 2**: Python FastAPI 모듈화 백엔드 기본 환경 및 의존성 구성
- [x] **Step 3**: `STATE_IDLE` 3D Canvas 구현 (5,000개 고밀도 미세 노드가 촘촘하게 흩뿌려져 은은한 파동으로 자전하는 실키 포인트 클라우드 구체 완성)
- [x] **Step 4**: 프로젝트 루트 `package.json` 추가로 루트 터미널에서 `npm run dev` 및 `npm run build` 직접 실행 지원
- [x] **Step 5**: 브라우저 서브에이전트(CDP) 스크린샷 자가 검증 (초미세 입자 60fps 부드러운 렌더링 확인)
- [x] **Step 6**: 핵심 상태 3종(`STATE_GALAXY_VIEW`, `STATE_GRAPH_TRAVERSAL`, `STATE_BENCHMARK_RADAR`) 및 `STATE_IDLE` 구체 간 부드러운 60fps 모핑 전환 안정화
- [x] **Step 7**: FastAPI 서버(포트 8000) 구동 및 Neo4j 실데이터 연동 `POST /api/query` 엔드포인트 검증 완료
- [x] **Step 8**: 프론트엔드-백엔드 실시간 API 연동 및 제13조 3D Graph Traversal 레이저 빔 연쇄 발사 브라우저(CDP) 자가 검증 완료
- [x] **Step 10**: 프론트엔드 Scene 2(`STATE_GRAPH_OVERVIEW` / "전체 DB 지식 그래프")에 적재된 전체 민법 지식 그래프 네트워크(5개 편 클러스터, 1,118개 조문 노드, 299개 준용/예외 엣지) 3D 실시간 렌더링 연동 및 브라우저(CDP) 시각 검증 완료
- [ ] **Step 11**: Groq Whisper STT 법률 용어 프롬프트 음성 인식 연동 & WebSocket/SSE 실시간 상태 트리거
- [ ] **Step 12**: 전체 프론트엔드/백엔드 유닛 테스트 작성 및 100% 통과 검증



---

## 🛠️ 5. 토큰 및 에러 방지 규칙 (Optimization Rules)
1. 새로운 기능 작업 전 반드시 본 파일(`PROJECT_PROGRESS.md`)의 구조를 확인하여 중복 파일 생성을 방지한다.
2. 코드는 기능별/계층별로 분리 작성하며 한 파일에 몰아서 작성하지 않는다.
3. 작업 완료 후 본 파일의 체크리스트와 파일 레지스트리를 즉시 업데이트한다.
4. 매 단계 기능 구현 후 터미널 테스트 명령어를 직접 실행하고 100% 검증 후 결과를 기록한다.
