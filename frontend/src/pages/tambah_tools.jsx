import React, { useState } from "react";
import { FaBackspace, FaPlus } from "react-icons/fa";
import axios from "axios";
import NotifikasiCustom from "../components/NotifikasiCustom";
import { useNavigate } from "react-router-dom";

export default function FormTools() {
  const [judulTools, setJudulTools] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [toolsImage, setToolsImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  const [notif, setNotif] = useState("");
  const [showNotif, setShowNotif] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setToolsImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("judul", judulTools);
    formData.append("deskripsi", deskripsi);
    formData.append("image", toolsImage);

    try {
      await axios.post("http://localhost:5000/api/tools", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setNotif("Tools berhasil ditambahkan!");
      setShowNotif(true);

      setJudulTools("");
      setDeskripsi("");
      setToolsImage(null);
      setPreviewImage(null);
    } catch (err) {
      console.error("Gagal upload:", err);
      setNotif("Gagal menambahkan tools.");
      setShowNotif(true);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a57] py-10 px-4 relative">
      {/* Tombol Kembali */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded cursor-pointer flex items-center"
        >
          <FaBackspace className="mr-2" /> Kembali
        </button>
      </div>

      {/* Notifikasi Custom */}
      {showNotif && notif && (
        <NotifikasiCustom
          message={notif}
          onConfirm={() => {
            setShowNotif(false);
            setNotif("");
            navigate("/list_tools");
          }}
          singleButton
        />
      )}

      {/* Form */}
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow mt-6">
        <h2 className="text-2xl font-bold mb-6 text-black">Tambah Tools</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-black font-medium mb-1">
              Judul Tools
            </label>
            <input
              type="text"
              value={judulTools}
              onChange={(e) => setJudulTools(e.target.value)}
              className="border p-2 w-full rounded"
              required
              placeholder="Masukkan Judul Tools"
            />
          </div>

          <div className="mb-4">
            <label className="block text-black font-medium mb-1">
              Deskripsi Tools
            </label>
            <input
              type="text"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="border p-2 w-full rounded"
              required
              placeholder="Masukkan Deskripsi"
            />
          </div>

          <div className="mb-6">
            <label className="block text-black font-medium mb-1">
              Gambar Tools
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border p-2 rounded bg-white text-black cursor-pointer"
              required
            />
            {previewImage && (
              <div className="mt-4 border rounded overflow-hidden w-fit">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="max-w-xs object-contain"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold cursor-pointer px-4 py-2 rounded flex items-center gap-2"
          >
            <FaPlus /> Tambah Tool
          </button>
        </form>
      </div>
    </main>
  );
}