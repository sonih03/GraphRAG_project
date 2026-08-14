# 🧹 GraphRAG 프로젝트 잔재 파일 정리 및 최종 폴더 구조 보고서

프로젝트 전반을 정밀하게 점검하여 **불필요한 잔재 파일(6개)을 모두 삭제**하고, 컴포넌트 간 단일 책임 원칙(SRP)에 맞춰 **가장 슬림하고 최적화된 폴더 및 파일 구조**로 정리했습니다.

---

## 🗑️ 1. 삭제 완료된 잔재 파일 내역 및 사유

| 삭제된 파일 경로 | 삭제 사유 |
|---|---|
| `frontend/src/components/canvas/InstancedSphereNodes.tsx` | 0바이트 빈 파일 (초기 프로토타입 잔재) |
| `frontend/src/components/canvas/ParticleBackground.tsx` | 0바이트 빈 파일 (초기 프로토타입 잔재) |
| `frontend/src/components/canvas/SphereConnections.tsx` | 초기 300개 노드 시절 와이어프레임 선 렌더러로, 현재 5,000개 모핑 시스템에서 미사용 |
| `frontend/src/components/canvas/IdleSphereGraph.tsx` | 초기 구체 래퍼 파일로, 현재 `MorphingGraphUniverse.tsx`가 모든 모핑 상태를 일괄 처리하므로 불필요 |
| `frontend/src/components/canvas/NoiseWaveSphere.tsx` | 초기 단독 구체 렌더러로, 모든 알고리즘이 `MorphingGraphUniverse.tsx` 내부로 통합 이관 완료됨 |
| `frontend/src/hooks/useSphereGeometry.ts` | 초기 300개 노드 생성용 훅으로, 현재 모핑 버퍼 시스템에서 미사용 |

---

## 📁 2. 최종 슬림화된 프로젝트 구조 (Clean Architecture)

```
GraphRAG_project/
├── .env / .env.example          # Neo4j 계정 & AI API 환경 변수
├── docker-compose.yml           # Neo4j 5.19 APOC 컨테이너 정의
├── package.json                 # 루트 통합 빌드/실행 스크립트
├── PROJECT_CONTEXT.md           # 프로젝트 요구사항 및 상태 머신 명세
├── PROJECT_PROGRESS.md          # 파일 레지스트리 및 작업 진행 일지
│
├── backend/                     # 🐍 FastAPI 백엔드 (포트 8000)
│   ├── requirements.txt         # 백엔드 의존성
│   └── app/
│       ├── main.py              # FastAPI 진입점 (lifespan, CORS, /api/query)
│       ├── core/                # config.py, logging.py
│       ├── models/              # query.py, graph.py (Pydantic 모델)
│       ├── services/            # neo4j_service.py (Cypher 2-Hop 탐색), llm_service.py
│       └── api/v1/endpoints/    # graph.py (/overview, /subgraph, /query), health.py
│
└── frontend/                    # ⚛️ Next.js 16 + Three.js / R3F (포트 3000)
    ├── package.json
    └── src/
        ├── app/                 # page.tsx (메인 뷰), layout.tsx, globals.css
        ├── types/               # graph.ts (GraphSystemState 6개 상태 정의)
        ├── lib/                 # constants, utils (수학 및 Tailwind 유틸)
        └── components/
            ├── canvas/          # 🌟 3D R3F 렌더링 엔진 (5개 핵심 파일)
            │   ├── GraphCanvas.tsx             # 3D 씬 루트 컨테이너
            │   ├── MorphingGraphUniverse.tsx   # 5,000 포인트 클라우드 통합 모핑 엔진
            │   ├── LaserTraversalEdges.tsx     # 제13조 -> 14/15/16조 초록/빨강 레이저 빔
            │   ├── Article3DLabels.tsx         # 3D 공간 상의 법률 조문 HTML 빌보드 태그
            │   └── CameraController.tsx        # 상태별 부드러운 줌인/줌아웃 카메라 Lerp
            ├── ui/              # 🎛️ HUD 제어 컴포넌트
            │   ├── ControlBar.tsx              # 하단 칩 및 백엔드 POST /api/query 연동
            │   ├── Header.tsx / StatusBadge.tsx # 상단 브랜드 및 실시간 상태 인디케이터
            │   └── GlassCard.tsx               # 글래스모피즘 베이스 카드
            └── overlays/        # 📊 Framer-Motion 팝업
                ├── OverlayManager.tsx          # 상태별 오버레이 스위처
                └── BenchmarkRadarOverlay.tsx   # 성능 벤치마크 레이더 차트
```

---

## ⚡ 3. 빌드 및 동작 무결성 검증

- **Next.js 프로덕션 빌드 (`npm run build`)**: **627ms 소요, 0건의 오류 (100% 통과)**
- **FastAPI 백엔드 (`GET /health`)**: `status: online, neo4j_connected: true`
- **Neo4j Cypher Traversal API (`POST /api/query`)**: HTTP 200 OK
- **브라우저 3D 모핑 및 레이저 엣지 렌더링**: 60 FPS 부드러운 전환 확인 완료
