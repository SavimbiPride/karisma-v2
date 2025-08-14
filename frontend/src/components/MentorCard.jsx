import React from "react";

export default function MentorCard({ mentor }) {
  const { foto, username, tentang } = mentor;

  return (
    <div className="relative pt-[13px] pb-4 pl-5 pr-[17px] rounded-b-3xl rounded-tr-3xl bg-white/20 backdrop-blur-sm">
      <div className="bg-white rounded-b-3xl rounded-tr-3xl p-4 flex flex-col h-full text-gray-800">
        <div className="w-full h-56 bg-gray-200 rounded-b-3xl rounded-tr-3xl mb-4 overflow-hidden">
          <img
            src={`http://localhost:5000/uploads/${
              foto || "default-avatar.png"
            }`}
            alt={username}
            className="w-full h-full object-cover rounded-2xl"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-avatar.png";
            }}
          />
        </div>

        <div className="flex items-center space-x-2 mb-1">
          <h3 className="font-bold text-lg">{username}</h3>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed flex-grow">
          {tentang}
        </p>
      </div>
    </div>
  );
}
