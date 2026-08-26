Slide 01 [Intro]: 발표 목차

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="bgGradient" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#070b14" />
      <stop offset="60%" stop-color="#020408" />
      <stop offset="100%" stop-color="#000000" />
    </radialGradient>

    <!-- Part Accent Gradients -->
    <linearGradient id="gradCyan" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0ea5e9" />
    </linearGradient>
    <linearGradient id="gradBlue" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#60a5fa" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
    <linearGradient id="gradIndigo" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#818cf8" />
      <stop offset="100%" stop-color="#6366f1" />
    </linearGradient>
    <linearGradient id="gradViolet" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#a78bfa" />
      <stop offset="100%" stop-color="#8b5cf6" />
    </linearGradient>
    <linearGradient id="gradPurple" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#c084fc" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>

    <!-- Card Base Gradient & Border -->
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0f172a" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#050914" stop-opacity="0.95" />
    </linearGradient>

    <!-- Glow Filter -->
    <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Base Canvas Background -->
  <rect width="1920" height="1080" fill="url(#bgGradient)" />

  <!-- 80px Margin Boundary Frame -->
  <rect x="80" y="80" width="1760" height="920" rx="16" fill="none" stroke="#1e293b" stroke-width="1.2" />

  <!-- Header Section -->
  <g transform="translate(120, 160)">
    <text x="0" y="0" fill="#ffffff" font-family="'Pretendard', 'Inter', -apple-system, sans-serif" font-size="54" font-weight="900" letter-spacing="-0.5">GraphRAG 발표 목차</text>
  </g>

  <!-- Full-Width Agenda Cards -->
  <g transform="translate(120, 235)">

    <!-- PART 1 -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="1680" height="108" rx="14" fill="url(#cardGrad)" stroke="#1e293b" stroke-width="1.5" />
      <rect x="0" y="0" width="6" height="108" rx="3" fill="url(#gradCyan)" filter="url(#softGlow)" />
      
      <rect x="35" y="33" width="120" height="42" rx="8" fill="#0369a1" fill-opacity="0.25" stroke="#0ea5e9" stroke-width="1" />
      <text x="95" y="60" fill="#38bdf8" font-family="'Pretendard', 'Inter', sans-serif" font-size="16" font-weight="800" text-anchor="middle" letter-spacing="1">PART 01</text>
      
      <line x1="185" y1="38" x2="185" y2="70" stroke="#334155" stroke-width="1.5" />
      <text x="220" y="63" fill="#f8fafc" font-family="'Pretendard', 'Inter', sans-serif" font-size="25" font-weight="700">강의 개요 &amp; GraphRAG 소개</text>
    </g>

    <!-- PART 2 -->
    <g transform="translate(0, 130)">
      <rect x="0" y="0" width="1680" height="108" rx="14" fill="url(#cardGrad)" stroke="#1e293b" stroke-width="1.5" />
      <rect x="0" y="0" width="6" height="108" rx="3" fill="url(#gradBlue)" filter="url(#softGlow)" />
      
      <rect x="35" y="33" width="120" height="42" rx="8" fill="#1d4ed8" fill-opacity="0.25" stroke="#3b82f6" stroke-width="1" />
      <text x="95" y="60" fill="#60a5fa" font-family="'Pretendard', 'Inter', sans-serif" font-size="16" font-weight="800" text-anchor="middle" letter-spacing="1">PART 02</text>
      
      <line x1="185" y1="38" x2="185" y2="70" stroke="#334155" stroke-width="1.5" />
      <text x="220" y="63" fill="#f8fafc" font-family="'Pretendard', 'Inter', sans-serif" font-size="25" font-weight="700">GraphRAG의 특징 및 VectorRAG 비교</text>
    </g>

    <!-- PART 3 -->
    <g transform="translate(0, 260)">
      <rect x="0" y="0" width="1680" height="108" rx="14" fill="url(#cardGrad)" stroke="#1e293b" stroke-width="1.5" />
      <rect x="0" y="0" width="6" height="108" rx="3" fill="url(#gradIndigo)" filter="url(#softGlow)" />
      
      <rect x="35" y="33" width="120" height="42" rx="8" fill="#4338ca" fill-opacity="0.25" stroke="#6366f1" stroke-width="1" />
      <text x="95" y="60" fill="#818cf8" font-family="'Pretendard', 'Inter', sans-serif" font-size="16" font-weight="800" text-anchor="middle" letter-spacing="1">PART 03</text>
      
      <line x1="185" y1="38" x2="185" y2="70" stroke="#334155" stroke-width="1.5" />
      <text x="220" y="63" fill="#f8fafc" font-family="'Pretendard', 'Inter', sans-serif" font-size="25" font-weight="700">GraphRAG 데이터베이스 구축 방법</text>
    </g>

    <!-- PART 4 -->
    <g transform="translate(0, 390)">
      <rect x="0" y="0" width="1680" height="108" rx="14" fill="url(#cardGrad)" stroke="#1e293b" stroke-width="1.5" />
      <rect x="0" y="0" width="6" height="108" rx="3" fill="url(#gradViolet)" filter="url(#softGlow)" />
      
      <rect x="35" y="33" width="120" height="42" rx="8" fill="#6d28d9" fill-opacity="0.25" stroke="#8b5cf6" stroke-width="1" />
      <text x="95" y="60" fill="#a78bfa" font-family="'Pretendard', 'Inter', sans-serif" font-size="16" font-weight="800" text-anchor="middle" letter-spacing="1">PART 04</text>
      
      <line x1="185" y1="38" x2="185" y2="70" stroke="#334155" stroke-width="1.5" />
      <text x="220" y="63" fill="#f8fafc" font-family="'Pretendard', 'Inter', sans-serif" font-size="25" font-weight="700">질문 검색 및 답변 생성 메커니즘</text>
    </g>

    <!-- PART 5 -->
    <g transform="translate(0, 520)">
      <rect x="0" y="0" width="1680" height="108" rx="14" fill="url(#cardGrad)" stroke="#1e293b" stroke-width="1.5" />
      <rect x="0" y="0" width="6" height="108" rx="3" fill="url(#gradPurple)" filter="url(#softGlow)" />
      
      <rect x="35" y="33" width="120" height="42" rx="8" fill="#7e22ce" fill-opacity="0.25" stroke="#a855f7" stroke-width="1" />
      <text x="95" y="60" fill="#c084fc" font-family="'Pretendard', 'Inter', sans-serif" font-size="16" font-weight="800" text-anchor="middle" letter-spacing="1">PART 05</text>
      
      <line x1="185" y1="38" x2="185" y2="70" stroke="#334155" stroke-width="1.5" />
      <text x="220" y="63" fill="#f8fafc" font-family="'Pretendard', 'Inter', sans-serif" font-size="25" font-weight="700">답변 인식 문제점 분석 및 개선 방안</text>
    </g>
  </g>

  <!-- Footer -->
  <g transform="translate(120, 940)">
    <text x="0" y="0" fill="#475569" font-family="'Pretendard', 'Inter', sans-serif" font-size="13" font-weight="500" letter-spacing="1">GraphRAG TECHNICAL PRESENTATION</text>
    <text x="1680" y="0" fill="#475569" font-family="'Pretendard', 'Inter', sans-serif" font-size="13" font-weight="600" text-anchor="end">02 / AGENDA</text>
  </g>
</svg>


Slide 02 VectorRAG vs GraphRAG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <!-- Canvas Base Gradient -->
    <radialGradient id="bgGradient" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#070b14" />
      <stop offset="60%" stop-color="#020408" />
      <stop offset="100%" stop-color="#000000" />
    </radialGradient>

    <!-- Vector RAG Accent (Rose/Red) -->
    <linearGradient id="vectorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f43f5e" />
      <stop offset="100%" stop-color="#fb7185" />
    </linearGradient>
    <linearGradient id="vectorCardBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#190e15" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#090509" stop-opacity="0.95" />
    </linearGradient>

    <!-- Graph RAG Accent (Cyan/Indigo/Violet) -->
    <linearGradient id="graphGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#818cf8" />
      <stop offset="100%" stop-color="#c084fc" />
    </linearGradient>
    <linearGradient id="graphCardBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b162a" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#040813" stop-opacity="0.95" />
    </linearGradient>

    <!-- Glowing Filters -->
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2.5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Arrow Markers -->
    <marker id="arrowRose" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" fill="#f43f5e" />
    </marker>
    <marker id="arrowCyan" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" fill="#38bdf8" />
    </marker>
    <marker id="arrowIndigo" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" fill="#818cf8" />
    </marker>
    <marker id="arrowPurple" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" fill="#c084fc" />
    </marker>
  </defs>

  <!-- Base Canvas Background -->
  <rect width="1920" height="1080" fill="url(#bgGradient)" />

  <!-- 80px Margin Boundary Frame -->
  <rect x="80" y="80" width="1760" height="920" rx="16" fill="none" stroke="#1e293b" stroke-width="1.2" />

  <!-- ==================== HEADER ==================== -->
  <g transform="translate(120, 145)">
    <rect x="0" y="-20" width="95" height="26" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1" />
    <text x="47" y="-3" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800" text-anchor="middle">PART 02</text>
    <text x="110" y="2" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="38" font-weight="900" letter-spacing="-0.5">VectorRAG  vs GraphRAG</text>
  </g>

  <!-- ==================== LEFT COLUMN: Vector Space Model (Width: 820px) ==================== -->
  <g transform="translate(120, 195)">
    <!-- Main Card Body -->
    <rect x="0" y="0" width="820" height="695" rx="14" fill="url(#vectorCardBg)" stroke="#3b1722" stroke-width="1.5" />
    <rect x="0" y="0" width="6" height="695" rx="3" fill="url(#vectorGrad)" filter="url(#glow)" />

    <!-- Card Title Bar -->
    <g transform="translate(30, 25)">
      <rect x="0" y="0" width="120" height="32" rx="6" fill="#4c0519" stroke="#f43f5e" stroke-width="1" />
      <text x="60" y="21" fill="#fb7185" font-family="'Pretendard', sans-serif" font-size="13" font-weight="800" text-anchor="middle">Vector Space</text>
      <text x="135" y="24" fill="#fda4af" font-family="'Pretendard', sans-serif" font-size="20" font-weight="800">코사인 유사도 기반 거리 측정 (좌표계 모델)</text>
    </g>

    <!-- DIAGRAM: 3D-like Geometric Vector Space with Cosine Beam -->
    <g transform="translate(30, 75)">
      <rect x="0" y="0" width="760" height="340" rx="12" fill="#0b0609" stroke="#2a121d" stroke-width="1.2" />

      <!-- Coordinate Grid Background -->
      <g stroke="#220e17" stroke-width="1" stroke-dasharray="3 3">
        <line x1="80" y1="270" x2="680" y2="270" />
        <line x1="80" y1="200" x2="680" y2="200" />
        <line x1="80" y1="130" x2="680" y2="130" />
        <line x1="80" y1="60" x2="680" y2="60" />
        <line x1="230" y1="270" x2="230" y2="40" />
        <line x1="380" y1="270" x2="380" y2="40" />
        <line x1="530" y1="270" x2="530" y2="40" />
      </g>

      <!-- 3D Coordinate Axes (X, Y, Z Perspective) -->
      <g stroke="#641d33" stroke-width="2">
        <!-- Z Axis (Depth) -->
        <line x1="80" y1="270" x2="20" y2="310" stroke-dasharray="4 4" />
        <!-- X Axis (Horizontal) -->
        <line x1="80" y1="270" x2="720" y2="270" />
        <polygon points="720,266 730,270 720,274" fill="#e11d48" />
        <!-- Y Axis (Vertical) -->
        <line x1="80" y1="270" x2="80" y2="30" />
        <polygon points="76,30 80,20 84,30" fill="#e11d48" />
      </g>
      <text x="735" y="274" fill="#f43f5e" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800">Dim_X</text>
      <text x="80" y="15" fill="#f43f5e" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800" text-anchor="middle">Dim_Y</text>
      <text x="80" y="290" fill="#64748b" font-family="'Pretendard', sans-serif" font-size="11" font-weight="700">Origin (0,0)</text>

      <!-- Cosine Search Radar Cone / Beam (Radius Area) -->
      <path d="M 80 270 L 340 70 A 240 240 0 0 1 450 160 Z" fill="#f43f5e" fill-opacity="0.12" stroke="#f43f5e" stroke-width="1.2" stroke-dasharray="5 4" />

      <!-- Cosine Angle Arc theta -->
      <path d="M 170 270 A 90 90 0 0 0 148 215" fill="none" stroke="#fb7185" stroke-width="2" />
      <text x="175" y="240" fill="#fda4af" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800">θ</text>
      <text x="285" y="195" fill="#fb7185" font-family="'Pretendard', sans-serif" font-size="11" font-weight="700">Similarity Beam (cos θ ≈ 1)</text>

      <!-- Query Vector q -->
      <g>
        <line x1="80" y1="270" x2="330" y2="85" stroke="#f43f5e" stroke-width="3.5" filter="url(#glow)" />
        <polygon points="325,78 340,80 334,94" fill="#ffffff" />
        <circle cx="340" cy="80" r="6" fill="#ffffff" filter="url(#glow)" />
        <rect x="290" y="45" width="115" height="24" rx="4" fill="#4c0519" stroke="#f43f5e" stroke-width="1" />
        <text x="347" y="61" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="11" font-weight="900" text-anchor="middle">Query Vector (q)</text>
      </g>

      <!-- Vector v1 (Hit - Angle is very close) -->
      <g>
        <line x1="80" y1="270" x2="410" y2="135" stroke="#fb7185" stroke-width="2" stroke-dasharray="4 2" />
        <circle cx="410" cy="135" r="7" fill="#fb7185" filter="url(#softGlow)" />
        <rect x="425" y="122" width="130" height="26" rx="4" fill="#240c17" stroke="#fb7185" stroke-width="1" />
        <text x="490" y="139" fill="#fda4af" font-family="'Pretendard', sans-serif" font-size="11" font-weight="700" text-anchor="middle">Hit: Chunk 1 (cos θ = 0.92)</text>
      </g>

      <!-- Vector v2 (Missed - Contextually linked but distant angle) -->
      <g>
        <line x1="80" y1="270" x2="570" y2="90" stroke="#4c1d2e" stroke-width="1.5" stroke-dasharray="4 4" />
        <circle cx="570" cy="90" r="6" fill="#4c1d2e" />
        <rect x="585" y="78" width="150" height="26" rx="4" fill="#14070d" stroke="#4c0519" stroke-width="1" />
        <text x="660" y="95" fill="#64748b" font-family="'Pretendard', sans-serif" font-size="10" font-weight="600" text-anchor="middle">Miss: Chunk 2 (인과 관계 단절)</text>
      </g>

      <!-- Other Isolated Points in Coordinate Space -->
      <circle cx="210" cy="160" r="5" fill="#33141f" />
      <circle cx="480" cy="230" r="5" fill="#33141f" />
      <circle cx="630" cy="200" r="5" fill="#33141f" />
      <circle cx="290" cy="240" r="5" fill="#33141f" />

      <!-- Red Cross Badge indicating No Relationships -->
      <g transform="translate(480, 280)">
        <rect x="0" y="0" width="255" height="34" rx="6" fill="#310a14" stroke="#f43f5e" stroke-width="1" />
        <text x="127" y="21" fill="#fca5a5" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800" text-anchor="middle">✕ 노드 간 연결선(Edge) 부재 / 고립 좌표</text>
      </g>
    </g>

    <!-- 3 Core Mechanism Blocks -->
    <g transform="translate(30, 435)">
      <!-- Item 1 -->
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="760" height="72" rx="8" fill="#12070e" stroke="#2a121d" stroke-width="1" />
        <rect x="15" y="16" width="38" height="38" rx="6" fill="#3b0718" stroke="#f43f5e" stroke-width="1" />
        <text x="34" y="40" fill="#fb7185" font-family="'Pretendard', sans-serif" font-size="14" font-weight="900" text-anchor="middle">01</text>
        <text x="68" y="32" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="15" font-weight="800">다차원 벡터 공간 고립 투영</text>
        <text x="68" y="52" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="12">텍스트를 독립된 수치 벡터로 변환하여 개별 청크의 좌표만 기록 (관계망 유실)</text>
      </g>

      <!-- Item 2 -->
      <g transform="translate(0, 84)">
        <rect x="0" y="0" width="760" height="72" rx="8" fill="#12070e" stroke="#2a121d" stroke-width="1" />
        <rect x="15" y="16" width="38" height="38" rx="6" fill="#3b0718" stroke="#f43f5e" stroke-width="1" />
        <text x="34" y="40" fill="#fb7185" font-family="'Pretendard', sans-serif" font-size="14" font-weight="900" text-anchor="middle">02</text>
        <text x="68" y="32" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="15" font-weight="800">코사인 유사도(cos θ) 각도 탐색</text>
        <text x="68" y="52" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="12">질의어 벡터와 방향이 가장 가까운 Top-K 청크만 좁은 시야로 추출</text>
      </g>

      <!-- Item 3 -->
      <g transform="translate(0, 168)">
        <rect x="0" y="0" width="760" height="72" rx="8" fill="#12070e" stroke="#2a121d" stroke-width="1" />
        <rect x="15" y="16" width="38" height="38" rx="6" fill="#3b0718" stroke="#f43f5e" stroke-width="1" />
        <text x="34" y="40" fill="#fb7185" font-family="'Pretendard', sans-serif" font-size="14" font-weight="900" text-anchor="middle">03</text>
        <text x="68" y="32" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="15" font-weight="800">문맥·인과관계 추론 실패</text>
        <text x="68" y="52" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="12">조항 간의 준용·원인-결과 관계가 있어도 단어가 다르면 벡터 각도가 벌어져 탐색 불가</text>
      </g>
    </g>
  </g>

  <!-- ==================== RIGHT COLUMN: Graph Network Model (Width: 820px) ==================== -->
  <g transform="translate(980, 195)">
    <!-- Main Card Body -->
    <rect x="0" y="0" width="820" height="695" rx="14" fill="url(#graphCardBg)" stroke="#162942" stroke-width="1.5" />
    <rect x="0" y="0" width="6" height="695" rx="3" fill="url(#graphGrad)" filter="url(#glow)" />

    <!-- Card Title Bar -->
    <g transform="translate(30, 25)">
      <rect x="0" y="0" width="120" height="32" rx="6" fill="#0c4a6e" stroke="#0284c7" stroke-width="1" />
      <text x="60" y="21" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="13" font-weight="800" text-anchor="middle">GraphDB Network</text>
      <text x="135" y="24" fill="#bae6fd" font-family="'Pretendard', sans-serif" font-size="20" font-weight="800">지식 그래프 기반 관계망 탐색 (네트워크 모델)</text>
    </g>

    <!-- DIAGRAM: GraphDB Circular Nodes, Labeled Edges & Traversal Walk -->
    <g transform="translate(30, 75)">
      <rect x="0" y="0" width="760" height="340" rx="12" fill="#040914" stroke="#0f223d" stroke-width="1.2" />

      <!-- Community Cluster Boundaries -->
      <path d="M 60 70 Q 280 20 520 60 Q 720 120 680 260 Q 380 320 100 280 Z" fill="#082f49" fill-opacity="0.12" stroke="#0369a1" stroke-width="1.2" stroke-dasharray="6 4" />
      <text x="100" y="295" fill="#0284c7" font-family="'Pretendard', sans-serif" font-size="11" font-weight="700">Hierarchical Community Cluster</text>

      <!-- Directed Labeled Edges (Traversal Path) -->
      <g stroke-width="2.5">
        <!-- Edge 1: Start Node -> Hub Node -->
        <line x1="140" y1="130" x2="300" y2="100" stroke="#38bdf8" marker-end="url(#arrowCyan)" filter="url(#softGlow)" />
        <!-- Edge 2: Hub Node -> Branch 1 -->
        <line x1="340" y1="100" x2="520" y2="75" stroke="#818cf8" marker-end="url(#arrowIndigo)" filter="url(#softGlow)" />
        <!-- Edge 3: Hub Node -> Branch 2 -->
        <line x1="335" y1="125" x2="395" y2="215" stroke="#818cf8" marker-end="url(#arrowIndigo)" filter="url(#softGlow)" />
        <!-- Edge 4: Branch 2 -> Target Node -->
        <line x1="420" y1="225" x2="590" y2="195" stroke="#c084fc" marker-end="url(#arrowPurple)" filter="url(#softGlow)" />
        <!-- Edge 5: Branch 1 -> Target Node -->
        <line x1="540" y1="95" x2="600" y2="170" stroke="#c084fc" marker-end="url(#arrowPurple)" />
        <!-- Sub Edge -->
        <line x1="135" y1="155" x2="200" y2="230" stroke="#1e3a5f" stroke-width="1.5" stroke-dasharray="3 3" />
      </g>

      <!-- Relationship Badges -->
      <g transform="translate(195, 95)">
        <rect x="0" y="0" width="60" height="18" rx="4" fill="#0b1322" stroke="#38bdf8" stroke-width="1" />
        <text x="30" y="13" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="9" font-weight="800" text-anchor="middle">REFERENCES</text>
      </g>
      <g transform="translate(415, 68)">
        <rect x="0" y="0" width="60" height="18" rx="4" fill="#0b1322" stroke="#818cf8" stroke-width="1" />
        <text x="30" y="13" fill="#818cf8" font-family="'Pretendard', sans-serif" font-size="9" font-weight="800" text-anchor="middle">APPLIES_TO</text>
      </g>
      <g transform="translate(475, 222)">
        <rect x="0" y="0" width="66" height="18" rx="4" fill="#0b1322" stroke="#c084fc" stroke-width="1" />
        <text x="33" y="13" fill="#c084fc" font-family="'Pretendard', sans-serif" font-size="9" font-weight="800" text-anchor="middle">LEADS_TO</text>
      </g>

      <!-- Circular Graph Nodes -->
      <!-- Node A: Query Target -->
      <g transform="translate(130, 130)">
        <circle cx="0" cy="0" r="28" fill="#0c4a6e" stroke="#38bdf8" stroke-width="2.5" filter="url(#glow)" />
        <text x="0" y="4" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="12" font-weight="900" text-anchor="middle">Node A</text>
        <text x="0" y="-35" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="10" font-weight="800" text-anchor="middle">Start Entity</text>
      </g>

      <!-- Node B: Hub Entity -->
      <g transform="translate(325, 100)">
        <circle cx="0" cy="0" r="32" fill="#312e81" stroke="#818cf8" stroke-width="2.5" filter="url(#glow)" />
        <text x="0" y="4" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="13" font-weight="900" text-anchor="middle">Node B</text>
        <text x="0" y="-38" fill="#a5b4fc" font-family="'Pretendard', sans-serif" font-size="10" font-weight="800" text-anchor="middle">Core Hub</text>
      </g>

      <!-- Node C: Branch Entity 1 -->
      <g transform="translate(535, 75)">
        <circle cx="0" cy="0" r="24" fill="#1e1b4b" stroke="#818cf8" stroke-width="2" />
        <text x="0" y="4" fill="#e0e7ff" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800" text-anchor="middle">Node C</text>
      </g>

      <!-- Node D: Branch Entity 2 -->
      <g transform="translate(410, 230)">
        <circle cx="0" cy="0" r="26" fill="#4c1d95" stroke="#a78bfa" stroke-width="2" />
        <text x="0" y="4" fill="#ede9fe" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800" text-anchor="middle">Node D</text>
      </g>

      <!-- Node E: Final Multi-hop Result -->
      <g transform="translate(615, 185)">
        <circle cx="0" cy="0" r="30" fill="#581c87" stroke="#c084fc" stroke-width="3" filter="url(#glow)" />
        <text x="0" y="4" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="13" font-weight="900" text-anchor="middle">Node E</text>
        <text x="0" y="44" fill="#c084fc" font-family="'Pretendard', sans-serif" font-size="11" font-weight="900" text-anchor="middle">Multi-hop Reach</text>
      </g>

      <!-- Sub Cluster Node -->
      <g transform="translate(210, 240)">
        <circle cx="0" cy="0" r="16" fill="#082f49" stroke="#0284c7" stroke-width="1.2" />
        <text x="0" y="3" fill="#7dd3fc" font-family="'Pretendard', sans-serif" font-size="9" text-anchor="middle">Sub</text>
      </g>

      <!-- Success Badge -->
      <g transform="translate(480, 280)">
        <rect x="0" y="0" width="255" height="34" rx="6" fill="#042f2e" stroke="#14b8a6" stroke-width="1" />
        <text x="127" y="21" fill="#5eead4" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800" text-anchor="middle">✓ Graph Traversal 경로 추적 성공</text>
      </g>
    </g>

    <!-- 3 Core Mechanism Blocks -->
    <g transform="translate(30, 435)">
      <!-- Item 1 -->
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="760" height="72" rx="8" fill="#061224" stroke="#0e233f" stroke-width="1" />
        <rect x="15" y="16" width="38" height="38" rx="6" fill="#0c4a6e" stroke="#38bdf8" stroke-width="1" />
        <text x="34" y="40" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="14" font-weight="900" text-anchor="middle">01</text>
        <text x="68" y="32" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="15" font-weight="800">지식 그래프(KG) 명시적 모델링</text>
        <text x="68" y="52" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="12">개체를 원형 노드(Node)로, 관계를 유향 엣지(Edge)로 정의하여 맥락 구조화</text>
      </g>

      <!-- Item 2 -->
      <g transform="translate(0, 84)">
        <rect x="0" y="0" width="760" height="72" rx="8" fill="#061224" stroke="#0e233f" stroke-width="1" />
        <rect x="15" y="16" width="38" height="38" rx="6" fill="#312e81" stroke="#818cf8" stroke-width="1" />
        <text x="34" y="40" fill="#818cf8" font-family="'Pretendard', sans-serif" font-size="14" font-weight="900" text-anchor="middle">02</text>
        <text x="68" y="32" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="15" font-weight="800">경로 탐색 (Graph Traversal)</text>
        <text x="68" y="52" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="12">노드와 엣지를 따라 다단계(Multi-hop)로 연결된 숨은 단서를 체계적으로 추적</text>
      </g>

      <!-- Item 3 -->
      <g transform="translate(0, 168)">
        <rect x="0" y="0" width="760" height="72" rx="8" fill="#061224" stroke="#0e233f" stroke-width="1" />
        <rect x="15" y="16" width="38" height="38" rx="6" fill="#581c87" stroke="#c084fc" stroke-width="1" />
        <text x="34" y="40" fill="#c084fc" font-family="'Pretendard', sans-serif" font-size="14" font-weight="900" text-anchor="middle">03</text>
        <text x="68" y="32" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="15" font-weight="800">상호 관계 및 전역 맥락 복원</text>
        <text x="68" y="52" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="12">단어 유사도의 한계를 극복하고 분산된 데이터 간의 상호작용을 완벽하게 파악</text>
      </g>
    </g>
  </g>

  <!-- ==================== BOTTOM SUMMARY BANNER ==================== -->
  <g transform="translate(120, 915)">
    <rect x="0" y="0" width="1680" height="55" rx="10" fill="#080e1a" stroke="#1e293b" stroke-width="1.2" />
    
    <g transform="translate(40, 16)">
      <rect x="0" y="0" width="105" height="24" rx="4" fill="#3b0718" stroke="#f43f5e" stroke-width="1" />
      <text x="52" y="16" fill="#fb7185" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800" text-anchor="middle">Vector Model</text>
      <text x="120" y="17" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="13" font-weight="600">독립된 좌표 간 코사인 거리(cos θ) 측정 ➔ 엣지(Edge) 부재로 인과관계 단절</text>
    </g>

    <text x="840" y="34" fill="#64748b" font-family="'Pretendard', sans-serif" font-size="16" font-weight="900" text-anchor="middle">VS</text>

    <g transform="translate(920, 16)">
      <rect x="0" y="0" width="105" height="24" rx="4" fill="#0c4a6e" stroke="#38bdf8" stroke-width="1" />
      <text x="52" y="16" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800" text-anchor="middle">Graph Model</text>
      <text x="120" y="17" fill="#f8fafc" font-family="'Pretendard', sans-serif" font-size="13" font-weight="700">노드-엣지 네트워크 구조 ➔ Graph Traversal로 다단계 상호 관계 완벽 추론</text>
    </g>
  </g>

  <!-- ==================== FOOTER ==================== -->
  <g transform="translate(120, 990)">
    <text x="0" y="0" fill="#475569" font-family="'Pretendard', sans-serif" font-size="12" font-weight="500" letter-spacing="1">GraphRAG PRESENTATION | ARCHITECTURE COMPARISON</text>
    <text x="1680" y="0" fill="#475569" font-family="'Pretendard', sans-serif" font-size="12" font-weight="600" text-anchor="end">03 / COMPARISON</text>
  </g>
</svg>

Slide 03 LLM 한게
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <!-- Background Radial Gradient -->
    <radialGradient id="bgGradient" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#070b14" />
      <stop offset="60%" stop-color="#020408" />
      <stop offset="100%" stop-color="#000000" />
    </radialGradient>

    <!-- Card Backgrounds -->
    <linearGradient id="cardBgAmber" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1c1308" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#0a0703" stop-opacity="0.95" />
    </linearGradient>
    <linearGradient id="cardBgCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#081826" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#030b12" stop-opacity="0.95" />
    </linearGradient>
    <linearGradient id="cardBgRose" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1c0910" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#0a0306" stop-opacity="0.95" />
    </linearGradient>

    <!-- Accent Gradients -->
    <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#fbbf24" />
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0ea5e9" />
    </linearGradient>
    <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f43f5e" />
      <stop offset="100%" stop-color="#e11d48" />
    </linearGradient>

    <!-- Glow Filters -->
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2.5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Arrow Markers -->
    <marker id="arrowAmber" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" fill="#f59e0b" />
    </marker>
    <marker id="arrowCyan" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" fill="#38bdf8" />
    </marker>
    <marker id="arrowRose" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" fill="#f43f5e" />
    </marker>
  </defs>

  <!-- Base Canvas Background -->
  <rect width="1920" height="1080" fill="url(#bgGradient)" />

  <!-- 80px Margin Boundary Frame -->
  <rect x="80" y="80" width="1760" height="920" rx="16" fill="none" stroke="#1e293b" stroke-width="1.2" />

  <!-- ==================== HEADER ==================== -->
  <g transform="translate(120, 145)">
    <rect x="0" y="-20" width="110" height="26" rx="6" fill="#1e293b" stroke="#f43f5e" stroke-width="1" />
    <text x="55" y="-3" fill="#fb7185" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800" text-anchor="middle">BOTTLENECK</text>
    <text x="125" y="2" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="38" font-weight="900" letter-spacing="-0.5">Neo4j 스키마 및 LLM 전수 적재의 3대 한계</text>
  </g>

  <!-- ==================== 3 BOTTLENECK VISUAL CARDS ==================== -->

  <!-- CARD 1: COST (X: 120) -->
  <g transform="translate(120, 195)">
    <!-- Card Frame -->
    <rect x="0" y="0" width="540" height="700" rx="14" fill="url(#cardBgAmber)" stroke="#3a250a" stroke-width="1.5" />
    <rect x="0" y="0" width="6" height="700" rx="3" fill="url(#amberGrad)" filter="url(#glow)" />

    <!-- Card Header -->
    <g transform="translate(25, 25)">
      <rect x="0" y="0" width="105" height="32" rx="6" fill="#451a03" stroke="#f59e0b" stroke-width="1" />
      <text x="52" y="21" fill="#fbbf24" font-family="'Pretendard', sans-serif" font-size="13" font-weight="800" text-anchor="middle">LIMIT 01</text>
      <text x="120" y="23" fill="#fef3c7" font-family="'Pretendard', sans-serif" font-size="22" font-weight="900">💰 비용 (Cost)</text>
    </g>

    <!-- LARGE VISUAL DIAGRAM: Exponential Cost Escalator -->
    <g transform="translate(25, 75)">
      <rect x="0" y="0" width="490" height="450" rx="12" fill="#0b0702" stroke="#261805" stroke-width="1.2" />

      <!-- Stage Multipliers Diagram -->
      <!-- Step 1 -->
      <g transform="translate(30, 30)">
        <rect x="0" y="0" width="115" height="60" rx="8" fill="#1c1104" stroke="#78350f" stroke-width="1" />
        <text x="57" y="26" fill="#fbbf24" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800" text-anchor="middle">1. 원본 청크</text>
        <text x="57" y="46" fill="#d97706" font-family="'Pretendard', sans-serif" font-size="10" text-anchor="middle">100% LLM 주입</text>
      </g>
      <path d="M 155 60 L 185 60" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrowAmber)" />

      <!-- Step 2 -->
      <g transform="translate(195, 30)">
        <rect x="0" y="0" width="115" height="60" rx="8" fill="#291807" stroke="#b45309" stroke-width="1.2" />
        <text x="57" y="26" fill="#fde68a" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800" text-anchor="middle">2. 개체/관계 추출</text>
        <text x="57" y="46" fill="#f59e0b" font-family="'Pretendard', sans-serif" font-size="10" font-weight="700" text-anchor="middle">토큰 소모 × 3배</text>
      </g>
      <path d="M 320 60 L 350 60" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrowAmber)" />

      <!-- Step 3 -->
      <g transform="translate(360, 30)">
        <rect x="0" y="0" width="100" height="60" rx="8" fill="#381e09" stroke="#f59e0b" stroke-width="1.5" />
        <text x="50" y="26" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="11" font-weight="900" text-anchor="middle">3. 군집 요약</text>
        <text x="50" y="46" fill="#fde68a" font-family="'Pretendard', sans-serif" font-size="10" font-weight="700" text-anchor="middle">토큰 소모 × 8배</text>
      </g>

      <!-- Token Cost Inflation Curve (Exponential Visual) -->
      <g transform="translate(30, 115)">
        <rect x="0" y="0" width="430" height="195" rx="8" fill="#140a02" stroke="#381905" stroke-width="1" />
        
        <!-- Grid lines -->
        <line x1="40" y1="160" x2="390" y2="160" stroke="#2d1704" stroke-width="1" />
        <line x1="40" y1="110" x2="390" y2="110" stroke="#2d1704" stroke-width="1" stroke-dasharray="2 2" />
        <line x1="40" y1="60" x2="390" y2="60" stroke="#2d1704" stroke-width="1" stroke-dasharray="2 2" />
        
        <!-- Curve Axis Labels -->
        <text x="35" y="164" fill="#64748b" font-family="'Pretendard', sans-serif" font-size="9" text-anchor="end">0</text>
        <text x="35" y="114" fill="#64748b" font-family="'Pretendard', sans-serif" font-size="9" text-anchor="end">100만</text>
        <text x="35" y="64" fill="#64748b" font-family="'Pretendard', sans-serif" font-size="9" text-anchor="end">500만+</text>

        <!-- Exponential Path -->
        <path d="M 50 155 Q 220 150 370 45" fill="none" stroke="#f59e0b" stroke-width="3.5" filter="url(#glow)" />
        <circle cx="370" cy="45" r="6" fill="#ffffff" filter="url(#glow)" />
        <text x="360" y="30" fill="#fbbf24" font-family="'Pretendard', sans-serif" font-size="12" font-weight="900" text-anchor="end">토큰 기하급수 폭증 ↗</text>

        <!-- Vector vs Graph Comparison Bars -->
        <g transform="translate(50, 135)">
          <text x="0" y="-8" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="10">VectorRAG (단일 임베딩)</text>
          <rect x="135" y="-18" width="50" height="12" rx="3" fill="#38bdf8" />
          <text x="195" y="-9" fill="#7dd3fc" font-family="'Pretendard', sans-serif" font-size="10" font-weight="700">약 5만 원</text>
        </g>
        <g transform="translate(50, 175)">
          <text x="0" y="-8" fill="#fca5a5" font-family="'Pretendard', sans-serif" font-size="10">GraphRAG (LLM 전수 적재)</text>
          <rect x="135" y="-18" width="180" height="12" rx="3" fill="url(#amberGrad)" filter="url(#softGlow)" />
          <text x="325" y="-9" fill="#fbbf24" font-family="'Pretendard', sans-serif" font-size="10" font-weight="900">수백만 원 이상</text>
        </g>
      </g>

      <!-- Cost Callout Badge -->
      <g transform="translate(30, 330)">
        <rect x="0" y="0" width="430" height="95" rx="8" fill="#2d1303" stroke="#f59e0b" stroke-width="1.2" />
        <text x="215" y="38" fill="#fde68a" font-family="'Pretendard', sans-serif" font-size="15" font-weight="900" text-anchor="middle">💸 대량 코퍼스 적재 비용 수백만 원</text>
        <text x="215" y="68" fill="#fbbf24" font-family="'Pretendard', sans-serif" font-size="12" font-weight="600" text-anchor="middle">모든 청크 반복 API 호출 ➔ 기하급수적 토큰 과금</text>
      </g>
    </g>

    <!-- CORE 2-LINE SUMMARY CHIP -->
    <g transform="translate(25, 545)">
      <rect x="0" y="0" width="490" height="130" rx="10" fill="#140a02" stroke="#451a03" stroke-width="1.5" />
      <rect x="20" y="20" width="6" height="20" rx="2" fill="#f59e0b" />
      <text x="35" y="36" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="16" font-weight="900">전수 LLM 호출로 인한 토큰 폭증</text>
      <text x="35" y="70" fill="#d1d5db" font-family="'Pretendard', sans-serif" font-size="13" font-weight="600">· 엔티티 추출, 중복 제거, 군집 요약마다 반복 API 호출</text>
      <text x="35" y="98" fill="#fbbf24" font-family="'Pretendard', sans-serif" font-size="13" font-weight="700">· 대량 문서 적재 시 기하급수적 토큰 소모 및 수백만 원 과금</text>
    </g>
  </g>

  <!-- CARD 2: SPEED (X: 690) -->
  <g transform="translate(690, 195)">
    <!-- Card Frame -->
    <rect x="0" y="0" width="540" height="700" rx="14" fill="url(#cardBgCyan)" stroke="#0e2a3f" stroke-width="1.5" />
    <rect x="0" y="0" width="6" height="700" rx="3" fill="url(#cyanGrad)" filter="url(#glow)" />

    <!-- Card Header -->
    <g transform="translate(25, 25)">
      <rect x="0" y="0" width="105" height="32" rx="6" fill="#082f49" stroke="#0284c7" stroke-width="1" />
      <text x="52" y="21" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="13" font-weight="800" text-anchor="middle">LIMIT 02</text>
      <text x="120" y="23" fill="#e0f2fe" font-family="'Pretendard', sans-serif" font-size="22" font-weight="900">⚡ 속도 (Speed)</text>
    </g>

    <!-- LARGE VISUAL DIAGRAM: Latency & Rate Limit Funnel -->
    <g transform="translate(25, 75)">
      <rect x="0" y="0" width="490" height="450" rx="12" fill="#020a10" stroke="#0e2033" stroke-width="1.2" />

      <!-- Funnel Bottleneck Graphic -->
      <g transform="translate(30, 25)">
        <!-- Input Documents Stream -->
        <rect x="0" y="0" width="430" height="50" rx="6" fill="#082036" stroke="#0284c7" stroke-width="1" />
        <text x="215" y="30" fill="#e0f2fe" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800" text-anchor="middle">수만 페이지 대용량 문서 데이터셋</text>

        <!-- Flow Lines Downward -->
        <path d="M 120 50 L 180 95" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3 3" />
        <path d="M 310 50 L 250 95" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3 3" />

        <!-- Funnel Neck (Rate Limit / Latency) -->
        <g transform="translate(145, 95)">
          <rect x="0" y="0" width="140" height="75" rx="8" fill="#1e1329" stroke="#f43f5e" stroke-width="2" filter="url(#softGlow)" />
          <rect x="15" y="10" width="110" height="20" rx="4" fill="#4c0519" />
          <text x="70" y="24" fill="#fb7185" font-family="'Pretendard', sans-serif" font-size="10" font-weight="900" text-anchor="middle">RATE LIMIT BOTTLENECK</text>
          <text x="70" y="48" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="12" font-weight="900" text-anchor="middle">RPM / TPM 제한</text>
          <text x="70" y="64" fill="#fda4af" font-family="'Pretendard', sans-serif" font-size="10" text-anchor="middle">네트워크 Latency 지연</text>
        </g>

        <!-- Drop-by-drop slow output arrow -->
        <path d="M 215 175 L 215 205" stroke="#f43f5e" stroke-width="2.5" stroke-dasharray="2 3" marker-end="url(#arrowRose)" />
      </g>

      <!-- Time Gauge Graphic -->
      <g transform="translate(30, 240)">
        <rect x="0" y="0" width="430" height="95" rx="8" fill="#041726" stroke="#0e3554" stroke-width="1" />
        
        <!-- Vector vs Graph Speed Comparison -->
        <g transform="translate(20, 25)">
          <text x="0" y="0" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="11">Vector Indexing:</text>
          <rect x="110" y="-12" width="40" height="14" rx="4" fill="#38bdf8" />
          <text x="160" y="0" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800">수 분 (Fast)</text>
        </g>
        
        <g transform="translate(20, 65)">
          <text x="0" y="0" fill="#fca5a5" font-family="'Pretendard', sans-serif" font-size="11">GraphRAG Pipeline:</text>
          <rect x="110" y="-12" width="220" height="14" rx="4" fill="url(#roseGrad)" filter="url(#softGlow)" />
          <text x="340" y="0" fill="#f43f5e" font-family="'Pretendard', sans-serif" font-size="12" font-weight="900">수십 시간 ~ 수일</text>
        </g>
      </g>

      <!-- Speed Callout Badge -->
      <g transform="translate(30, 350)">
        <rect x="0" y="0" width="430" height="75" rx="8" fill="#08233a" stroke="#0284c7" stroke-width="1.2" />
        <text x="215" y="32" fill="#bae6fd" font-family="'Pretendard', sans-serif" font-size="15" font-weight="900" text-anchor="middle">⏱️ 실시간 데이터 적재 및 업데이트 불가</text>
        <text x="215" y="56" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="12" font-weight="600" text-anchor="middle">순차적 직렬 파싱 ➔ 변경 시 전체 재구축 시간 부담</text>
      </g>
    </g>

    <!-- CORE 2-LINE SUMMARY CHIP -->
    <g transform="translate(25, 545)">
      <rect x="0" y="0" width="490" height="130" rx="10" fill="#03121f" stroke="#0e2a3f" stroke-width="1.5" />
      <rect x="20" y="20" width="6" height="20" rx="2" fill="#38bdf8" />
      <text x="35" y="36" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="16" font-weight="900">API 레이턴시 및 처리량 병목</text>
      <text x="35" y="70" fill="#d1d5db" font-family="'Pretendard', sans-serif" font-size="13" font-weight="600">· 네트워크 지연 및 API Rate Limit(RPM/TPM)으로 인한 극심한 지연</text>
      <text x="35" y="98" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="13" font-weight="700">· 수만 페이지 분석 시 수십 시간 소요 ➔ 실시간 반영 불가능</text>
    </g>
  </g>

  <!-- CARD 3: HALLUCINATION (X: 1260) -->
  <g transform="translate(1260, 195)">
    <!-- Card Frame -->
    <rect x="0" y="0" width="540" height="700" rx="14" fill="url(#cardBgRose)" stroke="#3f1422" stroke-width="1.5" />
    <rect x="0" y="0" width="6" height="700" rx="3" fill="url(#roseGrad)" filter="url(#glow)" />

    <!-- Card Header -->
    <g transform="translate(25, 25)">
      <rect x="0" y="0" width="105" height="32" rx="6" fill="#4c0519" stroke="#f43f5e" stroke-width="1" />
      <text x="52" y="21" fill="#fb7185" font-family="'Pretendard', sans-serif" font-size="13" font-weight="800" text-anchor="middle">LIMIT 03</text>
      <text x="120" y="23" fill="#ffe4e6" font-family="'Pretendard', sans-serif" font-size="22" font-weight="900">🧠 환각 (Hallucination)</text>
    </g>

    <!-- LARGE VISUAL DIAGRAM: Phantom Nodes & Broken Graph Topology -->
    <g transform="translate(25, 75)">
      <rect x="0" y="0" width="490" height="450" rx="12" fill="#0d0408" stroke="#2b0e19" stroke-width="1.2" />

      <!-- Top: Correct Ground Truth Graph -->
      <g transform="translate(30, 30)">
        <rect x="0" y="0" width="430" height="110" rx="8" fill="#14060c" stroke="#3b1523" stroke-width="1" />
        <text x="15" y="22" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800">✓ 실제 법률 관계 (Ground Truth)</text>

        <!-- Node A -->
        <circle cx="80" cy="65" r="24" fill="#0c4a6e" stroke="#38bdf8" stroke-width="2" />
        <text x="80" y="69" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="10" font-weight="800" text-anchor="middle">제103조</text>

        <!-- Correct Edge -->
        <line x1="110" y1="65" x2="280" y2="65" stroke="#38bdf8" stroke-width="2.5" />
        <rect x="155" y="53" width="80" height="22" rx="4" fill="#082f49" stroke="#38bdf8" stroke-width="0.8" />
        <text x="195" y="68" fill="#7dd3fc" font-family="'Pretendard', sans-serif" font-size="9" font-weight="800" text-anchor="middle">적용 (준용)</text>

        <!-- Node B -->
        <circle cx="310" cy="65" r="24" fill="#312e81" stroke="#818cf8" stroke-width="2" />
        <text x="310" y="69" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="10" font-weight="800" text-anchor="middle">제746조</text>
      </g>

      <!-- Bottom: LLM Hallucinated Broken Graph -->
      <g transform="translate(30, 155)">
        <rect x="0" y="0" width="430" height="165" rx="8" fill="#20060e" stroke="#4c0519" stroke-width="1.2" />
        <text x="15" y="24" fill="#f43f5e" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800">✕ LLM 적재 오류 (환각 노드 &amp; 가짜 엣지)</text>

        <!-- Node A -->
        <circle cx="80" cy="85" r="24" fill="#0c4a6e" stroke="#38bdf8" stroke-width="2" />
        <text x="80" y="89" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="10" font-weight="800" text-anchor="middle">제103조</text>

        <!-- Hallucinated Broken Edge -->
        <line x1="110" y1="85" x2="280" y2="85" stroke="#f43f5e" stroke-width="2.5" stroke-dasharray="4 3" />
        <rect x="145" y="73" width="100" height="22" rx="4" fill="#4c0519" stroke="#f43f5e" stroke-width="1" />
        <text x="195" y="88" fill="#fca5a5" font-family="'Pretendard', sans-serif" font-size="9" font-weight="900" text-anchor="middle">✕ 임의 관계 연결</text>

        <!-- Phantom Node (Fake Article) -->
        <circle cx="310" cy="85" r="26" fill="#4c0519" stroke="#f43f5e" stroke-width="2.5" stroke-dasharray="3 3" filter="url(#glow)" />
        <text x="310" y="82" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="10" font-weight="900" text-anchor="middle">가짜 조문</text>
        <text x="310" y="96" fill="#fca5a5" font-family="'Pretendard', sans-serif" font-size="8" text-anchor="middle">(미존재 #999)</text>

        <text x="215" y="145" fill="#fca5a5" font-family="'Pretendard', sans-serif" font-size="11" font-weight="700" text-anchor="middle">단 하나의 조문 왜곡도 전체 판결 논리 붕괴 직결</text>
      </g>

      <!-- Hallucination Callout Badge -->
      <g transform="translate(30, 335)">
        <rect x="0" y="0" width="430" height="90" rx="8" fill="#310815" stroke="#e11d48" stroke-width="1.2" />
        <text x="215" y="35" fill="#ffe4e6" font-family="'Pretendard', sans-serif" font-size="15" font-weight="900" text-anchor="middle">⚠️ 지식 그래프 데이터 무결성 훼손</text>
        <text x="215" y="65" fill="#fb7185" font-family="'Pretendard', sans-serif" font-size="12" font-weight="600" text-anchor="middle">확률적 모델 특성상 엄밀한 법률 도메인에서 치명적 오답 유발</text>
      </g>
    </g>

    <!-- CORE 2-LINE SUMMARY CHIP -->
    <g transform="translate(25, 545)">
      <rect x="0" y="0" width="490" height="130" rx="10" fill="#140409" stroke="#3f1422" stroke-width="1.5" />
      <rect x="20" y="20" width="6" height="20" rx="2" fill="#f43f5e" />
      <text x="35" y="36" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="16" font-weight="900">가짜 노드 및 허위 관계 엣지 생성</text>
      <text x="35" y="70" fill="#d1d5db" font-family="'Pretendard', sans-serif" font-size="13" font-weight="600">· 존재하지 않는 조문 번호 임의 생성 및 메타데이터 왜곡</text>
      <text x="35" y="98" fill="#fb7185" font-family="'Pretendard', sans-serif" font-size="13" font-weight="700">· 준용·예외 조항 누락 및 거짓 엣지 연결로 최종 추론 붕괴</text>
    </g>
  </g>

  <!-- ==================== BOTTOM CORE SUMMARY BANNER ==================== -->
  <g transform="translate(120, 915)">
    <rect x="0" y="0" width="1680" height="55" rx="10" fill="#080e1a" stroke="#1e293b" stroke-width="1.2" />
    <circle cx="35" cy="27" r="5" fill="#f43f5e" filter="url(#softGlow)" />
    <text x="55" y="32" fill="#e2e8f0" font-family="'Pretendard', sans-serif" font-size="14" font-weight="600">
      <tspan fill="#fbbf24" font-weight="800">비용 폭증</tspan> · <tspan fill="#38bdf8" font-weight="800">속도 지연</tspan> · <tspan fill="#f43f5e" font-weight="800">환각 오류</tspan> 해결을 위해, LLM 전수 적재가 아닌 <tspan fill="#34d399" font-weight="800">"규칙 기반(Rule-based) 전처리 + 결정론적 파서 결합"</tspan> 구조가 필수적입니다.
    </text>
  </g>

  <!-- ==================== FOOTER ==================== -->
  <g transform="translate(120, 990)">
    <text x="0" y="0" fill="#475569" font-family="'Pretendard', sans-serif" font-size="12" font-weight="500" letter-spacing="1">GraphRAG PRESENTATION | INGESTION BOTTLENECKS</text>
    <text x="1680" y="0" fill="#475569" font-family="'Pretendard', sans-serif" font-size="12" font-weight="600" text-anchor="end">06 / BOTTLENECK</text>
  </g>
</svg>

Slide 04 [Regex Parser]: 100% 결정론적 정규표현식 파서 (0원, 3초, 100% 정밀도)
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <!-- Background Radial Gradient -->
    <radialGradient id="bgGradient" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#070b14" />
      <stop offset="60%" stop-color="#020408" />
      <stop offset="100%" stop-color="#000000" />
    </radialGradient>

    <!-- Accent Color Gradients -->
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#34d399" />
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0ea5e9" />
    </linearGradient>

    <!-- Glow Filters -->
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Arrow Markers -->
    <marker id="arrowEmerald" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" fill="#34d399" />
    </marker>
    <marker id="arrowCyan" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" fill="#38bdf8" />
    </marker>
  </defs>

  <!-- Base Canvas Background -->
  <rect width="1920" height="1080" fill="url(#bgGradient)" />
  <rect x="80" y="80" width="1760" height="920" rx="16" fill="none" stroke="#1e293b" stroke-width="1.2" />

  <!-- ==================== HEADER ==================== -->
  <g transform="translate(120, 145)">
    <rect x="0" y="-22" width="115" height="28" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="1" />
    <text x="57" y="-4" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800" text-anchor="middle">PIPELINE 01</text>
    <text x="135" y="2" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="38" font-weight="900" letter-spacing="-0.5">정규식 파서의 데이터 분해 및 DB 구조화 흐름</text>

    <!-- Top-Right Performance Info -->
    <g transform="translate(1180, -18)">
      <text x="0" y="20" fill="#a78bfa" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800">API 비용 <tspan fill="#ffffff" font-weight="900">₩0원</tspan></text>
      <text x="150" y="20" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800">로컬 빌드 <tspan fill="#ffffff" font-weight="900">3.0초</tspan></text>
      <text x="300" y="20" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800">추출 정밀도 <tspan fill="#ffffff" font-weight="900">100%</tspan></text>
    </g>
  </g>

  <!-- ==================== PARSING PIPELINE FLOW ==================== -->

  <!-- [STAGE 1] RAW TEXT INPUT (Left: X=120, Y=220) -->
  <g transform="translate(120, 220)">
    <rect x="0" y="0" width="450" height="620" rx="14" fill="#060d16" stroke="#1e293b" stroke-width="1.5" />
    <rect x="25" y="-12" width="160" height="24" rx="4" fill="#1e293b" />
    <text x="105" y="4" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800" text-anchor="middle">STAGE 01 : 비정형 원문</text>
    
    <!-- Paper Document Graphic -->
    <g transform="translate(25, 40)">
      <rect x="0" y="0" width="400" height="540" rx="8" fill="#02060b" stroke="#0f172a" stroke-width="1" />
      <line x1="20" y1="30" x2="380" y2="30" stroke="#1e293b" stroke-width="1" />
      <text x="20" y="22" fill="#475569" font-family="'Pretendard', sans-serif" font-size="12" font-weight="700">대한민국 민법 원문 (civil_law.txt)</text>

      <!-- Target 1 (Article & Branch) Highlighted Green -->
      <g transform="translate(20, 55)">
        <rect x="-5" y="-3" width="370" height="34" rx="6" fill="#07201b" stroke="#10b981" stroke-width="1" stroke-dasharray="3 3" />
        <text x="10" y="20" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="15" font-weight="900">제14조의2(성년후견의 개시)</text>
      </g>

      <!-- Target 2 (Circle Clauses) Highlighted Blue -->
      <g transform="translate(20, 105)">
        <rect x="-5" y="-3" width="370" height="60" rx="6" fill="#0b2438" stroke="#0284c7" stroke-width="1" stroke-dasharray="3 3" />
        <text x="10" y="20" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800">① 가정법원은 질병, 장애, 노령 등으로...</text>
        <text x="10" y="42" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="12">정신적 제약에 대해 성년후견 개시를 한다.</text>
      </g>

      <g transform="translate(20, 180)">
        <rect x="-5" y="-3" width="370" height="60" rx="6" fill="#0b2438" stroke="#0284c7" stroke-width="1" stroke-dasharray="3 3" />
        <text x="10" y="20" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800">② 가정법원은 성년후견 심판을 할 때...</text>
        <text x="10" y="42" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="12">피성년후견인 본인의 의사를 고려하여야 한다.</text>
      </g>

      <!-- Divider -->
      <line x1="20" y1="260" x2="380" y2="260" stroke="#1e293b" stroke-width="1" stroke-dasharray="5 5" />

      <!-- Target 3 (Deleted Article) Highlighted Red -->
      <g transform="translate(20, 285)">
        <rect x="-5" y="-3" width="370" height="46" rx="6" fill="#2d0f19" stroke="#f43f5e" stroke-width="1" stroke-dasharray="3 3" />
        <text x="10" y="20" fill="#fda4af" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800" text-decoration="line-through">제21조 [삭제]</text>
        <text x="10" y="38" fill="#f43f5e" font-family="'Pretendard', sans-serif" font-size="11" font-weight="700">➔ 고스트 데이터 (불필요 데이터)</text>
      </g>
    </g>
  </g>

  <!-- Flow Arrow from Stage 1 to Stage 2 -->
  <g transform="translate(585, 490)">
    <line x1="0" y1="0" x2="50" y2="0" stroke="url(#emeraldGrad)" stroke-width="3" marker-end="url(#arrowEmerald)" filter="url(#softGlow)" />
  </g>

  <!-- [STAGE 2] DETERMINISTIC PARSER ENGINE (Center: X=650, Y=220) -->
  <g transform="translate(650, 220)">
    <rect x="0" y="0" width="460" height="620" rx="14" fill="#060d16" stroke="#1e293b" stroke-width="1.5" />
    <rect x="25" y="-12" width="160" height="24" rx="4" fill="#1e293b" />
    <text x="105" y="4" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800" text-anchor="middle">STAGE 02 : 엔진 작동 규칙</text>

    <!-- Central Processing Pipeline -->
    <g transform="translate(25, 40)">
      <rect x="0" y="0" width="410" height="540" rx="8" fill="url(#glowGrad)" stroke="#10b981" stroke-width="1" />
      
      <!-- Rule 1 -->
      <g transform="translate(20, 30)">
        <rect x="0" y="0" width="370" height="135" rx="10" fill="#0b1c18" stroke="#10b981" stroke-width="1.5" />
        <circle cx="35" cy="35" r="14" fill="#064e3b" stroke="#34d399" stroke-width="1.5" />
        <text x="35" y="40" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="14" font-weight="900" text-anchor="middle">1</text>
        <text x="65" y="38" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="16" font-weight="900">가지번호 분해 파서</text>
        <text x="25" y="78" fill="#d1fae5" font-family="'Pretendard', sans-serif" font-size="13" font-weight="600">· "제14조의2" ➔ 본조(14)와 가지(2)로 쪼개어 인식</text>
        <text x="25" y="103" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="12" font-weight="700">· 데이터 누락 없는 정교한 고유 ID 키 생성</text>
      </g>

      <!-- Rule 2 -->
      <g transform="translate(20, 195)">
        <rect x="0" y="0" width="370" height="135" rx="10" fill="#041624" stroke="#0284c7" stroke-width="1.5" />
        <circle cx="35" cy="35" r="14" fill="#0c4a6e" stroke="#38bdf8" stroke-width="1.5" />
        <text x="35" y="40" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="14" font-weight="900" text-anchor="middle">2</text>
        <text x="65" y="38" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="16" font-weight="900">원문자 항(Clause) 슬라이서</text>
        <text x="25" y="78" fill="#e0f2fe" font-family="'Pretendard', sans-serif" font-size="13" font-weight="600">· ①항, ②항 기호 기준 독립 텍스트 슬라이싱</text>
        <text x="25" y="103" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="12" font-weight="700">· 질문에 맞는 미세한 타깃 컨텍스트 단위 구축</text>
      </g>

      <!-- Rule 3 -->
      <g transform="translate(20, 360)">
        <rect x="0" y="0" width="370" height="135" rx="10" fill="#200611" stroke="#f43f5e" stroke-width="1.5" />
        <circle cx="35" cy="35" r="14" fill="#4c0519" stroke="#f43f5e" stroke-width="1.5" />
        <text x="35" y="40" fill="#f43f5e" font-family="'Pretendard', sans-serif" font-size="14" font-weight="900" text-anchor="middle">3</text>
        <text x="65" y="38" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="16" font-weight="900">삭제 조항 필터 가드</text>
        <text x="25" y="78" fill="#ffe4e6" font-family="'Pretendard', sans-serif" font-size="13" font-weight="600">· "[삭제]" 텍스트 포함 시 Neo4j 로드 스킵</text>
        <text x="25" y="103" fill="#fb7185" font-family="'Pretendard', sans-serif" font-size="12" font-weight="700">· 폐지된 조문을 배제하여 RAG 환각 원천 차단</text>
      </g>
    </g>
  </g>

  <!-- Flow Arrow from Stage 2 to Stage 3 -->
  <g transform="translate(1125, 490)">
    <line x1="0" y1="0" x2="50" y2="0" stroke="url(#emeraldGrad)" stroke-width="3" marker-end="url(#arrowEmerald)" filter="url(#softGlow)" />
  </g>

  <!-- [STAGE 3] NEO4J STRUCTURED GRAPH (Right: X=1190, Y=220) -->
  <g transform="translate(1190, 220)">
    <rect x="0" y="0" width="610" height="620" rx="14" fill="#060d16" stroke="#1e293b" stroke-width="1.5" />
    <rect x="25" y="-12" width="160" height="24" rx="4" fill="#1e293b" />
    <text x="105" y="4" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800" text-anchor="middle">STAGE 03 : 그래프 적재 결과</text>

    <!-- Graph Schema Board -->
    <g transform="translate(25, 40)">
      <rect x="0" y="0" width="560" height="540" rx="8" fill="#02060b" stroke="#0f172a" stroke-width="1" />
      
      <!-- Graph Canvas Visual -->
      <g transform="translate(20, 25)">
        <rect x="0" y="0" width="520" height="340" rx="10" fill="#010408" stroke="#1e293b" stroke-width="1" />
        <text x="15" y="25" fill="#475569" font-family="'Pretendard', sans-serif" font-size="11" font-weight="700">Neo4j 지식 그래프 적재 모델</text>
        
        <!-- Nodes representation -->
        <!-- Parent Node (Section) -->
        <rect x="210" y="40" width="100" height="34" rx="6" fill="#062e21" stroke="#10b981" stroke-width="1.5" />
        <text x="260" y="61" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800" text-anchor="middle">:Section (통칙)</text>

        <!-- Hierarchy Edge -->
        <line x1="260" y1="74" x2="260" y2="120" stroke="#10b981" stroke-width="2" marker-end="url(#arrowEmerald)" />

        <!-- Article Node (Green) -->
        <circle cx="260" cy="150" r="30" fill="#062c21" stroke="#10b981" stroke-width="2.5" filter="url(#glow)" />
        <text x="260" y="154" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="11" font-weight="900" text-anchor="middle">제14조의2</text>
        
        <!-- Clause Edges (Blue) -->
        <line x1="235" y1="170" x2="160" y2="230" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrowCyan)" />
        <line x1="285" y1="170" x2="360" y2="230" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrowCyan)" />

        <!-- Clause 1 Node (Blue) -->
        <circle cx="145" cy="255" r="22" fill="#041b2d" stroke="#38bdf8" stroke-width="2" />
        <text x="145" y="259" fill="#e0f2fe" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800" text-anchor="middle">①항</text>

        <!-- Clause 2 Node (Blue) -->
        <circle cx="375" cy="255" r="22" fill="#041b2d" stroke="#38bdf8" stroke-width="2" />
        <text x="375" y="259" fill="#e0f2fe" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800" text-anchor="middle">②항</text>

        <!-- Edge Labels -->
        <rect x="230" y="90" width="60" height="16" rx="3" fill="#022c22" />
        <text x="260" y="101" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="9" font-weight="800" text-anchor="middle">BELONGS_TO</text>

        <rect x="165" y="190" width="55" height="16" rx="3" fill="#051c2c" />
        <text x="1925" y="0" /> <!-- Empty spacer -->
        <text x="192" y="201" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="9" font-weight="800" text-anchor="middle">HAS_CLAUSE</text>
        <rect x="300" y="190" width="55" height="16" rx="3" fill="#051c2c" />
        <text x="327" y="201" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="9" font-weight="800" text-anchor="middle">HAS_CLAUSE</text>

        <text x="260" y="315" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="11" font-weight="700" text-anchor="middle">조문(:Article)과 세부 조항(:Clause)의 다차원 연결 구조 완성</text>
      </g>

      <!-- Filter Shield Banner (Red) -->
      <g transform="translate(20, 385)">
        <rect x="0" y="0" width="520" height="130" rx="10" fill="#1b080e" stroke="#ef4444" stroke-width="1.2" />
        <circle cx="35" cy="40" r="15" fill="#4c0519" stroke="#ef4444" stroke-width="1.5" />
        <text x="35" y="46" fill="#ef4444" font-family="'Pretendard', sans-serif" font-size="18" font-weight="900" text-anchor="middle">✕</text>
        <text x="65" y="36" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="15" font-weight="900">제21조 [삭제] 노드 ➔ DB 적재 차단 (스킵)</text>
        
        <text x="25" y="80" fill="#fca5a5" font-family="'Pretendard', sans-serif" font-size="13" font-weight="600">· 폐지된 빈 껍데기 노드가 엣지를 차지하는 현상 방지</text>
        <text x="25" y="105" fill="#fda4af" font-family="'Pretendard', sans-serif" font-size="12">· 불필요한 노이즈 데이터를 사전에 완벽 필터링하여 RAG 정확도 극대화</text>
      </g>
    </g>
  </g>

  <!-- ==================== BOTTOM CORE SUMMARY BANNER ==================== -->
  <g transform="translate(120, 895)">
    <rect x="0" y="0" width="1680" height="60" rx="10" fill="#080e1a" stroke="#1e293b" stroke-width="1.2" />
    <circle cx="35" cy="30" r="5" fill="#34d399" filter="url(#softGlow)" />
    <text x="55" y="36" fill="#e2e8f0" font-family="'Pretendard', sans-serif" font-size="15" font-weight="600">
      본 시스템은 원문 텍스트의 <tspan fill="#34d399" font-weight="800">지시어 규칙</tspan>을 결정론적으로 파싱하여, RAG 가동 시 <tspan fill="#38bdf8" font-weight="800">가장 관련도 높은 세부 조항(Clause) 단위</tspan>의 컨텍스트를 정확하게 추출합니다.
    </text>
  </g>

  <!-- ==================== FOOTER ==================== -->
  <g transform="translate(120, 985)">
    <text x="0" y="0" fill="#475569" font-family="'Pretendard', sans-serif" font-size="12" font-weight="500" letter-spacing="1">GraphRAG PRESENTATION | DETERMINISTIC REGEX PARSER FLOW</text>
    <text x="1680" y="0" fill="#475569" font-family="'Pretendard', sans-serif" font-size="12" font-weight="600" text-anchor="end">07 / PARSER FLOW</text>
  </g>
</svg>



Slide 05 [State Machine]: 2. 🔄 순차 파싱 상태 머신 다이어그램 (contextPath 동적 매핑)
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <!-- Background Radial Gradient -->
    <radialGradient id="bgGradient" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#070b14" />
      <stop offset="60%" stop-color="#020408" />
      <stop offset="100%" stop-color="#000000" />
    </radialGradient>

    <!-- Emerald / Cyan Gradients -->
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#34d399" />
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0ea5e9" />
    </linearGradient>
    <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f43f5e" />
      <stop offset="100%" stop-color="#e11d48" />
    </linearGradient>

    <!-- Glow Filters -->
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Arrow Markers -->
    <marker id="arrowCyan" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" fill="#38bdf8" />
    </marker>
    <marker id="arrowEmerald" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" fill="#34d399" />
    </marker>
    <marker id="arrowRose" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" fill="#f43f5e" />
    </marker>
    <marker id="arrowOrange" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" fill="#f59e0b" />
    </marker>
  </defs>

  <!-- Base Canvas Background -->
  <rect width="1920" height="1080" fill="url(#bgGradient)" />
  <rect x="80" y="80" width="1760" height="920" rx="16" fill="none" stroke="#1e293b" stroke-width="1.2" />

  <!-- ==================== HEADER ==================== -->
  <g transform="translate(120, 145)">
    <rect x="0" y="-22" width="115" height="28" rx="6" fill="#1b153a" stroke="#818cf8" stroke-width="1" />
    <text x="57" y="-4" fill="#a5b4fc" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800" text-anchor="middle">PIPELINE 02</text>
    <text x="135" y="2" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="38" font-weight="900" letter-spacing="-0.5">순차 파싱 상태 머신 (contextPath 동적 매핑)</text>

    <!-- Top-Right Status Info -->
    <g transform="translate(1180, -18)">
      <text x="0" y="20" fill="#bae6fd" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800">파싱 매커니즘 <tspan fill="#ffffff" font-weight="900">Line-by-Line</tspan></text>
      <text x="180" y="20" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800">계층화 전략 <tspan fill="#ffffff" font-weight="900">Lazy Write</tspan></text>
      <text x="340" y="20" fill="#f59e0b" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800">오류율 <tspan fill="#ffffff" font-weight="900">0.0% (Zero-Loss)</tspan></text>
    </g>
  </g>

  <!-- ==================== STATE ENGINE BOARD ==================== -->

  <!-- LEFT PANEL: STATE BUFFERS & CONTEXT PATH (X: 120, Y: 220, W: 500) -->
  <g transform="translate(120, 220)">
    <rect x="0" y="0" width="500" height="620" rx="14" fill="#060d16" stroke="#1e293b" stroke-width="1.5" />
    <rect x="25" y="-12" width="170" height="24" rx="4" fill="#1e293b" />
    <text x="110" y="4" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800" text-anchor="middle">메모리 상태 버퍼 명세</text>

    <!-- Buffer Container -->
    <g transform="translate(25, 40)">
      <rect x="0" y="0" width="450" height="540" rx="8" fill="#02060b" stroke="#0f172a" stroke-width="1" />
      
      <!-- Part Buffer -->
      <g transform="translate(20, 25)">
        <rect x="0" y="0" width="410" height="56" rx="6" fill="#0c1d2e" stroke="#0284c7" stroke-width="1.2" />
        <text x="15" y="22" fill="#7dd3fc" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800">current_part (편 상태)</text>
        <text x="15" y="43" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800">"제1편 총칙" ➔ number: 1</text>
      </g>

      <!-- Chapter Buffer -->
      <g transform="translate(20, 95)">
        <rect x="0" y="0" width="410" height="56" rx="6" fill="#0c1d2e" stroke="#0284c7" stroke-width="1.2" />
        <text x="15" y="22" fill="#7dd3fc" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800">current_chapter (장 상태)</text>
        <text x="15" y="43" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800">"제1장 통칙" ➔ number: 1</text>
      </g>

      <!-- Section Buffer -->
      <g transform="translate(20, 165)">
        <rect x="0" y="0" width="410" height="56" rx="6" fill="#0c1d2e" stroke="#0284c7" stroke-width="1.2" />
        <text x="15" y="22" fill="#7dd3fc" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800">current_section (절 상태)</text>
        <text x="15" y="43" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800">"제1절 행위능력" ➔ number: 1</text>
      </g>

      <!-- Connection Flow Visual -->
      <path d="M 225 225 L 225 255" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrowCyan)" stroke-dasharray="3 3" />

      <!-- Synthsized Path -->
      <g transform="translate(20, 260)">
        <rect x="0" y="0" width="410" height="70" rx="8" fill="#1e1b4b" stroke="#6366f1" stroke-width="1.5" />
        <text x="15" y="24" fill="#c7d2fe" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800">동적 contextPath 합성 (조문 노드에 삽입되는 주소)</text>
        <text x="15" y="52" fill="#818cf8" font-family="'Pretendard', sans-serif" font-size="15" font-weight="900">"제1편 총칙 > 제1장 통칙 > 제1절 행위능력"</text>
      </g>

      <!-- Lazy Write Explanation -->
      <g transform="translate(20, 350)">
        <rect x="0" y="0" width="410" height="165" rx="8" fill="#052e25" stroke="#10b981" stroke-width="1.2" />
        <circle cx="28" cy="28" r="14" fill="#064e3b" stroke="#34d399" stroke-width="1" />
        <text x="28" y="32" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="12" font-weight="900" text-anchor="middle">💡</text>
        <text x="50" y="32" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="14" font-weight="900">지연 쓰기 (Lazy Write) 아키텍처</text>
        
        <text x="15" y="75" fill="#a7f3d0" font-family="'Pretendard', sans-serif" font-size="12" font-weight="600">· 본문 텍스트 라인은 메모리 버퍼에 계속 누적(Accumulate)됨</text>
        <text x="15" y="100" fill="#a7f3d0" font-family="'Pretendard', sans-serif" font-size="12" font-weight="600">· 다음 조문 지시어 감지 즉시 flush_current_article() 실행</text>
        <text x="15" y="125" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="12" font-weight="700">· 이전 조문 노드를 Neo4j 규격으로 안전하게 밀어낸 후 전환</text>
      </g>
    </g>
  </g>

  <!-- Flow Arrow from Left Panel to Right State Machine -->
  <g transform="translate(635, 490)">
    <line x1="0" y1="0" x2="35" y2="0" stroke="url(#cyanGrad)" stroke-width="3" marker-end="url(#arrowCyan)" filter="url(#softGlow)" />
  </g>

  <!-- RIGHT PANEL: STATE TRANSITION MAP (X: 690, Y: 220, W: 1110) -->
  <g transform="translate(690, 220)">
    <rect x="0" y="0" width="1110" height="620" rx="14" fill="#060d16" stroke="#1e293b" stroke-width="1.5" />
    <rect x="25" y="-12" width="170" height="24" rx="4" fill="#1e293b" />
    <text x="110" y="4" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800" text-anchor="middle">시각적 상태 전이 맵</text>

    <!-- State Machine Canvas -->
    <g transform="translate(25, 40)">
      <rect x="0" y="0" width="1060" height="540" rx="8" fill="#02060b" stroke="#0f172a" stroke-width="1" />

      <!-- STATE: START -->
      <circle cx="70" cy="90" r="12" fill="#475569" stroke="#64748b" stroke-width="2" />
      <text x="70" y="120" fill="#64748b" font-family="'Pretendard', sans-serif" font-size="11" font-weight="700" text-anchor="middle">시작</text>
      <path d="M 82 90 L 135 90" stroke="#475569" stroke-width="1.5" marker-end="url(#arrowCyan)" />

      <!-- STATE: IDLE -->
      <g transform="translate(150, 55)">
        <rect x="0" y="0" width="120" height="70" rx="10" fill="#1e293b" stroke="#475569" stroke-width="1.5" />
        <text x="60" y="32" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="14" font-weight="900" text-anchor="middle">STATE_IDLE</text>
        <text x="60" y="52" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="11" text-anchor="middle">대기 / 스캔 전</text>
      </g>
      <path d="M 270 90 L 315 90" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrowCyan)" />

      <!-- STATE: PART -->
      <g transform="translate(330, 55)">
        <rect x="0" y="0" width="130" height="70" rx="10" fill="#0c1d2e" stroke="#0284c7" stroke-width="2" />
        <text x="65" y="32" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="14" font-weight="900" text-anchor="middle">STATE_PART</text>
        <text x="65" y="52" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="11" font-weight="700" text-anchor="middle">"제N편" 감지</text>
      </g>
      <path d="M 460 90 L 505 90" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrowCyan)" />

      <!-- STATE: CHAPTER -->
      <g transform="translate(520, 55)">
        <rect x="0" y="0" width="130" height="70" rx="10" fill="#0c1d2e" stroke="#0284c7" stroke-width="2" />
        <text x="65" y="32" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="14" font-weight="900" text-anchor="middle">STATE_CHAP</text>
        <text x="65" y="52" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="11" font-weight="700" text-anchor="middle">"제N장" 감지</text>
      </g>
      <path d="M 650 90 L 695 90" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrowCyan)" />

      <!-- STATE: SECTION -->
      <g transform="translate(710, 55)">
        <rect x="0" y="0" width="130" height="70" rx="10" fill="#0c1d2e" stroke="#0284c7" stroke-width="2" />
        <text x="65" y="32" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="14" font-weight="900" text-anchor="middle">STATE_SEC</text>
        <text x="65" y="52" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="11" font-weight="700" text-anchor="middle">"제N절" 감지</text>
      </g>
      
      <!-- Link Down to STATE_ARTICLE -->
      <path d="M 775 125 L 775 205" stroke="#34d399" stroke-width="2.5" marker-end="url(#arrowEmerald)" />
      <text x="785" y="165" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="11" font-weight="700">"제N조" 조문 최초 발견</text>

      <!-- STATE: ARTICLE (Core Buffer Accumulation) -->
      <g transform="translate(710, 220)">
        <rect x="0" y="0" width="130" height="90" rx="10" fill="#04261f" stroke="#10b981" stroke-width="2.5" filter="url(#softGlow)" />
        <text x="65" y="35" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="14" font-weight="900" text-anchor="middle">STATE_ARTICLE</text>
        <text x="65" y="55" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="11" font-weight="700" text-anchor="middle">조문 라인 누적 중</text>
        <text x="65" y="73" fill="#a7f3d0" font-family="'Fira Code', monospace" font-size="10" text-anchor="middle">Lines Accumulate</text>
      </g>

      <!-- Self-loop arrow for lines accumulation -->
      <path d="M 840 240 C 890 220 890 310 855 300" fill="none" stroke="#10b981" stroke-width="2.5" marker-end="url(#arrowEmerald)" />
      <text x="895" y="265" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="11" font-weight="700" text-anchor="middle">일반 텍스트 라인 스캔</text>

      <!-- Transition to FLUSH -->
      <path d="M 710 265 L 530 265" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#arrowOrange)" />
      <text x="620" y="250" fill="#fbbf24" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800" text-anchor="middle">새로운 구조/조문 감지</text>

      <!-- STATE: FLUSH (Sub-process Frame) -->
      <g transform="translate(100, 220)">
        <rect x="0" y="0" width="415" height="230" rx="12" fill="#200611" stroke="#f43f5e" stroke-width="2.5" filter="url(#glow)" />
        <rect x="20" y="-12" width="130" height="24" rx="4" fill="#881337" />
        <text x="85" y="4" fill="#fda4af" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800" text-anchor="middle">STATE_FLUSH</text>

        <!-- Sub-process Step 1 -->
        <g transform="translate(20, 30)">
          <rect x="0" y="0" width="375" height="42" rx="6" fill="#4c0519" stroke="#f43f5e" stroke-width="1" />
          <text x="15" y="26" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800">1. contextPath 합성 (편>장>절 주소 삽입)</text>
        </g>

        <!-- Sub-process Step 2 -->
        <g transform="translate(20, 85)">
          <rect x="0" y="0" width="375" height="42" rx="6" fill="#4c0519" stroke="#f43f5e" stroke-width="1" />
          <text x="15" y="26" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800">2. 항 단위 슬라이싱 (① ~ ⑳ 분해)</text>
        </g>

        <!-- Sub-process Step 3 -->
        <g transform="translate(20, 140)">
          <rect x="0" y="0" width="375" height="42" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="1" />
          <text x="15" y="26" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800">3. Neo4j 적재 완료 ➔ flush_current_article()</text>
        </g>
      </g>

      <!-- Back to Article State after flush -->
      <path d="M 307 450 Q 510 520 730 320" fill="none" stroke="#10b981" stroke-width="2" marker-end="url(#arrowEmerald)" stroke-dasharray="3 3" />
      <text x="560" y="465" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="11" font-weight="700" text-anchor="middle">새로운 조문 버퍼 초기화 후 스캔 재개</text>

      <!-- Transition from Flush back to Chapter/Part State (if structure changed) -->
      <path d="M 210 220 L 360 135" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrowCyan)" stroke-dasharray="3 3" />
      <text x="240" y="170" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="11" font-weight="700" text-anchor="middle">구조 변경 감지 시</text>

      <!-- STATE: EOF / FINISH -->
      <circle cx="1000" cy="265" r="8" fill="#475569" stroke="#64748b" stroke-width="2" />
      <circle cx="1000" cy="265" r="16" fill="none" stroke="#64748b" stroke-width="1.5" />
      <text x="1000" y="300" fill="#64748b" font-family="'Pretendard', sans-serif" font-size="11" font-weight="700" text-anchor="middle">종료 (EOF)</text>
      
      <!-- Link from ARTICLE to FINISH at End of File -->
      <path d="M 840 265 L 975 265" stroke="#475569" stroke-width="2" marker-end="url(#arrowCyan)" />
      <text x="910" y="250" fill="#64748b" font-family="'Pretendard', sans-serif" font-size="11" font-weight="700" text-anchor="middle">파일 끝 감지</text>
    </g>
  </g>

  <!-- ==================== BOTTOM CORE SUMMARY BANNER ==================== -->
  <g transform="translate(120, 895)">
    <rect x="0" y="0" width="1680" height="60" rx="10" fill="#080e1a" stroke="#1e293b" stroke-width="1.2" />
    <circle cx="35" cy="30" r="5" fill="#38bdf8" filter="url(#softGlow)" />
    <text x="55" y="36" fill="#e2e8f0" font-family="'Pretendard', sans-serif" font-size="15" font-weight="600">
      라인 단위 순차 분석 스택을 유지하며, 조문이 마감되는 시점에 <tspan fill="#f59e0b" font-weight="800">지연 적재(Lazy Flush)</tspan>하여 <tspan fill="#38bdf8" font-weight="800">메모리 오버헤드 없이</tspan> 대규모 법률 문서를 완벽한 계층 지식망으로 구조화합니다.
    </text>
  </g>

  <!-- ==================== FOOTER ==================== -->
  <g transform="translate(120, 985)">
    <text x="0" y="0" fill="#475569" font-family="'Pretendard', sans-serif" font-size="12" font-weight="500" letter-spacing="1">GraphRAG PRESENTATION | STATE MACHINE PIPELINE FLOW</text>
    <text x="1680" y="0" fill="#475569" font-family="'Pretendard', sans-serif" font-size="12" font-weight="600" text-anchor="end">08 / STATE MACHINE</text>
  </g>
</svg>



Slide 06 [Relations]: 3. 🔗 준용(MUTATIS_MUTANDIS) 및 예외(EXCEPTION_TO) 관계망 구축
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <!-- Background Radial Gradient -->
    <radialGradient id="bgGradient" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#070b14" />
      <stop offset="60%" stop-color="#020408" />
      <stop offset="100%" stop-color="#000000" />
    </radialGradient>

    <!-- Panel Card Gradients -->
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#072b20" />
      <stop offset="100%" stop-color="#010f0b" />
    </linearGradient>
    <linearGradient id="roseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#240713" />
      <stop offset="100%" stop-color="#0c0205" />
    </linearGradient>

    <!-- Accent Line Gradients -->
    <linearGradient id="lineEmerald" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#34d399" />
    </linearGradient>
    <linearGradient id="lineRose" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f43f5e" />
      <stop offset="100%" stop-color="#fda4af" />
    </linearGradient>

    <!-- Glow Filters -->
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Arrow Markers -->
    <marker id="arrowEmerald" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" fill="#34d399" />
    </marker>
    <marker id="arrowRose" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" fill="#f43f5e" />
    </marker>
  </defs>

  <!-- Base Canvas Background -->
  <rect width="1920" height="1080" fill="url(#bgGradient)" />
  <rect x="80" y="80" width="1760" height="920" rx="16" fill="none" stroke="#1e293b" stroke-width="1.2" />

  <!-- ==================== HEADER ==================== -->
  <g transform="translate(120, 145)">
    <rect x="0" y="-22" width="115" height="28" rx="6" fill="#1e153a" stroke="#818cf8" stroke-width="1" />
    <text x="57" y="-4" fill="#a5b4fc" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800" text-anchor="middle">PIPELINE 03</text>
    <text x="135" y="2" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="38" font-weight="900" letter-spacing="-0.5">준용(MUTATIS_MUTANDIS) 및 예외(EXCEPTION_TO) 엣지 생성</text>

    <!-- Top-Right Status Info -->
    <g transform="translate(1180, -18)">
      <text x="0" y="20" fill="#bae6fd" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800"> <tspan fill="#ffffff" font-weight="900"></tspan></text>
      <text x="240" y="20" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800"> <tspan fill="#ffffff" font-weight="900"></tspan></text>
    </g>
  </g>

  <!-- ==================== RELATIONSHIPS BOARD ==================== -->

  <!-- [LEFT PANEL] 준용 규정 추출 (X: 120, W: 810, H: 520) -->
  <g transform="translate(120, 210)">
    <rect x="0" y="0" width="810" height="520" rx="14" fill="url(#emeraldGrad)" stroke="#113328" stroke-width="1.5" />
    <rect x="0" y="0" width="6" height="520" rx="3" fill="#10b981" filter="url(#glow)" />
    
    <!-- Title -->
    <g transform="translate(30, 30)">
      <rect x="0" y="0" width="220" height="32" rx="6" fill="#042c20" stroke="#10b981" stroke-width="1.2" />
      <text x="110" y="21" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="15" font-weight="900" text-anchor="middle">MUTATIS_MUTANDIS (준용)</text>
    </g>

    <!-- Ingestion Flow Box -->
    <g transform="translate(30, 85)">
      <rect x="0" y="0" width="750" height="405" rx="10" fill="#020a07" stroke="#0b241c" stroke-width="1.2" />
      
      <!-- Sub-Card 1: Raw Text -->
      <g transform="translate(30, 30)">
        <rect x="0" y="0" width="310" height="345" rx="8" fill="#051c15" stroke="#0c3c2a" stroke-width="1" />
        <text x="20" y="32" fill="#6ee7b7" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800">📄 준용 법조문 원문</text>
        <line x1="20" y1="42" x2="290" y2="42" stroke="#0c3c2a" stroke-width="1" />
        
        <text x="20" y="85" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="13" font-weight="700">민법 제415조</text>
        <text x="20" y="140" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="15" font-weight="800">"제391조의 규정은</text>
        
        <!-- Keyword Highlight -->
        <rect x="15" y="165" width="130" height="34" rx="4" fill="#064e3b" stroke="#34d399" stroke-width="1" />
        <text x="80" y="187" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="15" font-weight="900" text-anchor="middle">준용한다."</text>

        <!-- Regex Label -->
        <text x="20" y="315" fill="#475569" font-family="'Fira Code', monospace" font-size="10">Regex Pattern: "준용"</text>
      </g>

      <!-- Connecting Arrow with Label -->
      <g transform="translate(355, 140)">
        <path d="M 0 0 L 50 0" stroke="url(#lineEmerald)" stroke-width="3" marker-end="url(#arrowEmerald)" filter="url(#softGlow)" />
        <text x="25" y="-12" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="9" font-weight="800" text-anchor="middle">Regex 매칭</text>
      </g>

      <!-- Sub-Card 2: Graph representation (Top Right) -->
      <g transform="translate(435, 30)">
        <rect x="0" y="0" width="285" height="160" rx="8" fill="#010604" stroke="#0a2c20" stroke-width="1" />
        <text x="20" y="28" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800">Neo4j 온톨로지 매핑</text>
        
        <!-- Graph visualization -->
        <circle cx="65" cy="95" r="24" fill="#042c1d" stroke="#10b981" stroke-width="2" />
        <text x="65" y="99" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="10" font-weight="900" text-anchor="middle">제415조</text>
        
        <!-- Edge -->
        <line x1="91" y1="95" x2="194" y2="95" stroke="#10b981" stroke-width="2.5" marker-end="url(#arrowEmerald)" filter="url(#softGlow)" />
        <rect x="98" y="70" width="90" height="16" rx="3" fill="#064e3b" />
        <text x="143" y="81" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="7.5" font-weight="900" text-anchor="middle">MUTATIS</text>

        <circle cx="225" cy="95" r="24" fill="#042c1d" stroke="#10b981" stroke-width="2" />
        <text x="225" y="99" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="10" font-weight="900" text-anchor="middle">제391조</text>
      </g>

      <!-- Sub-Card 3: Cypher Query Code Block (Bottom Right) -->
      <g transform="translate(435, 205)">
        <rect x="0" y="0" width="285" height="170" rx="8" fill="#010408" stroke="#0e251d" stroke-width="1.2" />
        <text x="15" y="25" fill="#64748b" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800">Cypher DB 적재 쿼리</text>
        
        <!-- Code syntax highlighting -->
        <g transform="translate(15, 45)">
          <text x="0" y="15" fill="#818cf8" font-family="'Fira Code', monospace" font-size="11">MATCH</text>
          <text x="45" y="15" fill="#e2e8f0" font-family="'Fira Code', monospace" font-size="11">(s:Article {id: "415"})</text>
          
          <text x="0" y="38" fill="#818cf8" font-family="'Fira Code', monospace" font-size="11">MATCH</text>
          <text x="45" y="38" fill="#e2e8f0" font-family="'Fira Code', monospace" font-size="11">(t:Article {id: "391"})</text>
          
          <text x="0" y="65" fill="#34d399" font-family="'Fira Code', monospace" font-size="11">MERGE</text>
          <text x="45" y="65" fill="#e2e8f0" font-family="'Fira Code', monospace" font-size="11">(s)-[r:</text>
          <text x="110" y="65" fill="#10b981" font-family="'Fira Code', monospace" font-size="11" font-weight="700">MUTATIS</text>
          <text x="163" y="65" fill="#e2e8f0" font-family="'Fira Code', monospace" font-size="11">]->(t)</text>
          
          <text x="0" y="90" fill="#64748b" font-family="'Fira Code', monospace" font-size="10">ON CREATE SET r.label="준용"</text>
        </g>
      </g>
    </g>
  </g>

  <!-- [RIGHT PANEL] 예외 규정 추출 (X: 990, W: 810, H: 520) -->
  <g transform="translate(990, 210)">
    <rect x="0" y="0" width="810" height="520" rx="14" fill="url(#roseGrad)" stroke="#381021" stroke-width="1.5" />
    <rect x="0" y="0" width="6" height="520" rx="3" fill="#f43f5e" filter="url(#glow)" />
    
    <!-- Title -->
    <g transform="translate(30, 30)">
      <rect x="0" y="0" width="220" height="32" rx="6" fill="#4c0519" stroke="#f43f5e" stroke-width="1.2" />
      <text x="110" y="21" fill="#fca5a5" font-family="'Pretendard', sans-serif" font-size="15" font-weight="900" text-anchor="middle">EXCEPTION_TO (예외)</text>
    </g>

    <!-- Ingestion Flow Box -->
    <g transform="translate(30, 85)">
      <rect x="0" y="0" width="750" height="405" rx="10" fill="#0d0206" stroke="#260b17" stroke-width="1.2" />
      
      <!-- Sub-Card 1: Raw Text -->
      <g transform="translate(30, 30)">
        <rect x="0" y="0" width="310" height="345" rx="8" fill="#1b0610" stroke="#3c0c24" stroke-width="1" />
        <text x="20" y="32" fill="#fda4af" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800">📄 예외 법조문 원문</text>
        <line x1="20" y1="42" x2="290" y2="42" stroke="#3c0c24" stroke-width="1" />
        
        <text x="20" y="85" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="13" font-weight="700">민법 제16조 제2항</text>
        
        <!-- Keyword Highlight -->
        <rect x="15" y="125" width="245" height="34" rx="4" fill="#4c0519" stroke="#f43f5e" stroke-width="1" />
        <text x="137" y="147" fill="#fb7185" font-family="'Pretendard', sans-serif" font-size="14" font-weight="900" text-anchor="middle">"전항의 규정에도 불구하고"</text>
        
        <text x="20" y="185" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="15" font-weight="800">가정법원은 심판을...</text>
        
        <!-- Regex Label -->
        <text x="20" y="315" fill="#475569" font-family="'Fira Code', monospace" font-size="10">Regex Pattern: "불구하고|다만"</text>
      </g>

      <!-- Connecting Arrow with Label -->
      <g transform="translate(355, 140)">
        <path d="M 0 0 L 50 0" stroke="url(#lineRose)" stroke-width="3" marker-end="url(#arrowRose)" filter="url(#softGlow)" />
        <text x="25" y="-12" fill="#fb7185" font-family="'Pretendard', sans-serif" font-size="9" font-weight="800" text-anchor="middle">Regex 매칭</text>
      </g>

      <!-- Sub-Card 2: Graph representation (Top Right) -->
      <g transform="translate(435, 30)">
        <rect x="0" y="0" width="285" height="160" rx="8" fill="#070104" stroke="#2b0a1a" stroke-width="1" />
        <text x="20" y="28" fill="#fb7185" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800">Neo4j 온톨로지 매핑</text>
        
        <!-- Graph visualization -->
        <circle cx="65" cy="95" r="24" fill="#4c0519" stroke="#f43f5e" stroke-width="2" />
        <text x="65" y="99" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="10" font-weight="900" text-anchor="middle">제16조②</text>
        
        <!-- Edge -->
        <line x1="91" y1="95" x2="194" y2="95" stroke="#f43f5e" stroke-width="2.5" marker-end="url(#arrowRose)" filter="url(#softGlow)" />
        <rect x="102" y="70" width="82" height="16" rx="3" fill="#4c0519" />
        <text x="143" y="81" fill="#fda4af" font-family="'Pretendard', sans-serif" font-size="7.5" font-weight="900" text-anchor="middle">EXCEPTION_TO</text>

        <circle cx="225" cy="95" r="24" fill="#4c0519" stroke="#f43f5e" stroke-width="2" />
        <text x="225" y="99" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="10" font-weight="900" text-anchor="middle">제16조①</text>
      </g>

      <!-- Sub-Card 3: Cypher Query Code Block (Bottom Right) -->
      <g transform="translate(435, 205)">
        <rect x="0" y="0" width="285" height="170" rx="8" fill="#010408" stroke="#2d0e1b" stroke-width="1.2" />
        <text x="15" y="25" fill="#64748b" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800">Cypher DB 적재 쿼리</text>
        
        <!-- Code syntax highlighting -->
        <g transform="translate(15, 45)">
          <text x="0" y="15" fill="#818cf8" font-family="'Fira Code', monospace" font-size="11">MATCH</text>
          <text x="45" y="15" fill="#e2e8f0" font-family="'Fira Code', monospace" font-size="11">(s:Article {id: "16-2"})</text>
          
          <text x="0" y="38" fill="#818cf8" font-family="'Fira Code', monospace" font-size="11">MATCH</text>
          <text x="45" y="38" fill="#e2e8f0" font-family="'Fira Code', monospace" font-size="11">(t:Article {id: "16-1"})</text>
          
          <text x="0" y="65" fill="#f43f5e" font-family="'Fira Code', monospace" font-size="11">MERGE</text>
          <text x="45" y="65" fill="#e2e8f0" font-family="'Fira Code', monospace" font-size="11">(s)-[r:</text>
          <text x="110" y="65" fill="#fb7185" font-family="'Fira Code', monospace" font-size="11" font-weight="700">EXCEPTION_TO</text>
          <text x="195" y="65" fill="#e2e8f0" font-family="'Fira Code', monospace" font-size="11">]->(t)</text>
          
          <text x="0" y="90" fill="#64748b" font-family="'Fira Code', monospace" font-size="10">ON CREATE SET r.label="예외"</text>
        </g>
      </g>
    </g>
  </g>

  <!-- ==================== BOTTOM CORE SUMMARY BANNER ==================== -->
  <g transform="translate(120, 760)">
    <rect x="0" y="0" width="1680" height="95" rx="10" fill="#080e1a" stroke="#1e293b" stroke-width="1.2" />
    <circle cx="35" cy="47" r="5" fill="#10b981" filter="url(#softGlow)" />
    <text x="60" y="40" fill="#e2e8f0" font-family="'Pretendard', sans-serif" font-size="15" font-weight="600">
      법률 문장 내 지시어를 기반으로 <tspan fill="#34d399" font-weight="800">준용(MUTATIS_MUTANDIS)</tspan> 및 <tspan fill="#f43f5e" font-weight="800">예외(EXCEPTION_TO)</tspan> 관계를 결정론적으로 매핑하고 Cypher DML로 일괄 MERGE 처리합니다.
    </text>
    <text x="60" y="68" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="14" font-weight="600">
      RAG 가동 시 Cypher 실시간 쿼리를 통해 준용 법리와 단서 예외 조건 조항까지 누락 없이 다중 홉(Multi-Hop)으로 일관되게 탐색합니다.
    </text>
  </g>

  <!-- ==================== FOOTER ==================== -->
  <g transform="translate(120, 985)">
    <text x="0" y="0" fill="#475569" font-family="'Pretendard', sans-serif" font-size="12" font-weight="500" letter-spacing="1">GraphRAG PRESENTATION | MUTATIS MUTANDIS &amp; EXCEPTION RELATION FLOW</text>
    <text x="1680" y="0" fill="#475569" font-family="'Pretendard', sans-serif" font-size="12" font-weight="600" text-anchor="end">09 / RELATIONSHIPS</text>
  </g>
</svg>



Slide 07 [Search Mechanism]: 자연어 질의 청크 분할 및 2-Hop 그래프 탐색 과정
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <!-- Background Radial Gradient -->
    <radialGradient id="bgGradient" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#070b14" />
      <stop offset="60%" stop-color="#020408" />
      <stop offset="100%" stop-color="#000000" />
    </radialGradient>

    <!-- Panel Card Gradients -->
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#071d2b" />
      <stop offset="100%" stop-color="#020a12" />
    </linearGradient>
    <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#190e2b" />
      <stop offset="100%" stop-color="#090511" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#241607" />
      <stop offset="100%" stop-color="#0c0702" />
    </linearGradient>

    <!-- Line Accent Gradients -->
    <linearGradient id="lineCyan" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0ea5e9" />
    </linearGradient>
    <linearGradient id="linePurple" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#a855f7" />
      <stop offset="100%" stop-color="#c084fc" />
    </linearGradient>
    <linearGradient id="lineGold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>

    <!-- Glow Filters -->
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Arrow Markers -->
    <marker id="arrowCyan" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" fill="#38bdf8" />
    </marker>
    <marker id="arrowPurple" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" fill="#a855f7" />
    </marker>
    <marker id="arrowGold" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" fill="#fbbf24" />
    </marker>
  </defs>

  <!-- Base Canvas Background -->
  <rect width="1920" height="1080" fill="url(#bgGradient)" />
  <rect x="80" y="80" width="1760" height="920" rx="16" fill="none" stroke="#1e293b" stroke-width="1.2" />

  <!-- ==================== HEADER ==================== -->
  <g transform="translate(120, 145)">
    <rect x="0" y="-22" width="115" height="28" rx="6" fill="#1e1b4b" stroke="#6366f1" stroke-width="1" />
    <text x="57" y="-4" fill="#c7d2fe" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800" text-anchor="middle">SEARCH ENGINE</text>
    <text x="135" y="2" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="38" font-weight="900" letter-spacing="-0.5">자연어 질의 분석, 2-Hop 탐색 및 LLM 종합 답변 생성</text>

    <!-- Top-Right Status Info -->
    <g transform="translate(1180, -18)">
      <text x="0" y="20" fill="#bae6fd" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800">탐색 범위 <tspan fill="#ffffff" font-weight="900">2-Hop Traversal</tspan></text>
      <text x="210" y="20" fill="#fde68a" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800">답변 생성 <tspan fill="#ffffff" font-weight="900">Gemini LLM</tspan></text>
    </g>
  </g>

  <!-- ==================== SEARCH ENGINE BOARD ==================== -->

  <!-- [STAGE 1] 질의 키워드 분석 및 시작 노드 특정 (Left: X=120) -->
  <g transform="translate(120, 210)">
    <rect x="0" y="0" width="500" height="520" rx="14" fill="url(#blueGrad)" stroke="#112b3e" stroke-width="1.5" />
    <rect x="0" y="0" width="6" height="520" rx="3" fill="#38bdf8" filter="url(#glow)" />
    
    <!-- Step Badge -->
    <g transform="translate(25, 25)">
      <rect x="0" y="0" width="70" height="26" rx="6" fill="#0c253d" stroke="#38bdf8" stroke-width="1" />
      <text x="35" y="17" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800" text-anchor="middle">STEP 01</text>
      <text x="85" y="20" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="20" font-weight="900">💬 질의 키워드 분석</text>
    </g>

    <!-- Content Graphic -->
    <g transform="translate(25, 80)">
      <rect x="0" y="0" width="450" height="415" rx="8" fill="#020810" stroke="#0a2033" stroke-width="1.2" />
      
      <!-- Natural language query bubble -->
      <rect x="20" y="25" width="410" height="95" rx="6" fill="#0c253d" />
      <text x="35" y="55" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800">"토지를 침범해서 무단으로 건물을 지은</text>
      <text x="35" y="80" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="15" font-weight="900">경우, 건물 철거를 요구할 수 있나요?"</text>

      <!-- Tokenizer / Keywords -->
      <text x="20" y="160" fill="#64748b" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800">1. 형태소 분석 및 법률 명사 추출</text>
      <g transform="translate(20, 175)">
        <rect x="0" y="0" width="75" height="28" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="0.8" />
        <text x="37.5" y="18" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="12" font-weight="900" text-anchor="middle">토지</text>
        <rect x="85" y="0" width="75" height="28" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="0.8" />
        <text x="122.5" y="18" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="12" font-weight="900" text-anchor="middle">침범</text>
        <rect x="170" y="0" width="75" height="28" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="0.8" />
        <text x="207.5" y="18" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="12" font-weight="900" text-anchor="middle">철거</text>
      </g>

      <!-- Center node map -->
      <text x="20" y="240" fill="#64748b" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800">2. 핵심 가중치 사전 매핑 ➔ 1차 시작 노드 지정</text>
      <g transform="translate(20, 260)">
        <rect x="0" y="0" width="410" height="125" rx="8" fill="#021c16" stroke="#10b981" stroke-width="1.2" />
        <circle cx="45" cy="62" r="26" fill="#064e3b" stroke="#34d399" stroke-width="2" filter="url(#glow)" />
        <text x="45" y="66" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="11" font-weight="900" text-anchor="middle">제214조</text>
        
        <text x="85" y="55" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="15" font-weight="900">소유물방해제거청구권</text>
        <text x="85" y="78" fill="#6ee7b7" font-family="'Pretendard', sans-serif" font-size="12">시작 조문(Center Node)으로 선정</text>
      </g>
    </g>
  </g>

  <!-- Flow Chevron 1 (X: 620, Y: 470) -->
  <g transform="translate(625, 470)">
    <line x1="0" y1="0" x2="30" y2="0" stroke="url(#lineCyan)" stroke-width="3" marker-end="url(#arrowCyan)" filter="url(#softGlow)" />
  </g>

  <!-- [STAGE 2] 2-HOP TRAVERSAL & SUBGRAPH EXTRACTION (Center: X=660) -->
  <g transform="translate(660, 210)">
    <rect x="0" y="0" width="520" height="520" rx="14" fill="url(#purpleGrad)" stroke="#2b113a" stroke-width="1.5" />
    <rect x="0" y="0" width="6" height="520" rx="3" fill="#a855f7" filter="url(#glow)" />
    
    <!-- Step Badge -->
    <g transform="translate(25, 25)">
      <rect x="0" y="0" width="70" height="26" rx="6" fill="#2d0c45" stroke="#a855f7" stroke-width="1" />
      <text x="35" y="17" fill="#c084fc" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800" text-anchor="middle">STEP 02</text>
      <text x="85" y="20" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="20" font-weight="900">🔗 2-Hop 실시간 그래프 탐색</text>
    </g>

    <!-- Content Graphic -->
    <g transform="translate(25, 80)">
      <rect x="0" y="0" width="470" height="415" rx="8" fill="#07030d" stroke="#250f33" stroke-width="1.2" />

      <!-- Graph Diagram -->
      <g transform="translate(20, 20)">
        <rect x="0" y="0" width="430" height="240" rx="8" fill="#010408" stroke="#1a0c28" stroke-width="1" />
        <text x="15" y="20" fill="#64748b" font-family="'Pretendard', sans-serif" font-size="10">2-Hop 온톨로지 서브그래프 추출</text>
        
        <!-- Center (제214조) -->
        <circle cx="215" cy="120" r="26" fill="#064e3b" stroke="#34d399" stroke-width="2.5" filter="url(#glow)" />
        <text x="215" y="124" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="11" font-weight="900" text-anchor="middle">제214조</text>
        
        <!-- Left Link (제213조) -->
        <line x1="189" y1="120" x2="96" y2="120" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrowCyan)" />
        <text x="142" y="112" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="8" font-weight="800" text-anchor="middle">참조</text>
        <circle cx="70" cy="120" r="22" fill="#041c2c" stroke="#38bdf8" stroke-width="1.8" />
        <text x="70" y="124" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="9" font-weight="900" text-anchor="middle">제213조</text>
        <text x="70" y="156" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="8.5" text-anchor="middle">소유물반환 (1-Hop)</text>

        <!-- Right Link (제741조 & 제748조) -->
        <line x1="241" y1="120" x2="334" y2="120" stroke="#a855f7" stroke-width="2" marker-end="url(#arrowPurple)" />
        <text x="287" y="112" fill="#a855f7" font-family="'Pretendard', sans-serif" font-size="8" font-weight="800" text-anchor="middle">참조</text>
        <circle cx="360" cy="120" r="22" fill="#2d0c45" stroke="#a855f7" stroke-width="1.8" />
        <text x="360" y="124" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="9" font-weight="900" text-anchor="middle">제741조</text>
        <text x="360" y="156" fill="#c084fc" font-family="'Pretendard', sans-serif" font-size="8.5" text-anchor="middle">부당이득 (1-Hop)</text>

        <!-- 2-Hop extension (제748조) -->
        <line x1="360" y1="142" x2="360" y2="198" stroke="#10b981" stroke-width="1.5" marker-end="url(#arrowEmerald)" />
        <text x="375" y="175" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="8" font-weight="800" text-anchor="middle">준용</text>
        <circle cx="360" cy="210" r="18" fill="#042c1d" stroke="#10b981" stroke-width="1.5" />
        <text x="360" y="213" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="9" font-weight="800" text-anchor="middle">제748조</text>
        <text x="295" y="213" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="8.5">반환범위 (2-Hop)</text>
      </g>

      <!-- Cypher query snippet -->
      <g transform="translate(20, 275)">
        <rect x="0" y="0" width="430" height="120" rx="6" fill="#010408" stroke="#25123a" stroke-width="1.2" />
        <text x="15" y="20" fill="#64748b" font-family="'Pretendard', sans-serif" font-size="10">실시간 연관 조문 탐색 Cypher</text>
        <text x="15" y="45" fill="#818cf8" font-family="'Fira Code', monospace" font-size="11">MATCH <tspan fill="#e2e8f0">path = (c:Article {id:"214"})-[r*1..2]-(n)</tspan></text>
        <text x="15" y="70" fill="#818cf8" font-family="'Fira Code', monospace" font-size="11">RETURN <tspan fill="#e2e8f0">nodes(path) AS nodes, relationships(path) AS rels</tspan></text>
      </g>
    </g>
  </g>

  <!-- Flow Chevron 2 (X: 1185, Y: 470) -->
  <g transform="translate(1185, 470)">
    <line x1="0" y1="0" x2="30" y2="0" stroke="url(#linePurple)" stroke-width="3" marker-end="url(#arrowPurple)" filter="url(#softGlow)" />
  </g>

  <!-- [STAGE 3] RAG CONTEXT INJECTION & LLM ANSWER (Right: X=1220) -->
  <g transform="translate(1220, 210)">
    <rect x="0" y="0" width="580" height="520" rx="14" fill="url(#goldGrad)" stroke="#38210c" stroke-width="1.5" />
    <rect x="0" y="0" width="6" height="520" rx="3" fill="#fbbf24" filter="url(#glow)" />
    
    <!-- Step Badge -->
    <g transform="translate(25, 25)">
      <rect x="0" y="0" width="70" height="26" rx="6" fill="#2d1504" stroke="#fbbf24" stroke-width="1" />
      <text x="35" y="17" fill="#fbbf24" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800" text-anchor="middle">STEP 03</text>
      <text x="85" y="20" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="20" font-weight="900">🔮 LLM 종합 답변 생성</text>
    </g>

    <!-- Content Graphic -->
    <g transform="translate(25, 80)">
      <rect x="0" y="0" width="530" height="415" rx="8" fill="#0c0702" stroke="#251408" stroke-width="1.2" />

      <!-- Injected Prompt Context box -->
      <g transform="translate(20, 20)">
        <rect x="0" y="0" width="490" height="145" rx="6" fill="#1c1103" stroke="#d97706" stroke-width="1.2" />
        <text x="15" y="22" fill="#fbbf24" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800">RAG Prompt Injection Context (추출된 조항 융합)</text>
        
        <rect x="15" y="38" width="460" height="92" rx="4" fill="#0f0701" />
        <text x="25" y="58" fill="#fde68a" font-family="'Pretendard', sans-serif" font-size="12" font-weight="700">· [주조문] 제214조 (소유물 방해제거 ➔ 무단 건물 철거 청구)</text>
        <text x="25" y="80" fill="#fde68a" font-family="'Pretendard', sans-serif" font-size="12" font-weight="700">· [1-Hop] 제213조 (소유물 반환 청구 ➔ 무단 점유 토지 인도 청구)</text>
        <text x="25" y="102" fill="#fde68a" font-family="'Pretendard', sans-serif" font-size="12" font-weight="700">· [1-Hop] 제741조 (부당이득 반환 청구 ➔ 무단 사용 지료/임료 반환 청구)</text>
      </g>

      <!-- Gemini Synthesis output report -->
      <g transform="translate(20, 185)">
        <rect x="0" y="0" width="490" height="210" rx="8" fill="#1b120c" stroke="#f59e0b" stroke-width="1.5" filter="url(#softGlow)" />
        <text x="15" y="25" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="13" font-weight="900">✦ AI 종합 분석 보고서 출력 결과</text>
        
        <rect x="15" y="38" width="460" height="155" rx="4" fill="#0f0701" />
        <text x="25" y="60" fill="#fbbf24" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800">"귀하는 무단으로 건물을 축조해 토지 소유권을 방해하고 있는</text>
        <text x="25" y="82" fill="#fbbf24" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800">상대방에게 <tspan fill="#ffffff">제214조에 기해 건물 철거</tspan>를 청구할 수 있습니다.</text>
        <text x="25" y="108" fill="#fbbf24" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800">또한, 현재 토지를 불법 점유하고 있으므로 <tspan fill="#ffffff">제213조에 따라</tspan></text>
        <text x="25" y="130" fill="#fbbf24" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800"><tspan fill="#ffffff">토지 인도</tspan>를 청구하고, <tspan fill="#ffffff">제741조에 기해 무단 점유 기간 동안의</tspan></text>
        <text x="25" y="152" fill="#fbbf24" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800"><tspan fill="#ffffff">임료 상당의 부당이득 반환</tspan>을 함께 청구하는 것이 타당합니다."</text>
      </g>
    </g>
  </g>

  <!-- ==================== BOTTOM CORE SUMMARY BANNER ==================== -->
  <g transform="translate(120, 760)">
    <rect x="0" y="0" width="1680" height="95" rx="10" fill="#080e1a" stroke="#1e293b" stroke-width="1.2" />
    <circle cx="35" cy="47" r="5" fill="#fbbf24" filter="url(#softGlow)" />
    <text x="60" y="40" fill="#e2e8f0" font-family="'Pretendard', sans-serif" font-size="15" font-weight="600">
      자연어 질문에서 유도된 핵심 조문(제214조)을 기점으로, 실시간 그래프 탐색을 통해 연관 법리 조항(제213조, 제741조, 제748조)을 즉시 구출합니다.
    </text>
    <text x="60" y="68" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="14" font-weight="600">
      구출한 다중 홉 법리 컨텍스트를 LLM 프롬프트에 주입하여, 철거(제214조) · 인도(제213조) · 임료 청구(제741조)가 결합한 전문 변호사 수준의 입체적 보고서를 완성합니다.
    </text>
  </g>

  <!-- ==================== FOOTER ==================== -->
  <g transform="translate(120, 985)">
    <text x="0" y="0" fill="#475569" font-family="'Pretendard', sans-serif" font-size="12" font-weight="500" letter-spacing="1">GraphRAG PRESENTATION | 2-HOP TRAVERSAL &amp; LLM SYNTHESIS FLOW</text>
    <text x="1680" y="0" fill="#475569" font-family="'Pretendard', sans-serif" font-size="12" font-weight="600" text-anchor="end">10 / RAG SYNTHESIS</text>
  </g>
</svg>



Slide 8 [Baseline Failure]: 초기 단순 검색 실패 원인 분석
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <!-- Background Radial Gradient -->
    <radialGradient id="bgGradient" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#070b14" />
      <stop offset="60%" stop-color="#020408" />
      <stop offset="100%" stop-color="#000000" />
    </radialGradient>

    <!-- Card Background Gradients -->
    <linearGradient id="roseCardBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#240710" />
      <stop offset="100%" stop-color="#0a0204" />
    </linearGradient>
    <linearGradient id="darkCardBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0b1320" />
      <stop offset="100%" stop-color="#03070d" />
    </linearGradient>

    <!-- Accent Lines -->
    <linearGradient id="lineRose" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f43f5e" />
      <stop offset="100%" stop-color="#fb7185" />
    </linearGradient>

    <!-- Glow Filters -->
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Arrow Markers -->
    <marker id="arrowRose" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" fill="#f43f5e" />
    </marker>
  </defs>

  <!-- Base Canvas Background -->
  <rect width="1920" height="1080" fill="url(#bgGradient)" />
  <rect x="80" y="80" width="1760" height="920" rx="16" fill="none" stroke="#1e293b" stroke-width="1.2" />

  <!-- ==================== HEADER ==================== -->
  <g transform="translate(120, 145)">
    <rect x="0" y="-22" width="115" height="28" rx="6" fill="#4c0519" stroke="#f43f5e" stroke-width="1" />
    <text x="57" y="-4" fill="#fda4af" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800" text-anchor="middle">BASELINE LIMIT</text>
    <text x="135" y="2" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="38" font-weight="900" letter-spacing="-0.5">초기 단순 키워드 검색의 한계와 실패 원인 분석</text>

    <!-- Top-Right Status Info -->
    <g transform="translate(1180, -18)">
      <text x="0" y="20" fill="#fca5a5" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800">검색 방식 <tspan fill="#ffffff" font-weight="900">Simple Sparse (Lucene)</tspan></text>
      <text x="260" y="20" fill="#ef4444" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800">평가 정답률 <tspan fill="#ffffff" font-weight="900">2.0%⚠</tspan></text>
    </g>
  </g>

  <!-- ==================== CONTENT LAYOUT ==================== -->

  <!-- [LEFT PANEL] 구어체 분할 및 어휘 불일치 장벽 (X: 120, W: 810, H: 520) -->
  <g transform="translate(120, 210)">
    <rect x="0" y="0" width="810" height="520" rx="14" fill="url(#roseCardBg)" stroke="#3f0f20" stroke-width="1.5" />
    <rect x="0" y="0" width="6" height="520" rx="3" fill="#f43f5e" filter="url(#glow)" />
    
    <!-- Panel Title -->
    <g transform="translate(30, 30)">
      <rect x="0" y="0" width="220" height="32" rx="6" fill="#4c0519" stroke="#f43f5e" stroke-width="1.2" />
      <text x="110" y="21" fill="#fca5a5" font-family="'Pretendard', sans-serif" font-size="15" font-weight="900" text-anchor="middle">어휘 불일치</text>
    </g>

    <!-- Ingestion Flow Box -->
    <g transform="translate(30, 85)">
      <rect x="0" y="0" width="750" height="405" rx="10" fill="#0d0206" stroke="#2b0e19" stroke-width="1.2" />
      
      <!-- Sub-Card 1: User Spoken Query -->
      <g transform="translate(30, 30)">
        <rect x="0" y="0" width="300" height="345" rx="8" fill="#1b0610" stroke="#3c0c24" stroke-width="1" />
        <text x="20" y="32" fill="#fda4af" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800">💬 사용자 구어체 질문</text>
        <line x1="20" y1="42" x2="280" y2="42" stroke="#3c0c24" stroke-width="1" />
        
        <!-- Spoken text bubble -->
        <rect x="15" y="60" width="270" height="70" rx="6" fill="#3a071c" />
        <text x="25" y="85" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800">"친구한테 돈을 빌려줬는데</text>
        <text x="25" y="110" fill="#fda4af" font-family="'Pretendard', sans-serif" font-size="14" font-weight="900">언제까지 돌려받을 수 있죠?"</text>

        <!-- Simple Split -->
        <text x="20" y="160" fill="#64748b" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800">단순 문자열 공백 분할 (Standard Split)</text>
        <g transform="translate(20, 175)">
          <rect x="0" y="0" width="55" height="24" rx="4" fill="#0f0508" stroke="#f43f5e" stroke-width="0.8" />
          <text x="27.5" y="16" fill="#fb7185" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800" text-anchor="middle">돈을</text>
          
          <rect x="62" y="0" width="78" height="24" rx="4" fill="#0f0508" stroke="#f43f5e" stroke-width="0.8" />
          <text x="101" y="16" fill="#fb7185" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800" text-anchor="middle">빌려줬는데</text>

          <rect x="147" y="0" width="60" height="24" rx="4" fill="#0f0508" stroke="#f43f5e" stroke-width="0.8" />
          <text x="177" y="16" fill="#fb7185" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800" text-anchor="middle">언제까지</text>
        </g>
        
        <text x="20" y="225" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="11" font-weight="600">➔ 형태소 분석 부재로 조사("돈을", "~는데") 및</text>
        <text x="20" y="245" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="11" font-weight="600">무의미한 구어체 어미가 인덱싱 노이즈로 작용</text>
        
        <!-- Silent Fail Alert -->
        <rect x="15" y="275" width="270" height="50" rx="4" fill="#4c0519" />
        <text x="150" y="295" fill="#fda4af" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800" text-anchor="middle">검색어: "돈을 OR 빌려줬는데 OR 언제까지"</text>
        <text x="150" y="312" fill="#fb7185" font-family="'Pretendard', sans-serif" font-size="10" font-weight="700" text-anchor="middle">민법전 내 해당 단어 매칭 0건</text>
      </g>

      <!-- Connecting Arrow with Mismatch Wall -->
      <g transform="translate(345, 140)">
        <path d="M 0 0 L 60 0" stroke="url(#lineRose)" stroke-width="3" marker-end="url(#arrowRose)" filter="url(#softGlow)" />
        <line x1="30" y1="-50" x2="30" y2="50" stroke="#f43f5e" stroke-width="4" filter="url(#glow)" />
        <text x="30" y="-62" fill="#fca5a5" font-family="'Pretendard', sans-serif" font-size="10" font-weight="900" text-anchor="middle">어휘 장벽</text>
      </g>

      <!-- Sub-Card 2: Ground Truth Law Text (Right) -->
      <g transform="translate(425, 30)">
        <rect x="0" y="0" width="295" height="345" rx="8" fill="#090104" stroke="#310a17" stroke-width="1" />
        <text x="20" y="32" fill="#fca5a5" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800">민법전 내 실제 법률 용어</text>
        
        <!-- Law Lexicon Mapping Failures -->
        <g transform="translate(20, 55)">
          <rect x="0" y="0" width="255" height="75" rx="6" fill="#1f080f" stroke="#ef4444" stroke-width="1" stroke-dasharray="3 3" />
          <text x="15" y="24" fill="#fda4af" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800">돈을 빌려줌 ➔ 소비대차 (소비대주)</text>
          <text x="15" y="46" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="11">민법 제598조: "소비대차는 금전 기타..."</text>
          <text x="15" y="64" fill="#f43f5e" font-family="'Pretendard', sans-serif" font-size="11" font-weight="700">➔ 어휘 대치 실패 (Match Fail)</text>
        </g>

        <g transform="translate(20, 145)">
          <rect x="0" y="0" width="255" height="75" rx="6" fill="#1f080f" stroke="#ef4444" stroke-width="1" stroke-dasharray="3 3" />
          <text x="15" y="24" fill="#fda4af" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800">언제까지 돌려받음 ➔ 반환시기</text>
          <text x="15" y="46" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="11">민법 제603조: "반환시기의 약정이 없는..."</text>
          <text x="15" y="64" fill="#f43f5e" font-family="'Pretendard', sans-serif" font-size="11" font-weight="700">➔ 어휘 대치 실패 (Match Fail)</text>
        </g>

        <text x="20" y="255" fill="#fca5a5" font-family="'Pretendard', sans-serif" font-size="13" font-weight="900">결과: 엉뚱한 조문 반환</text>
        <text x="20" y="278" fill="#fb7185" font-family="'Pretendard', sans-serif" font-size="12" font-weight="700">➔ 검색 성능의 극심한 저하 초래</text>
      </g>
    </g>
  </g>

  <!-- [RIGHT PANEL] 50개 벤치마크 평가 결과 분석 (X: 990, W: 810, H: 520) -->
  <g transform="translate(990, 210)">
    <rect x="0" y="0" width="810" height="520" rx="14" fill="url(#roseCardBg)" stroke="#3f0f20" stroke-width="1.5" />
    <rect x="0" y="0" width="6" height="520" rx="3" fill="#f43f5e" filter="url(#glow)" />
    
    <!-- Panel Title -->
    <g transform="translate(30, 30)">
      <rect x="0" y="0" width="240" height="32" rx="6" fill="#4c0519" stroke="#f43f5e" stroke-width="1.2" />
      <text x="120" y="21" fill="#fca5a5" font-family="'Pretendard', sans-serif" font-size="15" font-weight="900" text-anchor="middle">RAG 벤치마크 평가 지표</text>
    </g>

    <!-- Metrics Cards & Failure list -->
    <g transform="translate(30, 85)">
      
      <!-- Benchmark Statistical metrics -->
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="750" height="130" rx="8" fill="#1b0811" stroke="#f43f5e" stroke-width="1.2" />
        <text x="20" y="26" fill="#fda4af" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800">benchmark_50.csv 평가 데이터셋 50개 쿼리 실행 결과</text>
        
        <!-- 3 Tier Metrics Display -->
        <g transform="translate(20, 42)">
          <!-- Hit Rate@3 -->
          <rect x="0" y="0" width="220" height="65" rx="6" fill="#4c0519" stroke="#f43f5e" stroke-width="1" />
          <text x="110" y="22" fill="#fda4af" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800" text-anchor="middle">Hit Rate@3 (정답률)</text>
          <text x="110" y="52" fill="#ffffff" font-family="'Fira Code', monospace" font-size="24" font-weight="900" text-anchor="middle" filter="url(#glow)">2.0%</text>

          <!-- MRR -->
          <rect x="240" y="0" width="220" height="65" rx="6" fill="#2d050f" stroke="#e11d48" stroke-width="0.8" />
          <text x="350" y="22" fill="#fda4af" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800" text-anchor="middle">상위 노출 순위 (MRR)</text>
          <text x="350" y="52" fill="#ffffff" font-family="'Fira Code', monospace" font-size="22" font-weight="800" text-anchor="middle">0.010</text>

          <!-- NDCG@3 -->
          <rect x="480" y="0" width="230" height="65" rx="6" fill="#2d050f" stroke="#e11d48" stroke-width="0.8" />
          <text x="595" y="22" fill="#fda4af" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800" text-anchor="middle">연관도 &amp; 정밀도 (NDCG@3)</text>
          <text x="595" y="52" fill="#ffffff" font-family="'Fira Code', monospace" font-size="22" font-weight="800" text-anchor="middle">0.010</text>
        </g>
      </g>

      <!-- Detailed Failure Analysis -->
      <g transform="translate(0, 155)">
        <rect x="0" y="0" width="750" height="225" rx="8" fill="#090104" stroke="#310a17" stroke-width="1.2" />
        <text x="25" y="30" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="15" font-weight="900">초기 단순 키워드 검색의 3대 패인</text>
        
        <!-- Fail 1 -->
        <g transform="translate(25, 45)">
          <circle cx="10" cy="15" r="5" fill="#f43f5e" />
          <text x="25" y="19" fill="#fda4af" font-family="'Pretendard', sans-serif" font-size="13" font-weight="800">구어체와 전문 법률 용어 간의 어휘 괴리</text>
          <text x="25" y="38" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="12">· 일반 사용자의 자연어 일상 표현과 민법전 내 정형화된 한자어 용어가 불일치함</text>
        </g>

        <!-- Fail 2 -->
        <g transform="translate(25, 100)">
          <circle cx="10" cy="15" r="5" fill="#f43f5e" />
          <text x="25" y="19" fill="#fda4af" font-family="'Pretendard', sans-serif" font-size="13" font-weight="800">한글 형태소 분석 및 전처리 결여</text>
          <text x="25" y="38" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="12">· 조사와 종결어미 등의 불용어 전처리가 없어 무분별한 불필요 텍스트 매칭 유발</text>
        </g>

        <!-- Fail 3 -->
        <g transform="translate(25, 155)">
          <circle cx="10" cy="15" r="5" fill="#f43f5e" />
          <text x="25" y="19" fill="#fda4af" font-family="'Pretendard', sans-serif" font-size="13" font-weight="800">가중치 튜닝이 없는 단순 OR 조건 질의</text>
          <text x="25" y="38" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="12">· 텍스트 매칭 시 조문 명칭(name), 조문 요약(summary) 간의 중요도 가중치 부여 실패</text>
        </g>
      </g>
    </g>
  </g>

  <!-- ==================== BOTTOM CORE SUMMARY BANNER ==================== -->
  <g transform="translate(120, 760)">
    <rect x="0" y="0" width="1680" height="95" rx="10" fill="#080e1a" stroke="#1e293b" stroke-width="1.2" />
    <circle cx="35" cy="47" r="5" fill="#f43f5e" filter="url(#softGlow)" />
    <text x="60" y="40" fill="#e2e8f0" font-family="'Pretendard', sans-serif" font-size="15" font-weight="600">
      사용자의 일상 구어체 표현과 민법전 내 엄격한 한자어 간의 <tspan fill="#f43f5e" font-weight="800">'어휘 불일치'</tspan> 장벽으로 인해 초기 단순 검색의 정답률은 <tspan fill="#fb7185" font-weight="800">단 2.0%</tspan>에 불과했습니다.
    </text>
    <text x="60" y="68" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="14" font-weight="600">
      형태소 분석 전처리 없이 단순 문자열 분할로 쿼리를 조립하는 방식은 인덱싱 노이즈를 다량 유발하여 RAG 실패를 일으키는 가장 큰 원인이 됩니다.
    </text>
  </g>

  <!-- ==================== FOOTER ==================== -->
  <g transform="translate(120, 985)">
    <text x="0" y="0" fill="#475569" font-family="'Pretendard', sans-serif" font-size="12" font-weight="500" letter-spacing="1">GraphRAG PRESENTATION | BASELINE FAILURE &amp; LEXICAL MISMATCH</text>
    <text x="1680" y="0" fill="#475569" font-family="'Pretendard', sans-serif" font-size="12" font-weight="600" text-anchor="end">11 / BASELINE FAILURE</text>
  </g>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
          
          <text x="15" y="145" fill="#38bdf8" font-family="'Fira Code', monospace" font-size="10">"related_rights":</text>
          <text x="15" y="163" fill="#e2e8f0" font-family="'Pretendard', sans-serif" font-size="10">"대여금반환청구권"</text>
          
          <text x="0" y="190" fill="#64748b" font-family="'Fira Code', monospace" font-size="10">}</text>
        </g>
        
        <rect x="15" y="275" width="270" height="50" rx="4" fill="#042c16" stroke="#10b981" stroke-width="0.8" />
        <text x="150" y="295" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="12" font-weight="900" text-anchor="middle">법률 전문 어휘 일치 완료</text>
        <text x="150" y="312" fill="#a7f3d0" font-family="'Pretendard', sans-serif" font-size="10" text-anchor="middle">민법전 색인 100% 매핑</text>
      </g>
    </g>
  </g>

  <!-- [RIGHT PANEL] 가중치 기반 Lucene 쿼리 식 생성 (X: 990, W: 810, H: 520) -->
  <g transform="translate(990, 210)">
    <rect x="0" y="0" width="810" height="520" rx="14" fill="url(#purpleCardBg)" stroke="#20113f" stroke-width="1.5" />
    <rect x="0" y="0" width="6" height="520" rx="3" fill="#a855f7" filter="url(#glow)" />
    
    <!-- Title -->
    <g transform="translate(30, 30)">
      <rect x="0" y="0" width="240" height="32" rx="6" fill="#2d0c45" stroke="#a855f7" stroke-width="1.2" />
      <text x="120" y="21" fill="#c084fc" font-family="'Pretendard', sans-serif" font-size="15" font-weight="900" text-anchor="middle">가중치 Lucene 쿼리 생성</text>
    </g>

    <!-- Ingestion Flow Box -->
    <g transform="translate(30, 85)">
      <rect x="0" y="0" width="750" height="405" rx="10" fill="#07030d" stroke="#250f33" stroke-width="1.2" />
      
      <!-- Boosting Mechanism visual -->
      <g transform="translate(30, 30)">
        <rect x="0" y="0" width="690" height="150" rx="8" fill="#010408" stroke="#25123a" stroke-width="1.2" />
        <text x="20" y="30" fill="#64748b" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800">조문 구조별 가중치 부스팅 설계 (Field-specific Weighting)</text>
        
        <!-- 3 Columns for fields -->
        <g transform="translate(20, 50)">
          <!-- Name -->
          <rect x="0" y="0" width="200" height="80" rx="6" fill="#1b0811" stroke="#f43f5e" stroke-width="1" />
          <text x="100" y="30" fill="#fda4af" font-family="'Pretendard', sans-serif" font-size="13" font-weight="900" text-anchor="middle">조문 제목 (name)</text>
          <text x="100" y="65" fill="#f43f5e" font-family="'Fira Code', monospace" font-size="28" font-weight="900" text-anchor="middle" filter="url(#glow)">^3.0</text>

          <!-- Summary -->
          <rect x="220" y="0" width="200" height="80" rx="6" fill="#1c0d02" stroke="#f59e0b" stroke-width="1" />
          <text x="320" y="30" fill="#fde68a" font-family="'Pretendard', sans-serif" font-size="13" font-weight="900" text-anchor="middle">조문 요약 (summary)</text>
          <text x="320" y="65" fill="#fbbf24" font-family="'Fira Code', monospace" font-size="28" font-weight="900" text-anchor="middle">^2.0</text>

          <!-- FullText -->
          <rect x="440" y="0" width="210" height="80" rx="6" fill="#021c16" stroke="#10b981" stroke-width="1" />
          <text x="545" y="30" fill="#a7f3d0" font-family="'Pretendard', sans-serif" font-size="13" font-weight="900" text-anchor="middle">조문 본문 (fullText)</text>
          <text x="545" y="65" fill="#10b981" font-family="'Fira Code', monospace" font-size="28" font-weight="900" text-anchor="middle">^1.0</text>
        </g>
      </g>

      <!-- Synthesized Lucene String Box -->
      <g transform="translate(30, 200)">
        <rect x="0" y="0" width="690" height="175" rx="8" fill="#010408" stroke="#1a0c28" stroke-width="1" />
        <text x="20" y="28" fill="#c084fc" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800">최종 합성된 Lucene Query String</text>
        
        <!-- Code displaying lucene string from normalizer.py -->
        <rect x="15" y="42" width="660" height="110" rx="4" fill="#07030c" stroke="#2c0c4c" stroke-width="1" />
        <g transform="translate(30, 60)">
          <text x="0" y="15" fill="#ffffff" font-family="'Fira Code', monospace" font-size="11">
            (name:<tspan fill="#fb7185">"채무불이행"</tspan><tspan fill="#f43f5e">^3.0</tspan> OR summary:<tspan fill="#fb7185">"채무불이행"</tspan><tspan fill="#f43f5e">^2.0</tspan> OR fullText:<tspan fill="#fb7185">"채무불이행"</tspan><tspan fill="#f43f5e">^1.0</tspan>)
          </text>
          <text x="0" y="40" fill="#a855f7" font-family="'Fira Code', monospace" font-size="12" font-weight="800">
            OR
          </text>
          <text x="0" y="65" fill="#38bdf8" font-family="'Fira Code', monospace" font-size="11">
            (fullText:<tspan fill="#e2e8f0">"이행지체"</tspan> OR fullText:<tspan fill="#e2e8f0">"대여금"</tspan> OR fullText:<tspan fill="#e2e8f0">"손해배상"</tspan>)
          </text>
        </g>
      </g>
    </g>
  </g>

  <!-- ==================== BOTTOM CORE SUMMARY BANNER ==================== -->
  <g transform="translate(120, 760)">
    <rect x="0" y="0" width="1680" height="95" rx="10" fill="#080e1a" stroke="#1e293b" stroke-width="1.2" />
    <circle cx="35" cy="47" r="5" fill="#38bdf8" filter="url(#softGlow)" />
    <text x="60" y="40" fill="#e2e8f0" font-family="'Pretendard', sans-serif" font-size="15" font-weight="600">
      <tspan fill="#38bdf8" font-weight="800">Gemini 3.6 Flash</tspan>를 결합하여 사용자 구어체 질문을 표준 한자어 법률 명사 및 권리 유형으로 즉시 전처리합니다.
    </text>
    <text x="60" y="68" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="14" font-weight="600">
      추출한 핵심 개념을 기점으로 조문 제목/요약/본문 구조에 <tspan fill="#a855f7" font-weight="800">가중치 부스팅(^3.0 / ^2.0 / ^1.0)</tspan>을 차등 적용하여, 검색 정확도를 비약적으로 상승시킵니다.
    </text>
  </g>

  <!-- ==================== FOOTER ==================== -->
  <g transform="translate(120, 985)">
    <text x="0" y="0" fill="#475569" font-family="'Pretendard', sans-serif" font-size="12" font-weight="500" letter-spacing="1">GraphRAG PRESENTATION | QUERY NORMALIZATION &amp; STRUCTURED SCHEMAS</text>
    <text x="1680" y="0" fill="#475569" font-family="'Pretendard', sans-serif" font-size="12" font-weight="600" text-anchor="end">12 / QUERY NORMALIZATION</text>
  </g>
</svg>


Slide 9 - Vector Ingestion: 조문 384차원 벡터 임베딩 생성 및 Neo4j 데이터베이스 적재
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <!-- Background Radial Gradient -->
    <radialGradient id="bgGradient" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#070b14" />
      <stop offset="60%" stop-color="#020408" />
      <stop offset="100%" stop-color="#000000" />
    </radialGradient>

    <!-- Card Background Gradients -->
    <linearGradient id="emeraldCardBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#072b1a" />
      <stop offset="100%" stop-color="#010e0a" />
    </linearGradient>
    <linearGradient id="dbCardBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0b2447" />
      <stop offset="100%" stop-color="#020d1a" />
    </linearGradient>

    <!-- Glow Filters -->
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Arrow Markers -->
    <marker id="arrowEmerald" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" fill="#10b981" />
    </marker>
    <marker id="arrowCyan" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" fill="#38bdf8" />
    </marker>
  </defs>

  <!-- Base Canvas Background -->
  <rect width="1920" height="1080" fill="url(#bgGradient)" />
  <rect x="80" y="80" width="1760" height="920" rx="16" fill="none" stroke="#1e293b" stroke-width="1.2" />

  <!-- ==================== HEADER ==================== -->
  <g transform="translate(120, 145)">
    <rect x="0" y="-22" width="125" height="28" rx="6" fill="#042c16" stroke="#10b981" stroke-width="1" />
    <text x="62" y="-4" fill="#6ee7b7" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800" text-anchor="middle">VECTOR INGESTION</text>
    <text x="145" y="2" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="38" font-weight="900" letter-spacing="-0.5">해결책 1단계: 조문 384차원 벡터 임베딩 생성 및 Neo4j DB 적재</text>

    <!-- Top-Right Status Info -->
    <g transform="translate(1180, -18)">
      <text x="0" y="20" fill="#bae6fd" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800">임베딩 모델 <tspan fill="#ffffff" font-weight="900">FastEmbed bge-small</tspan></text>
      <text x="240" y="20" fill="#c7d2fe" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800">대상 데이터 <tspan fill="#ffffff" font-weight="900">민법 조문 1,118개</tspan></text>
    </g>
  </g>

  <!-- ==================== CONTENT LAYOUT ==================== -->

  <!-- [LEFT PANEL] 오프라인 벡터 생성 파이프라인 (X: 120, W: 810, H: 520) -->
  <g transform="translate(120, 210)">
    <rect x="0" y="0" width="810" height="520" rx="14" fill="url(#emeraldCardBg)" stroke="#113322" stroke-width="1.5" />
    <rect x="0" y="0" width="6" height="520" rx="3" fill="#10b981" filter="url(#glow)" />
    
    <!-- Title -->
    <g transform="translate(30, 25)">
      <rect x="0" y="0" width="280" height="32" rx="6" fill="#042c16" stroke="#10b981" stroke-width="1.2" />
      <text x="140" y="21" fill="#6ee7b7" font-family="'Pretendard', sans-serif" font-size="14" font-weight="900" text-anchor="middle">384D 조밀 벡터 인코딩 (오프라인)</text>
    </g>

    <!-- Content Box -->
    <g transform="translate(30, 75)">
      <rect x="0" y="0" width="750" height="420" rx="10" fill="#020805" stroke="#0a2414" stroke-width="1.2" />
      
      <!-- Flow Step 1: Article fullText Extract -->
      <g transform="translate(30, 30)">
        <rect x="0" y="0" width="690" height="150" rx="8" fill="#05150d" stroke="#0d3c24" stroke-width="1" />
        <text x="20" y="30" fill="#6ee7b7" font-family="'Pretendard', sans-serif" font-size="13" font-weight="800">1. 민법 조문 데이터 정제 및 fullText 추출</text>
        <line x1="20" y1="42" x2="670" y2="42" stroke="#0d3c24" stroke-width="0.8" />
        
        <!-- Article Example -->
        <g transform="translate(20, 55)">
          <rect x="0" y="0" width="630" height="75" rx="4" fill="#021008" stroke="#10b981" stroke-width="0.6" />
          <text x="15" y="25" fill="#a7f3d0" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800">Article 노드 대상 속성 추출</text>
          <text x="15" y="45" fill="#ffffff" font-family="'Fira Code', monospace" font-size="11.5">a.fullText = "제598조(소비대차의 의의) 소비대차는 당사자 일방이 금전 기타 대체물의 소유권을..."</text>
          <text x="15" y="62" fill="#64748b" font-family="'Pretendard', sans-serif" font-size="10">→ 민법전 전체 1,118개 조문 노드의 원본 텍스트를 인풋 버퍼로 메모리 적재</text>
        </g>
      </g>

      <!-- Connection Flow Arrow -->
      <g transform="translate(375, 195)">
        <path d="M 0 0 L 0 45" stroke="#10b981" stroke-width="2" marker-end="url(#arrowEmerald)" />
        <text x="12" y="27" fill="#6ee7b7" font-family="'Pretendard', sans-serif" font-size="10.5" font-weight="800">FastEmbed (bge-small) 임베딩 모델 구동</text>
      </g>

      <!-- Flow Step 2: Dense Vector Encoding -->
      <g transform="translate(30, 250)">
        <rect x="0" y="0" width="690" height="145" rx="8" fill="#05150d" stroke="#0d3c24" stroke-width="1" />
        <text x="20" y="28" fill="#6ee7b7" font-family="'Pretendard', sans-serif" font-size="13" font-weight="800">2. 고차원 의미 공간 상의 384차원 벡터 변환</text>
        <line x1="20" y1="38" x2="670" y2="38" stroke="#0d3c24" stroke-width="0.8" />

        <!-- Array Visual -->
        <g transform="translate(20, 50)">
          <rect x="0" y="0" width="650" height="40" rx="6" fill="#021008" stroke="#10b981" stroke-width="0.8" />
          <line x1="100" y1="0" x2="100" y2="40" stroke="#10b981" stroke-width="0.5" />
          <line x1="200" y1="0" x2="200" y2="40" stroke="#10b981" stroke-width="0.5" />
          <line x1="300" y1="0" x2="300" y2="40" stroke="#10b981" stroke-width="0.5" />
          <line x1="400" y1="0" x2="400" y2="40" stroke="#10b981" stroke-width="0.5" />
          <line x1="500" y1="0" x2="500" y2="40" stroke="#10b981" stroke-width="0.5" />
          
          <text x="50" y="25" fill="#ffffff" font-family="'Fira Code', monospace" font-size="11" text-anchor="middle">v[0] = 0.052</text>
          <text x="150" y="25" fill="#ffffff" font-family="'Fira Code', monospace" font-size="11" text-anchor="middle">v[1] = -0.124</text>
          <text x="250" y="25" fill="#ffffff" font-family="'Fira Code', monospace" font-size="11" text-anchor="middle">v[2] = 0.381</text>
          <text x="350" y="25" fill="#ffffff" font-family="'Fira Code', monospace" font-size="11" text-anchor="middle">v[3] = 0.009</text>
          <text x="450" y="25" fill="#6ee7b7" font-family="'Fira Code', monospace" font-size="11" text-anchor="middle">... [384 차원]</text>
          <text x="575" y="25" fill="#ffffff" font-family="'Fira Code', monospace" font-size="11" text-anchor="middle">v[383] = -0.071</text>
        </g>
        <text x="20" y="125" fill="#a7f3d0" font-family="'Pretendard', sans-serif" font-size="11">✓ 조문 본문의 핵심 의미가 384차원 실수형 밀집 벡터로 기하학적 인코딩 완료</text>
      </g>
    </g>
  </g>

  <!-- [RIGHT PANEL] DB 적재 및 인덱싱 (X: 990, W: 810, H: 520) -->
  <g transform="translate(990, 210)">
    <rect x="0" y="0" width="810" height="520" rx="14" fill="url(#dbCardBg)" stroke="#112233" stroke-width="1.5" />
    <rect x="0" y="0" width="6" height="520" rx="3" fill="#38bdf8" filter="url(#glow)" />
    
    <!-- Title -->
    <g transform="translate(30, 25)">
      <rect x="0" y="0" width="280" height="32" rx="6" fill="#0b2447" stroke="#38bdf8" stroke-width="1.2" />
      <text x="140" y="21" fill="#7dd3fc" font-family="'Pretendard', sans-serif" font-size="14" font-weight="900" text-anchor="middle">Neo4j 데이터베이스 반영 및 인덱싱</text>
    </g>

    <!-- Content Box -->
    <g transform="translate(30, 75)">
      <rect x="0" y="0" width="750" height="420" rx="10" fill="#010710" stroke="#0b1e36" stroke-width="1.2" />
      
      <!-- Step 3: UNWIND Cypher batch update -->
      <g transform="translate(30, 30)">
        <rect x="0" y="0" width="690" height="160" rx="8" fill="#041224" stroke="#0e2a4e" stroke-width="1" />
        <text x="20" y="28" fill="#7dd3fc" font-family="'Pretendard', sans-serif" font-size="13" font-weight="800">3. UNWIND Cypher 배치를 통한 노드 속성 일괄 갱신 (SET)</text>
        <line x1="20" y1="38" x2="670" y2="38" stroke="#0e2a4e" stroke-width="0.8" />

        <!-- Batch Code Display -->
        <g transform="translate(20, 50)">
          <rect x="0" y="0" width="650" height="95" rx="4" fill="#020914" stroke="#38bdf8" stroke-width="0.6" />
          <text x="15" y="22" fill="#7dd3fc" font-family="'Fira Code', monospace" font-size="11.5">UNWIND $batch AS item</text>
          <text x="15" y="42" fill="#7dd3fc" font-family="'Fira Code', monospace" font-size="11.5">MATCH (a:Article {id: item.id})</text>
          <text x="15" y="62" fill="#38bdf8" font-family="'Fira Code', monospace" font-size="11.5">SET a.embedding = item.embedding</text>
          <text x="15" y="82" fill="#64748b" font-family="'Pretendard', sans-serif" font-size="10.5">→ batch_size = 200 건씩 끊어 병렬 연산 및 DB 락(Lock) 최소화 적재</text>
        </g>
      </g>

      <!-- Step 4: Vector Index & Similarity -->
      <g transform="translate(30, 205)">
        <rect x="0" y="0" width="690" height="185" rx="8" fill="#041224" stroke="#0e2a4e" stroke-width="1" />
        <text x="20" y="28" fill="#7dd3fc" font-family="'Pretendard', sans-serif" font-size="13" font-weight="800">4. 코사인 유사도 기반 civilArticleVectorIndex 인덱스 생성</text>
        <line x1="20" y1="38" x2="670" y2="38" stroke="#0e2a4e" stroke-width="0.8" />

        <!-- Cypher DDL display -->
        <g transform="translate(20, 50)">
          <rect x="0" y="0" width="650" height="118" rx="4" fill="#020914" stroke="#38bdf8" stroke-width="0.6" />
          <text x="15" y="22" fill="#f43f5e" font-family="'Fira Code', monospace" font-size="11" font-weight="800">CREATE VECTOR INDEX</text>
          <text x="175" y="22" fill="#ffffff" font-family="'Fira Code', monospace" font-size="11">civilArticleVectorIndex</text>
          <text x="350" y="22" fill="#34d399" font-family="'Fira Code', monospace" font-size="11">FOR</text>
          <text x="380" y="22" fill="#ffffff" font-family="'Fira Code', monospace" font-size="11">(a:Article)</text>
          <text x="470" y="22" fill="#34d399" font-family="'Fira Code', monospace" font-size="11">ON</text>
          <text x="495" y="22" fill="#ffffff" font-family="'Fira Code', monospace" font-size="11">(a.embedding)</text>
          
          <text x="15" y="45" fill="#38bdf8" font-family="'Fira Code', monospace" font-size="11">OPTIONS</text>
          <text x="75" y="45" fill="#ffffff" font-family="'Fira Code', monospace" font-size="11">{ indexConfig: {</text>
          
          <text x="35" y="68" fill="#38bdf8" font-family="'Fira Code', monospace" font-size="11">`vector.dimensions`:</text>
          <text x="210" y="68" fill="#ffffff" font-family="'Fira Code', monospace" font-size="11">384,</text>
          
          <text x="35" y="90" fill="#38bdf8" font-family="'Fira Code', monospace" font-size="11">`vector.similarity_function`:</text>
          <text x="315" y="90" fill="#34d399" font-family="'Fira Code', monospace" font-size="11">'cosine'</text>
          <text x="385" y="90" fill="#ffffff" font-family="'Fira Code', monospace" font-size="11">} }</text>
        </g>
      </g>
    </g>
  </g>

  <!-- ==================== BOTTOM CORE SUMMARY BANNER ==================== -->
  <g transform="translate(120, 760)">
    <rect x="0" y="0" width="1680" height="95" rx="10" fill="#080e1a" stroke="#1e293b" stroke-width="1.2" />
    <circle cx="35" cy="47" r="5" fill="#10b981" filter="url(#softGlow)" />
    <text x="60" y="40" fill="#e2e8f0" font-family="'Pretendard', sans-serif" font-size="15" font-weight="600">
      민법 조문 전체를 <tspan fill="#34d399" font-weight="800">384차원 조밀 벡터로 임베딩</tspan>하여 Neo4j 데이터베이스에 적재하는 단계입니다.
    </text>
    <text x="60" y="68" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="14" font-weight="600">
      <tspan fill="#38bdf8" font-weight="800">bge-small</tspan> 모델 기반으로 인코딩된 벡터 속성을 <tspan fill="#38bdf8" font-weight="800">UNWIND Cypher 배치</tspan>를 통해 주입한 후, 코사인 유사도 지표 기반의 전용 벡터 인덱스를 생성해 둡니다.
    </text>
  </g>

  <!-- ==================== FOOTER ==================== -->
  <g transform="translate(120, 985)">
    <text x="0" y="0" fill="#475569" font-family="'Pretendard', sans-serif" font-size="12" font-weight="500" letter-spacing="1">GraphRAG PRESENTATION | VECTOR INGESTION &amp; INDEXING PIPELINE</text>
    <text x="1680" y="0" fill="#475569" font-family="'Pretendard', sans-serif" font-size="12" font-weight="600" text-anchor="end">12 / VECTOR INGESTION</text>
  </g>
</svg>




Slide 10 [Hybrid Pipeline]: 해결책 2단계 - 사용자의 실시간 구어체 질의 정규화 & 키워드·벡터 병렬 검색 파이프라인

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <!-- Background Radial Gradient -->
    <radialGradient id="bgGradient" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#070b14" />
      <stop offset="60%" stop-color="#020408" />
      <stop offset="100%" stop-color="#000000" />
    </radialGradient>

    <!-- Card Background Gradients -->
    <linearGradient id="purpleCardBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#160e28" />
      <stop offset="100%" stop-color="#05030b" />
    </linearGradient>
    <linearGradient id="blueCardBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#071b2b" />
      <stop offset="100%" stop-color="#020912" />
    </linearGradient>
    <linearGradient id="emeraldCardBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#072b1a" />
      <stop offset="100%" stop-color="#010e0a" />
    </linearGradient>

    <!-- Accent Gradients -->
    <linearGradient id="lineCyan" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0ea5e9" />
    </linearGradient>
    <linearGradient id="linePurple" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#a855f7" />
      <stop offset="100%" stop-color="#c084fc" />
    </linearGradient>

    <!-- Glow Filters -->
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Arrow Markers -->
    <marker id="arrowPurple" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" fill="#a855f7" />
    </marker>
    <marker id="arrowCyan" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" fill="#38bdf8" />
    </marker>
    <marker id="arrowEmerald" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" fill="#10b981" />
    </marker>
  </defs>

  <!-- Base Canvas Background -->
  <rect width="1920" height="1080" fill="url(#bgGradient)" />
  <rect x="80" y="80" width="1760" height="920" rx="16" fill="none" stroke="#1e293b" stroke-width="1.2" />

  <!-- ==================== HEADER ==================== -->
  <g transform="translate(120, 145)">
    <rect x="0" y="-22" width="125" height="28" rx="6" fill="#1b082e" stroke="#a855f7" stroke-width="1" />
    <text x="62" y="-4" fill="#c084fc" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800" text-anchor="middle">HYBRID PIPELINE</text>
    <text x="145" y="2" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="38" font-weight="900" letter-spacing="-0.5">해결책 2단계: 실시간 질의 정규화 및 키워드·벡터 병렬 검색</text>

    <!-- Top-Right Status Info -->
    <g transform="translate(1100, -18)">
      <text x="0" y="20" fill="#bae6fd" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800">정규화 엔진 <tspan fill="#ffffff" font-weight="900">Gemini 3.6 Flash</tspan></text>
      <text x="210" y="20" fill="#c7d2fe" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800">리랭커 모델 <tspan fill="#ffffff" font-weight="900">bge-reranker-large (ONNX)</tspan></text>
    </g>
  </g>

  <!-- ==================== CONTENT LAYOUT ==================== -->

  <!-- [LEFT PANEL] 실시간 구어체 질의 쿼리 정규화 (X: 120, W: 810, H: 520) -->
  <g transform="translate(120, 210)">
    <rect x="0" y="0" width="810" height="520" rx="14" fill="url(#blueCardBg)" stroke="#112b3e" stroke-width="1.5" />
    <rect x="0" y="0" width="6" height="520" rx="3" fill="#38bdf8" filter="url(#glow)" />
    
    <g transform="translate(30, 25)">
      <rect x="0" y="0" width="220" height="32" rx="6" fill="#0c253d" stroke="#38bdf8" stroke-width="1.2" />
      <text x="110" y="21" fill="#7dd3fc" font-family="'Pretendard', sans-serif" font-size="14" font-weight="900" text-anchor="middle">실시간 질의 정규화 단계</text>
    </g>

    <!-- Normalization Details -->
    <g transform="translate(30, 75)">
      <rect x="0" y="0" width="750" height="420" rx="10" fill="#020810" stroke="#0a2033" stroke-width="1.2" />
      
      <!-- Input -->
      <g transform="translate(30, 30)">
        <rect x="0" y="0" width="690" height="85" rx="6" fill="#051424" stroke="#0e2a47" stroke-width="0.8" />
        <text x="20" y="28" fill="#7dd3fc" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800">💬 실시간 구어체 질문 입력 (Spoken Query)</text>
        <rect x="20" y="40" width="650" height="32" rx="4" fill="#0c253d" />
        <text x="35" y="60" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="13" font-weight="800">"친구가 500만원 빌려가서 안 갚고 연락을 피해요. 소송이나 반환 청구할 수 있나요?"</text>
      </g>

      <path d="M 375 115 L 375 145" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrowCyan)" />

      <!-- Gemini Processor -->
      <g transform="translate(30, 145)">
        <rect x="0" y="0" width="690" height="85" rx="6" fill="#0c1d33" stroke="#38bdf8" stroke-width="1.2" filter="url(#softGlow)" />
        <text x="20" y="28" fill="#7dd3fc" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800">⚙️ Gemini 3.6 Flash 구조화 변환 (Structured Outputs)</text>
        <text x="20" y="55" fill="#e2e8f0" font-family="'Pretendard', sans-serif" font-size="11.5">일상 대화체 질문의 노이즈(조사, 감정 등)를 제거하고 법조문 용어 및 권리 관계로 형태소 매핑 적용</text>
        <text x="20" y="72" fill="#bae6fd" font-family="'Fira Code', monospace" font-size="10.5">Prompt 아키텍처: { response_schema: PydanticModel("NormalizedQuery") }</text>
      </g>

      <path d="M 375 230 L 375 260" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrowCyan)" />

      <!-- Structured Schema Outputs -->
      <g transform="translate(30, 260)">
        <rect x="0" y="0" width="690" height="135" rx="6" fill="#020914" stroke="#0e2a47" stroke-width="0.8" />
        <text x="20" y="25" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="11.5" font-weight="800">정규화된 JSON 데이터 반환</text>
        
        <g transform="translate(30, 45)">
          <text x="0" y="15" fill="#64748b" font-family="'Fira Code', monospace" font-size="11">{</text>
          
          <text x="15" y="32" fill="#38bdf8" font-family="'Fira Code', monospace" font-size="11">"original_intent":</text>
          <text x="165" y="32" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="11">"금전소비대차 계약에 따른 대여금 반환 채무불이행"</text>
          
          <text x="15" y="52" fill="#38bdf8" font-family="'Fira Code', monospace" font-size="11">"primary_legal_terms":</text>
          <text x="165" y="52" fill="#a7f3d0" font-family="'Fira Code', monospace" font-size="11">["소비대차", "대여금반환청구", "이행지체", "채무불이행"]</text>
          
          <text x="15" y="72" fill="#38bdf8" font-family="'Fira Code', monospace" font-size="11">"related_rights":</text>
          <text x="165" y="72" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="11">"대여금반환청구권, 손해배상청구권"</text>
          
          <text x="0" y="90" fill="#64748b" font-family="'Fira Code', monospace" font-size="11">}</text>
        </g>
      </g>
    </g>
  </g>

  <!-- [RIGHT PANEL] 병렬 하이브리드 검색 & 리랭크 (X: 990, W: 810, H: 520) -->
  <g transform="translate(990, 210)">
    <rect x="0" y="0" width="810" height="520" rx="14" fill="url(#purpleCardBg)" stroke="#20113f" stroke-width="1.5" />
    <rect x="0" y="0" width="6" height="520" rx="3" fill="#a855f7" filter="url(#glow)" />
    
    <g transform="translate(30, 25)">
      <rect x="0" y="0" width="220" height="32" rx="6" fill="#2d0c45" stroke="#a855f7" stroke-width="1.2" />
      <text x="110" y="21" fill="#c084fc" font-family="'Pretendard', sans-serif" font-size="14" font-weight="900" text-anchor="middle">병렬 검색 및 Reranking</text>
    </g>

    <!-- Ingestion Flow Box -->
    <g transform="translate(30, 75)">
      <rect x="0" y="0" width="750" height="420" rx="10" fill="#07030d" stroke="#250f33" stroke-width="1.2" />
      
      <!-- Split Parallel Search -->
      <g transform="translate(30, 30)">
        <!-- Left branch (Sparse Search) -->
        <rect x="0" y="0" width="320" height="100" rx="6" fill="#020c1b" stroke="#38bdf8" stroke-width="1.2" />
        <text x="160" y="25" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="12" font-weight="900" text-anchor="middle">① 어휘 검색 (Sparse Search)</text>
        <text x="20" y="52" fill="#ffffff" font-family="'Fira Code', monospace" font-size="10.5">Lucene Fulltext Index (가중치 쿼리)</text>
        <text x="20" y="72" fill="#94a3b8" font-family="'Fira Code', monospace" font-size="10">name^3.0 OR summary^2.0 OR fullText^1.0</text>

        <!-- Right branch (Dense Search) -->
        <rect x="370" y="0" width="320" height="100" rx="6" fill="#021c12" stroke="#10b981" stroke-width="1.2" />
        <text x="530" y="25" fill="#10b981" font-family="'Pretendard', sans-serif" font-size="12" font-weight="900" text-anchor="middle">② 의미 검색 (Dense Search)</text>
        <text x="390" y="52" fill="#ffffff" font-family="'Fira Code', monospace" font-size="10.5">civilArticleVectorIndex 코사인 유사도</text>
        <text x="390" y="72" fill="#94a3b8" font-family="'Fira Code', monospace" font-size="10">FastEmbed 인코딩 384D 유사 조문 탐색</text>
      </g>

      <!-- Converge arrows -->
      <path d="M 190 130 L 190 160 L 335 160" fill="none" stroke="#38bdf8" stroke-width="1.5" />
      <path d="M 560 130 L 560 160 L 415 160" fill="none" stroke="#10b981" stroke-width="1.5" />
      <circle cx="375" cy="160" r="4" fill="#a855f7" />
      <path d="M 375 160 L 375 185" stroke="#a855f7" stroke-width="2" marker-end="url(#arrowPurple)" />

      <!-- RRF Rank Merging -->
      <g transform="translate(180, 185)">
        <rect x="0" y="0" width="390" height="60" rx="6" fill="#18072e" stroke="#a855f7" stroke-width="1" />
        <text x="195" y="26" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="12.5" font-weight="900" text-anchor="middle">③ 공통 상위 조문 병합</text>
        <text x="195" y="46" fill="#c084fc" font-family="'Fira Code', monospace" font-size="11" text-anchor="middle">RRF_Score = 1/(Rank_sparse + 60) + 1/(Rank_dense + 60)</text>
      </g>

      <path d="M 375 245 L 375 275" stroke="#a855f7" stroke-width="2" marker-end="url(#arrowPurple)" />

      <!-- Cross-Encoder Reranker -->
      <g transform="translate(180, 275)">
        <rect x="0" y="0" width="390" height="60" rx="6" fill="#2d1504" stroke="#fbbf24" stroke-width="1" />
        <text x="195" y="26" fill="#fbbf24" font-family="'Pretendard', sans-serif" font-size="12.5" font-weight="900" text-anchor="middle">④ 순위 재정렬(질문 / 이름 + 요약 + 본문)</text>
        <text x="195" y="46" fill="#fde68a" font-family="'Pretendard', sans-serif" font-size="11" text-anchor="middle">상위 10개 후보 조문의 정밀 연관성 재정렬</text>
      </g>

      <path d="M 375 335 L 375 360" stroke="#fbbf24" stroke-width="2" marker-end="url(#arrowPurple)" />

      <!-- RAG Generation context -->
      <g transform="translate(120, 360)">
        <rect x="0" y="0" width="510" height="40" rx="4" fill="#1e1b4b" stroke="#818cf8" stroke-width="1" />
        <text x="255" y="25" fill="#a5b4fc" font-family="'Pretendard', sans-serif" font-size="12" font-weight="900" text-anchor="middle">최종 후보 조문 종합 ➔ RAG LLM 프롬프트 주입</text>
      </g>
    </g>
  </g>

  <!-- ==================== BOTTOM CORE SUMMARY BANNER ==================== -->
  <g transform="translate(120, 760)">
    <rect x="0" y="0" width="1680" height="95" rx="10" fill="#080e1a" stroke="#1e293b" stroke-width="1.2" />
    <circle cx="35" cy="47" r="5" fill="#a855f7" filter="url(#softGlow)" />
    <text x="60" y="40" fill="#e2e8f0" font-family="'Pretendard', sans-serif" font-size="15" font-weight="600">
      사용자의 실시간 입력 질문을 <tspan fill="#38bdf8" font-weight="800">Gemini 3.6 Flash</tspan>로 법률 용어 정규화하여 어휘 매핑 성능을 극대화합니다.
    </text>
    <text x="60" y="68" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="14" font-weight="600">
      정규화 쿼리를 활용해 <tspan fill="#38bdf8" font-weight="800">어휘(Lucene)</tspan> 및 <tspan fill="#10b981" font-weight="800">의미(Vector)</tspan> 병렬 검색을 동시 구동하며, <tspan fill="#a855f7" font-weight="800">RRF 병합</tspan>과 <tspan fill="#fbbf24" font-weight="800">크로스 인코더 리랭커</tspan>로 고도의 최종 검색 정확도를 달성합니다.
    </text>
  </g>

  <!-- ==================== FOOTER ==================== -->
  <g transform="translate(120, 985)">
    <text x="0" y="0" fill="#475569" font-family="'Pretendard', sans-serif" font-size="12" font-weight="500" letter-spacing="1">GraphRAG PRESENTATION | HYBRID PIPELINE &amp; QUERY PROCESSING</text>
    <text x="1680" y="0" fill="#475569" font-family="'Pretendard', sans-serif" font-size="12" font-weight="600" text-anchor="end">13 / HYBRID PIPELINE</text>
  </g>
</svg>


Slide 11 [Benchmark Results]: 대규모 벤치마크 평가 성과 (n=50, Hit Rate 18배 / NDCG 22배) 및 종합 결론

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <!-- Background Radial Gradient -->
    <radialGradient id="bgGradient" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#070b14" />
      <stop offset="60%" stop-color="#020408" />
      <stop offset="100%" stop-color="#000000" />
    </radialGradient>

    <!-- Card Base Gradients -->
    <linearGradient id="mainCardBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0a192c" />
      <stop offset="100%" stop-color="#020812" />
    </linearGradient>
    <linearGradient id="heroCardBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d233a" />
      <stop offset="100%" stop-color="#030d17" />
    </linearGradient>

    <!-- Accent Border Gradient -->
    <linearGradient id="lineCyan" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#818cf8" />
      <stop offset="100%" stop-color="#34d399" />
    </linearGradient>
  </defs>

  <!-- Base Canvas Background -->
  <rect width="1920" height="1080" fill="url(#bgGradient)" />
  <rect x="80" y="80" width="1760" height="920" rx="16" fill="none" stroke="#1e293b" stroke-width="1.2" />

  <!-- ==================== HEADER ==================== -->
  <g transform="translate(120, 145)">
    <!-- Badge -->
    <rect x="0" y="-22" width="150" height="28" rx="6" fill="#082f49" stroke="#38bdf8" stroke-width="1" />
    <text x="75" y="-4" fill="#7dd3fc" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800" text-anchor="middle">TREC IR BENCHMARK</text>
    
    <!-- Title -->
    <text x="170" y="2" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="36" font-weight="900" letter-spacing="-0.5">50개 데이터셋 벤치마크 평가 성과표</text>

    <!-- Top-Right Domain / Cost Chips -->
    <g transform="translate(1110, -18)">
      <rect x="0" y="0" width="280" height="32" rx="6" fill="#0b1a2b" stroke="#1e3a5f" stroke-width="1" />
      <text x="15" y="21" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="12" font-weight="600">범위:</text>
      <text x="50" y="21" fill="#f8fafc" font-family="'Pretendard', sans-serif" font-size="12" font-weight="700">민법 5대 영역 무작위 샘플링</text>

      <rect x="295" y="0" width="155" height="32" rx="6" fill="#06281e" stroke="#059669" stroke-width="1" />
      <text x="310" y="21" fill="#6ee7b7" font-family="'Pretendard', sans-serif" font-size="12" font-weight="600">과금액:</text>
      <text x="360" y="21" fill="#34d399" font-family="'Fira Code', monospace" font-size="13" font-weight="800">6원</text>
    </g>
  </g>

  <!-- ==================== 4 TOP HERO STAT TILES ==================== -->
  <g transform="translate(120, 195)">
    <!-- Card 1: NDCG@3 -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="405" height="88" rx="10" fill="url(#heroCardBg)" stroke="#1e3a5f" stroke-width="1.2" />
      <rect x="0" y="0" width="4" height="88" rx="2" fill="#38bdf8" />
      <text x="20" y="28" fill="#7dd3fc" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800">NDCG@3 (검색 질적 정밀도)</text>
      <text x="20" y="66" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="32" font-weight="900">22배 <tspan font-size="18" font-weight="700" fill="#38bdf8">폭증</tspan></text>
      <text x="385" y="62" fill="#94a3b8" font-family="'Fira Code', monospace" font-size="13" font-weight="600" text-anchor="end">0.013 ➔ <tspan fill="#38bdf8" font-weight="800">0.286</tspan></text>
    </g>

    <!-- Card 2: Hit Rate@3 -->
    <g transform="translate(425, 0)">
      <rect x="0" y="0" width="405" height="88" rx="10" fill="url(#heroCardBg)" stroke="#1e3a5f" stroke-width="1.2" />
      <rect x="0" y="0" width="4" height="88" rx="2" fill="#34d399" />
      <text x="20" y="28" fill="#6ee7b7" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800">Hit Rate@3 (Top-3 적중률)</text>
      <text x="20" y="66" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="32" font-weight="900">18배 <tspan font-size="18" font-weight="700" fill="#34d399">상승</tspan></text>
      <text x="385" y="62" fill="#94a3b8" font-family="'Fira Code', monospace" font-size="13" font-weight="600" text-anchor="end">2.0% ➔ <tspan fill="#34d399" font-weight="800">36.0%</tspan></text>
    </g>

    <!-- Card 3: MRR -->
    <g transform="translate(850, 0)">
      <rect x="0" y="0" width="405" height="88" rx="10" fill="url(#heroCardBg)" stroke="#1e3a5f" stroke-width="1.2" />
      <rect x="0" y="0" width="4" height="88" rx="2" fill="#818cf8" />
      <text x="20" y="28" fill="#c7d2fe" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800">MRR (상위 순위 평점)</text>
      <text x="20" y="66" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="32" font-weight="900">18배 <tspan font-size="18" font-weight="700" fill="#818cf8">향상</tspan></text>
      <text x="385" y="62" fill="#94a3b8" font-family="'Fira Code', monospace" font-size="13" font-weight="600" text-anchor="end">0.017 ➔ <tspan fill="#818cf8" font-weight="800">0.307</tspan></text>
    </g>

    <!-- Card 4: GTCR -->
    <g transform="translate(1275, 0)">
      <rect x="0" y="0" width="405" height="88" rx="10" fill="url(#heroCardBg)" stroke="#1e3a5f" stroke-width="1.2" />
      <rect x="0" y="0" width="4" height="88" rx="2" fill="#fbbf24" />
      <text x="20" y="28" fill="#fde68a" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800">GTCR (준용/참조 연관 탐색율)</text>
      <text x="20" y="66" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="32" font-weight="900">93.7% <tspan font-size="18" font-weight="700" fill="#fbbf24">도달</tspan></text>
      <text x="385" y="62" fill="#94a3b8" font-family="'Fira Code', monospace" font-size="13" font-weight="600" text-anchor="end">82.0% ➔ <tspan fill="#fbbf24" font-weight="800">93.7%</tspan></text>
    </g>
  </g>

  <!-- ==================== MAIN FULL-WIDTH COMPARISON TABLE ==================== -->
  <g transform="translate(120, 305)">
    <!-- Container Card -->
    <rect x="0" y="0" width="1680" height="425" rx="14" fill="url(#mainCardBg)" stroke="#1e3a5f" stroke-width="1.5" />
    <rect x="0" y="0" width="6" height="425" rx="3" fill="url(#lineCyan)" />

    <!-- Table Inner Frame -->
    <g transform="translate(30, 18)">
      <!-- Table Header Background -->
      <rect x="0" y="0" width="1620" height="44" rx="6" fill="#0f2238" stroke="#1e3a5f" stroke-width="1" />
      <text x="30" y="28" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="13" font-weight="800">평가 지표 (n=50, TREC 표준)</text>
      <text x="450" y="28" fill="#fda4af" font-family="'Pretendard', sans-serif" font-size="13" font-weight="800" text-anchor="end">Baseline (기존 단순 검색)</text>
      <text x="730" y="28" fill="#38bdf8" font-family="'Pretendard', sans-serif" font-size="13" font-weight="800" text-anchor="end">Proposed (3-Tier GraphRAG)</text>
      <text x="1000" y="28" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="13" font-weight="800" text-anchor="end">성능 향상 폭 (Delta)</text>
      <text x="1080" y="28" fill="#cbd5e1" font-family="'Pretendard', sans-serif" font-size="13" font-weight="800">평가 의미 및 세부 비고</text>

      <!-- ==================== TABLE ROWS ==================== -->

      <!-- ROW 1: Hit Rate@1 -->
      <g transform="translate(0, 44)">
        <rect x="0" y="0" width="1620" height="56" fill="#051324" fill-opacity="0.5" />
        <line x1="0" y1="56" x2="1620" y2="56" stroke="#132a45" stroke-width="1" />
        
        <text x="30" y="34" fill="#f8fafc" font-family="'Pretendard', sans-serif" font-size="14.5" font-weight="800">Hit Rate@1 <tspan fill="#64748b" font-weight="600" font-size="12.5">(1순위 최상단 적중률)</tspan></text>
        <text x="450" y="35" fill="#fda4af" font-family="'Fira Code', monospace" font-size="15" font-weight="700" text-anchor="end">0.0%</text>
        <text x="730" y="35" fill="#bae6fd" font-family="'Fira Code', monospace" font-size="16" font-weight="800" text-anchor="end">18.0%</text>
        
        <rect x="860" y="13" width="140" height="30" rx="6" fill="#064e3b" stroke="#059669" stroke-width="1" />
        <text x="930" y="33" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="13" font-weight="800" text-anchor="middle">+18.0%p</text>
        
        <text x="1080" y="34" fill="#cbd5e1" font-family="'Pretendard', sans-serif" font-size="13">첫 번째 추천 조문이 바로 정답인 비율 (정규화를 통한 1순위 다이렉트 매칭)</text>
      </g>

      <!-- ROW 2: Hit Rate@3 -->
      <g transform="translate(0, 100)">
        <rect x="0" y="0" width="1620" height="56" fill="#081b30" fill-opacity="0.4" />
        <line x1="0" y1="56" x2="1620" y2="56" stroke="#132a45" stroke-width="1" />
        
        <text x="30" y="34" fill="#f8fafc" font-family="'Pretendard', sans-serif" font-size="14.5" font-weight="800">Hit Rate@3 <tspan fill="#64748b" font-weight="600" font-size="12.5">(Top-3 추천 풀 적중률)</tspan></text>
        <text x="450" y="35" fill="#fda4af" font-family="'Fira Code', monospace" font-size="15" font-weight="700" text-anchor="end">2.0%</text>
        <text x="730" y="35" fill="#38bdf8" font-family="'Fira Code', monospace" font-size="16" font-weight="800" text-anchor="end">36.0%</text>
        
        <rect x="860" y="13" width="140" height="30" rx="6" fill="#064e3b" stroke="#059669" stroke-width="1" />
        <text x="930" y="33" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="13" font-weight="800" text-anchor="middle">+34.0%p (18배 ↑)</text>
        
        <text x="1080" y="34" fill="#e2e8f0" font-family="'Pretendard', sans-serif" font-size="13" font-weight="600">Top-3 내 정답 적중률 18배 폭발적 증가 (어휘+의미 병렬 검색으로 누락 방지)</text>
      </g>

      <!-- ROW 3: MRR -->
      <g transform="translate(0, 156)">
        <rect x="0" y="0" width="1620" height="56" fill="#051324" fill-opacity="0.5" />
        <line x1="0" y1="56" x2="1620" y2="56" stroke="#132a45" stroke-width="1" />
        
        <text x="30" y="34" fill="#f8fafc" font-family="'Pretendard', sans-serif" font-size="14.5" font-weight="800">MRR <tspan fill="#64748b" font-weight="600" font-size="12.5">(Mean Reciprocal Rank - 상위 노출 순위)</tspan></text>
        <text x="450" y="35" fill="#fda4af" font-family="'Fira Code', monospace" font-size="15" font-weight="700" text-anchor="end">0.017</text>
        <text x="730" y="35" fill="#bae6fd" font-family="'Fira Code', monospace" font-size="16" font-weight="800" text-anchor="end">0.307</text>
        
        <rect x="860" y="13" width="140" height="30" rx="6" fill="#064e3b" stroke="#059669" stroke-width="1" />
        <text x="930" y="33" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="13" font-weight="800" text-anchor="middle">+0.290 (18배 ↑)</text>
        
        <text x="1080" y="34" fill="#cbd5e1" font-family="'Pretendard', sans-serif" font-size="13">정답 조문이 상위권(1~3위)에 들어오는 순위 품질 평점 18배 상승</text>
      </g>

      <!-- ROW 4: NDCG@3 -->
      <g transform="translate(0, 212)">
        <rect x="0" y="0" width="1620" height="56" fill="#081b30" fill-opacity="0.4" />
        <line x1="0" y1="56" x2="1620" y2="56" stroke="#132a45" stroke-width="1" />
        
        <text x="30" y="34" fill="#f8fafc" font-family="'Pretendard', sans-serif" font-size="14.5" font-weight="800">NDCG@3 <tspan fill="#64748b" font-weight="600" font-size="12.5">(검색 연관도 및 순위 질적 정밀도)</tspan></text>
        <text x="450" y="35" fill="#fda4af" font-family="'Fira Code', monospace" font-size="15" font-weight="700" text-anchor="end">0.013</text>
        <text x="730" y="35" fill="#38bdf8" font-family="'Fira Code', monospace" font-size="16" font-weight="800" text-anchor="end">0.286</text>
        
        <rect x="860" y="13" width="140" height="30" rx="6" fill="#064e3b" stroke="#059669" stroke-width="1" />
        <text x="930" y="33" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="13" font-weight="800" text-anchor="middle">+0.273 (22배 ↑)</text>
        
        <text x="1080" y="34" fill="#e2e8f0" font-family="'Pretendard', sans-serif" font-size="13" font-weight="600">384차원 FastEmbed Dense 인코딩 결합으로 검색 연관 정밀도 22배 폭발적 증가</text>
      </g>

      <!-- ROW 5: GTCR -->
      <g transform="translate(0, 268)">
        <rect x="0" y="0" width="1620" height="56" fill="#051324" fill-opacity="0.5" />
        <line x1="0" y1="56" x2="1620" y2="56" stroke="#132a45" stroke-width="1" />
        
        <text x="30" y="34" fill="#f8fafc" font-family="'Pretendard', sans-serif" font-size="14.5" font-weight="800">GTCR <tspan fill="#64748b" font-weight="600" font-size="12.5">(Graph Traversal Coverage - 준용/참조 연관조문 탐색율)</tspan></text>
        <text x="450" y="35" fill="#fda4af" font-family="'Fira Code', monospace" font-size="15" font-weight="700" text-anchor="end">82.0%</text>
        <text x="730" y="35" fill="#bae6fd" font-family="'Fira Code', monospace" font-size="16" font-weight="800" text-anchor="end">93.7%</text>
        
        <rect x="860" y="13" width="140" height="30" rx="6" fill="#064e3b" stroke="#059669" stroke-width="1" />
        <text x="930" y="33" fill="#34d399" font-family="'Pretendard', sans-serif" font-size="13" font-weight="800" text-anchor="middle">+11.7%p (93.7%)</text>
        
        <text x="1080" y="34" fill="#cbd5e1" font-family="'Pretendard', sans-serif" font-size="13">Neo4j 온톨로지 1~2 Hop 그래프 탐색으로 법률 준용·예외 조항 93.7% 완벽 회수</text>
      </g>

      <!-- ROW 6: Total Cost -->
      <g transform="translate(0, 324)">
        <rect x="0" y="0" width="1620" height="56" rx="0 0 6 6" fill="#081b30" fill-opacity="0.4" />
        
        <text x="30" y="34" fill="#f8fafc" font-family="'Pretendard', sans-serif" font-size="14.5" font-weight="800">총 API 과금 비용 <tspan fill="#64748b" font-weight="600" font-size="12.5">(Total Billing Cost - 50개 쿼리 전수 검증)</tspan></text>
        <text x="450" y="35" fill="#fda4af" font-family="'Fira Code', monospace" font-size="15" font-weight="700" text-anchor="end">$0.000000</text>
        <text x="730" y="35" fill="#fbbf24" font-family="'Fira Code', monospace" font-size="16" font-weight="800" text-anchor="end">$0.004535</text>
        
        <rect x="860" y="13" width="140" height="30" rx="6" fill="#1e1b4b" stroke="#6366f1" stroke-width="1" />
        <text x="930" y="33" fill="#c7d2fe" font-family="'Pretendard', sans-serif" font-size="13" font-weight="800" text-anchor="middle">약 6원 (KRW)</text>
        
        <text x="1080" y="34" fill="#cbd5e1" font-family="'Pretendard', sans-serif" font-size="13">50개 대규모 검증 전체 비용이 약 6원에 불과하여 프로덕션 운영 과금 부담 극소화</text>
      </g>
    </g>
  </g>

  <!-- ==================== BOTTOM CORE SUMMARY BANNER ==================== -->
  <g transform="translate(120, 750)">
    <rect x="0" y="0" width="1680" height="195" rx="12" fill="#050e1a" stroke="#1e3a5f" stroke-width="1.2" />
    
    <!-- Title Tag -->
    <g transform="translate(30, 20)">
      <rect x="0" y="0" width="180" height="26" rx="5" fill="#082f49" stroke="#38bdf8" stroke-width="1" />
      <text x="90" y="17" fill="#7dd3fc" font-family="'Pretendard', sans-serif" font-size="12" font-weight="800" text-anchor="middle">결과의 의의 및 검증 결론</text>
    </g>

    <!-- 3 Insight Blocks -->
    <g transform="translate(30, 60)">
      <!-- Point 1 -->
      <g transform="translate(0, 0)">
        <circle cx="8" cy="8" r="4" fill="#f43f5e" />
        <text x="24" y="12" fill="#fda4af" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800">기존 단순 키워드 검색의 붕괴 확인 (98% 실패)</text>
        <text x="24" y="35" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="12.5">
          단순 CONTAINS 방식은 50개 질문 중 49개(98%)에서 정답을 찾지 못해, 일상어와 법률어 간 어휘 불일치(Vocabulary Mismatch) 해소가 필수적임이 수치로 입증되었습니다.
        </text>
      </g>

      <!-- Point 2 -->
      <g transform="translate(0, 48)">
        <circle cx="8" cy="8" r="4" fill="#38bdf8" />
        <text x="24" y="12" fill="#7dd3fc" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800">3-Tier GraphRAG 파이프라인의 압도적 우수성 입증</text>
        <text x="24" y="35" fill="#cbd5e1" font-family="'Pretendard', sans-serif" font-size="12.5">
          제안 파이프라인 적용 시 적중률(Hit Rate@3)이 <tspan fill="#34d399" font-weight="700">36.0%(18배 증가)</tspan>로 급증하고, 검색 정밀도(NDCG@3)가 <tspan fill="#38bdf8" font-weight="700">22배 폭증</tspan>하여 법률 Q&amp;A 서비스의 실효성을 명확히 검증했습니다.
        </text>
      </g>

      <!-- Point 3 -->
      <g transform="translate(0, 96)">
        <circle cx="8" cy="8" r="4" fill="#fbbf24" />
        <text x="24" y="12" fill="#fde68a" font-family="'Pretendard', sans-serif" font-size="14" font-weight="800">초저비용 상용화 가능성 확인</text>
        <text x="24" y="35" fill="#94a3b8" font-family="'Pretendard', sans-serif" font-size="12.5">
          50개 대규모 랜덤 샘플링 전체 평가 API 과금액이 <tspan fill="#34d399" font-weight="700">단 6원($0.0045)</tspan>에 불과하여 엔터프라이즈 환경에서의 상용 서비스 경제성을 완벽히 확보했습니다.
        </text>
      </g>
    </g>
  </g>

  <!-- ==================== FOOTER ==================== -->
  <g transform="translate(120, 985)">
    <text x="0" y="0" fill="#475569" font-family="'Pretendard', sans-serif" font-size="12" font-weight="500" letter-spacing="1">GraphRAG PRESENTATION | TREC IR STANDARD BENCHMARK METRICS</text>
    <text x="1680" y="0" fill="#475569" font-family="'Pretendard', sans-serif" font-size="12" font-weight="600" text-anchor="end">14 / BENCHMARK RESULTS</text>
  </g>
</svg>
