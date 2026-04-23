from openai import OpenAI

client = OpenAI(
    api_key="sk-1ca684ac426154d52777ac0be5314cc96d2a6e05b6085efe",
    base_url="https://api.ilmu.ai/v1"
)

response = client.chat.completions.create(
    model="ilmu-glm-5.1",
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