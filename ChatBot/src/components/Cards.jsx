export default function Card({ title, onClick }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow hover:shadow-lg transform hover:-translate-y-1 transition cursor-pointer m-2" onClick={onClick}>
      <h3 className="font-semibold text-gray-800">{title}</h3>
    </div>
  );
}
