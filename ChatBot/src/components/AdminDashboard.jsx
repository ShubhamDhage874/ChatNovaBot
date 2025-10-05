import { useState } from "react";

export default function AdminDashboard({ user, onLogout }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("❌ Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploaded_by", user.email || "admin");

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed!");
      }

      const result = await response.json();
      setMessage(`✅ File uploaded successfully (ID: ${result.document_id})`);
      setFile(null);
    } catch (err) {
      setMessage("❌ Error uploading file: " + err.message);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-blue-700 font-bold">
          Welcome, {user.email || "Admin"}
        </h2>
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      {/* Upload Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">📤 Upload Documents</h3>
        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Upload
          </button>
        </form>
        {message && <p className="mt-3 text-sm">{message}</p>}
      </div>
    </div>
  );
}
