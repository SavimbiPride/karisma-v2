import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaBackspace } from "react-icons/fa";
import NotifikasiCustom from "../components/NotifikasiCustom";
import { toast, ToastContainer } from "react-toastify";

export default function ListSesi() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sesiList, setSesiList] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [sesiToDelete, setSesiToDelete] = useState(null);

  useEffect(() => {
    const fetchSesi = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/kelas/${id}/sesi`
        );
        setSesiList(res.data);
      } catch (err) {
        console.error("Gagal mengambil data sesi:", err);
      }
    };

    fetchSesi();
  }, [id]);

  const handleDeleteClick = (sesi) => {
    setSesiToDelete(sesi);
    setShowNotif(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/sesi/${sesiToDelete.id}`);
      setSesiList(sesiList.filter((s) => s.id !== sesiToDelete.id));

      toast.success(`Sesi "${sesiToDelete.judul_sesi}" berhasil dihapus!`);
    } catch (err) {
      console.error("Gagal menghapus sesi:", err);
      toast.error("Gagal menghapus sesi.");
    } finally {
      setShowNotif(false);
      setSesiToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowNotif(false);
    setSesiToDelete(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a57] p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Daftar Sesi Kelas</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/list_kelas")}
            className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded cursor-pointer flex items-center"
          >
            <FaBackspace className="mr-2" /> Kembali
          </button>
          <button
            onClick={() => navigate(`/tambah_sesi/${id}`)}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded shadow flex items-center gap-2"
          >
            <FaPlus /> Tambah Sesi
          </button>
        </div>
      </div>

      {showNotif && (
        <NotifikasiCustom
          message={`Yakin ingin menghapus sesi "${sesiToDelete?.judul_sesi}"?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} pauseOnHover />

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full text-sm text-center">
          <thead className="bg-[#000045] text-white">
            <tr>
              <th className="py-2 px-4">No</th>
              <th className="py-2 px-4">Judul Sesi</th>
              <th className="py-2 px-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sesiList.length > 0 ? (
              sesiList.map((sesi, index) => (
                <tr
                  key={sesi.id}
                  className="text-black border-b hover:bg-gray-100"
                >
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{sesi.judul_sesi}</td>
                  <td className="py-2 px-4 flex justify-center gap-3">
                    <button
                      onClick={() => navigate(`/edit_sesi/${id}/${sesi.id}`)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(sesi)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-4 text-gray-500">
                  Belum ada sesi untuk kelas ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}