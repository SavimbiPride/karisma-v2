import React, { useState, useEffect } from "react";
import axios from "axios";
import NotifikasiCustom from "../components/NotifikasiCustom";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const EditProfile = () => {
  const [form, setForm] = useState({
    id: "",
    username: "",
    email: "",
    alamat: "",
    domisili: "",
    tanggal_lahir: "",
    foto: "",
    password: "",
    confirmPassword: "",
  });

  const [newPhoto, setNewPhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [notifVisible, setNotifVisible] = useState(false);
  const [notifMessage, setNotifMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data;
        if (userData.tanggal_lahir) {
          userData.tanggal_lahir = userData.tanggal_lahir.split("T")[0];
        }

        setForm({ ...userData, password: "", confirmPassword: "" });
      } catch (err) {
        console.error("Gagal mengambil data user:", err);
      }
    };

    fetchUser();

    return () => {
      if (previewPhoto) {
        URL.revokeObjectURL(previewPhoto);
      }
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (previewPhoto) URL.revokeObjectURL(previewPhoto);
      setNewPhoto(file);
      setPreviewPhoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setNotifMessage("Konfirmasi password tidak cocok.");
      setNotifVisible(true);
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    if (newPhoto) formData.append("foto", newPhoto);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.foto) {
        localStorage.setItem("foto", response.data.foto);
      }

      const updatedUser = { ...form, foto: response.data.foto || form.foto };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("profileUpdated"));

      setNotifMessage("Profil berhasil diperbarui!");
    } catch (error) {
      console.error(error);
      setNotifMessage("Gagal memperbarui profil.");
    } finally {
      setNotifVisible(true);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/user/${form.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setNotifMessage("Akun berhasil dihapus.");
      setNotifVisible(true);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Gagal menghapus akun:", err);
      setNotifMessage("Terjadi kesalahan saat menghapus akun.");
      setNotifVisible(true);
    }
  };

  const navigateBack = () => {
    navigate(role === "admin" ? "/dashboard" : "/home");
  };

  const closeNotif = () => setNotifVisible(false);

  return (
    <div className="min-h-screen w-screen bg-[#0a0a57] text-white flex justify-center items-center p-6 relative">
      {notifVisible && (
        <NotifikasiCustom
          message={notifMessage}
          onConfirm={closeNotif}
          singleButton={true}
        />
      )}

      {showDeleteConfirm && (
        <NotifikasiCustom
          message="Yakin ingin menghapus akun ini?"
          onConfirm={() => {
            setShowDeleteConfirm(false);
            handleDeleteAccount();
          }}
          onCancel={() => setShowDeleteConfirm(false)}
          singleButton={false}
        />
      )}

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-white text-black p-6 rounded-lg shadow-md w-full max-w-none grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div className="flex flex-col items-center justify-center">
          <img
            src={
              previewPhoto
                ? previewPhoto
                : form.foto && form.foto.trim() !== ""
                ? `http://localhost:5000/uploads/${form.foto}`
                : "/default-avatar.png"
            }
            alt="Foto Profil"
            className="w-40 h-40 rounded-full mb-4 object-cover shadow-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-avatar.png";
            }}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="p-2 border rounded cursor-pointer w-full mb-4"
          />

          <div className="flex flex-col gap-2 w-full">
            <button
              type="submit"
              className="bg-[#0a0a57] hover:bg-blue-400 text-white px-4 py-2 rounded cursor-pointer"
            >
              Simpan Perubahan
            </button>
            <button
              type="button"
              onClick={navigateBack}
              className="bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded cursor-pointer"
            >
              Kembali ke {role === "admin" ? "Dashboard" : "Home"}
            </button>
            {role === "user" && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded cursor-pointer"
              >
                Delete This Account
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <label>Username</label>
          <input
            name="username"
            value={form.username || ""}
            onChange={handleChange}
            className="p-2 border rounded"
          />

          {role === "admin" && (
            <>
              <label>Email</label>
              <input
                name="email"
                value={form.email || ""}
                onChange={handleChange}
                className="p-2 border rounded"
              />
            </>
          )}

          <label>Alamat</label>
          <input
            name="alamat"
            value={form.alamat || ""}
            onChange={handleChange}
            className="p-2 border rounded"
          />

          <label>Domisili</label>
          <input
            name="domisili"
            value={form.domisili || ""}
            onChange={handleChange}
            className="p-2 border rounded"
          />

          <label>Tanggal Lahir</label>
          <input
            type="date"
            name="tanggal_lahir"
            value={form.tanggal_lahir || ""}
            onChange={handleChange}
            className="p-2 border rounded cursor-pointer"
          />

          <label>Password Baru</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="p-2 border rounded w-full pr-10"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <label>Konfirmasi Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="p-2 border rounded w-full pr-10"
            />
            <span
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;