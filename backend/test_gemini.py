import os
from google import genai
from google.genai import types as genai_types

key = os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY') or ''
print(f'Testing key prefix: {key[:12]}...')

client = genai.Client(api_key=key)

models_to_try = ['gemini-2.0-flash', 'gemini-2.5-flash-lite', 'gemini-3.6-flash', 'gemini-2.5-flash-preview-05-20', 'gemini-1.5-flash']

for model in models_to_try:
    try:
        response = client.models.generate_content(
            model=model,
            contents='민법 제214조를 한 문장으로 요약해줘.',
            config=genai_types.GenerateContentConfig(temperature=0.1)
        )
        print(f'SUCCESS with model: {model}')
        print(response.text[:300])
        break
    except Exception as e:
        print(f'FAIL {model}: {str(e)[:150]}')
