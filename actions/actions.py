import psycopg2
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.types import DomainDict

# ✅ Rasa actions 
class ActionSearchFAQ(Action):

    def name(self) -> Text:
        return "action_search_faq"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> List[Dict[Text, Any]]:

        user_query = tracker.latest_message.get("text")

        try:
            conn = psycopg2.connect(
                dbname="universitydb",
                user="rasa_user",
                password="Shubh874",
                host="localhost",
                port="5432"
            )
            cursor = conn.cursor()

            # ✅ FAQ Query
            query = """
                SELECT question, answer
                FROM faq
                ORDER BY similarity(question, %s) DESC
                LIMIT 1;
            """
            cursor.execute(query, (user_query,))
            result = cursor.fetchone()

            if result:
                dispatcher.utter_message(text=result[1])
            else:
                dispatcher.utter_message(text="Sorry, I couldn’t find an answer for that.")

            cursor.close()
            conn.close()

        except Exception as e:
            dispatcher.utter_message(text=f"Database error: {str(e)}")

        return []
