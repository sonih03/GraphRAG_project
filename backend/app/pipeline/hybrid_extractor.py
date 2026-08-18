import re
from typing import Dict, List, Any, Set

def extract_modifications(text: str) -> List[Dict[str, str]]:
    """
    Extracts variable term replacements in mutatis mutandis clauses.
    e.g. "이 경우 '채무자'는 '해제권자'로 본다"
    """
    mods = []
    # Pattern: "X"는 "Y"로 본다 / 'X'는 'Y'로 본다
    mod_pattern = re.compile(r'["\']([^"\']+)["\']\s*(?:은|는|을|를)\s*["\']([^"\']+)["\']\s*(?:로|으로)\s*본다')
    for match in mod_pattern.finditer(text):
        mods.append({
            "original_term": match.group(1).strip(),
            "replaced_term": match.group(2).strip()
        })
    return mods

def extract_legal_relationships(
    articles: List[Dict[str, Any]],
    existing_article_ids: Set[str],
    number_to_id: Dict[str, str]
) -> Dict[str, List[Dict[str, Any]]]:
    """
    Extracts MUTATIS_MUTANDIS (준용), EXCEPTION_TO (예외), and REFERENCES (참조)
    relationships with strict ghost node prevention.
    """
    mutatis_edges: List[Dict[str, Any]] = []
    exception_edges: List[Dict[str, Any]] = []
    reference_edges: List[Dict[str, Any]] = []

    # Regex patterns for range references: 제107조 내지 제110조
    range_pattern = re.compile(r'제\s*(\d+)\s*조\s*(?:내지|부터)\s*제?\s*(\d+)\s*조')
    # Regex pattern for individual/multiple articles: 제14조, 제14조의2
    article_ref_pattern = re.compile(r'제\s*(\d+(?:의\d+)?)\s*조')

    for art in articles:
        src_id = art["id"]
        full_text = art["fullText"]
        current_base = art["number_base"]

        lines = full_text.split('\n')
        for line in lines:
            line_str = line.strip()
            if not line_str:
                continue

            is_mutatis = "준용한다" in line_str or "준용" in line_str
            is_exception = "불구하고" in line_str or "단서" in line_str or ("다만," in line_str and "그러하지 아니하다" in line_str)

            # 1. Check relative references: "전조", "전2조", "전3조"
            if "전조" in line_str and is_mutatis:
                prev_id = f"KR-CIVIL-ART-{current_base - 1}"
                if prev_id in existing_article_ids:
                    mutatis_edges.append({
                        "id": f"MUTATIS-{src_id}-{prev_id}",
                        "source_id": src_id,
                        "target_id": prev_id,
                        "type": "MUTATIS_MUTANDIS",
                        "label": "준용 규정 (Mutatis Mutandis)",
                        "color": "#10b981",
                        "description": f"{art['title']}가 전조({prev_id})의 규정을 준용함",
                        "modifications": extract_modifications(line_str),
                        "is_conditional": len(extract_modifications(line_str)) > 0
                    })

            if "전2조" in line_str or "전 2조" in line_str:
                for offset in [1, 2]:
                    target_id = f"KR-CIVIL-ART-{current_base - offset}"
                    if target_id in existing_article_ids:
                        target_list = mutatis_edges if is_mutatis else reference_edges
                        rel_type = "MUTATIS_MUTANDIS" if is_mutatis else "REFERENCES"
                        target_list.append({
                            "id": f"{rel_type}-{src_id}-{target_id}",
                            "source_id": src_id,
                            "target_id": target_id,
                            "type": rel_type,
                            "label": "준용 규정" if is_mutatis else "참조 규정",
                            "color": "#10b981" if is_mutatis else "#38bdf8",
                            "description": f"{art['title']}가 {target_id} 규정을 연계함",
                            "modifications": [],
                            "is_conditional": False
                        })

            # 2. Check "내지(乃至)" range expansions
            for r_match in range_pattern.finditer(line_str):
                start_n = int(r_match.group(1))
                end_n = int(r_match.group(2))
                if start_n < end_n and (end_n - start_n) <= 20:
                    for n in range(start_n, end_n + 1):
                        target_id = f"KR-CIVIL-ART-{n}"
                        if target_id in existing_article_ids and target_id != src_id:
                            if is_mutatis:
                                mutatis_edges.append({
                                    "id": f"MUTATIS-{src_id}-{target_id}",
                                    "source_id": src_id,
                                    "target_id": target_id,
                                    "type": "MUTATIS_MUTANDIS",
                                    "label": "준용 규정 (Mutatis Mutandis)",
                                    "color": "#10b981",
                                    "description": f"{art['title']}가 제{n}조를 준용함",
                                    "modifications": extract_modifications(line_str),
                                    "is_conditional": len(extract_modifications(line_str)) > 0
                                })
                            elif is_exception:
                                exception_edges.append({
                                    "id": f"EXCEPT-{src_id}-{target_id}",
                                    "source_id": src_id,
                                    "target_id": target_id,
                                    "type": "EXCEPTION_TO",
                                    "label": "예외 규정 (Exception)",
                                    "color": "#ef4444",
                                    "description": f"{art['title']}가 제{n}조의 예외/특칙을 규정함",
                                    "proviso_flag": True
                                })

            # 3. Check individual article references: 제XX조, 제XX조의2
            for a_match in article_ref_pattern.finditer(line_str):
                ref_str = a_match.group(1)  # e.g. "14", "14의2"
                target_id = number_to_id.get(ref_str)

                # Strict ghost node safety filter
                if target_id and target_id in existing_article_ids and target_id != src_id:
                    if is_mutatis:
                        mutatis_edges.append({
                            "id": f"MUTATIS-{src_id}-{target_id}",
                            "source_id": src_id,
                            "target_id": target_id,
                            "type": "MUTATIS_MUTANDIS",
                            "label": "준용 규정 (Mutatis Mutandis)",
                            "color": "#10b981",
                            "description": f"{art['title']}가 제{ref_str}조를 준용함",
                            "modifications": extract_modifications(line_str),
                            "is_conditional": len(extract_modifications(line_str)) > 0
                        })
                    elif is_exception:
                        exception_edges.append({
                            "id": f"EXCEPT-{src_id}-{target_id}",
                            "source_id": src_id,
                            "target_id": target_id,
                            "type": "EXCEPTION_TO",
                            "label": "예외 규정 (Exception)",
                            "color": "#ef4444",
                            "description": f"{art['title']}가 제{ref_str}조에 대한 예외/특칙을 규정함",
                            "proviso_flag": True
                        })
                    else:
                        reference_edges.append({
                            "id": f"REF-{src_id}-{target_id}",
                            "source_id": src_id,
                            "target_id": target_id,
                            "type": "REFERENCES",
                            "label": "참조 규정 (References)",
                            "color": "#38bdf8",
                            "description": f"{art['title']}가 제{ref_str}조를 참조함"
                        })

    # Deduplicate edges by (source_id, target_id, type)
    def dedupe(edge_list):
        seen = set()
        unique = []
        for e in edge_list:
            key = (e["source_id"], e["target_id"], e["type"])
            if key not in seen:
                seen.add(key)
                unique.append(e)
        return unique

    return {
        "mutatis_edges": dedupe(mutatis_edges),
        "exception_edges": dedupe(exception_edges),
        "reference_edges": dedupe(reference_edges)
    }
