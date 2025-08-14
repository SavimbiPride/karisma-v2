import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { TiTick } from "react-icons/ti";
import { FaBackspace } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

export default function TugasUser() {
  const { id_user, id_sesi } = useParams();
  const navigate = useNavigate();

  const [tugas, setTugas] = useState(null);
  const [files, setFiles] = useState([]);
  const [previewURLs, setPreviewURLs] = useState([]);
  const [fileTugasList, setFileTugasList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);

  useEffect(() => {
    if (id_user && id_sesi) {
      fetchTugasData();
    }

    if (fileTugasList.length > 0) {
      setShowEditButton(true);
    }
  }, [id_user, id_sesi, fileTugasList]);

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
    setFiles(selectedFiles);
    setPreviewURLs(selectedFiles.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.warning("Mana file-nya >:(");
      return;
    }

    const formData = new FormData();
    formData.append("id_user", id_user);
    formData.append("id_sesi", id_sesi);
    files.forEach((file) => {
      formData.append("pengumpulan", file);
    });

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/tugas", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Tugas berhasil dikumpulkan!");
      setFiles([]);
      setPreviewURLs([]);
      fetchTugasData();
      setShowEditButton(true);
    } catch (err) {
      toast.error("Gagal mengumpulkan tugas.");
    } finally {
      setLoading(false);
    }
  };

  if (!tugas)
    return <p className="text-white text-center mt-10">Memuat tugas...</p>;

  return (
    <div className="min-h-screen bg-[#00003A] flex items-center justify-center p-6 text-black">
      <ToastContainer />
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl w-full space-y-6">
        <h2 className="text-2xl font-bold text-center">Tugas</h2>
        <p className="text-gray-700 text-center">{tugas.soal_tugas}</p>

        {fileTugasList.length > 0 && (
          <div>
            <p className="text-sm text-green-700 font-semibold flex items-center gap-2 mb-2">
              <TiTick /> File yang telah dikumpulkan:
            </p>
            <div className="grid grid-cols-2 gap-4">
              {fileTugasList.map((fileTugas, index) => {
                const ekstensi = fileTugas.split(".").pop().toLowerCase();
                const fileUrl = `http://localhost:5000/uploads/tugas/${fileTugas}`;

                return (
                  <div
                    key={index}
                    className="border rounded p-2 bg-gray-50 text-center relative"
                  >
                    {(() => {
                      if (
                        ["jpg", "jpeg", "png", "gif", "webp"].includes(ekstensi)
                      ) {
                        return (
                          <img
                            src={fileUrl}
                            alt="Preview"
                            className="max-h-40 mx-auto rounded"
                          />
                        );
                      }
                      if (["mp4", "webm", "ogg"].includes(ekstensi)) {
                        return (
                          <video controls className="max-h-40 w-full rounded">
                            <source src={fileUrl} type={`video/${ekstensi}`} />
                          </video>
                        );
                      }
                      if (
                        ["mp3", "wav", "ogg", "m4a", "aac", "flac"].includes(
                          ekstensi
                        )
                      ) {
                        return (
                          <audio controls className="w-full mt-2">
                            <source src={fileUrl} type={`audio/${ekstensi}`} />
                          </audio>
                        );
                      }
                      if (ekstensi === "pdf") {
                        return (
                          <iframe
                            src={fileUrl}
                            title={`PDF-${index}`}
                            className="w-full h-40 rounded border"
                          ></iframe>
                        );
                      }
                      return (
                        <div className="text-center">
                          <img
                            src="/icon-file.png"
                            alt="File"
                            className="w-12 mx-auto mb-1"
                          />
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline break-words text-sm"
                          >
                            {fileTugas}
                          </a>
                        </div>
                      );
                    })()}
                    <p className="text-xs mt-1 break-words">{fileTugas}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {fileTugasList.length === 0 ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="file"
              accept="*"
              onChange={handleFileChange}
              multiple
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            />

            {previewURLs.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {files.map((file, i) => {
                  const url = previewURLs[i];
                  if (file.type.startsWith("image/")) {
                    return (
                      <img
                        key={i}
                        src={url}
                        alt="Preview"
                        className="max-h-48 object-contain"
                      />
                    );
                  } else if (file.type.startsWith("audio/")) {
                    return (
                      <audio key={i} controls className="w-full">
                        <source src={url} type={file.type} />
                      </audio>
                    );
                  } else if (file.type.startsWith("video/")) {
                    return (
                      <video key={i} controls className="max-h-48 w-full">
                        <source src={url} type={file.type} />
                      </video>
                    );
                  } else if (file.type === "application/pdf") {
                    return (
                      <div
                        key={i}
                        className="text-red-700 flex flex-col items-center"
                      >
                        <img
                          src="/icon-pdf.png"
                          alt="PDF"
                          className="w-12 mb-1"
                        />
                        <p className="text-xs">{file.name}</p>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={i}
                        className="text-gray-700 flex flex-col items-center"
                      >
                        <img
                          src="/icon-file.png"
                          alt="File"
                          className="w-12 mb-1"
                        />
                        <p className="text-xs">{file.name}</p>
                      </div>
                    );
                  }
                })}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-800 hover:bg-indigo-900 text-white px-6 py-2 rounded"
            >
              {loading ? "Mengirim..." : "Submit"}
            </button>
          </form>
        ) : (
          showEditButton && (
            <button
              type="button"
              onClick={() => navigate(`/edit_tugas/${id_user}/${id_sesi}`)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded w-full"
            >
              Edit Tugas
            </button>
          )
        )}
        <div className="pt-2 border-t border-gray-200 mt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded cursor-pointer flex items-center"
          >
            <FaBackspace className="mr-2" /> Kembali
          </button>
        </div>
      </div>
    </div>
  );
}