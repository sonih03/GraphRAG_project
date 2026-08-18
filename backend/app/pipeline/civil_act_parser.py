import re
from typing import Dict, List, Any, Set, Tuple

# Mapping of unicode circle numbers to standard clause numbers
UNICODE_CIRCLE_MAP = {
    '①': 1, '②': 2, '③': 3, '④': 4, '⑤': 5,
    '⑥': 6, '⑦': 7, '⑧': 8, '⑨': 9, '⑩': 10,
    '⑪': 11, '⑫': 12, '⑬': 13, '⑭': 14, '⑮': 15,
    '⑯': 16, '⑰': 17, '⑱': 18, '⑲': 19, '⑳': 20
}

def normalize_text(text: str) -> str:
    """Normalize whitespace and line endings"""
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    # Normalize unicode special spaces
    text = re.sub(r'[\u2000-\u200B\u00A0]', ' ', text)
    return text

def parse_civil_law_text(raw_text: str) -> Dict[str, Any]:
    """
    Parses Korean Civil Act text into structured Parts, Chapters, Sections,
    Articles (with branch number defense: e.g. 제14조의2) and Clauses.
    """
    text = normalize_text(raw_text)

    parts: List[Dict[str, Any]] = []
    chapters: List[Dict[str, Any]] = []
    sections: List[Dict[str, Any]] = []
    articles: List[Dict[str, Any]] = []
    clauses: List[Dict[str, Any]] = []
    hierarchy_edges: List[Dict[str, Any]] = []

    existing_article_ids: Set[str] = set()
    article_number_to_id: Dict[str, str] = {}

    current_part: Dict[str, Any] = {"id": "KR-CIVIL-PART-1", "title": "제1편 총칙", "number": 1}
    current_chapter: Dict[str, Any] = {"id": "KR-CIVIL-CHAP-1", "title": "제1장 통칙", "number": 1}
    current_section: Dict[str, Any] = {"id": "KR-CIVIL-SEC-1", "title": "통칙", "number": 1}

    # Track hierarchy order
    parts.append(current_part)
    chapters.append(current_chapter)
    sections.append(current_section)
    hierarchy_edges.append({"parent_id": current_part["id"], "child_id": current_chapter["id"], "order": 1})
    hierarchy_edges.append({"parent_id": current_chapter["id"], "child_id": current_section["id"], "order": 1})

    # Regex for hierarchy markers
    part_pattern = re.compile(r'^\s*제\s*([0-9]+)\s*편\s+(.+)$')
    chapter_pattern = re.compile(r'^\s*제\s*([0-9]+)\s*장\s+(.+)$')
    section_pattern = re.compile(r'^\s*제\s*([0-9]+)\s*절\s+(.+)$')

    # Branch number defensive Article Regex (matches 제1조, 제14조의2, 제760조의3, etc.)
    article_start_pattern = re.compile(
        r'^\s*제\s*(\d+(?:의\d+)?)\s*조\s*(?:\(([^)]+)\))?\s*(.*)$'
    )

    lines = text.split('\n')
    current_article_lines: List[str] = []
    current_article_meta: Dict[str, Any] = {}

    def flush_current_article():
        nonlocal current_article_lines, current_article_meta
        if not current_article_meta or not current_article_lines:
            return

        full_text = '\n'.join(current_article_lines).strip()
        art_id = current_article_meta["id"]
        is_deleted = "삭제" in current_article_meta.get("name", "") or "[삭제" in full_text or "삭제 <" in full_text

        art_data = {
            "id": art_id,
            "number_str": current_article_meta["number_str"],
            "number_base": current_article_meta["number_base"],
            "number_branch": current_article_meta["number_branch"],
            "title": f"제{current_article_meta['number_str']}조",
            "name": current_article_meta["name"],
            "fullText": full_text,
            "summary": full_text[:120] + "..." if len(full_text) > 120 else full_text,
            "contextPath": f"{current_part['title']} > {current_chapter['title']} > {current_section['title']}",
            "is_deleted": is_deleted,
            "part_id": current_part["id"],
            "chapter_id": current_chapter["id"],
            "section_id": current_section["id"],
        }
        articles.append(art_data)
        existing_article_ids.add(art_id)
        article_number_to_id[current_article_meta["number_str"]] = art_id
        # Also map plain number if no branch
        if current_article_meta["number_branch"] == 0:
            article_number_to_id[str(current_article_meta["number_base"])] = art_id

        # Hierarchy edge: Section -> Article
        hierarchy_edges.append({
            "parent_id": current_section["id"],
            "child_id": art_id,
            "order": len(articles)
        })

        # Sub-chunk clauses if article has circled numbers
        has_clauses = False
        for c_char, c_num in UNICODE_CIRCLE_MAP.items():
            if c_char in full_text:
                has_clauses = True
                break

        if has_clauses:
            # Split clauses by circled numbers
            clause_splits = re.split(r'([①-⑳])', full_text)
            clause_idx = 1
            for i in range(1, len(clause_splits), 2):
                symbol = clause_splits[i]
                c_content = clause_splits[i+1].strip() if i+1 < len(clause_splits) else ""
                c_num = UNICODE_CIRCLE_MAP.get(symbol, clause_idx)
                clause_id = f"{art_id}-C{c_num}"
                clauses.append({
                    "id": clause_id,
                    "article_id": art_id,
                    "clause_num": c_num,
                    "text": f"{symbol} {c_content}",
                    "summary": c_content[:100]
                })
                hierarchy_edges.append({
                    "parent_id": art_id,
                    "child_id": clause_id,
                    "order": c_num
                })
                clause_idx += 1

        current_article_lines = []
        current_article_meta = {}

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        # Check Part
        p_match = part_pattern.match(stripped)
        if p_match:
            flush_current_article()
            p_num = int(p_match.group(1))
            current_part = {
                "id": f"KR-CIVIL-PART-{p_num}",
                "part_num": p_num,
                "title": f"제{p_num}편 {p_match.group(2).strip()}"
            }
            parts.append(current_part)
            continue

        # Check Chapter
        c_match = chapter_pattern.match(stripped)
        if c_match:
            flush_current_article()
            c_num = int(c_match.group(1))
            current_chapter = {
                "id": f"{current_part['id']}-CHAP-{c_num}",
                "chapter_num": c_num,
                "title": f"제{c_num}장 {c_match.group(2).strip()}",
                "part_id": current_part["id"]
            }
            chapters.append(current_chapter)
            hierarchy_edges.append({
                "parent_id": current_part["id"],
                "child_id": current_chapter["id"],
                "order": len(chapters)
            })
            continue

        # Check Section
        s_match = section_pattern.match(stripped)
        if s_match:
            flush_current_article()
            s_num = int(s_match.group(1))
            current_section = {
                "id": f"{current_chapter['id']}-SEC-{s_num}",
                "section_num": s_num,
                "title": f"제{s_num}절 {s_match.group(2).strip()}",
                "chapter_id": current_chapter["id"]
            }
            sections.append(current_section)
            hierarchy_edges.append({
                "parent_id": current_chapter["id"],
                "child_id": current_section["id"],
                "order": len(sections)
            })
            continue

        # Check Article
        a_match = article_start_pattern.match(stripped)
        if a_match:
            flush_current_article()
            num_str = a_match.group(1)  # e.g. "14", "14의2"
            title_name = (a_match.group(2) or "").strip()
            body_first_line = (a_match.group(3) or "").strip()

            # Parse base and branch number
            if '의' in num_str:
                parts_num = num_str.split('의')
                base_num = int(parts_num[0])
                branch_num = int(parts_num[1])
                clean_id = f"KR-CIVIL-ART-{base_num}-{branch_num}"
            else:
                base_num = int(num_str)
                branch_num = 0
                clean_id = f"KR-CIVIL-ART-{base_num}"

            current_article_meta = {
                "id": clean_id,
                "number_str": num_str,
                "number_base": base_num,
                "number_branch": branch_num,
                "name": title_name
            }
            if body_first_line:
                current_article_lines.append(body_first_line)
            continue

        # Accumulate article content line
        if current_article_meta:
            current_article_lines.append(stripped)

    # Flush last article
    flush_current_article()

    return {
        "parts": parts,
        "chapters": chapters,
        "sections": sections,
        "articles": articles,
        "clauses": clauses,
        "hierarchy_edges": hierarchy_edges,
        "existing_article_ids": existing_article_ids,
        "article_number_to_id": article_number_to_id,
        "total_articles": len(articles),
        "total_clauses": len(clauses)
    }
