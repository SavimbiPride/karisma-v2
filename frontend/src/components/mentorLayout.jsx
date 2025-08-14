import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function MentorLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/dashboard_mentor" },
    { label: "Profil", path: "/profile_mentor" },
  ];

  const mentorName =
    JSON.parse(localStorage.getItem("user"))?.username || "Mentor";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-screen font-sans relative">
      <aside className="w-64 bg-[#000045] text-white flex flex-col">
        <div className="flex items-center justify-center py-6 border-b border-gray-700">
          <img src="/Logo Karisma 2.png" alt="Logo" className="h-14" />
        </div>
        <nav className="flex-grow p-6 space-y-4 text-lg">
          {menuItems.map((item) => (
            <div
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`cursor-pointer px-4 py-2 rounded ${
                location.pathname === item.path
                  ? "bg-white text-[#000045] font-semibold"
                  : "hover:bg-white/20"
              }`}
            >
              {item.label}
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-600 text-sm">
          <p className="mb-2">
            Login sebagai: <span className="font-bold">{mentorName}</span>
          </p>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded cursor-pointer"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-gray-100 overflow-auto p-6">{children}</main>
    </div>
  );
}