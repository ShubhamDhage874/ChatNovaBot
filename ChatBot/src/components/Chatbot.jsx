import { useState } from "react";
import axios from "axios";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;
    setMessages(prev => [...prev, { sender: "user", text: input }]);
    try {
      const res = await axios.post("http://localhost:5005/webhooks/rest/webhook", { sender: "user", message: input });
      const botMsgs = res.data.map(m => ({ sender: "bot", text: m.text }));
      setMessages(prev => [...prev, ...botMsgs]);
    } catch {
      setMessages(prev => [...prev, { sender: "bot", text: "❌ Server error" }]);
    }
    setInput("");
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-5 w-80 max-h-96 bg-white rounded-xl shadow-lg flex flex-col overflow-hidden z-50">
          <div className="flex-1 p-2 overflow-y-auto">
            {messages.map((m, i) => (
              <div key={i} className={`my-1 ${m.sender === "user" ? "text-right" : "text-left"}`}>
                <span className={`inline-block p-2 rounded-lg ${m.sender === "user" ? "bg-green-200" : "bg-gray-200"}`}>{m.text}</span>
              </div>
            ))}
          </div>
          <div className="flex p-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === "Enter" ? sendMessage() : null} className="flex-1 p-2 border rounded-lg border-gray-300 focus:border-blue-500" />
            <button onClick={sendMessage} className="ml-2 p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition">Send</button>
          </div>
        </div>
      )}
      <div className="fixed bottom-5 right-5 bg-blue-700 text-white p-4 rounded-full cursor-pointer shadow-lg" onClick={() => setOpen(!open)}>💬</div>
    </>
  );
}
