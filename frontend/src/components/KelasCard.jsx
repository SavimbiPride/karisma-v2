import React from "react";

export default function KelasCard({ kelas }) {
  const image = kelas?.image
    ? `http://localhost:5000/uploads/${kelas.image}`
    : "https://via.placeholder.com/380x200.png/FFC300/0D285F?text=Karisma%20Academy";

  const title = kelas?.judul?.trim() || "Kursus Tanpa Judul";

  return (
    <div className="relative p-2.5 rounded-3xl bg-white/10 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="bg-white rounded-2xl flex flex-col h-full">
        <div className="relative p-4">
          <img
            src={image}
            alt={`Gambar kelas ${title}`}
            className="w-full h-48 object-cover rounded-xl"
          />
        </div>

        <div className="px-4 pb-5 pt-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        </div>
      </div>
    </div>
  );
}