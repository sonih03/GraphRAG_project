import asyncio
import csv
import os
import random
import sys
from google import genai
from google.genai import types as genai_types

# Ensure backend directory is in python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from evaluation.database import db
from evaluation.config import eval_settings

PROMPT_TEMPLATE = """
다음 민법 조문을 바탕으로, 법률 용어를 전혀 모르는 일반인이 지인에게 하소연하듯 물어볼 법한 1문장의 일상어 질문을 작성해 주세요.
법률 전문 용어(예: 채무불이행, 소유물방해제거, 동시이행, 제3자 등)는 절대 직접 사용하지 말고 상황과 정황 위주로 작성하십시오.

[조문 정보]
- 조문명: {title} ({name})
- 내용: {full_text}

출력 형식: 오직 질문 문장 1개만 출력할 것.
"""

CATEGORIES = [
    {"name": "민법총칙", "min": 1, "max": 184},
    {"name": "물권법", "min": 185, "max": 372},
    {"name": "채권총론", "min": 373, "max": 526},
    {"name": "채권각론", "min": 527, "max": 766},
    {"name": "친족상속법", "min": 767, "max": 1118}
]

async def generate_single_query(client, semaphore, rec, idx):
    async with semaphore:
        prompt = PROMPT_TEMPLATE.format(
            title=rec['title'],
            name=rec['name'] or "",
            full_text=rec['fullText'][:1500]
        )
        
        model_name = "gemini-3.6-flash"
        try:
            response = await client.aio.models.generate_content(
                model=model_name,
                contents=prompt,
                config=genai_types.GenerateContentConfig(temperature=0.7)
            )
            query = response.text.strip()
        except Exception as e:
            print(f"[{idx}/50] Failed with {model_name}: {e}. Retrying with gemini-2.5-flash...")
            response = await client.aio.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=genai_types.GenerateContentConfig(temperature=0.7)
            )
            query = response.text.strip()
            
        print(f"[{idx}/50] Generated: {query} -> {rec['id']} ({rec['category']})")
        return {
            "id": f"Q{idx}",
            "raw_query": query,
            "expected_article_id": rec['id'],
            "category": rec['category']
        }

async def generate_50_dataset():
    driver = db.get_neo4j_driver()
    
    all_sampled = []
    async with driver.session() as session:
        for cat in CATEGORIES:
            cypher = """
            MATCH (a:Article)
            WHERE a.number_base >= $min AND a.number_base <= $max AND (a.is_deleted = false OR a.is_deleted IS NULL)
            RETURN a.id AS id, a.title AS title, a.name AS name, a.summary AS summary, a.fullText AS fullText
            """
            res = await session.run(cypher, min=cat["min"], max=cat["max"])
            cat_articles = []
            async for record in res:
                cat_articles.append({
                    "id": record["id"],
                    "title": record["title"],
                    "name": record["name"],
                    "summary": record["summary"],
                    "fullText": record["fullText"] or "",
                    "category": cat["name"]
                })
            
            if len(cat_articles) < 10:
                print(f"Warning: Only found {len(cat_articles)} articles for category {cat['name']}")
                sampled = cat_articles
            else:
                sampled = random.sample(cat_articles, 10)
            all_sampled.extend(sampled)
            
    # Shuffle the list to mix categories
    random.shuffle(all_sampled)
    
    # Initialize genai client
    api_key = eval_settings.GEMINI_API_KEY
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set in the environment or config.")
        
    client = genai.Client(api_key=api_key)
    semaphore = asyncio.Semaphore(5) # Bounded concurrency to avoid rate limits
    
    tasks = []
    for idx, rec in enumerate(all_sampled, 1):
        tasks.append(generate_single_query(client, semaphore, rec, idx))
        
    dataset = await asyncio.gather(*tasks)
    
    # Save to CSV
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(current_dir, "benchmark_50.csv")
    
    with open(csv_path, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "raw_query", "expected_article_id", "category"])
        writer.writeheader()
        writer.writerows(dataset)
        
    print(f"Successfully created {csv_path} with {len(dataset)} entries!")

if __name__ == "__main__":
    asyncio.run(generate_50_dataset())
