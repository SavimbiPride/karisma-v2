import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NotifikasiCustom from '../components/NotifikasiCustom';
import { FaBackspace} from "react-icons/fa";

function DetailTugasUser() {
  const { id_sesi, id_user } = useParams();
  const navigate = useNavigate();

  const [soalTugas, setSoalTugas] = useState('');
  const [filePreview, setFilePreview] = useState([]);
  const [nilai, setNilai] = useState('');
  const [komentar, setKomentar] = useState('');
  const [dataTugasAda, setDataTugasAda] = useState(false);

  const [notif, setNotif] = useState({ show: false, message: '', success: true });

useEffect(() => {
  const fetchTugasUser = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/bySesi/${id_sesi}/${id_user}`);
      const { soal_tugas, pengumpulan, nilai, komentar_mentor } = res.data;

      setSoalTugas(soal_tugas);
      setFilePreview(pengumpulan ? JSON.parse(pengumpulan) : []);
      setNilai(nilai || '');
      setKomentar(komentar_mentor || '');
      setDataTugasAda(true); 
    } catch (error) {
      setDataTugasAda(false);
      console.error('Gagal mengambil data tugas:', error);
    }
  };

  fetchTugasUser();
}, [id_sesi, id_user]);


  const handleSubmit = async () => {
    try {
      if (dataTugasAda) {
        await axios.post('http://localhost:5000/api/review', {
          id_sesi,
          id_user,
          nilai,
          komentar,
        });
      } else {
        await axios.post('http://localhost:5000/api/review-baru', {
          id_sesi,
          id_user,
          nilai,
          komentar,
        });
      }

      setNotif({
        show: true,
        message: 'Review berhasil disimpan!',
        success: true,
      });
    } catch (error) {
      console.error('Gagal menyimpan review:', error);
      setNotif({
        show: true,
        message: 'Gagal menyimpan review.',
        success: false,
      });
    }
  };


  return (
    <div className="min-h-screen min-w-screen w-full bg-[#0A0A57] p-4">
      {notif.show && (
        <NotifikasiCustom
          message={notif.message}
          onConfirm={() => {
            setNotif({ ...notif, show: false });
            if (notif.success) navigate(-1);
          }}
        />
      )}

      <div className="bg-gray-200 text-[#0A0A57] rounded-xl p-6 max-w-lg mx-auto mb-6">
        <h2 className="text-lg font-bold mb-4">Soal</h2>
        <p className="text-sm">{soalTugas || 'Memuat soal...'}</p>
      </div>

      <div className="bg-gray-200 text-[#0A0A57] rounded-xl p-6 max-w-lg mx-auto mb-6">
        <h2 className="text-lg font-bold mb-2">Preview File</h2>
        <div className="grid grid-cols-2 gap-4">
          {filePreview.length > 0 ? (
            filePreview.map((fileName, index) => {
              const fileUrl = `http://localhost:5000/uploads/tugas/${fileName}`;
              const ekstensi = fileName.split('.').pop().toLowerCase();

              const downloadButton = (
                <a
                  href={fileUrl}
                  download
                  className="mt-2 inline-block text-white bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1 rounded"
                >
                  Unduh
                </a>
              );

              if (["jpg", "jpeg", "png", "gif", "webp"].includes(ekstensi)) {
                return (
                  <div key={index} className="border rounded p-2 bg-white text-center">
                    <img src={fileUrl} alt={fileName} className="max-h-40 mx-auto rounded" />
                    <p className="text-xs mt-1 break-words">{fileName}</p>
                    {downloadButton}
                  </div>
                );
              }

              if (["mp4", "webm", "ogg"].includes(ekstensi)) {
                return (
                  <div key={index} className="border rounded p-2 bg-white text-center">
                    <video controls className="max-h-40 w-full rounded">
                      <source src={fileUrl} type={`video/${ekstensi}`} />
                    </video>
                    <p className="text-xs mt-1 break-words">{fileName}</p>
                    {downloadButton}
                  </div>
                );
              }

              if (["mp3", "wav", "ogg", "m4a", "aac", "flac"].includes(ekstensi)) {
                return (
                  <div key={index} className="border rounded p-2 bg-white text-center">
                    <audio controls className="w-full mt-2">
                      <source src={fileUrl} type={`audio/${ekstensi}`} />
                    </audio>
                    <p className="text-xs mt-1 break-words">{fileName}</p>
                    {downloadButton}
                  </div>
                );
              }

              if (ekstensi === "pdf") {
                return (
                  <div key={index} className="border rounded p-2 bg-white text-center">
                    <iframe src={fileUrl} title={`PDF-${index}`} className="w-full h-40 rounded border"></iframe>
                    <p className="text-xs mt-1 break-words">{fileName}</p>
                    {downloadButton}
                  </div>
                );
              }

              return (
                <div key={index} className="border rounded p-2 bg-white text-center">
                  <img src="/icon-file.png" alt="File" className="w-12 mx-auto mb-1" />
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline break-words text-sm"
                  >
                    {fileName}
                  </a>
                  {downloadButton}
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500">File belum tersedia.</p>
          )}
        </div>
      </div>

      <div className="bg-gray-200 text-[#0A0A57] rounded-xl p-6 max-w-lg mx-auto mb-6">
        <h2 className="text-lg font-bold mb-2">Score</h2>
        <input
          type="number"
          value={nilai}
          onChange={(e) => setNilai(e.target.value)}
          placeholder="Masukkan nilai"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none text-[#0A0A57]"
        />
      </div>

      <div className="bg-gray-200 text-[#0A0A57] rounded-xl p-6 max-w-lg mx-auto mb-6">
        <h2 className="text-lg font-bold mb-2">Komentar</h2>
        <textarea
          value={komentar}
          onChange={(e) => setKomentar(e.target.value)}
          placeholder="Komentar untuk student"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none text-[#0A0A57] resize-none"
          rows={4}
        />
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={handleSubmit}
          className="bg-[#1c2ea0] hover:bg-[#000045] px-10 py-3 rounded-lg text-white font-semibold text-base cursor-pointer"
        >
          Submit
        </button>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded cursor-pointer flex items-center"
        >
          <FaBackspace className="mr-2" /> Kembali
        </button>
      </div>
    </div>
  );
}

export default DetailTugasUser;