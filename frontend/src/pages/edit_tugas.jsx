import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import NotifikasiCustom from "../components/NotifikasiCustom";

export default function EditTugas() {
  const { id_user, id_sesi } = useParams();
  const navigate = useNavigate();

  const [tugas, setTugas] = useState(null);
  const [fileTugasList, setFileTugasList] = useState([]);
  const [files, setFiles] = useState([]);
  const [previewURLs, setPreviewURLs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNotifHapusSemua, setShowNotifHapusSemua] = useState(false);

  useEffect(() => {
    if (id_user && id_sesi) {
      fetchTugasData();
    }
  }, [id_user, id_sesi]);

  const fetchTugasData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/tugas/cek/${id_user}/${id_sesi}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTugas(res.data.tugas);
      const filenames = Array.isArray(res.data.tugas?.pengumpulan)
        ? res.data.tugas.pengumpulan
        : [res.data.tugas?.pengumpulan].filter(Boolean);
      setFileTugasList(filenames);
    } catch (err) {
      toast.error("Gagal memuat data tugas");
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setFiles((prev) => [...prev, ...selectedFiles]);
    setPreviewURLs((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    const updatedPreviews = [...previewURLs];
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setFiles(updatedFiles);
    setPreviewURLs(updatedPreviews);
  };

  const removeFileTugasLama = async (filename) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/tugas/hapus-file`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { id_user, id_sesi, filename },
      });

      setFileTugasList((prev) => {
        const updated = prev.filter((f) => f !== filename);

        if (updated.length === 0) {
          hapusSeluruhRowJikaKosong();
        }

        return updated;
      });

      toast.success("File lama berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus file lama");
    }
  };

  const hapusSeluruhRowJikaKosong = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/tugas/hapus-semua`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { id_user, id_sesi },
      });

      console.log("Row tugas_user berhasil dihapus karena kosong");
    } catch (err) {
      console.warn("Tidak bisa hapus row kosong:", err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id_user", id_user);
    formData.append("id_sesi", id_sesi);
    formData.append("fileTugasList", JSON.stringify(fileTugasList));

    files.forEach((file) => {
      formData.append("pengumpulan", file);
    });

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/tugas/edit", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Tugas berhasil diperbarui!");
      setFiles([]);
      setPreviewURLs([]);
      fetchTugasData();
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      toast.error("Gagal memperbarui tugas.");
      console.error(
        "Error saat update tugas:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKonfirmasiHapus = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/tugas/hapus-semua`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { id_user, id_sesi },
      });

      toast.success("Semua file berhasil dihapus.");
      setFileTugasList([]);
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      toast.error("Gagal menghapus semua file.");
      console.error("gagal hapus semua file:", err.message);
    } finally {
      setShowNotifHapusSemua(false);
    }
  };

  const renderPreview = (filename) => {
    const url = `http://localhost:5000/uploads/tugas/${filename}`;
    const ext = filename.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
      return <img src={url} alt="img" className="max-h-40 mx-auto rounded" />;
    }
    if (["mp4", "webm", "ogg"].includes(ext)) {
      return (
        <video controls className="max-h-40 mx-auto rounded">
          <source src={url} type={`video/${ext}`} />
        </video>
      );
    }
    if (["mp3", "wav", "m4a", "aac", "flac"].includes(ext)) {
      return (
        <audio controls className="w-full mt-2">
          <source src={url} type={`audio/${ext}`} />
        </audio>
      );
    }
    if (ext === "pdf") {
      return (
        <iframe src={url} className="w-full h-40 rounded" title="PDF"></iframe>
      );
    }
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 underline"
      >
        {filename}
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-[#00003A] flex items-center justify-center p-6 text-black">
      <ToastContainer />
      {showNotifHapusSemua && (
        <NotifikasiCustom
          pesan="Yakin ingin menghapus semua file yang telah dikumpulkan?"
          jenis="warning"
          tombolDua
          onKonfirmasi={handleKonfirmasiHapus}
          onTutup={() => setShowNotifHapusSemua(false)}
        />
      )}

      <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl w-full space-y-6">
        <h2 className="text-2xl font-bold text-center">Edit Tugas</h2>
        {tugas && (
          <p className="text-gray-700 text-center">{tugas.soal_tugas}</p>
        )}

        {fileTugasList.length > 0 && (
          <div>
            <p className="text-sm text-green-700 font-semibold mb-2">
              File yang sebelumnya dikumpulkan:
            </p>
            <div className="grid grid-cols-2 gap-4">
              {fileTugasList.map((file, i) => (
                <div key={i} className="relative border p-2 bg-gray-50 rounded">
                  <button
                    type="button"
                    onClick={() => removeFileTugasLama(file)}
                    className="absolute top-1 right-1 z-10 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full hover:bg-red-700"
                  >
                    ❌
                  </button>
                  {renderPreview(file)}
                  <p className="text-xs text-center mt-1 break-words">{file}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {previewURLs.length > 0 && (
            <div>
              <p className="text-sm text-gray-700 font-semibold">File baru:</p>
              <div className="grid grid-cols-2 gap-4">
                {previewURLs.map((url, i) => {
                  const file = files[i];
                  return (
                    <div
                      key={i}
                      className="relative border p-2 bg-gray-50 rounded text-center"
                    >
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="absolute top-1 right-1 z-10 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full hover:bg-red-700"
                      >
                        ❌
                      </button>
                      {file.type.startsWith("image/") ? (
                        <img
                          src={url}
                          alt="Preview"
                          className="max-h-40 mx-auto rounded"
                        />
                      ) : file.type.startsWith("video/") ? (
                        <video controls className="max-h-40 w-full rounded">
                          <source src={url} type={file.type} />
                        </video>
                      ) : file.type.startsWith("audio/") ? (
                        <audio controls className="w-full mt-2">
                          <source src={url} type={file.type} />
                        </audio>
                      ) : file.type === "application/pdf" ? (
                        <div className="text-center">
                          <img
                            src="/icon-pdf.png"
                            alt="PDF"
                            className="w-12 mx-auto"
                          />
                          <p className="text-xs">{file.name}</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <img
                            src="/icon-file.png"
                            alt="File"
                            className="w-12 mx-auto"
                          />
                          <p className="text-xs">{file.name}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-800 hover:bg-indigo-900 text-white px-6 py-2 rounded"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>

          {fileTugasList.length > 0 && (
            <button
              type="button"
              onClick={() => setShowNotifHapusSemua(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
            >
              Hapus Semua File
            </button>
          )}
        </form>

        <div className="pt-2 border-t border-gray-200 mt-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded w-full mt-2"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}