# 🧭 GraphRAG Legal Navigator - 프로젝트 상태 & 작업 인덱스 레지스트리 (SSOT)

> **[문서 목적]**  
> 본 문서는 LLM 및 개발자가 매 대화/명령마다 프로젝트의 전체 구현 상태, 함수/컴포넌트 인덱스, 3D 좌표계, 작업 이력 및 로드맵을 즉시 파악하여 **토큰 낭비를 방지하고, 중복 함수 구현을 차단하며, 전체 컨텍스트를 100% 보존**하기 위한 단일 진실 공급원(Single Source of Truth)입니다.

---

## 🏛️ 1. 시스템 핵심 아키텍처 & 포트 맵

```text
[Frontend: Next.js 16 (React 19, Three.js)]  <--- HTTP (Port 8000) --->  [Backend: FastAPI (Python 3.12)]
  • URL: http://localhost:3000                                            • URL: http://localhost:8000
  • 3D Canvas (R3F, 5000 Particles)                                       • 2-Hop Traversal API
  • Framer-Motion Glassmorphic Overlays                                   • Neo4j Bolt Driver (Port 7687)
                                                                                  │
                                                                           [Database: Neo4j 5.19 APOC]
                                                                             • 1,118 Articles (1,197 with branch)
                                                                             • 530 Ontology Relations (Mutatis/Except/Ref)
```

---

## 🗂️ 2. 컴포넌트 및 핵심 함수 레지스트리 (중복 구현 방지 인덱스)

### 🎨 프론트엔드 (Frontend)

| 모듈 / 파일 경로 | 주요 컴포넌트 / 함수 | 상세 기능 및 역할 |
| :--- | :--- | :--- |
| **`lib/utils/math.ts`** | `PART_CLUSTERS` | 5대 편 3D 중심 좌표 상수 (`총칙: [-4.5, 2.8, 1.0]` 등) |
| | `getArticlePosition(num)` | 조문 번호별 3D 위치 산출 (시연 조문 오프셋 + 구면 분산) |
| | `getInvolvedClusterIndices(nums)` | 질의에 참여하는 편(0~4) 인덱스 Set 추출 |
| | `calculateClusterCameraFraming(indices)` | 활성 군집들의 Centroid 기반 최적 카메라 거리 산출 |
| | `generateSpherePositions(count)` | IDLE 모드 피보나치 구면 5,000 파티클 좌표 생성 |
| | `generateOverviewPositions(count)` | GALAXY_VIEW 모드 5개 편 광역 파티클 좌표 생성 |
| **`components/canvas/CameraController.tsx`** | `<CameraController />` | 상태별 부드러운 Lerp 카메라 이동 (`GALAXY: Z=19.5`, `TRAVERSAL: Z=8.5` 등) |
| **`components/canvas/MorphingGraphUniverse.tsx`** | `<MorphingGraphUniverse />` | 5,000개 입자 구체 ↔ 5대 편 분산 ↔ 군집 격리 모핑 렌더러 |
| **`components/canvas/FullGraphNetworkEdges.tsx`** | `<FullGraphNetworkEdges />` | 530개 전체 엣지 순차 점등 및 3D 글래스모피즘 편 라벨 (`distanceFactor=28`) |
| **`components/canvas/LaserTraversalEdges.tsx`** | `<LaserTraversalEdges />` | 기점 조문 ➔ 타겟 조문 프로그레시브 3D 레이저 광선 발사기 |
| **`components/canvas/Article3DLabels.tsx`** | `<Article3DLabels />` | 3D 공간 상 조문별 HTML 빌보드 라벨 (철거/인도/부당이득/손배/취득시효) |
| **`components/overlays/GraphRAGAnswerPanel.tsx`** | `<GraphRAGAnswerPanel />` | 우측 슬라이드인 실시간 AI 법률 분석 보고서 (단계별 가이드, 최소화 지원) |
| **`components/overlays/BenchmarkRadarOverlay.tsx`** | `<BenchmarkRadarOverlay />` | GraphRAG vs VectorRAG 성능 벤치마크 비교 모달 |
| **`components/overlays/CompareAnswersOverlay.tsx`** | `<CompareAnswersOverlay />` | VectorRAG 오답 vs GraphRAG 정답 분할 비교 뷰 |
| **`components/overlays/VectorWarningOverlay.tsx`** | `<VectorWarningOverlay />` | 벡터 검색 고립 청크 한계 경고 팝업 |
| **`components/ui/ControlBar.tsx`** | `<ControlBar />` | 하단 4대 퀵 프롬프트 칩 & 자연어 질의 검색창 |
| **`components/ui/StatusBadge.tsx`** | `<StatusBadge />` | 현재 3D 그래프 시스템 상태 인디케이터 |

### ⚙️ 백엔드 (Backend)

| 모듈 / 파일 경로 | 주요 함수 / 클래스 | 상세 기능 및 역할 |
| :--- | :--- | :--- |
| **`pipeline/civil_act_parser.py`** | `parse_civil_law_text(text)` | 민법 1,197개 조문, 1,034개 항 무손실 정규식 파서 (가지번호 방어) |
| **`pipeline/hybrid_extractor.py`** | `extract_legal_relationships(...)` | 준용(288) + 예외(11) + 참조(231) = 530개 엣지 정밀 추출기 |
| **`pipeline/neo4j_loader.py`** | `load_data_to_neo4j(...)` | UNIQUE CONSTRAINT DDL 우선 적용 후 UNWIND 배치 적재 |
| **`services/neo4j_service.py`** | `get_article_subgraph(query)` | 2-Hop 온톨로지 서브그래프 Cypher 쿼리 서비스 |
| | `get_all_overview(limit)` | 전체 조문 및 530개 엣지 오버뷰 조회 서비스 |
| **`api/v1/endpoints/graph.py`** | `query_graphrag(request)` | 자연어 질의 ➔ 물권↔채권 다중 군집 분석 & 2-Hop 탐색 엔드포인트 |

---

## 🧭 3. 3D 공간 5대 편 좌표 및 카메라 매개변수 기준표 (중심 코어 + 외곽 정사면체 4대 꼭짓점)

```text
                                [제1편 총칙 P₁] (상단 꼭짓점)
                                      ／             ＼
                                    ／                 ＼
     [제5편 상속 P₄] (좌하단 뒤)     ★ [제3편 채권 코어 (0,0,0)]      [제2편 물권 P₂] (우하단)
                ＼                         │                 ／
                  ＼                       │               ／
                    ＼                     │             ／
                      ＼                   │           ／
                                [제4편 친족 P₃] (좌하단 앞)
```

- **수학 공식**: `generateTetrahedronClusters(3.1)` (순수 정사면체 수학 공식, $R=3.1$ 콤팩트 결속)
- **중심 코어 (Origin `[0, 0, 0]`)**: **`제3편 채권`** (민법 계약·불법행위·부당이득 핵심 연결 허브)
- **외곽 4대 꼭짓점 (총칙·물권·친족·상속)**:
  - 중심 채권과의 거리: $\forall k \in \{1, 2, 3, 4\}, \ \|\vec{P}_k - \text{Origin}\| = 3.10$ (100% 동일한 외접구 반지름)
  - 외곽 4개 꼭짓점 간 상호 거리: $\forall i \neq j, \ \|\vec{P}_i - \vec{P}_j\| = \sqrt{8/3} R = 5.062$ (100% 동일한 정사면체 변의 길이)

| 상태 (GraphSystemState) | 카메라 위치 (Camera Pos) | 바라보는 지점 (LookAt) | 설명 |
| :--- | :--- | :--- | :--- |
| **`STATE_IDLE`** | `[0, 0, 6.8]` | `[0, 0, 0]` | 단일 피보나치 구체 자전 뷰 |
| **`STATE_GALAXY_VIEW`** | `[0, 0.15, 11.5]` | `[0, 0, 0]` | **중심 코어(채권) + 외곽 정사면체(총칙·물권·친족·상속) 은하 뷰** (화면 꽉 찬 뷰, 슬림 라벨, 잘림 0%) |
| **`STATE_GRAPH_TRAVERSAL`** | Active Cluster Centroid (`Z=6.8`) | Cluster Center | 물권↔채권 다중 군집 포커싱 & 우측 AI 박스 여백 확보 |
| **`STATE_BENCHMARK_RADAR`** | `[0, 0, 6.8]` | `[0, 0, 0]` | 벤치마크 레이더 차트 모달 뷰 |

---

## ✅ 4. 완료된 작업 이력 (Changelog)

- [x] **2026-08-18 (Phase 1)**: 대한민국 민법 1,118개 조문 및 530개 관계선 Neo4j 적재 파이프라인 구축 완료.
- [x] **2026-08-18 (Phase 2)**: Three.js 5,000 파티클 모핑 캔버스 및 60 FPS 렌더링 파이프라인 완성.
- [x] **2026-08-18 (Phase 3)**: 토지 무단 구조물 설치 분쟁(제214·213조 ↔ 제741·750조 ↔ 제245조) 다중 군집 RAG 시나리오 & 3D 레이저 트래버설 & AI 패널 연동.
- [x] **2026-08-18 (Phase 4)**: 전체 DB 지식 그래프(`STATE_GALAXY_VIEW`) 광역 은하 좌표계 복원 및 파노라마 줌아웃(`Z=19.5`), 컴팩트 3D 글래스모피즘 라벨 복원 완료.
- [x] **2026-08-18 (Phase 5)**: React 19 Hook 순서 규칙 준수 및 린트/컴파일 검증 통과 (`tsc --noEmit` 에러 0건).
- [x] **2026-08-18 (Phase 6)**: 하단 검색창 바에 의한 `제3편 채권` 가림 해소 및 컴팩트 3D 라벨 배지 최적화.
- [x] **2026-08-18 (Phase 7)**: 3D 구면 등거리(R=4.25) 입체 기하학적 배치 검증.
- [x] **2026-08-18 (Phase 8)**: GALAXY_VIEW 무한 회전 제거(정면 안정화) 및 5-Fold 구면 대칭 배치.
- [x] **2026-08-18 (Phase 9)**: 방사형 허브 및 콤팩트 구체 은하 개편.
- [x] **2026-08-18 (Phase 10)**: `제3편 채권` 중심 코어 `(0,0,0)` + 외곽 정사면체 4대 꼭짓점 토폴로지 구축 및 부드러운 코스믹 3D 자전 연동 완료.
- [x] **2026-08-18 (Phase 11)**: 정사면체 반경 최적화($R=3.1$) & 카메라 줌인($Z=11.5$)으로 화면 빈 공간 제거 완료.
- [x] **2026-08-18 (Phase 12)**: 3D 라벨 카드 초미니 마이크로 뱃지화 완료.
- [x] **2026-08-18 (Phase 13)**: **3D 라벨 알약 뱃지 크기를 완벽한 스위트 스팟(`transform: scale(0.95)`, `distanceFactor=8`)으로 정밀 튜닝하여 선명한 가독성과 미려한 그래프 비가림 시각화 동시 달성 완료**.

---

## 🚀 5. 향후 작업 로드맵 (Roadmap)

- [ ] **Step 1: 지식 그래프 시각적 완성도 극대화 (Visual Enhancement)**
  - [ ] 중심 코어(채권) ➔ 외곽 4대 편 기하학적 연결 가이드 빔 & 정사면체 와이어프레임 렌더링
  - [ ] 530개 엣지 위를 흐르는 3색 에너지 펄스 파티클 쉐이더 (`MUTATIS_MUTANDIS`, `EXCEPTION_TO`, `REFERENCES`)
  - [ ] 군집별 볼류메트릭 오라 글로우 & 코스믹 성운 더스트 파티클
  - [ ] 인터랙티브 마우스 호버 스마트 포커싱 및 엣지 디밍
- [ ] **Step 2: STT 음성 인식 연동 (Groq Whisper API)**
  - 하단 마이크 버튼 클릭 또는 웹 브라우저 음성 발화로 4대 프롬프트 칩 자동 트리거.
- [ ] **Step 3: Graph Traversal 멀티 홉 레이저 애니메이션 인터랙션 강화**
  - 질문 칩 클릭 시 시나리오별 실시간 조문 탐색 하이라이트.
- [ ] **Step 4: 15분 강의 라이브 시연 최종 리허설 및 프레젠테이션 모드 완성**
  - 키보드 단축키(1, 2, 3, 4, Space)로 15분 타임라인별 원터치 슬라이드 전환 추가.
