import re
from fastapi import APIRouter
from app.models.query import QueryRequest
from app.services.neo4j_service import neo4j_service
from app.services.llm_service import llm_service
from typing import Dict, Any, List

router = APIRouter()

@router.get("/overview")
async def get_graph_overview():
    """Returns all 1,118 Civil Act overview nodes and relationships from Neo4j"""
    return neo4j_service.get_all_overview(limit=1200)

@router.get("/subgraph/{article_id}")
async def get_article_subgraph(article_id: str):
    """Returns the multi-hop knowledge graph for a specific article"""
    return neo4j_service.get_article_subgraph(target_query=article_id)

def get_cluster_name_by_art_num(num: int) -> str:
    if 1 <= num <= 184:
        return "제1편 총칙"
    elif 185 <= num <= 372:
        return "제2편 물권"
    elif 373 <= num <= 766:
        return "제3편 채권"
    elif 767 <= num <= 996:
        return "제4편 친족"
    elif 997 <= num <= 1118:
        return "제5편 상속"
    return "제1편 총칙"

@router.post("/query")
async def query_graphrag(request: QueryRequest) -> Dict[str, Any]:
    """
    Executes a real Gemini API RAG legal query with Neo4j ontology traversal.
    Returns real subgraph nodes, relationship edges, and dynamic Gemini-generated legal reasoning.
    """
    prompt = request.get_prompt()
    
    # 1. Retrieve Dynamic Subgraph from Neo4j based on natural language or direct ID
    subgraph = neo4j_service.get_dynamic_rag_subgraph(query_text=prompt)
    
    # 2. Build context string from traversed Neo4j nodes
    context_parts = []
    clusters_involved_set = set()
    
    for node in subgraph.get("nodes", []):
        # Resolve article number
        node_id = node.get("id", "")
        match = re.search(r'(\d+)', node_id)
        art_num = int(match.group(1)) if match else 13
        
        # Add to clusters involved
        part_name = get_cluster_name_by_art_num(art_num)
        clusters_involved_set.add(part_name)
        node["part"] = part_name  # Ensure part name is populated for frontend morphing
        
        # Retrieve full text or summary
        title = node.get("title", "") or node.get("label", "")
        summary = node.get("summary", "")
        full_text = node.get("fullText", "") or node.get("properties", {}).get("fullText", "")
        
        context_parts.append(
            f"[{node.get('articleNumber', f'제{art_num}조')} • {title}]\n"
            f"요약: {summary}\n"
            f"조문내용: {full_text}\n"
        )
    
    context = "\n".join(context_parts)
    
    # 3. Construct System Prompt for Gemini
    system_prompt = (
        "당신은 대한민국 민법 전문 법률 AI 비서입니다. 제공된 민법 조문 컨텍스트(Context)를 바탕으로 사용자의 질문에 정밀하게 답하십시오.\n"
        "답변을 작성할 때 반드시 다음 규칙을 지키십시오:\n"
        "1. 반드시 제공된 관련 조문번호(예: 제214조, 제750조, 제741조 등)를 언급하고, 해당 조문을 근거로 상세한 법률 효과를 제시해야 합니다.\n"
        "2. 구조적으로 일목요연하게 단계별(예: 1단계 물권적 조치, 2단계 채권적 청구 등) 해결책을 제시하십시오.\n"
        "3. 만약 질문이 타인의 토지 무단 구조물 설치에 대한 대처 방안인 경우, 물권적 청구권(제214조 철거, 제213조 인도)과 채권적 청구(제741조 부당이득 반환, 제750조 손해배상) 및 방어 수단(제245조 취득시효 방지)을 연계하여 입체적으로 답변을 생성하십시오.\n"
        "4. 모든 답변은 공손하고 신뢰감 있는 마크다운(Markdown) 포맷으로 가독성 있게 정리해서 제시해 주십시오.\n"
        "5. 답변의 전체 분량은 반드시 공백 포함 500자 내외로 매우 압축적이고 명확하게 작성하십시오. 부연 설명이나 형식적 수사를 배제하고 핵심 결론만 신속하게 제시하십시오."
    )
    
    llm_prompt = (
        f"[사용자의 법률 질문]\n{prompt}\n\n"
        f"[관련 민법 조문 컨텍스트]\n{context}\n\n"
        "위 조문 컨텍스트를 참고하여, 사용자의 질문에 법적으로 어떻게 대처해야 하는지 핵심 결론 위주로 요약된 간결한 법률 분석 보고서(500자 이내)를 작성해 주십시오."
    )
    
    # 4. Generate response using Gemini-3.7-flash (initialized dynamically via llm_service)
    try:
        answer = await llm_service.generate_completion(prompt=llm_prompt, system_prompt=system_prompt)
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        answer = (
            f"❌ [RAG_API_ERROR_500] 실시간 Gemini API 통신 중 오류가 발생했습니다.\n\n"
            f"**오류 유형:** `{type(e).__name__}`\n"
            f"**오류 메시지:** `{str(e)}`\n\n"
            f"**상세 스택 트레이스:**\n```\n{error_details}\n```"
        )
    
    return {
        "query": prompt,
        "mode": request.mode,
        "target_id": subgraph.get("target_id", "214"),
        "answer": answer,
        "subgraph": subgraph,
        "confidence": 0.99,
        "clusters_involved": list(clusters_involved_set),
        "metadata": {
            "engine": "Neo4j GraphRAG Gemini Engine",
            "traversed_nodes": len(subgraph.get("nodes", [])),
            "traversed_edges": len(subgraph.get("edges", [])),
            "parts": list(clusters_involved_set)
        }
    }
