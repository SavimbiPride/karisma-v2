import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import NotifikasiCustom from "../components/NotifikasiCustom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ListTools() {
  const [toolsList, setToolsList] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [selectedToolId, setSelectedToolId] = useState(null);
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "List kelas", path: "/list_kelas" },
    { label: "List admin", path: "/list_admin" },
    { label: "List user", path: "/list_user" },
    { label: "List mentor", path: "/list_mentor" },
    { label: "List tools", path: "/list_tools" },
  ];

  const getTools = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/list-tools");
      setToolsList(response.data);
    } catch (error) {
      console.error("Gagal mengambil data tools:", error);
    }
  };

  useEffect(() => {
    getTools();
  }, []);

  const confirmDelete = (id) => {
    setSelectedToolId(id);
    setShowNotif(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/tools/${selectedToolId}`);
      setShowNotif(false);
      getTools();
      toast.success("Tools berhasil dihapus");
    } catch (error) {
      console.error("Gagal menghapus tools:", error);
      toast.error("Gagal menghapus tools");
    }
  };

  return (
    <div className="flex min-h-screen">
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
      </aside>

      <ToastContainer position="top-right" autoClose={3000} />

      <main className="flex-1 p-6 bg-gray-50">
        {showNotif && (
          <NotifikasiCustom
            message="Apakah Anda yakin ingin menghapus tools ini?"
            onConfirm={handleDelete}
            onCancel={() => setShowNotif(false)}
          />
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-black text-3xl font-bold">List Tools</h1>
          <button
            onClick={() => {
              localStorage.setItem("notif_tools_ditambahkan", "true");
              navigate("/tambah_tools");
            }}
            className="bg-[#000045] hover:bg-[#1a1a80] text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
          >
            <FaPlus /> Tambah Tools
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full text-sm">
            <thead className="bg-[#000045] text-white text-left">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4 w-24 text-center">Gambar</th>
                <th className="py-3 px-4 w-1/4">Judul</th>
                <th className="py-3 px-4 w-1/2">Deskripsi</th>
                <th className="py-3 px-4 w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {toolsList.map((tool, index) => (
                <tr key={tool.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 text-center">{index + 1}</td>
                  <td className="py-3 px-4 text-center">
                    <img
                      src={`http://localhost:5000/uploads/${tool.image}`}
                      alt={tool.judul}
                      className="w-14 h-14 object-cover rounded-md border mx-auto"
                    />
                  </td>
                  <td className="py-3 px-4">{tool.judul}</td>
                  <td className="py-3 px-4">{tool.deskripsi}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-3">
                      <Link to={`/edit_tools/${tool.id}`} title="Edit">
                        <button className="text-blue-600 hover:text-blue-800 cursor-pointer">
                          <FaEdit />
                        </button>
                      </Link>
                      <button
                        onClick={() => confirmDelete(tool.id)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                        title="Hapus"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {toolsList.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="py-6 text-center text-gray-500 italic"
                  >
                    Tidak ada data tools.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}