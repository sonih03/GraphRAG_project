export interface LegalArticleNode {
  id: string;
  articleNumber: string;
  title: string;
  chapter: string;
  position: [number, number, number];
  summary: string;
  fullText: string;
}

export interface LegalRelationEdge {
  id: string;
  source: string;
  target: string;
  type: 'MUTATIS_MUTANDIS' | 'EXCEPTION_OF' | 'DEFINES' | 'REFERENCES';
  label: string;
  color: string;
  description: string;
}

// 4 Core Articles for Traversal Demo
export const LEGAL_DEMO_NODES: LegalArticleNode[] = [
  {
    id: 'art-13',
    articleNumber: '제13조',
    title: '피한정후견인의 행위와 동의',
    chapter: '제1편 총칙 > 제2장 인 > 제2절 능력',
    position: [0, 0, 0], // Center focus in traversal
    summary: '가정법원은 피한정후견인이 한정후견인의 동의를 받아야 하는 행위의 범위를 정할 수 있다.',
    fullText: '① 가정법원은 피한정후견인이 한정후견인의 동의를 받아야 하는 행위의 범위를 정할 수 있다.\n② 한정후견인의 동의를 필요로 하는 행위에 대하여 동의 없이 한 법률행위는 취소할 수 있다. 다만, 일용품의 구입 등 일상생활에 필요하고 그 대가가 과도하지 아니한 법률행위는 그러하지 아니하다.',
  },
  {
    id: 'art-14',
    articleNumber: '제14조',
    title: '한정후견종료의 심판',
    chapter: '제1편 총칙 > 제2장 인 > 제2절 능력',
    position: [-2.2, 1.3, 0.5],
    summary: '한정후견개시의 원인이 소멸된 경우 가정법원은 종료의 심판을 한다.',
    fullText: '한정후견개시의 원인이 소멸된 경우에는 가정법원은 본인, 배우자, 4촌 이내의 친족, 한정후견인 등의 청구에 의하여 한정후견종료의 심판을 한다.',
  },
  {
    id: 'art-15',
    articleNumber: '제15조',
    title: '제한능력자의 상대방의 확답을 촉구할 권리',
    chapter: '제1편 총칙 > 제2장 인 > 제2절 능력',
    position: [2.3, 1.1, -0.4],
    summary: '제한능력자의 상대방은 1개월 이상의 기간을 정하여 취소할 수 있는 행위를 추인할 것인지 여부의 확답을 촉구할 수 있다.',
    fullText: '① 제한능력자의 상대방은 제한능력자가 능력자가 된 후에 그에게 1개월 이상의 기간을 정하여 그 취소할 수 있는 행위를 추인할 것인지 여부의 확답을 촉구할 수 있다.\n② 제13조의 피한정후견인의 법률행위에 관하여도 상대방은 한정후견인에게 확답을 촉구할 수 있다(준용).',
  },
  {
    id: 'art-16',
    articleNumber: '제16조',
    title: '피특정후견인의 행위와 보호',
    chapter: '제1편 총칙 > 제2장 인 > 제2절 능력',
    position: [0.5, -2.1, 0.6],
    summary: '특정후견은 피특정후견인의 의사에 반하여 할 수 없으며 후견인의 대리권 범위를 정한다.',
    fullText: '① 가정법원은 특정후견의 심판을 할 때에는 특정후견인의 후원을 받을 기간 또는 사무의 범위를 정하여야 한다.\n② 특정후견은 피특정후견인의 의사에 반하여 할 수 없다.',
  },
];

export const LEGAL_DEMO_EDGES: LegalRelationEdge[] = [
  {
    id: 'edge-13-14',
    source: 'art-13',
    target: 'art-14',
    type: 'MUTATIS_MUTANDIS',
    label: '준용 규정 (Mutatis Mutandis)',
    color: '#10b981', // Emerald Green Laser
    description: '제14조(종료심판 청구권자)가 피한정후견인 보호절차에 준용됨',
  },
  {
    id: 'edge-13-15',
    source: 'art-13',
    target: 'art-15',
    type: 'MUTATIS_MUTANDIS',
    label: '준용 규정 (Mutatis Mutandis)',
    color: '#10b981', // Emerald Green Laser
    description: '제15조(상대방 확답촉구권)가 피한정후견인의 동의권 거래에 준용됨',
  },
  {
    id: 'edge-13-13b',
    source: 'art-13',
    target: 'art-16',
    type: 'EXCEPTION_OF',
    label: '예외/구분 규정 (Exception)',
    color: '#ef4444', // Ruby Red Laser
    description: '제13조 제2항 단서(일상생활 일용품 구매) 및 제16조와의 능력제한 예외 경계',
  },
];

export const COMPARISON_DUMMY_DATA = {
  query: "피한정후견인이 동의 없이 체결한 고가 전자기기 매매계약의 효력과 상대방의 법적 구제 수단은?",
  vectorRAG: {
    title: "기존 VectorRAG (단순 임베딩 검색)",
    status: "단편적 검색 / 준용·예외 누락",
    statusColor: "text-red-400 bg-red-500/10 border-red-500/30",
    confidence: "64%",
    answer:
      "민법 제13조 제2항에 따라 피한정후견인이 한정후견인의 동의 없이 한 법률행위는 취소할 수 있습니다. 따라서 매매계약은 취소 가능합니다. (※ 상대방이 계약의 불확정 상태를 해소하기 위해 최고할 수 있는 제15조 확답촉구권 규정 및 일상용품 예외 단서와의 연계 조항을 누락함)",
    retrievedChunks: ["제13조 (피한정후견인의 행위와 동의) 1개 청크 단독 추출"],
    missingPoints: [
      "제15조(상대방의 확답촉구권) 준용 규정 누락",
      "제13조 제2항 단서(일상가사 예외) 구체적 포섭 결여",
      "다중 홉 추론 실패로 실무적 해결책 미제시",
    ],
  },
  graphRAG: {
    title: "GraphRAG (지식 그래프 온톨로지 추론)",
    status: "다중 홉(Multi-Hop) 완전 추론",
    statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    confidence: "96%",
    answer:
      "1. 계약의 효력: 고가 전자기기는 제13조 제2항 단서의 '일상생활에 필요하고 대가가 과도하지 않은 행위'에 해당하지 않으므로, 한정후견인 또는 피한정후견인이 취소할 수 있습니다.\n2. 상대방의 구제수단 (제15조 준용): 제13조와 준용 관계로 연결된 제15조 제2항에 따라, 상대방은 한정후견인에게 1개월 이상의 기간을 정하여 추인 여부의 확답을 최고(촉구)할 수 있으며, 확답이 없으면 취소된 것으로 봅니다.",
    retrievedChunks: [
      "제13조 -> [MUTATIS_MUTANDIS] -> 제15조",
      "제13조 제2항 -> [EXCEPTION_OF] -> 제1항",
      "온톨로지 서브그래프 4개 노드, 3개 관계 경로 완전 추론",
    ],
    highlights: [
      "준용(Mutatis Mutandis) 엣지를 통한 제15조 자동 연결",
      "원칙/예외 단서 조건의 정확한 법적 포섭",
      "상대방 최고권까지 포괄하는 완전한 실무 법률 해답 도출",
    ],
  },
};

export const BENCHMARK_DUMMY_DATA = {
  metrics: [
    { label: "포괄성 (Comprehensiveness)", vector: 64, graph: 91, diff: "+27%" },
    { label: "다중 홉 추론 (Multi-hop Reasoning)", vector: 48, graph: 95, diff: "+47%" },
    { label: "예외/준용 재현율 (Exception Recall)", vector: 32, graph: 98, diff: "+66%" },
    { label: "답변 충실도 (Faithfulness)", vector: 71, graph: 93, diff: "+22%" },
  ],
  summary: {
    totalEvaluations: 1250,
    testbed: "대한민국 민법 총칙 및 채권편 1,118개 조문",
    latency: "GraphRAG 1.1s vs VectorRAG 0.8s",
    f1Score: "GraphRAG 0.94 vs VectorRAG 0.53",
  },
};
