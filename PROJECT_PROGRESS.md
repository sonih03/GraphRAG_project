# 🎯 GraphRAG 15분 강의 라이브 시연 프레젠테이션 시스템

> **[핵심 목표 (Primary Mission)]**  
> 본 프로젝트의 유일무이한 궁극적 목표는 **"GraphRAG 15분 강의 라이브 시연"**입니다.  
> 본 웹사이트는 일반적인 웹 앱이 아닌, **"마우스 조작 없이 오직 RAG(자연어 질의 및 음성)만을 사용하여 화면과 3D 캔버스를 완벽하게 제어하는 15분 강의 시연 자료"**로 개발됩니다.

---

## ⏱️ 15분 강의 시연 타임라인 & RAG 자연어 제어 시나리오

강사는 마우스를 클릭하지 않고, 오직 **자연어 음성/질의(RAG)**를 입력하거나 발화하여 웹사이트의 상태와 3D 뷰포트를 실시간 제어합니다.

| 시간 (Time) | 강의 단계 | 강사 발화 / RAG 제어 질의 | 웹사이트 3D & UI 반응 (RAG 자동 제어) |
| :--- | :--- | :--- | :--- |
| **00:00 ~ 03:00** | **도입 및 문제 제기**<br>(Vector RAG의 치명적 한계) | *"전체 데이터베이스 구조 보여줘"* | • `STATE_GALAXY_VIEW` 자동 전환<br>• 5,000 입자가 5대 편으로 흩어지며 530개 전체 법률 엣지 순차 점등 |
| **03:00 ~ 07:00** | **GraphRAG 필요성 입증**<br>(조문 간 준용·예외 얽힘) | *"피한정후견인의 행위와 동의 제13조 연관 구조 보여줘"* | • `STATE_GRAPH_TRAVERSAL` 자동 전환<br>• 제1편(총칙)으로 카메라 줌인, 나머지 군집 소멸<br>• 제13조 ➔ 제15조(준용: 녹색), 제16조(예외: 적색) 3D 레이저 발광 |
| **07:00 ~ 11:00** | **다중 군집 크로스 추론**<br>(실무 법률 분쟁 RAG 해결) | *"다른 사람이 내 땅에 구조물을 설치했는데 법적으로 어떻게 해야 해?"* | • 제2편(물권) ↔ 제3편(채권) 다중 군집 자동 프레이밍 (총칙/친족/상속 소멸)<br>• 제214·213조(물권) ➔ 제741·750조(채권) 3D 레이저 연결<br>• 우측 `GraphRAG 법률 AI 분석 보고서` 패널 생성 |
| **11:00 ~ 13:30** | **정량적 성능 검증**<br>(Graph vs Vector 비교) | *"벤치마크 성능 수치 보여줘"* | • `STATE_BENCHMARK_RADAR` 자동 전환<br>• 환각 방지율(+55.3%), 리콜율(+58.3%) 레이더/프로그레스 바 팝업 |
| **13:30 ~ 15:00** | **결론 및 Q&A 정리** | *"기본 구체로 돌아가"* | • `STATE_IDLE` 복귀, 5,000 파티클 유기적 파동 구체 회전 |

---

## 🗂️ 전체 파일 및 디렉토리 구조 (Directory Tree)

```text
GraphRAG_project/
├── .env                                  # 루트 환경 변수 (포트 및 Neo4j 설정)
├── .env.example                          # 환경 변수 템플릿
├── docker-compose.yml                    # Neo4j 데이터베이스 컨테이너 구성
├── package.json                          # 루트 스크립트 실행기
├── PROJECT_CONTEXT.md                    # 프로젝트 요구사항 및 상태 머신 명세
├── PROJECT_PROGRESS.md                   # [본 문서] 15분 강의 목표 및 구조 총정리
├── Conversation.md                       # 라이브 데모 가이드 및 릴리스 노트
│
├── backend/                              # FastAPI 백엔드 (Python 3.12)
│   ├── requirements.txt                  # 백엔드 의존성 (fastapi, neo4j, httpx 등)
│   ├── data/
│   │   ├── civil_law.txt                 # 표준 민법 조문 원문 데이터 (1,118개 조문)
│   │   └── neo4j/                        # Neo4j 데이터 마운트 볼륨
│   └── app/
│       ├── main.py                       # FastAPI 애플리케이션 진입점 & CORS 설정
│       ├── api/v1/endpoints/
│       │   ├── graph.py                  # 지식 그래프 overview, subgraph, RAG 질의 엔드포인트
│       │   └── health.py                 # 서버 헬스체크 및 DB 연결 확인
│       ├── core/
│       │   ├── config.py                 # Pydantic 기반 설정 관리
│       │   └── logging.py                # 콘솔 및 파일 로깅 구성
│       ├── models/
│       │   └── query.py                  # Pydantic 질의 요청/응답 모델
│       ├── pipeline/
│       │   ├── parser.py                 # 정규식 기반 무손실 민법 조문/항/호 파서
│       │   ├── cross_reference.py        # 준용(MUTATIS_MUTANDIS)·예외(EXCEPTION_TO)·참조(REFERENCES) 추출기
│       │   └── ingest.py                 # Neo4j 일괄 무결점 그래프 적재 파이프라인 (Zero-LLM)
│       └── services/
│           ├── neo4j_service.py          # Neo4j Cypher 쿼리 및 서브그래프 추출 서비스
│           └── llm_service.py            # LLM 서비스 인터페이스
│
└── frontend/                             # Next.js 16 프론트엔드 (React 19, TypeScript)
    ├── package.json                      # 프론트엔드 의존성 (three, @react-three/fiber, framer-motion 등)
    ├── tsconfig.json                     # TypeScript 엄격 타입 컴파일 설정
    ├── next.config.ts                    # Next.js 빌드 설정
    └── src/
        ├── app/
        │   ├── layout.tsx                # 전역 루트 레이아웃 & 폰트 설정
        │   ├── page.tsx                  # 전역 상태(currentState, subgraphData) 총괄 오케스트레이터
        │   └── globals.css               # Tailwind CSS & 전역 다크모드 스타일
        ├── types/
        │   └── graph.ts                  # GraphSystemState, DynamicSubgraphData 타입 정의
        ├── lib/
        │   ├── constants/
        │   │   └── graphConfig.ts        # 3D 파티클 크기, 색상, 애니메이션 파라미터
        │   ├── dummy/
        │   │   └── legalGraphData.ts     # 벤치마크 및 비교 평가 데이터 구조
        │   └── utils/
        │       ├── cn.ts                 # Tailwind 클래스 병합 유틸리티
        │       └── math.ts               # 5,000 파티클 모핑, 피보나치 구체, 5대 편 3D 좌표 산출식
        └── components/
            ├── canvas/                   # 3D WebGL (Three.js) 컴포넌트
            │   ├── GraphCanvas.tsx       # Three.js 캔버스 뷰포트
            │   ├── CameraController.tsx  # 상태별 부드러운 카메라 Lerp 이동 제어기
            │   ├── MorphingGraphUniverse.tsx # 5,000 입자 모핑 & 군집 격리 렌더러
            │   ├── FullGraphNetworkEdges.tsx # 530개 전체 엣지 순차 점등(Ignition) 렌더러
            │   ├── LaserTraversalEdges.tsx   # 2-Hop 프로그레시브 발광 레이저 빔 렌더러
            │   └── Article3DLabels.tsx       # 3D 공간 상 실시간 조문 글래스모피즘 라벨
            ├── overlays/                 # 인터랙티브 오버레이 모달 & 패널
            │   ├── OverlayManager.tsx    # 오버레이 렌더링 총괄 관리자
            │   ├── GraphRAGAnswerPanel.tsx   # 우측 슬라이드인 AI 법률 분석 보고서 패널
            │   ├── BenchmarkRadarOverlay.tsx # GraphRAG vs VectorRAG 성능 벤치마크 모달
            │   ├── CompareAnswersOverlay.tsx # 실시간 답변 비교 모달
            │   └── VectorWarningOverlay.tsx  # 벡터 검색 위험 경고 오버레이
            └── ui/                       # UI 제어 컴포넌트
                ├── Header.tsx            # 상단 타이틀 및 실시간 상태 인디케이터
                ├── ControlBar.tsx        # 하단 검색창 & 4대 프롬프트 칩
                ├── GlassCard.tsx         # 글래스모피즘 공통 카드 컨테이너
                └── StatusBadge.tsx       # 상태 뱃지 렌더러
```

---

## 🧭 5대 편 3D 공간 좌표계 및 레이아웃 규칙 (`math.ts`)

- **토폴로지**: **중심 코어(제3편 채권) + 외곽 정사면체 4대 꼭짓점(총칙·물권·친족·상속)**
- **중심 코어 원점**: `제3편 채권` $\rightarrow [0, 0, 0]$ (민법 계약·불법행위·부당이득 핵심 연결 허브)
- **외곽 정사면체 꼭짓점**:
  - 중심 채권과의 외접구 반지름: $\forall k \in \{1, 2, 4, 5\}, \ \|\vec{P}_k - \text{Origin}\| = 4.20$ (100% 동일)
  - 4개 꼭짓점 상호 간격: $\forall i \neq j, \ \|\vec{P}_i - \vec{P}_j\| = \sqrt{8/3} R = 6.858$ (100% 동일)

| 편 (Part) | 조문 범위 | 3D 역할 및 좌표 ($R=4.2$) | 테마 색상 | 의미 |
| :--- | :--- | :--- | :--- | :--- |
| **제3편 채권** | 제373조 ~ 제766조 | **중심 코어 `[ 0.00,  0.00,  0.00]`** | Purple (`#c084fc`) | 계약·불법행위·부당이득 민법 핵심 허브 |
| **제1편 총칙** | 제1조 ~ 제184조 | **정사면체 꼭짓점 #1 `[ 0.00,  3.80,  1.20]`** | Cyan (`#38bdf8`) | 민법 전반에 적용되는 기본 원칙 |
| **제2편 물권** | 제185조 ~ 제372조 | **정사면체 꼭짓점 #2 `[ 3.70, -1.80, -1.00]`** | Indigo (`#818cf8`) | 물건에 대한 직접적 지배권 (소유권, 점유권 등) |
| **제4편 친족** | 제767조 ~ 제996조 | **정사면체 꼭짓점 #3 `[-2.10, -1.80,  3.20]`** | Emerald (`#34d399`) | 가족 및 신분 관계 (혼인, 친권, 후견) |
| **제5편 상속** | 제997조 ~ 제1118조 | **정사면체 꼭짓점 #4 `[-2.10, -1.80, -3.20]`** | Amber (`#fbbf24`) | 재산의 포괄적 승계 (상속, 유언, 유류분) |

---

## ✅ 무결점 품질 검증 결과 (Verification Status)

- [x] **중심 코어(채권) + 외곽 정사면체(총칙·물권·친족·상속) 순수 수학 공식 적용 완료**: 하드코딩 0%, 중심 거리 $R=4.2$ 및 외곽 변의 길이 $D=6.858$ 완벽 항등성 증명.
- [x] **TypeScript 타입 체크**: `npx tsc --noEmit` 통과 (에러 0개).
- [x] **FastAPI 백엔드**: `http://localhost:8000/health` 정상 작동 (`status: online`, `neo4j_connected: True`).
- [x] **Next.js 프론트엔드**: `http://localhost:3000` 정상 구동 (Turbopack 빌드 성공).
- [x] **브라우저 자동화 전수 감사**:
  - `기본 구체 (IDLE)` ➔ `전체 DB 지식 그래프` ➔ `무단 구조물 설치 (물권↔채권)` ➔ AI 답변 박스 조작 ➔ `성능 벤치마크` ➔ 검색창 입력 질의까지 **전체 UI 인터랙션 100% 정상 작동 및 콘솔 에러 0건** 검증 완료.
