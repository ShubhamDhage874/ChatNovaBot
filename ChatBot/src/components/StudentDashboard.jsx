import Card from "./Cards.jsx";

export default function StudentDashboard({ user, onLogout }) {
  const studentOptions = [
    "Ask about courses",
    "Exam timetable",
    "Fee payment",
    "Hostel info",
    "Events & Notices",
    "Contact faculty",
    "Submit documents",
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-blue-700 font-bold">
          Welcome Student, {user.email}
        </h2>
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {studentOptions.map((opt, idx) => (
          <Card key={idx} title={opt} onClick={() => alert(`${opt} clicked!`)} />
        ))}
      </div>
    </div>
  );
}
