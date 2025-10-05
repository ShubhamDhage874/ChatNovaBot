import { useState } from "react";
import Login from "./components/Login.jsx";
import Chatbot from "./components/Chatbot.jsx";
import StudentDashboard from "./components/StudentDashboard.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (loggedUser) => {
    setUser(loggedUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {!user ? (
        // 🔹 जर user login नसेल तर Login page
        <Login onLogin={handleLogin} />
      ) : (
        // 🔹 जर user login झाला असेल तर role नुसार Dashboard
        <>
          {user.role === "admin" ? (
            <AdminDashboard user={user} onLogout={handleLogout} />
          ) : (
            <StudentDashboard user={user} onLogout={handleLogout} />
          )}

          {/* 🔹 Chatbot फक्त login नंतरच दिसेल */}
          <Chatbot />
        </>
      )}
    </div>
  );
}
