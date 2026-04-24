import os
import time  # New: Needed for the delay between retries
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

class SyncBiteEngine:
    def __init__(self):
        # Added timeout=30.0 so the request fails after 30s instead of hanging
        self.client = OpenAI(
            api_key=os.getenv("ILMU_API_KEY"),
            base_url="https://api.ilmu.ai/v1",
            timeout=90.0 
        )
    
    def get_strategic_advice(self, campus_context, inventory_data, max_retries=3):
        """
        Processes campus context and inventory with auto-retry logic.
        """
        prompt = f"""
        Act as a Strategic Intelligence Officer for a campus canteen.
        Campus Context: {campus_context}
        Current Inventory: {inventory_data}
        
        Provide a response in this exact format:
        - ACTION: [Short, punchy instruction]
        - REASONING: [1-2 sentences explaining why]
        - IMPACT: [Predicted financial result]
        """
        
        # Loop for auto-retrying
        for attempt in range(max_retries):
            try:
                response = self.client.chat.completions.create(
                    model="ilmu-glm-5.1",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.5
                )
                return response.choices[0].message.content
            
            except Exception as e:
                # Check if the error is a server timeout (504)
                if "504" in str(e) or "timeout" in str(e).lower():
                    # If we still have retries left
                    if attempt < max_retries - 1:
                        wait_time = 5 * (attempt + 1) # Wait longer each time (5s, 10s...)
                        print(f"⚠️ Server busy (Attempt {attempt + 1}). Retrying in {wait_time}s...")
                        time.sleep(wait_time)
                        continue
                
                # If it's a different error or we ran out of retries
                return f"Strategic Analysis Unavailable after {max_retries} attempts: {e}"
            
    # A simple temporary mock if the API stays down
    def get_mock_advice():
        return """
        - ACTION: Launch 'Rainy Day' discount bundle for the 40 sandwiches.
        - REASONING: Classes are online, student traffic is near zero. Discounting clears stock instead of throwing it away.
        - IMPACT: Recover RM150 in revenue instead of RM200 loss.
        """

# --- Simulation Logic ---
if __name__ == "__main__":
    engine = SyncBiteEngine()
    
    # Example Simulation: The "Rainy Day" Scenario
    context = "Heavy thunderstorm warning; Sunway University moved afternoon classes online."
    inventory = "40 tuna sandwiches, expiring tonight. Cost: RM5 each."
    
    print("--- SYNCBITE AI: ANALYZING DATA... ---")
    advice = engine.get_strategic_advice(context, inventory)
    print("\n--- SYNCBITE AI: STRATEGIC DASHBOARD ---")
    print(advice)