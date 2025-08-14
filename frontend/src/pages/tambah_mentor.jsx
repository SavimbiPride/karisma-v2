import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NotifikasiCustom from "../components/NotifikasiCustom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function TambahMentor() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    konfirmasi: "",
    domisili: "",
    tanggal_lahir: "",
    alamat: "",
    foto: null,
  });

  const [preview, setPreview] = useState(null);
  const [showSuccessNotif, setShowSuccessNotif] = useState(false);
  const [showErrorNotif, setShowErrorNotif] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, foto: file }));
      setPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.konfirmasi) {
      setErrorMessage("Password dan konfirmasi tidak cocok");
      setShowErrorNotif(true);
      setTimeout(() => setShowErrorNotif(false), 3000);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("domisili", formData.domisili);
      data.append("tanggal_lahir", formData.tanggal_lahir);
      data.append("alamat", formData.alamat);

      if (formData.foto) {
        data.append("foto", formData.foto);
      }

      await axios.post("http://localhost:5000/api/mentor", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setShowSuccessNotif(true);
    } catch (error) {
      const msg = error.response?.data?.message;
      setErrorMessage(
        msg === "Email sudah digunakan"
          ? "Email sudah digunakan!"
          : "Gagal menambahkan mentor"
      );
      setShowErrorNotif(true);
      setTimeout(() => setShowErrorNotif(false), 3000);
    }
  };

  const handleOkSuccess = () => {
    setShowSuccessNotif(false);
    navigate("/list_mentor");
  };

  return (
    <div className="min-h-screen min-w-screen bg-[#0a0a57] flex items-center justify-center relative">
      <div className="bg-white rounded-lg p-10 shadow-md w-[900px]">
        <h2 className="text-black text-2xl font-bold text-center mb-6">
          Tambah Mentor Baru
        </h2>

        {showSuccessNotif && (
          <NotifikasiCustom
            message="Mentor berhasil ditambahkan!"
            onConfirm={handleOkSuccess}
            singleButton={true}
          />
        )}

        {showErrorNotif && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block font-semibold mb-1">Username</label>
              <input
                name="username"
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block font-semibold mb-1">Email</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2 relative">
              <label className="block font-semibold mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handleChange}
                className="w-full p-2 border rounded pr-10"
                required
              />
              <div
                className="absolute right-3 top-9 transform-translate-y-1/2 text-[#0A0A57] cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </div>
            </div>

            <div className="w-1/2 relative">
              <label className="block font-semibold mb-1">Konfirmasi</label>
              <input
                type={showConfirm ? "text" : "password"}
                name="konfirmasi"
                onChange={handleChange}
                className="w-full p-2 border rounded pr-10"
                required
              />
              <div
                className="absolute right-3 top-9 transform-translate-y-1/2 text-[#0A0A57] cursor-pointer"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block font-semibold mb-1">Domisili</label>
              <input
                name="domisili"
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="w-1/2">
              <label className="block font-semibold mb-1">Tanggal Lahir</label>
              <input
                type="date"
                name="tanggal_lahir"
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Alamat</label>
            <textarea
              name="alamat"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={3}
            ></textarea>
          </div>

          <div>
            <label className="block font-semibold mb-1">Foto Profil</label>
            <input
              type="file"
              name="foto"
              accept="image/*"
              onChange={handleChange}
              className="cursor-pointer border p-2 w-full rounded"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 w-28 h-28 rounded-full object-cover border"
              />
            )}
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded cursor-pointer"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => navigate("/list_mentor")}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>

        <img
          src="/Group 65.png"
          alt="kiri"
          className="absolute left-0 bottom-0 w-28"
        />
        <img
          src="/Group 77.png"
          alt="kanan"
          className="absolute right-0 bottom-0 w-28"
        />
      </div>
    </div>
  );
}