from openai import OpenAI

client = OpenAI(
    api_key="sk-96aa52da1310ab1c2ee5e2103e019465e00c54a8206ca0ee",   # ← paste your api key here
    base_url="https://api.ilmu.ai/v1"
)

response = client.chat.completions.create(
    model="glm-4.6",
    messages=[
        {
            "role": "system",
            "content": "You are a decision intelligence assistant for campus SME vendors."
        },
        {
            "role": "user",
            "content": "My campus canteen sells nasi lemak. Exam week starts in 2 days. Should I increase or decrease my rice order? Explain why with estimated cost impact in RM."
        }
    ],
    max_tokens=512,
    temperature=0.7
)

print(response.choices[0].message.content)