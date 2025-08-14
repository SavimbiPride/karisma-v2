import React, { useEffect, useState } from "react";
import {
  FaComment,
  FaTools,
  FaBookOpen,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaBackspace,
} from "react-icons/fa";
import { GiPlagueDoctorProfile } from "react-icons/gi";
import { TiTick } from "react-icons/ti";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function DetailKelasUser() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [kelas, setKelas] = useState(null);
  const [openSesi, setOpenSesi] = useState({});
  const [komentarInput, setKomentarInput] = useState("");
  const [listKomentar, setListKomentar] = useState([]);
  const [editingKomentar, setEditingKomentar] = useState(null);
  const [editedIsi, setEditedIsi] = useState("");
  const [berhasilKomentar, setBerhasilKomentar] = useState(false);
  const [sudahDibeli, setSudahDibeli] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/kelas/${id}`);
        setKelas(res.data);
      } catch (err) {
        console.error("Gagal mengambil detail kelas:", err);
      }
    };

    const fetchKomentar = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/komentar/${id}`);
        setListKomentar(res.data.rows);
      } catch (err) {
        console.error("Gagal mengambil komentar:", err);
      }
    };

    const cekPembelian = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/payment/cek-status/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data?.status === "berhasil") {
          setSudahDibeli(true);
        }
      } catch (err) {
        console.error("Gagal cek status pembelian:", err);
      }
    };

    fetchKelas();
    fetchKomentar();
    cekPembelian();

    if (location.pathname.includes("detail_kelas_beli")) {
      cekPembelian();
    }
  }, [id]);

  const toggleSesi = (sesiId) => {
    setOpenSesi((prev) => ({ ...prev, [sesiId]: !prev[sesiId] }));
  };

  const handlePostKomentar = async () => {
    if (!komentarInput.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("Silakan login terlebih dahulu.");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/komentar",
        { id_kelas: id, isi: komentarInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200 || res.status === 201) {
        const newComment = {
          id: res.data.id || tempId,
          isi: res.data.isi || komentarInput,
          username: user.username,
          foto: user.foto,
          dibuat: res.data.dibuat || new Date().toISOString(),
        };

        setListKomentar((prev) => [newComment, ...prev]);
        setKomentarInput("");
        toast.success("Berhasil post komentar :3", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        throw new Error("Respon komentar tidak valid");
      }
    } catch (err) {
      toast.error("Gagal kirim komentar");
      console.error(err);
    }
  };

  const handleEdit = (komentar) => {
    setEditingKomentar(komentar.id);
    setEditedIsi(komentar.isi);
  };

  const handleSaveEdit = async (idKomentar) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/komentar/${idKomentar}`,
        { isi: editedIsi },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setListKomentar((prev) =>
        prev.map((item) =>
          item.id === idKomentar ? { ...item, isi: editedIsi } : item
        )
      );
      setEditingKomentar(null);
      setEditedIsi("");
    } catch (err) {
      console.error("Gagal update komentar:", err);
      alert("Gagal mengedit komentar.");
    }
  };

  const handleDeleteKomentar = async (idKomentar) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/komentar/${idKomentar}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListKomentar((prev) => prev.filter((item) => item.id !== idKomentar));
    } catch (err) {
      console.error("Gagal hapus komentar:", err);
      alert("Gagal menghapus komentar.");
    }
  };

  if (!kelas) return <p className="text-white p-4">Memuat data kelas...</p>;

  return (
    <main className="relative min-h-screen bg-[#0a0a57] py-10 px-4 text-white">
      <Link to={`/daftar_kelas`}>
        <button className="sticky top-4 ml-auto bg-gray-300 hover:bg-gray-400 text-black px-6 py-2 rounded-lg cursor-pointer transition flex items-center">
          <FaBackspace className="mr-2" /> Kembali
        </button>
      </Link>
      <div className="max-w-5xl mx-auto bg-white text-[#0a0a57] p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          {kelas.judul}
        </h1>
        <div className="grid md:grid-cols-2 gap-6 items-start mb-8">
          <img
            src={`http://localhost:5000/uploads/${kelas.image}`}
            alt="gambar kelas"
            className="w-full rounded-xl object-cover shadow-md"
          />
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold mb-1">Deskripsi</h3>
              <p className="text-sm text-gray-700">{kelas.deskripsi}</p>
            </div>

            <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
              <GiPlagueDoctorProfile /> Profil Instruktur
            </h3>
            <div className="mt-4 flex items-start gap-4 bg-gray-50 p-4 rounded-lg shadow-sm">
              {kelas.foto_pengajar_url && (
                <img
                  src={kelas.foto_pengajar_url}
                  alt="Foto Pengajar"
                  className="w-24 h-24 rounded-full object-cover border"
                />
              )}
              <div>
                <p className="text-sm text-gray-600">Pengajar</p>
                <p className="text-lg font-semibold text-[#0a0a57]">
                  {kelas.nama_pengajar}
                </p>

                {kelas.tentang_mentor && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 font-medium">
                      Tentang Mentor
                    </p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {kelas.tentang_mentor}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {!sudahDibeli ? (
              <button
                onClick={() => navigate(`/pembelianKelas/${kelas.id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition cursor-pointer"
              >
                Beli, Rp {Number(kelas.harga).toLocaleString("id-ID")}
              </button>
            ) : (
              <div className="flex items-center gap-2 text-green-600 font-semibold border border-green-600 rounded px-4 py-2 w-fit">
                <TiTick className="text-xl" />
                <span>Anda sudah membeli kelas ini</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <FaTools /> TOOLS
          </h2>
          {kelas.tools?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {kelas.tools.map((tool) => (
                <div
                  key={tool.id}
                  className="flex gap-4 bg-[#eef2ff] p-4 rounded-lg shadow"
                >
                  {tool.image ? (
                    <img
                      src={`http://localhost:5000/uploads/${tool.image}`}
                      alt={tool.judul}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center text-xs text-gray-500">
                      No Image
                    </div>
                  )}
                  <div>
                    <p className="font-bold">{tool.judul}</p>
                    <p className="text-sm text-gray-600">{tool.deskripsi}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Tidak ada tools</p>
          )}
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <FaBookOpen /> SESI
          </h2>
          {kelas.sesi?.length > 0 ? (
            kelas.sesi.map((sesi, index) => (
              <div
                key={sesi.id}
                className="bg-[#eef2ff] rounded-xl mb-4 shadow-md"
              >
                <button
                  onClick={() => toggleSesi(sesi.id)}
                  className="w-full text-left px-4 py-3 font-semibold flex justify-between items-center cursor-pointer"
                >
                  <span>
                    {index + 1}. {sesi.judul_sesi}
                  </span>
                  <span>{openSesi[sesi.id] ? "▲" : "▼"}</span>
                </button>
                {openSesi[sesi.id] && (
                  <div className="px-4 pb-4 text-sm text-gray-700">
                    {sesi.topik}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Belum ada sesi.</p>
          )}
        </div>

        {sudahDibeli && (
          <div className="mt-10">
            <h3 className="text-lg font-bold gap-2 flex items-center mb-3">
              <FaComment /> Ulasan
            </h3>

            <div className="bg-blue-700 p-4 rounded-xl space-y-4">
              <div className="flex overflow-hidden rounded-md bg-white w-full">
                <textarea
                  className="flex-1 p-2 text-sm focus:outline-none"
                  placeholder="Add a comment..."
                  value={komentarInput}
                  onChange={(e) => setKomentarInput(e.target.value)}
                />
                <button
                  onClick={handlePostKomentar}
                  className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-5 font-semibold cursor-pointer"
                >
                  Post
                </button>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {!listKomentar.length ? (
                  <p className="text-white text-sm">Belum ada komentar.</p>
                ) : (
                  listKomentar.map((item) => (
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
                        {editingKomentar === item.id ? (
                          <>
                            <textarea
                              className="w-full text-sm border rounded p-1"
                              value={editedIsi}
                              onChange={(e) => setEditedIsi(e.target.value)}
                            />
                            <div className="flex gap-2 mt-1">
                              <button
                                onClick={() => handleSaveEdit(item.id)}
                                className="text-green-700 cursor-pointer"
                              >
                                <FaSave />
                              </button>
                              <button
                                onClick={() => setEditingKomentar(null)}
                                className="text-red-700 cursor-pointer"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-sm">{item.isi}</p>
                            {item.dibuat && (
                              <p className="text-xs text-gray-500">
                                {new Date(item.dibuat).toLocaleDateString(
                                  "id-ID",
                                  {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                            )}
                          </>
                        )}
                      </div>

                      {user?.username === item.username &&
                        editingKomentar !== item.id && (
                          <div className="absolute right-3 top-2 flex gap-2 text-sm">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-blue-600 cursor-pointer"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteKomentar(item.id)}
                              className="text-red-600 cursor-pointer"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        )}
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </main>
  );
}