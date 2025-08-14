import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const [adminName, setAdminName] = useState("Admin");
  const [summary, setSummary] = useState({
    total_user: 0,
    total_kelas: 0,
    penghasilan: [],
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.username) {
      setAdminName(userData.username);
    }

    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/summary", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Ringkasan data:", res);
        if (res.data) {
          setSummary({
            total_user: res.data.total_user || 0,
            total_kelas: res.data.total_kelas || 0,
            penghasilan: res.data.penghasilan || [],
          });
        }
      } catch (err) {
        console.error("Gagal mengambil ringkasan data:", err);
      }
    };

    fetchSummary();
  }, []);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const penghasilanMap = summary.penghasilan.reduce((acc, item) => {
    acc[item.bulan] = item.total_penghasilan;
    return acc;
  }, {});

  const chartData = monthNames.map((name, index) => ({
    bulan: name,
    total: penghasilanMap[index + 1] || 0,
  }));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleProfile = () => navigate("/EditProfile");

  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "List kelas", path: "/list_kelas" },
    { label: "List admin", path: "/list_admin" },
    { label: "List user", path: "/list_user" },
    { label: "List mentor", path: "/list_mentor" },
    { label: "List tools", path: "/list_tools" },
  ];

  return (
    <div className="flex min-h-screen min-w-screen bg-gray-100 text-gray-900">
      <aside className="w-64 bg-[#000045] text-white flex flex-col">
        <div className="flex items-center justify-center py-6 border-b border-gray-700">
          <img src="/Logo Karisma 2.png" alt="Logo" className="h-14" />
        </div>
        <nav className="flex-grow p-6 space-y-4 text-lg">
          {menuItems.map((item) => (
            <div
              key={item.label}
              onClick={() => {
                navigate(item.path);
                setDropdownOpen(false);
              }}
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
      </aside>

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Data Summary</h1>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="font-semibold bg-[#000045] text-white px-4 py-2 rounded-2xl cursor-pointer"
            >
              {adminName}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-[#000045] border rounded-xl shadow z-20 text-white">
                <button
                  onClick={handleProfile}
                  className="w-full text-left px-4 py-2 hover:bg-white/20 cursor-pointer rounded-xl"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-white/20 text-red-300 cursor-pointer rounded-xl"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-indigo-300 text-gray-900 p-6 rounded-lg shadow">
            <div className="flex items-center gap-2">
              <span className="material-icons text-lg">info</span>
              <span className="font-bold">Total Kelas</span>
            </div>
            <p className="text-2xl mt-4 font-semibold">
              {summary.total_kelas} Kelas
            </p>
          </div>

          <div className="bg-indigo-400 text-gray-900 p-6 rounded-lg shadow">
            <div className="flex items-center gap-2">
              <span className="material-icons text-lg">info</span>
              <span className="font-bold">Total User</span>
            </div>
            <p className="text-2xl mt-4 font-semibold">
              {summary.total_user} User
            </p>
          </div>

          <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-[#0a0a57]">
              Total penghasilan per bulan
            </h2>
            <div className="max-w-screen h-[300px]">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={chartData}
                  margin={{ top: 30, right: 30, left: 20, bottom: 40 }}
                  barSize={40}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" />
                  <YAxis
                    tickFormatter={(value) => value.toLocaleString("id-ID")}
                    domain={[0, "dataMax + 1000000"]}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `Rp ${Number(value).toLocaleString("id-ID")}`,
                      "Total",
                    ]}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar dataKey="total" fill="#000045" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}