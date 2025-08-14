import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaBackspace } from "react-icons/fa";
import Sertifikat from "./Sertifikat";

export default function KelasSaya() {
  const [kelasSaya, setKelasSaya] = useState([]);
  const [showSertifikatId, setShowSertifikatId] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchKelasSaya = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/payment/kelas-saya",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setKelasSaya(res.data);
      } catch (err) {
        console.error("Gagal mengambil kelas saya:", err);
      }
    };

    fetchKelasSaya();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a57] text-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kelas Saya</h1>
        <Link to="/home">
          <button className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded cursor-pointer flex items-center">
            <FaBackspace className="mr-2" /> Kembali
          </button>
        </Link>
      </div>

      {kelasSaya.length === 0 ? (
        <p className="text-white">Anda belum membeli kelas apapun.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kelasSaya.map((kelas) => (
            <div
              key={kelas.id}
              className={`${
                Math.round(kelas.progress) >= 100 ? "bg-green-200" : "bg-white"
              } text-[#0a0a57] rounded-xl p-4 shadow-md flex flex-col justify-between`}
            >
              <img
                src={`http://localhost:5000/uploads/${kelas.image}`}
                alt={kelas.judul}
                className="w-full h-48 object-cover rounded mb-3"
              />
              <div>
                <h2 className="text-xl font-semibold mb-1">{kelas.judul}</h2>
                <p className="text-sm text-gray-600 mb-2">
                  {kelas.deskripsi?.slice(0, 80)}...
                </p>

                {kelas.foto_pengajar && (
                  <div className="flex items-center gap-4 mt-6">
                    <img
                      src={`http://localhost:5000/uploads/${kelas.foto_pengajar}`}
                      alt="Foto Pengajar"
                      className="w-20 h-20 object-cover rounded-full border border-gray-300"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Diajarkan oleh</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {kelas.nama_pengajar}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-row gap-2 mt-4">
                <button
                  onClick={() => navigate(`/halaman_kelas/${kelas.id}`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Buka Kelas
                </button>

                {Math.round(kelas.progress) >= 100 && (
                  <Sertifikat
                    namaUser={user.username}
                    namaKelas={kelas.judul}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}