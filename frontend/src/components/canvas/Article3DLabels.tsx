'use client';

import { useMemo } from 'react';
import { Html } from '@react-three/drei';
import { GraphSystemState, DynamicSubgraphData, DynamicSubgraphNode } from '@/types/graph';
import { getArticlePosition } from '@/lib/utils/math';

interface Article3DLabelsProps {
  state: GraphSystemState;
  subgraphData?: DynamicSubgraphData | null;
}

const DEFAULT_NODES: DynamicSubgraphNode[] = [
  { id: 'KR-CIVIL-ART-13', articleNumber: '제13조', title: '피한정후견인의 행위와 동의', summary: '한정후견인의 동의를 필요로 하는 행위', type: 'origin_node' },
  { id: 'KR-CIVIL-ART-14', articleNumber: '제14조', title: '한정후견종료의 심판', summary: '한정후견개시 원인 소멸 시 종료 심판', type: 'traversal_node' },
  { id: 'KR-CIVIL-ART-15', articleNumber: '제15조', title: '상대방의 확답촉구권', summary: '1개월 이상 기간 정하여 추인 여부 확답 촉구 (준용)', type: 'traversal_node' },
  { id: 'KR-CIVIL-ART-16', articleNumber: '제16조', title: '피특정후견인의 행위와 보호', summary: '일상용품 구입 등 일상생활 필요행위 예외', type: 'traversal_node' },
];

export function Article3DLabels({ state, subgraphData }: Article3DLabelsProps) {
  const isVector = state === 'STATE_VECTOR_SEARCH';

  const nodes = useMemo(() => {
    const rawNodes = subgraphData?.nodes && subgraphData.nodes.length > 0 ? subgraphData.nodes : DEFAULT_NODES;
    return rawNodes.map((node) => {
      const match = node.id.match(/(\d+)/) || (node.articleNumber && node.articleNumber.match(/(\d+)/));
      const artNum = match ? parseInt(match[1], 10) : 13;
      const posVec = getArticlePosition(artNum);

      return {
        ...node,
        position: [posVec.x, posVec.y, posVec.z] as [number, number, number],
      };
    });
  }, [subgraphData]);

  if (state !== 'STATE_GRAPH_TRAVERSAL' && state !== 'STATE_VECTOR_SEARCH') {
    return null;
  }

  return (
    <group>
      {nodes.map((node, i) => {
        const isCenter = node.type === 'origin_node' || i === 0;
        if (isVector && !isCenter) return null;

        const isException = node.id.includes('16') || node.id.includes('245') || node.title?.includes('예외') || node.title?.includes('취득시효');
        const pos = node.position || [0, 0, 0];

        // Format short, ultra-clear label titles
        let shortTitle = node.title || node.summary || '';
        if (node.id.includes('214')) shortTitle = '소유물방해제거 (철거)';
        else if (node.id.includes('213')) shortTitle = '소유물반환 (토지인도)';
        else if (node.id.includes('245')) shortTitle = '점유취득시효 (방어)';
        else if (node.id.includes('750')) shortTitle = '불법행위 (손해배상)';
        else if (node.id.includes('741')) shortTitle = '부당이득 (차임반환)';

        return (
          <group key={node.id} position={pos}>
            <Html
              center
              distanceFactor={9.5}
              position={[0, 0.12, 0]}
              className="pointer-events-none select-none"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold tracking-wide border backdrop-blur-md whitespace-nowrap shadow-2xl flex items-center gap-1.5 ${
                    isVector
                      ? 'bg-red-950/85 text-red-200 border-red-500/70 shadow-red-950/70 animate-pulse'
                      : isCenter
                      ? 'bg-cyan-950/90 text-cyan-200 border-cyan-400/90 shadow-cyan-950/90'
                      : isException
                      ? 'bg-red-950/90 text-red-200 border-red-500/90 shadow-red-950/90'
                      : 'bg-emerald-950/90 text-emerald-200 border-emerald-400/90 shadow-emerald-950/90'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span>{node.articleNumber || node.name || '조문'}</span>
                  <span className="opacity-50">•</span>
                  <span className="font-normal text-[10.5px]">{shortTitle}</span>
                </div>

                {isCenter && !isVector && (
                  <span className="mt-0.5 px-1.5 py-0.2 rounded text-[8.5px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    탐색 기점 (Origin)
                  </span>
                )}
                {isVector && (
                  <span className="mt-0.5 px-1.5 py-0.2 rounded text-[8.5px] font-mono bg-red-500/20 text-red-300 border border-red-500/40">
                    고립 청크 (Isolated)
                  </span>
                )}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
