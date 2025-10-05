import React, { useState } from "react";
import { motion } from "framer-motion";

export default function App() {
const [isAdmin, setIsAdmin] = useState(false);
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleSubmit = (e) => {
    e.preventDefault();
    alert(`${isAdmin ? "Admin" : "Student"} Login\nEmail: ${email}\nPassword: ${password}`);
};
return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
      {/* background gradient circles */}
    <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
    <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-200"></div>

    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-md bg-white/10 border border-white/30 shadow-2xl rounded-3xl p-10 w-full max-w-md relative z-10"
    >
        <h2 className="text-3xl font-extrabold text-center text-white mb-6 tracking-wide">
        {isAdmin ? "Admin Login" : "Student Login"}
        </h2>

        {/* Toggle Buttons */}
        <div className="flex justify-center mb-8 space-x-2">
        <button
            onClick={() => setIsAdmin(false)}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
            !isAdmin
                ? "bg-white/80 text-purple-700 shadow-md"
                : "bg-white/20 text-white hover:bg-white/40"
            }`}
        >
            Student
        </button>
        <button
            onClick={() => setIsAdmin(true)}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
            isAdmin
                ? "bg-white/80 text-purple-700 shadow-md"
                : "bg-white/20 text-white hover:bg-white/40"
            }`}
        >
            Admin
        </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
        <div>
            <label className="block text-white font-medium mb-1">
            Email / Username
            </label>
            <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            placeholder={isAdmin ? "Enter admin email" : "Enter student email"}
            required
            />
        </div>

        <div>
            <label className="block text-white font-medium mb-1">
            Password
            </label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                placeholder="Enter password"
                required
            />
        </div>

        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold py-3 rounded-xl shadow-lg hover:from-pink-500 hover:to-purple-400 transition-colors"
    >
            Login
        </motion.button>
        </form>

        <p className="text-center text-gray-200 text-sm mt-6">
        © {new Date().getFullYear()} Your App Name
        </p>
    </motion.div>
    </div>
);
}