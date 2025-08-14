import React, { useEffect, useState } from "react";
import { FaTrash, FaComment, FaBackspace } from "react-icons/fa";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import NotifikasiCustom from "../components/NotifikasiCustom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminKomentar() {
  const { idKelas } = useParams();
  const [listKomentar, setListKomentar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotif, setShowNotif] = useState(false);
  const [idKomentarHapus, setIdKomentarHapus] = useState(null);
  const navigate = useNavigate();

  const fetchKomentar = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/komentar/${idKelas}`
      );
      setListKomentar(res.data.rows);
    } catch (err) {
      console.error("Gagal memuat komentar:", err);
    } finally {
      setLoading(false);
    }
  };

  const konfirmasiHapus = (id) => {
    setIdKomentarHapus(id);
    setShowNotif(true);
  };

  const handleDeleteKomentar = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/komentar/${idKomentarHapus}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setListKomentar((prev) =>
        prev.filter((item) => item.id !== idKomentarHapus)
      );
      toast.success("Komentar berhasil dihapus!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Gagal menghapus komentar:", err);
      toast.error("Gagal menghapus komentar!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setShowNotif(false);
      setIdKomentarHapus(null);
    }
  };
  useEffect(() => {
    fetchKomentar();
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0a0a57] p-6 overflow-y-auto">
      <ToastContainer />
      {showNotif && (
        <NotifikasiCustom
          pesan="Yakin ingin menghapus komentar ini?"
          onKonfirmasi={handleDeleteKomentar}
          onTutup={() => setShowNotif(false)}
          tombolDua={true}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2 text-white">
          <FaComment /> Komentar User
        </h3>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded cursor-pointer flex items-center"
        >
          <FaBackspace className="mr-2" /> Kembali
        </button>
      </div>

      <div className="p-4 rounded-xl space-y-4 border border-white/20">
        {loading ? (
          <p className="text-white">Memuat komentar...</p>
        ) : !listKomentar.length ? (
          <p className="text-white text-sm">Belum ada komentar.</p>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {listKomentar.map((item) => (
              <article
                key={item.id}
                className="flex items-start gap-3 bg-white text-[#0a0a57] p-3 rounded shadow relative"
              >
                <img
                  src={`http://localhost:5000/uploads/${
                    item.foto || "default-avatar.png"
                  }`}
                  alt="avatar"
                  className="w-10 h-10 object-cover rounded-full border"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-avatar.png";
                  }}
                />
                <div className="flex-1">
                  <p className="font-semibold">{item.username}</p>
                  <p className="text-sm">{item.isi}</p>
                  {item.dibuat && (
                    <p className="text-xs text-gray-500">
                      {new Date(item.dibuat).toLocaleDateString("id-ID", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>

                <div className="absolute right-3 top-2 flex gap-2 text-sm">
                  <button
                    onClick={() => konfirmasiHapus(item.id)}
                    className="text-red-600 cursor-pointer"
                  >
                    <FaTrash />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}