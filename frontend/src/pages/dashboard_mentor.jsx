import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function DashboardMentor() {
  const navigate = useNavigate();
  const [mentorName, setMentorName] = useState("");
  const [kelasData, setKelasData] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.username) {
      setMentorName(userData.username);
      fetchKelas(userData.username);
    }
  }, []);

  const fetchKelas = async (mentor) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/kelas/mentor/${mentor}`
      );
      setKelasData(res.data.kelas);
    } catch (err) {
      console.error("Gagal ambil data kelas:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { label: "Dashboard", path: "/dashboard_mentor" },
    { label: "Profile", path: "/profile_mentor" },
  ];

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
                window.location.pathname === item.path
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

      <div className="flex-1 bg-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#0A0A57]">Tugas User</h1>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-100 text-[#0A0A57] font-semibold">
              <tr>
                <th className="border px-2 py-2 text-left text-sm">No</th>
                <th className="border px-2 py-2 text-left text-sm">
                  Gambar Kelas
                </th>
                <th className="border px-3 py-2 text-left">Kelas</th>
                <th className="border px-3 py-2 text-left w-32">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {kelasData.length > 0 ? (
                kelasData.map((item, index) => (
                  <tr key={item.id} className="text-gray-700">
                    <td className="border px-2 py-1">{index + 1}</td>
                    <td className="border px-2 py-1">
                      {item.image ? (
                        <img
                          src={`http://localhost:5000/uploads/${item.image}`}
                          alt={item.nama_kelas}
                          className="h-20 w-35 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400 italic">
                          Tidak ada gambar
                        </span>
                      )}
                    </td>
                    <td className="border px-3 py-1">{item.nama_kelas}</td>
                    <td className="border px-3 py-1">
                      <button
                        onClick={() => navigate(`/sesiTugas/${item.id}`)}
                        className="bg-[#1c2ea0] text-white px-3 py-1 text-sm rounded cursor-pointer"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-3 text-gray-500">
                    Tidak ada kelas ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardMentor;