# 📐 GraphRAG 응답 시간 지연(30초 이상) 원인 분석 및 최적화 기획서

## 🏛️ 1. 현상 및 원인 분석 (Root Cause Analysis)

### ① 존재하지 않는 Gemini 모델명 사용으로 인한 API 내부 재시도(Retry) 루프
* **문제 지점**: [`llm_service.py`](file:///c:/Python312/Inho_Projects/GraphRAG_project/backend/app/services/llm_service.py#L16)에서 지정된 모델명이 공식 존재하지 않는 임의의 모델명인 `"gemini-3.6-flash"`로 하드코딩되어 있습니다.
* **지연 원인**: `google-genai` SDK는 잘못된 모델명이나 일시적인 네트워크 오류 발생 시 자체 내장된 지수 백오프(Exponential Backoff) 재시도 정책을 적용합니다. 존재하지 않는 모델로 호출 시 API 게이트웨이 단계에서 거부되거나 `503 UNAVAILABLE` 오류 등이 발생하면서 SDK 내부에서 실패 판정을 내리기 전까지 수 차례 재시도를 반복하여 **약 30초 이상의 지연(Timeout/Retry Hang)**이 발생합니다.
* **대안 모델**: 현재 Google AI Studio에서 제공하는 공식 최신 Flash 모델이자 가용성이 가장 높은 실시간 API 모델은 **`"gemini-2.5-flash"`**입니다.

### ② Neo4j 검색 시 비효율적인 다중 `CONTAINS` 키워드 루프
* **문제 지점**: [`neo4j_service.py`](file:///c:/Python312/Inho_Projects/GraphRAG_project/backend/app/services/neo4j_service.py#L224-L247)의 `get_dynamic_rag_subgraph()` 함수에서 형태소 분석 후 분리된 모든 키워드 목록에 대해 개별 루프를 돌며 Neo4j 세션을 매번 열고 `CONTAINS` 쿼리를 수행합니다.
* **지연 원인**: 인덱스가 걸려있지 않은 `CONTAINS` 쿼리가 다수 키워드에 대해 동기적으로 반복 수행되면서 DB 커넥션 및 검색 핑 지연을 추가로 누적시킵니다.
* **개선 방안**: 단일 Cypher 쿼리 내에서 `ANY` 연산자나 정규표현식을 사용해 단 한 번의 DB 조회로 모든 키워드 매칭을 일괄 처리하도록 변경합니다.

---

## 🧭 2. 개선 계획 및 최적화 기획 (Optimization Plan)

### [기획 1] 공식 상용 모델명으로 변경 및 재시도 타임아웃 단축
* **조치**: [`llm_service.py`](file:///c:/Python312/Inho_Projects/GraphRAG_project/backend/app/services/llm_service.py)의 `self._model_name` 값을 `"gemini-2.5-flash"`로 변경하여 정상적인 라우팅 및 초고속 추론(1~2초 내 답변 생성)이 이루어지도록 조치합니다.
* **추가 조치**: Gemini API 호출 실패 시 오랜 대기 없이 즉시 Groq Fallback으로 전환할 수 있도록 SDK 호출 시 옵션(타임아웃 등)을 설정하거나 예외 처리를 기민하게 조정합니다.

### [기획 2] Neo4j 키워드 매칭 단일 통합 쿼리화
* **조치**: 다중 키워드 리스트를 루프 돌며 세션을 반복 생성하는 대신, 단일 Cypher 쿼리로 통합 매칭합니다.
  ```cypher
  MATCH (a:Article)
  WHERE any(kw IN $keywords WHERE a.fullText CONTAINS kw OR a.title CONTAINS kw OR a.name CONTAINS kw OR a.summary CONTAINS kw)
  RETURN a.id AS id
  LIMIT 1
  ```

---

## 💻 3. 구체적 코드 반영 계획

1. **[`llm_service.py`](file:///c:/Python312/Inho_Projects/GraphRAG_project/backend/app/services/llm_service.py)**
   - `self._model_name = "gemini-2.5-flash"`로 모델명을 상용 규격으로 정정합니다.
2. **[`neo4j_service.py`](file:///c:/Python312/Inho_Projects/GraphRAG_project/backend/app/services/neo4j_service.py)**
   - `get_dynamic_rag_subgraph`의 키워드 검색 루프를 단일 Cypher 쿼리(`any(...)` 매칭)로 변경하여 데이터베이스 트래픽을 최소화합니다.

---

## 🚀 4. 로딩 애니메이션 끊김 현상 개선 기획

### ① 끊김 원인 분석 (Animation Freeze Analysis)
* **현상**: RAG 질의 로딩 단계에서 노드/엣지 연결 애니메이션이 진행되다가 중간에 뚝 끊긴 듯 정지합니다.
* **원인**:
  1. 진행률(`scanProgress`)이 `Math.min(0.96, ...)` 혹은 `Math.min(0.5, ...)`과 같은 특정 제한 값에 도달하면 시간이 지나도 더 이상 증가하지 않고 고정됩니다.
  2. 실제 백엔드 API 답변이 도착(대기 25초 내외)하기 전까지 진행률이 멈추기 때문에 정지 화면 상태로 대기하게 됩니다.

### ② 해결 및 최적화 기획 (Optimization Plan)
* **무한 점근적 하이브리드 곡선 (Infinite Asymptotic Curve) 도입**:
  - 초반 10초까지는 가속 곡선(Ease-In)을 타며 **85%** 수준까지 연결 속도를 높여 시각적 흐름을 줍니다.
  - 10초 이후에는 지수 감쇄 공식($1 - e^{-t}$)을 활용해 완전히 멈추지 않고 100%에 무한히 가까워지도록 **지속적으로 아주 조금씩 연결선을 늘려가며 동적 대기 상태를 유지**합니다.
  - 수식 설계:
    - $t \le 10.0$ 일 때: $P(t) = \left(\frac{t}{10.0}\right)^2 \times 0.85$
    - $t > 10.0$ 일 때: $P(t) = 0.85 + 0.15 \times \left(1 - e^{-\frac{t-10.0}{10.0}}\right)$
  - 이 수식을 통해 30초 이상 대기 시에도 끊김 없이 98%까지 미세하게 계속 연결되며, 최종 수신 시 100%로 깔끔히 스냅 완료됩니다.
