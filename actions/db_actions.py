import psycopg2
from psycopg2.extras import RealDictCursor
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import re

# Database config
DB_CONFIG = {
    "dbname": "universitydb",
    "user": "rasa_user",       # 🔹 खात्री कर user आहे
    "password": "yourpassword",  # 🔹 इथे तुझा postgres password टाक
    "host": "localhost",
    "port": "5432"
}

# Database connection helper
def connect_db():
    return psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)


# 1️⃣ University Info Action
class ActionGetUniversityInfo(Action):
    def name(self):
        return "action_get_university_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: dict):

        user_msg = tracker.latest_message.get("text").lower()
        search_term = re.sub(r"tell me about|info|details", "", user_msg).strip()

        conn = connect_db()
        cur = conn.cursor()
        cur.execute("SELECT name, website, description FROM universities;")
        results = cur.fetchall()
        conn.close()

        matches = [u for u in results if search_term in u['name'].lower()]

        if matches:
            for uni in matches:
                dispatcher.utter_message(
                    text=f"🏫 {uni['name']}\n🌐 {uni['website']}\n📖 {uni['description']}"
                )
        else:
            dispatcher.utter_message(text="❌ Sorry, I couldn't find any matching university.")

        return []


# 2️⃣ Fetch Courses for a University
class ActionFetchCourses(Action):
    def name(self):
        return "action_fetch_courses"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: dict):

        university_msg = tracker.get_slot("university")
        if not university_msg:
            dispatcher.utter_message(text="Please specify the university you want courses for.")
            return []

        conn = connect_db()
        cur = conn.cursor()
        query = """
        SELECT u.name as university, c.name as course, c.fees, pl.name as program_level
        FROM courses c
        JOIN colleges col ON c.college_id = col.id
        JOIN universities u ON col.university_id = u.id
        JOIN program_levels pl ON c.program_level_id = pl.id
        WHERE LOWER(u.name) LIKE %s
        """
        cur.execute(query, (f"%{university_msg.lower()}%",))
        rows = cur.fetchall()
        conn.close()

        if rows:
            msg = ""
            for r in rows:
                msg += f"🎓 {r['course']} ({r['program_level']}) - Fees: {r['fees']}\n"
            dispatcher.utter_message(text=f"📚 Courses offered by {rows[0]['university']}:\n{msg}")
        else:
            dispatcher.utter_message(text=f"❌ No courses found for {university_msg}.")

        return []


# 3️⃣ FAQ Fetch Action
class ActionGetFAQ(Action):
    def name(self):
        return "action_get_faq"

    def run(self, dispatcher, tracker, domain):
        user_msg = tracker.latest_message.get("text")

        conn = connect_db()
        cur = conn.cursor()
        cur.execute("SELECT answer FROM faq WHERE LOWER(question) LIKE %s LIMIT 1", (f"%{user_msg.lower()}%",))
        row = cur.fetchone()
        conn.close()

        if row:
            dispatcher.utter_message(text=row["answer"])
        else:
            dispatcher.utter_message(text="❌ Sorry, I couldn't find an answer to that.")
        return []


# 4️⃣ Log Events in DB
class ActionLogEvent(Action):
    def name(self):
        return "action_log_event"

    def run(self, dispatcher, tracker, domain):
        user_msg = tracker.latest_message.get("text")
        intent_name = tracker.latest_message.get("intent", {}).get("name")

        conn = connect_db()
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO events (sender_id, type_name, intent_name, action_name, data)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (
                tracker.sender_id,
                "user",
                intent_name,
                "action_log_event",
                str({"user_msg": user_msg})
            ),
        )
        conn.commit()
        conn.close()
        return []
