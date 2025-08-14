import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaBackspace} from "react-icons/fa";
import NotifikasiCustom from "../components/NotifikasiCustom";
import { toast } from "react-toastify";

export default function EditSesi() {
  const { id, sesiId } = useParams(); 
  const navigate = useNavigate();
  const [notif, setNotif] = useState(null);
  const [sesi, setSesi] = useState(null);

    useEffect(() => {
    const fetchSesi = async () => {
        try {
        const res = await axios.get(`http://localhost:5000/api/sesi/${sesiId}`);
        const data = res.data;

        setSesi({
          ...data,
          tugas: typeof data.tugas === "object" ? data.tugas : { soal_tugas: "" },
          quiz:
            typeof data.quiz === "object"
              ? {
                  soal: data.quiz.soal ?? "",
                  jawaban: Array.isArray(data.quiz.jawaban) ? data.quiz.jawaban : [],
                }
              : { soal: "", jawaban: [] },
        });

        } catch (error) {
        console.error("Gagal fetch sesi:", error);
        toast.error("Gagal memuat data sesi.");
        }
    };
    fetchSesi();
    }, [id]);

  const handleChange = (field, value) => {
    setSesi((prev) => ({ ...prev, [field]: value }));
  };

    const handleVideoChange = (file) => {
    setSesi((prev) => ({
        ...prev,
        video: file,
        preview: file ? URL.createObjectURL(file) : null,
    }));
    };

    const handleQuizChange = (qField, value, jawabanIndex = null) => {
        const updatedQuiz = { ...sesi.quiz };

        if (qField === "jawaban") {
            updatedQuiz.jawaban = updatedQuiz.jawaban.map((j, idx) =>
            idx === jawabanIndex ? { ...j, jawaban: value } : j
            );
        } else if (qField === "benar") {
            updatedQuiz.jawaban = updatedQuiz.jawaban.map((j, idx) => ({
            ...j,
            benar: idx === value,
            }));
        } else {
            updatedQuiz[qField] = value;
        }

        setSesi((prev) => ({ ...prev, quiz: updatedQuiz }));
    };

    const handleSubmit = async () => {
    try {
        const formData = new FormData();
        formData.append("judul_sesi", sesi.judul_sesi);
        formData.append("topik", sesi.topik);

        if (sesi.video instanceof File) {
          formData.append("sesi_video", sesi.video); 
        }

        formData.append("tugas", JSON.stringify(sesi.tugas));

        const quizData = {
        soal: sesi.quiz.soal,
        jawaban: sesi.quiz.jawaban.map((j) => ({
            jawaban: j.jawaban,
            benar: j.benar,
        })),
        };

        formData.append("quiz", JSON.stringify(quizData));

        await axios.put(`http://localhost:5000/api/sesi/${sesiId}`, formData);

        setNotif({
        message: "Sesi berhasil diperbarui!",
        onConfirm: () => {
            setNotif(null);
            navigate(`/list_sesi/${id}`);
        },
        });
    } catch (err) {
        console.error("Gagal mengupdate sesi:", err);
        setNotif({
        message: "Gagal menyimpan perubahan sesi.",
        onConfirm: () => setNotif(null),
        });
    }
    };

    if (!sesi) {
    return (
        <main className="flex-1 bg-[#0a0a57] p-8 overflow-auto text-white min-h-screen min-w-screen">
        <p>Loading sesi...</p>
        </main>
    );
    }
  return (
    <>
      {notif && (
        <NotifikasiCustom
          message={notif.message}
          onConfirm={notif.onConfirm}
          singleButton
        />
      )}

      <main className="flex-1 bg-[#0a0a57] p-8 overflow-auto text-black">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-bold">Edit Sesi</h2>
          <button
            type="button"
            onClick={() => navigate(`/list_sesi/${sesi.id_kelas}`)}
            className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded cursor-pointer flex items-center"
          >
            <FaBackspace className="mr-2" /> Kembali
          </button>
        </div>

        <form className="space-y-4 bg-white p-4 rounded shadow mb-6">
          <div>
            <label>Judul Sesi</label>
            <input
              value={sesi.judul_sesi}
              onChange={(e) => handleChange("judul_sesi", e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label>Topik</label>
            <input
              value={sesi.topik}
              onChange={(e) => handleChange("topik", e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label>Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleVideoChange(e.target.files?.[0] ?? null)}
              className="border p-2 w-full rounded cursor-pointer"
            />
            {(sesi.preview || sesi.video) && (
            <video
              controls
              src={
                sesi.preview
                  ? sesi.preview
                  : `http://localhost:5000${sesi.videoUrl}`  
              }
              className="w-100 h-50 border rounded mt-2"
            />
            )}
          </div>

          <div>
            <label>Tugas</label>
            <textarea
              value={sesi.tugas?.soal_tugas ?? ""}
              onChange={(e) =>
                setSesi((prev) => ({
                  ...prev,
                  tugas: { soal_tugas: e.target.value },
                }))
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>Soal Quiz</label>
            <input
              type="text"
              value={sesi.quiz.soal ?? ""}
              onChange={(e) => handleQuizChange("soal", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          {sesi.quiz.jawaban?.map((jawaban, jIndex) => (
            <div key={jIndex} className="flex items-center gap-2 mb-2">
                <input
                type="radio"
                name="jawaban_benar"
                checked={jawaban.benar}
                onChange={() => handleQuizChange("benar", jIndex)}
                className="cursor-pointer"
                />
                <input
                type="text"
                value={jawaban.jawaban}
                onChange={(e) =>
                    handleQuizChange("jawaban", e.target.value, jIndex)
                }
                placeholder={`Jawaban ${jIndex + 1}`}
                className="w-full border p-2 rounded"
                />
            </div>
            ))}

          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Simpan Perubahan
          </button>
        </form>
      </main>
    </>
  );
}
