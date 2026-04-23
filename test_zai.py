import os
from openai import OpenAI
from dotenv import load_dotenv

# 1. This loads the secret key from your .env file
load_dotenv()

# 2. This grabs the key from your environment
api_key = os.getenv("ILMU_API_KEY")

# 3. This is a safety check to make sure the key was actually found
if not api_key:
    raise ValueError("API Key not found! Make sure your .env file is in the same folder.")

# 4. Initialize the client
client = OpenAI(
    api_key=api_key,
    base_url="https://api.ilmu.ai/v1"
)

def ask_glm(context, question):
    try:
        # 5. The API call
        response = client.chat.completions.create(
            model="ilmu-glm-5.1",
            messages=[
                {"role": "user", "content": context},
                {"role": "assistant", "content": "Ok, how can I help?"},
                {"role": "user", "content": question},
            ],
            max_tokens=500,
            temperature=0.7
        )
        # Return the answer text
        return response.choices[0].message.content
    except Exception as e:
        # If something goes wrong, this will tell you exactly what it is
        return f"An error occurred: {e}"

# 6. Test the function
result = ask_glm(
    context="I run a campus canteen selling nasi lemak.",
    question="Exam week in 2 days. Should I order more rice? Give RM cost impact."
)

print(result)