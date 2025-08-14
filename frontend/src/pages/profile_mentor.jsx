import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import NotifikasiCustom from '../components/NotifikasiCustom';
import MentorLayout from '../components/mentorLayout';

export default function EditProfileMentor() {
  const [form, setForm] = useState({
    id: '',
    username: '',
    email: '',
    alamat: '',
    domisili: '',
    tanggal_lahir: '',
    foto: '',
    tentang: '',
    password: '',
    konfirmasiPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPhoto, setNewPhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [notifVisible, setNotifVisible] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data;
        if (userData.tanggal_lahir) {
          userData.tanggal_lahir = userData.tanggal_lahir.split('T')[0];
        }

        setForm(prev => ({
          ...prev,
          ...userData,
          password: '',
          konfirmasiPassword: ''
        }));
      } catch (err) {
        console.error('Gagal mengambil data mentor:', err);
      }
    };

    fetchUser();
    return () => {
      if (previewPhoto) URL.revokeObjectURL(previewPhoto);
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

    if (form.password && form.password !== form.konfirmasiPassword) {
      setNotifMessage('Konfirmasi password tidak cocok.');
      setNotifVisible(true);
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key !== 'konfirmasiPassword') formData.append(key, value || '');
    });
    if (newPhoto) formData.append('foto', newPhoto);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `http://localhost:5000/api/mentor/${form.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const updatedUser = {
        ...form,
        foto: res.data.foto || form.foto,
        role: 'mentor',
      };

      delete updatedUser.password;
      delete updatedUser.konfirmasiPassword;

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setNotifMessage('Profil berhasil diperbarui!');
    } catch (err) {
      console.error(err);
      setNotifMessage('Gagal memperbarui profil.');
    } finally {
      setNotifVisible(true);
    }
  };

  const closeNotif = () => {
    setNotifVisible(false);
    navigate('/profile_mentor');
  };

  return (
    <MentorLayout>
      {notifVisible && (
        <NotifikasiCustom
          message={notifMessage}
          onConfirm={closeNotif}
          singleButton={true}
        />
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white text-black p-6 rounded-lg shadow-md w-full max-w-4xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-6 text-[#0A0A57] text-center">Edit Profil Mentor</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center">
            <img
              src={
                previewPhoto
                  ? previewPhoto
                  : form.foto && form.foto.trim() !== ''
                  ? `http://localhost:5000/uploads/${form.foto}`
                  : '/default-avatar.png'
              }
              alt="Foto"
              className="w-32 h-32 rounded-full object-cover mb-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-avatar.png';
              }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="border p-2 rounded w-full"
            />
            <label className="mt-4">Tentang</label>
            <textarea
              name="tentang"
              value={form.tentang || ''}
              onChange={handleChange}
              className="p-2 border rounded h-32 resize-none w-full"
            />
            <button
              type="submit"
              className="mt-6 bg-[#0A0A57] text-white px-6 py-2 rounded hover:bg-blue-500 cursor-pointer w-full"
            >
              Simpan
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <label>Username</label>
            <input name="username" value={form.username} onChange={handleChange} className="p-2 border rounded" />

            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} className="p-2 border rounded" />

            <label>Alamat</label>
            <input name="alamat" value={form.alamat} onChange={handleChange} className="p-2 border rounded" />

            <label>Domisili</label>
            <input name="domisili" value={form.domisili} onChange={handleChange} className="p-2 border rounded" />

            <label>Tanggal Lahir</label>
            <input
              type="date"
              name="tanggal_lahir"
              value={form.tanggal_lahir}
              onChange={handleChange}
              className="p-2 border rounded"
            />

            <label>Password Baru</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="p-2 border rounded w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <label>Konfirmasi Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="konfirmasiPassword"
                value={form.konfirmasiPassword}
                onChange={handleChange}
                className="p-2 border rounded w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>
      </form>
    </MentorLayout>
  );
}