/**
 * Legal Benchmark & Answer Comparison Data Types and Mock Payloads
 */

export interface ComparisonAnswerData {
  query: string;
  targetArticle: string;
  vectorRAG: {
    answer: string;
    missingContext: string[];
    riskLevel: 'HIGH' | 'CRITICAL';
    confidence: number;
    pitfalls?: string[];
  };
  graphRAG: {
    answer: string;
    traversedArticles: string[];
    logicalChain: string[];
    confidence: number;
    highlights?: string[];
  };
}

export const COMPARISON_DUMMY_DATA: ComparisonAnswerData = {
  query: '피한정후견인이 동의 없이 고가의 전자기기를 구매한 경우, 상대방은 어떤 법적 조치를 취할 수 있는가?',
  targetArticle: '제13조 (피한정후견인의 행위와 동의)',
  vectorRAG: {
    answer: '민법 제13조에 따라 피한정후견인이 한정후견인의 동의 없이 한 법률행위는 취소할 수 있습니다. 따라서 상대방은 계약이 취소될 위험에 놓이게 됩니다.',
    missingContext: [
      '제15조(상대방의 최고권/확답촉구권) 누락',
      '제16조(일상용품 구매 등 일상생활 필요 행위 예외) 단서 누락',
    ],
    riskLevel: 'CRITICAL',
    confidence: 62.4,
    pitfalls: [
      '제15조 최고권(확답촉구권) 배제 위험',
      '제16조 일상생활 필요행위 유효성 오판',
    ],
  },
  graphRAG: {
    answer: '피한정후견인이 동의 없이 체결한 계약은 취소될 수 있으나(제13조), 상대방은 제15조에 따라 한정후견인에게 1개월 이상의 기간을 정하여 추인 여부의 확답을 촉구할 권리(최고권)를 행사할 수 있습니다. 만약 해당 구매가 일상용품 구입에 해당한다면 제13조 제2항 단서 및 제16조에 의해 취소할 수 없습니다.',
    traversedArticles: ['제13조', '제14조', '제15조', '제16조'],
    logicalChain: [
      '제13조(원칙적 취소권)',
      '➔ 제15조 준용(상대방 확답촉구권)',
      '➔ 제16조 예외(일상생활 필요행위 보호)',
    ],
    confidence: 98.7,
    highlights: [
      '온톨로지 준용 경로 100% 추적',
      '예외 단서 조항 자동 포섭',
      '환각율 0.0% 검증 완료',
    ],
  },
};

export interface BenchmarkMetric {
  label: string;
  graph: number;
  vector: number;
  diff: string;
}

export interface BenchmarkData {
  metrics: BenchmarkMetric[];
  summary: {
    testbed: string;
    totalEvaluations: number;
    f1Score: string;
    latency: string;
  };
}

export const BENCHMARK_DUMMY_DATA: BenchmarkData = {
  metrics: [
    { label: '조문 간 준용·예외 관계 추론 정확도', graph: 98.7, vector: 31.2, diff: '+67.5%' },
    { label: '법률 할루시네이션(환각) 방지율', graph: 99.4, vector: 44.1, diff: '+55.3%' },
    { label: '다중 홉(Multi-Hop) 지식 리콜율', graph: 96.8, vector: 38.5, diff: '+58.3%' },
    { label: '단서 조항 및 소멸 시효 포섭율', graph: 97.2, vector: 28.0, diff: '+69.2%' },
  ],
  summary: {
    testbed: '대한민국 민법 총 1,118개 조문 및 530개 상호 관계망',
    totalEvaluations: 500,
    f1Score: '0.978 (Graph) vs 0.342 (Vector)',
    latency: '85ms (온톨로지 그래프) vs 120ms (벡터 검색)',
  },
};
