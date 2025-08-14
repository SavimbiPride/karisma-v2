import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBackspace } from "react-icons/fa";

export default function FormPembayaran() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kelas, setKelas] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({
    nama: user?.username || "",
    email: user?.email || "",
    whatsapp: user?.whatsapp || "",
  });

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/kelas/${id}`);
        setKelas(res.data);
      } catch (err) {
        console.error("Gagal mengambil detail kelas:", err);
      }
    };

    fetchKelas();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/payment/create",
        {
          nama: form.nama,
          email: form.email,
          whatsapp: form.whatsapp,
          id_kelas: id,
          total_harga: kelas.harga,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      window.location.href = res.data.redirect_url;
    } catch (err) {
      console.error("Gagal membuat transaksi:", err);
      alert("Gagal memproses pembayaran.");
    }
  };

  if (!kelas) return <div className="text-white p-4">Memuat data kelas...</div>;

  return (
    <div className="min-h-screen w-full bg-[#0A0A57] p-4">
      <div className="bg-white max-w-3xl mx-auto p-8 rounded-2xl shadow-lg">
        <h2 className="text-center text-2xl font-bold text-[#0A0A57] mb-6">
          Form Pembayaran
        </h2>

        <div className="flex flex-col md:flex-row gap-6 mb-6 items-center text-black">
          <img
            src={`http://localhost:5000/uploads/${kelas.image}`}
            alt="Kelas"
            className="w-40 h-28 object-cover rounded-lg shadow-md"
          />
          <div>
            <p>
              <strong>Nama Kelas:</strong> {kelas.judul}
            </p>
            <p>
              <strong>Harga:</strong> Rp{" "}
              {Number(kelas.harga).toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <div>
            <label className="block text-sm font-semibold">Nama</label>
            <input
              type="text"
              name="nama"
              value={form.nama}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 cursor-not-allowed"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 cursor-not-allowed"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">
              Nomor WhatsApp
            </label>
            <input
              type="text"
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div className="flex justify-between items-center gap-4 pt-4">
            <button
              type="submit"
              className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded cursor-pointer"
            >
              Bayar Sekarang
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-1/2 bg-gray-300 hover:bg-gray-400 text-[#0A0A57] font-semibold py-2 rounded cursor-pointer"
            >
              <FaBackspace className="mr-2" /> Kembali
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}