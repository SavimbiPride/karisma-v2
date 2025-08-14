import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaBackspace } from "react-icons/fa";

function DetailSesi() {
  const navigate = useNavigate();
  const { id_kelas } = useParams();
  const [kelas, setKelas] = useState(null);
  const [sesiData, setSesiData] = useState([]);

  useEffect(() => {
    const fetchDetailKelas = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/kelas/${id_kelas}`
        );
        setKelas(res.data);
      } catch (error) {
        console.error("Gagal mengambil detail kelas:", error);
      }
    };

    const fetchSesi = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/sesi/kelas/${id_kelas}`
        );
        setSesiData(res.data.sesi);
      } catch (error) {
        console.error("Gagal mengambil data sesi:", error);
      }
    };

    fetchDetailKelas();
    fetchSesi();
  }, [id_kelas]);

  return (
    <div className="p-4 bg-[#000045] min-h-screen min-w-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-6 text-white">
          {kelas ? `Kelas: ${kelas.judul}` : "Memuat judul kelas..."}
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded cursor-pointer flex items-center"
        >
          <FaBackspace className="mr-2" /> Kembali
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        {sesiData.map((sesi, index) => (
          <div
            key={sesi.id}
            className="bg-white p-4 rounded-md shadow border border-gray-200 w-64"
          >
            <h3 className="font-semibold text-lg mb-2">SESI {index + 1}</h3>
            <p className="text-sm mb-4 break-words">
              {sesi.topik || "Tidak ada deskripsi"}
            </p>
            <button
              className="bg-black text-white px-4 py-1 rounded text-sm hover:bg-gray-800 cursor-pointer"
              onClick={() => navigate(`/sesiTugas/${sesi.id}/listUserTugas`)}
            >
              Lihat list user
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DetailSesi;