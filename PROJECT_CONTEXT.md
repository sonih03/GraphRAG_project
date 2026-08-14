# GraphRAG 3D Visualizer & Neural Retrieval Engine

## 1. 프로젝트 개요 (Project Overview)
본 프로젝트는 대규모 지식 그래프(Knowledge Graph) 및 GraphRAG(Graph Retrieval-Augmented Generation) 시스템을 3D Three.js 캔버스 상에서 실시간으로 시각화하고 탐색할 수 있는 차세대 인터랙티브 풀스택 플랫폼입니다.

---

## 2. 시스템 아키텍처 (System Architecture)

```
GraphRAG_project/
├── frontend/                                   # Next.js 16 (App Router, TypeScript)
│   ├── src/
│   │   ├── app/                               # Next.js App Router 레이아웃 및 페이지
│   │   │   ├── layout.tsx                     # 전역 메타데이터 및 다크 테마 레이아웃
│   │   │   ├── page.tsx                       # 메인 인터랙티브 대시보드
│   │   │   └── globals.css                    # Tailwind CSS v4 및 글로벌 스타일
│   │   ├── components/
│   │   │   ├── canvas/                        # Three.js / @react-three/fiber 3D 계층
│   │   │   │   ├── GraphCanvas.tsx             # R3F Canvas 루트 컨테이너
│   │   │   │   ├── CameraController.tsx        # OrbitControls 및 부드러운 댐핑
│   │   │   │   ├── IdleSphereGraph.tsx         # STATE_IDLE 3D 회전 구체 그래프
│   │   │   │   ├── InstancedSphereNodes.tsx    # InstancedMesh 기반 300+ 노드 고성능 렌더러
│   │   │   │   ├── SphereConnections.tsx       # 인접 노드 간 와이어프레임 엣지 라인
│   │   │   │   └── ParticleBackground.tsx      # 우주 공간감 파티클 스타필드
│   │   │   └── ui/                            # Glassmorphism UI 계층
│   │   │       ├── GlassCard.tsx               # 글래스모피즘 컨테이너
│   │   │       ├── Header.tsx                  # 상단 시스템 텔레메트리 헤더
│   │   │       ├── StatusBadge.tsx             # 그래프 시스템 상태 인디케이터
│   │   │       └── ControlBar.tsx              # 하단 프롬프트 쿼리 및 제어바
│   │   ├── hooks/
│   │   │   └── useSphereGeometry.ts           # 피보나치 구면 알고리즘 기하 연산 훅
│   │   ├── lib/
│   │   │   ├── constants/graphConfig.ts       # 노드 수(300), 반경, 색상, 애니메이션 파라미터
│   │   │   └── utils/
│   │   │       ├── math.ts                    # 피보나치 구면 좌표 및 거리 계산 유틸
│   │   │       └── cn.ts                      # Tailwind 클래스 병합 유틸
│   │   └── types/
│   │       ├── graph.ts                       # 노드/엣지/그래프 상태 타입
│   │       └── api.ts                         # API 통신 타입
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                                    # Python FastAPI 백엔드
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── endpoints/
│   │   │   │   ├── health.py                  # 헬스체크 엔드포인트
│   │   │   │   └── graph.py                   # GraphRAG 쿼리 및 그래프 데이터 API
│   │   │   └── router.py                      # v1 라우터 모듈
│   │   ├── core/
│   │   │   ├── config.py                      # pydantic-settings 기반 환경 설정
│   │   │   └── logging.py                     # 표준 로거
│   │   ├── models/
│   │   │   ├── graph.py                       # Node, Edge Pydantic 스키마
│   │   │   └── query.py                       # QueryRequest, QueryResponse 스키마
│   │   ├── services/
│   │   │   ├── neo4j_service.py               # Neo4j 그래프 데이터베이스 연동
│   │   │   └── llm_service.py                 # Groq LLM 추론 서비스
│   │   └── main.py                            # FastAPI 애플리케이션 진입점
│   ├── requirements.txt
│   └── .env.example
```

---

## 3. 핵심 기능 상태 머신 (Graph States)
1. **`STATE_IDLE`**:
   - 300여 개의 빈 노드가 피보나치 구면 기하 구조를 따라 3D 구체 형태로 배치됨
   - `THREE.InstancedMesh`를 통해 단일 드로우 콜로 60fps 유지
   - 우아하고 지속적인 자전(Auto-Rotation) 애니메이션 및 은은한 발광 효과
2. **`STATE_QUERYING`**: 사용자 질의 입력 시 탐색 파동 및 경로 활성화 애니메이션
3. **`STATE_RETRIEVED`**: Neo4j에서 추출된 서브그래프 하이라이트 및 LLM 근거 제공
4. **`STATE_HIGHLIGHT`**: 특정 엔티티/커뮤니티 집중 탐색 모드
