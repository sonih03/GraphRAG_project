import asyncio
import httpx

async def test_query(prompt: str):
    print(f"\n========================================\n[Test Query]: {prompt}")
    async with httpx.AsyncClient(timeout=45.0) as client:
        try:
            response = await client.post(
                "http://localhost:8000/api/v1/graph/query",
                json={"prompt": prompt}
            )
            if response.status_code == 200:
                data = response.json()
                print("--- Subgraph Target ID ---")
                print(data.get("target_id"))
                print("--- Traversed Nodes ---")
                nodes = [n.get("id") + " " + n.get("name", "") for n in data.get("subgraph", {}).get("nodes", [])]
                print(nodes)
                print("--- AI Answer ---")
                print(data.get("answer"))
            else:
                print(f"Error {response.status_code}: {response.text}")
        except Exception as e:
            print(f"Failed: {e}")

async def main():
    # Test 1: Legal Capacity / Limited Capacity (Part 1 General)
    await test_query("피한정후견인의 행위와 동의에 대해 설명해줘")
    # Test 2: Divorce / Marriage (Part 4 Family)
    await test_query("이혼할 때 자녀 양육비는 어떻게 청구하나요?")

if __name__ == "__main__":
    asyncio.run(main())
