import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaTrash, FaBackspace } from "react-icons/fa";
import axios from "axios";
import NotifikasiCustom from "../components/NotifikasiCustom";

export default function TambahSesi() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [notif, setNotif] = useState(null);

  const [sesiList, setSesiList] = useState([
    {
      judul_sesi: "",
      topik: "",
      video: null,
      preview: "",
      tugas: { soal_tugas: "" },
      quiz: {
        soal: "",
        jawaban: ["", "", "", ""],
        benar: 0,
      },
    },
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...sesiList];
    updated[index][field] = value;
    setSesiList(updated);
  };

  const handleVideoChange = (index, file) => {
    const updated = [...sesiList];
    updated[index].video = file;
    updated[index].preview = file ? URL.createObjectURL(file) : "";
    setSesiList(updated);
  };

  const handleQuizChange = (index, qField, value, jawabanIndex = null) => {
    const updated = [...sesiList];
    if (qField === "jawaban") {
      updated[index].quiz.jawaban[jawabanIndex] = value;
    } else if (qField === "benar") {
      updated[index].quiz.benar = value;
    } else {
      updated[index].quiz[qField] = value;
    }
    setSesiList(updated);
  };

  const addFormSesi = () => {
    setSesiList([
      ...sesiList,
      {
        judul_sesi: "",
        topik: "",
        video: null,
        preview: "",
        tugas: { soal_tugas: "" },
        quiz: {
          soal: "",
          jawaban: ["", "", "", ""],
          benar: 0,
        },
      },
    ]);
  };

  const removeFormSesi = (index) => {
    const updated = [...sesiList];
    updated.splice(index, 1);
    setSesiList(updated);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("id_kelas", id);

      const sesiData = sesiList.map((sesi, index) => {
        if (sesi.video instanceof File) {
          formData.append(`sesi_video_${index}`, sesi.video);
        }

        return {
          judul_sesi: sesi.judul_sesi,
          topik: sesi.topik,
          video_field: `sesi_video_${index}`,
          tugas: sesi.tugas.soal_tugas ? [sesi.tugas] : [],
          quiz:
            sesi.quiz.soal.trim() && sesi.quiz.jawaban.some((j) => j.trim())
              ? [
                  {
                    soal: sesi.quiz.soal,
                    jawaban: sesi.quiz.jawaban.map((j, idx) => ({
                      teks: j,
                      benar: idx === sesi.quiz.benar,
                    })),
                  },
                ]
              : [],
        };
      });

      formData.append("data", JSON.stringify(sesiData));

      const response = await axios.post(
        `http://localhost:5000/api/tambah_sesi/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Sukses:", response.data);

      setNotif({
        message: "Semua sesi berhasil disubmit!",
        onConfirm: () => {
          setNotif(null);
          navigate(`/list_sesi/${id}`);
        },
      });
    } catch (err) {
      console.error("Submit error:", err);
      setNotif({
        message: "Terjadi kesalahan saat mengirim sesi.",
        onConfirm: () => setNotif(null),
      });
    }
  };

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
          <h2 className="text-white text-xl font-bold">Sesi</h2>
          <button
            type="button"
            onClick={() => navigate(`/list_sesi/${id}`)}
            className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded cursor-pointer flex items-center"
          >
            <FaBackspace className="mr-2" /> Kembali
          </button>
        </div>

        {sesiList.map((sesi, i) => (
          <form key={i} className="space-y-4 bg-white p-4 rounded shadow mb-6">
            <h3 className="text-lg font-semibold">Sesi {i + 1}</h3>

            <div>
              <label>Judul Sesi</label>
              <input
                value={sesi.judul_sesi}
                onChange={(e) => handleChange(i, "judul_sesi", e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label>Topik</label>
              <input
                value={sesi.topik}
                onChange={(e) => handleChange(i, "topik", e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label>Video</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) =>
                  handleVideoChange(i, e.target.files?.[0] ?? null)
                }
                className="border p-2 w-full rounded cursor-pointer"
                required
              />
              {sesi.preview && (
                <video
                  controls
                  src={sesi.preview}
                  className="w-100 h-50 border rounded mt-2"
                />
              )}
            </div>

            <div>
              <label>Tugas</label>
              <textarea
                value={sesi.tugas.soal_tugas}
                onChange={(e) =>
                  handleChange(i, "tugas", { soal_tugas: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label>Soal Quiz</label>
              <input
                type="text"
                value={sesi.quiz.soal}
                onChange={(e) => handleQuizChange(i, "soal", e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            {sesi.quiz.jawaban.map((jawaban, jIndex) => (
              <div key={jIndex} className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  name={`jawaban_benar_${i}`}
                  checked={sesi.quiz.benar === jIndex}
                  onChange={() => handleQuizChange(i, "benar", jIndex)}
                  className="cursor-pointer"
                />
                <input
                  type="text"
                  value={jawaban}
                  onChange={(e) =>
                    handleQuizChange(i, "jawaban", e.target.value, jIndex)
                  }
                  placeholder={`Jawaban ${jIndex + 1}`}
                  className="w-full border p-2 rounded"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => removeFormSesi(i)}
              className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-2"
            >
              <FaTrash /> Hapus Sesi
            </button>
          </form>
        ))}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={addFormSesi}
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaPlus /> Tambah Sesi
          </button>

          {sesiList.length > 0 && (
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          )}
        </div>
      </main>
    </>
  );
}