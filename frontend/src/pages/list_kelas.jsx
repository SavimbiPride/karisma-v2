import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaEdit, FaComment } from "react-icons/fa";
import NotifikasiCustom from "../components/NotifikasiCustom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ListKelas() {
  const [kelasList, setKelasList] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [kelasToDelete, setKelasToDelete] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(kelasList.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentKelas = kelasList.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/list-kelas");
        setKelasList(res.data);
      } catch (err) {
        console.error("Gagal mengambil data kelas:", err);
      }
    };

    fetchKelas();
  }, []);

  const handleDeleteClick = (kelas) => {
    setKelasToDelete(kelas);
    setShowNotif(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/kelas/${kelasToDelete.id}`);
      setKelasList(kelasList.filter((k) => k.id !== kelasToDelete.id));
      setShowNotif(false);
      setKelasToDelete(null);

      toast.success(`Kelas "${kelasToDelete.judul}" berhasil dihapus`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } catch (err) {
      console.error("Gagal menghapus kelas:", err);
      setShowNotif(false);
    }
  };

  const cancelDelete = () => {
    setShowNotif(false);
    setKelasToDelete(null);
  };

  const formatHarga = (harga) => {
    return parseInt(harga).toLocaleString("id-ID");
  };

  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "List kelas", path: "/list_kelas" },
    { label: "List admin", path: "/list_admin" },
    { label: "List user", path: "/list_user" },
    { label: "List mentor", path: "/list_mentor" },
    { label: "List tools", path: "/list_tools" },
  ];

  return (
    <div className="flex min-h-screen min-w-screen">
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

      <main className="flex-1 bg-gray-100 p-8 overflow-auto relative">
        {showNotif && (
          <NotifikasiCustom
            message={`Yakin ingin menghapus kelas "${kelasToDelete?.judul}"?`}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}

        <ToastContainer />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-black text-3xl font-bold">Manajemen Kelas</h1>
          <button
            onClick={() => navigate("/tambah_kelas")}
            className="bg-[#000045] hover:bg-[#1a1a80] text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
          >
            <FaPlus /> Tambah Kelas
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentKelas.length > 0 ? (
            currentKelas.map((kelas) => (
              <div
                key={kelas.id}
                className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col"
              >
                <img
                  src={`http://localhost:5000/uploads/${kelas.image}`}
                  alt={kelas.judul}
                  className="w-full h-40 object-cover"
                />

                <div className="p-4 flex flex-col justify-between flex-1">
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-[#000045]">
                      {kelas.judul}
                    </h2>
                    <p className="text-gray-700">
                      Harga: <strong>Rp {formatHarga(kelas.harga)}</strong>
                    </p>
                    <p className="text-gray-600 text-sm">
                      Jumlah Mengikuti: {kelas.jumlahUserMengikuti || 0}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-2">
                      <button
                        onClick={() => navigate(`/detail_kelas/${kelas.id}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded cursor-pointer"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => navigate(`/list_sesi/${kelas.id}`)}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-1 rounded cursor-pointer"
                      >
                        List Sesi
                      </button>
                      <button
                        onClick={() => navigate(`/komentar/${kelas.id}`)}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded flex items-center gap-1 cursor-pointer"
                      >
                        <FaComment /> Komentar
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      onClick={() => navigate(`/edit_kelas/${kelas.id}`)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white text-sm px-3 py-1 rounded cursor-pointer"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(kelas)}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded cursor-pointer"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500 py-6">
              Tidak ada data kelas.
            </p>
          )}
        </div>

        <div className="flex justify-end mt-6 pr-1 text-sm">
          <div className="flex items-center gap-2">
            <span
              className={`text-black font-semibold cursor-pointer ${
                currentPage === 1 ? "opacity-50 pointer-events-none" : ""
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              &lt;
            </span>

            {Array.from({ length: totalPages }, (_, i) => (
              <span
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-2 py-1 rounded cursor-pointer ${
                  currentPage === i + 1
                    ? "bg-[#000045] text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </span>
            ))}

            <span
              className={`text-black font-semibold cursor-pointer ${
                currentPage === totalPages
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              &gt;
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}