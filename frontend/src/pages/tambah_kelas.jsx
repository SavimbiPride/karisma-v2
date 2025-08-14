import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import NotifikasiCustom from '../components/NotifikasiCustom';
import { FaBackspace } from "react-icons/fa";

export default function TambahKelas() {
  const idUsers = localStorage.getItem("id_users");
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [harga, setHarga] = useState('');
  const [namaPengajar, setNamaPengajar] = useState('');
  const [fotoPengajar, setFotoPengajar] = useState('');
  const [tentangMentor, setTentangMentor] = useState('');
  const [previewFotoPengajar, setPreviewFotoPengajar] = useState('');
  const [gambarKelas, setGambarKelas] = useState('');
  const [previewGambarKelas, setPreviewGambarKelas] = useState('');
  const [tools, setTools] = useState([{ judul: '', deskripsi: '', image: null, preview: '' }]);
  const [mentors, setMentors] = useState([]);
  const [listTools, setListTools] = useState([]);
  const [selectedMentorId, setSelectedMentorId] = useState('');
  const [selectedToolIds, setSelectedToolIds] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
  const [notifSuccess, setNotifSuccess] = useState(false);
  const [notifGagal, setNotifGagal] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/list-mentor', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMentors(res.data);
      } catch (err) {
        console.error('Gagal mengambil data mentor:', err);
      }
    };

    const fetchTools = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/list-tools"); 
        setListTools(response.data);
      } catch (error) {
        console.error("Gagal ambil list tools:", error);
      }
    };

    fetchTools();
    fetchMentors();
  }, []);

  const handleMentorChange = (e) => {
    const selectedUsername = e.target.value;
    const selectedMentor = mentors.find((mentor) => mentor.username === selectedUsername);

    if (selectedMentor) {
      setNamaPengajar(selectedMentor.username);
      setFotoPengajar(selectedMentor.foto);
      setPreviewFotoPengajar(`http://localhost:5000/uploads/${selectedMentor.foto}`);
      setTentangMentor(selectedMentor.tentang);
    }
  };

  const formatRupiah = (angka) => {
    const str = angka.toString().replace(/\D/g, '');
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const parseRupiah = (str) => {
    return parseInt(str.replace(/\./g, ''), 10) || 0;
  };

  const handleHargaChange = (e) => {
    const input = e.target.value;
    const cleaned = input.replace(/\D/g, '');
    const formatted = formatRupiah(cleaned);
    setHarga(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!judul || !deskripsi || !harga || !namaPengajar || !fotoPengajar || !gambarKelas) {
      setNotifMessage('Lengkapi semua field :3');
      setNotifGagal(true);
      return;
    }

    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('deskripsi', deskripsi);
    formData.append('harga', parseRupiah(harga));
    formData.append('gambar_kelas', gambarKelas);
    formData.append('id_users', selectedMentorId ? String(selectedMentorId) : '');
    formData.append('selectedToolIds', JSON.stringify(selectedToolIds));

    try {
      await axios.post("http://localhost:5000/api/kelas", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setNotifSuccess(true);
    } catch (err) {
      console.error('Gagal:', err);
      setNotifMessage('Gagal menambahkan kelas. Coba lagi nanti.');
      setNotifGagal(true);
    }
  };

  const handleOkSuccess = () => {
    setNotifSuccess(false);
    navigate('/list_kelas');
  };

  const handleOkGagal = () => setNotifGagal(false);

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-[#0a0a57] p-8 overflow-auto text-black">
      <div className="flex items-center justify-between mt-4 mb-4">
        <h2 className="text-white text-xl font-bold">Tambah Kelas</h2>
        <button
          onClick={() => navigate('/list_kelas')}
          className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded cursor-pointer flex items-center"
        >
          <FaBackspace className="mr-2" /> Kembali
        </button>
      </div>
        <div className="bg-white p-6 rounded shadow-md">
      
          {notifSuccess && <NotifikasiCustom message="Kelas berhasil ditambahkan!" onConfirm={handleOkSuccess} singleButton />}
          {notifGagal && <NotifikasiCustom message={notifMessage} onConfirm={handleOkGagal} singleButton />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label>Judul Kelas</label>
            <input type="text" value={judul} onChange={(e) => setJudul(e.target.value)} className="border p-2 w-full rounded" />

            <label>Deskripsi Kelas</label>
            <input type="text" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} className="border p-2 w-full rounded" />

            <label>Harga Kelas</label>
            <input type="text" value={harga} onChange={handleHargaChange} className="border p-2 w-full rounded" />

            <div>
              <label>Nama Pengajar</label>
              <Select
                options={mentors.map((mentor) => ({
                  value: mentor.username,
                  label: mentor.username,
                  foto: mentor.foto,
                  tentang: mentor.tentang
                }))}
                value={
                  namaPengajar
                    ? {
                        value: namaPengajar,
                        label: namaPengajar,
                        foto: fotoPengajar,
                        tentang: tentangMentor
                      }
                    : null
                }
                onChange={(selectedOption) => {
                  if (selectedOption) {
                    const mentor = mentors.find(m => m.username === selectedOption.value);
                    setNamaPengajar(selectedOption.value);
                    setFotoPengajar(selectedOption.foto);
                    setPreviewFotoPengajar(`http://localhost:5000/uploads/${selectedOption.foto}`);
                    setTentangMentor(selectedOption.tentang);
                    if (mentor) setSelectedMentorId(mentor.id);
                  } else {
                    setNamaPengajar('');
                    setFotoPengajar('');
                    setPreviewFotoPengajar('');
                    setTentangMentor('');
                    setSelectedMentorId('');
                  }
                }}
                placeholder="Pilih Mentor..."
                isClearable
                className="text-black border rounded"
                classNamePrefix="react-select"
              />

              {namaPengajar && (
                <div className="mt-4 flex items-start gap-4 bg-gray-50 p-4 rounded border shadow-sm">
                  <img
                    src={previewFotoPengajar}
                    alt={namaPengajar}
                    className="w-20 h-20 object-cover rounded-full border"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-[#0A0A57]">{namaPengajar}</h4>
                    <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                      {tentangMentor || 'Mentor ini belum menambahkan tentang dia :3'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <label>Gambar Kelas</label>
            <input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files[0];
              setGambarKelas(file);
              setPreviewGambarKelas(URL.createObjectURL(file));
            }} className="cursor-pointer border p-2 w-full rounded" />
            {previewGambarKelas && <img src={previewGambarKelas} alt="Preview Gambar Kelas" className="w-100 h-55 object-cover rounded border mt-2" />}

            <div className="mb-4">
              <label className="block text-black font-medium mb-1">Pilih Tools</label>
              <Select
                isMulti
                options={listTools.map(tool => ({
                  value: tool.id.toString(),
                  label: tool.judul
                }))}
                value={listTools
                  .filter(tool => selectedToolIds.includes(tool.id.toString()))
                  .map(tool => ({
                    value: tool.id.toString(),
                    label: tool.judul
                  }))
                }
                onChange={(selectedOptions) => {
                  setSelectedToolIds(selectedOptions.map(opt => opt.value));
                }}
                className="text-black border rounded"
                classNamePrefix="react-select"
              />
            </div>

            {selectedToolIds.length > 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {listTools
                  .filter(tool => selectedToolIds.includes(tool.id.toString()))
                  .map((tool) => (
                    <div
                      key={tool.id}
                      className="flex items-start gap-3 p-3 border rounded shadow-sm bg-gray-50"
                    >
                      <img
                        src={`http://localhost:5000/uploads/${tool.image}`}
                        alt={tool.judul}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-[#0a0a57] font-semibold">{tool.judul}</h4>
                        <p className="text-sm text-gray-700">{tool.deskripsi}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
            <div className="flex gap-4 mt-6">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">Simpan</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
