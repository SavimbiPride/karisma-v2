import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaBackspace } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HalamanKelas() {
  const { id } = useParams();
  const [kelas, setKelas] = useState(null);
  const [sesiAktif, setSesiAktif] = useState(0);
  const [progress, setProgress] = useState(0);
  const [jawabanDipilih, setJawabanDipilih] = useState(null);
  const [jawabanBenar, setJawabanBenar] = useState(null);
  const [jawabanPerSesi, setJawabanPerSesi] = useState({});
  const [userId, setUserId] = useState(null);
  const [submittedSessions, setSubmittedSessions] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [quizTerjawab, setQuizTerjawab] = useState(null);
  const [nilai, setNilai] = useState(null);
  const [reviewMentor, setReviewMentor] = useState(null);
  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    }

    if (location.state?.fromKelas) {
      setRefreshTrigger((prev) => !prev);
    }

    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem("token");
        const payload = JSON.parse(atob(token.split(".")[1]));

        const res = await axios.get(`http://localhost:5000/api/kelas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setKelas(res.data);

        if (!sesiAktif && res.data.sesi.length > 0) {
          setSesiAktif(res.data.sesi[0].id);
        }
        const quizRes = await axios.get(
          `http://localhost:5000/api/log_quiz/${payload.id}/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setQuizTerjawab(quizRes.data);

        const nilaiRes = await axios.get(
          `http://localhost:5000/api/nilai/kursus/${payload.id}/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (Array.isArray(nilaiRes.data)) {
          const sesiLulus = nilaiRes.data
            .filter((row) => row.nilai >= 70)
            .map((row) => row.id_sesi);

          setSubmittedSessions(sesiLulus);

          const totalSesi = res.data.sesi.length;
          const progressBar = (sesiLulus.length / totalSesi) * 100;
          setProgress(progressBar);
        }
      } catch (err) {
        console.error("Gagal mengambil semua data:", err);
      }
    };

    if (id) {
      fetchAllData();
    }
  }, [id, location.state]);

  useEffect(() => {
    const fetchNilaiDanReview = async () => {
      try {
        if (!sesiAktif || !userId) return;
        const token = localStorage.getItem("token");

        const [nilaiRes, reviewRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/nilai/${userId}/${sesiAktif}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5000/api/review/${userId}/${sesiAktif}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setNilai(nilaiRes.data.nilai ?? null);
        setReviewMentor(reviewRes.data.komentar_mentor ?? null);

        if (jawabanPerSesi[sesiAktif]) {
          setJawabanDipilih(jawabanPerSesi[sesiAktif].jawaban);
          setJawabanBenar(jawabanPerSesi[sesiAktif].benar);
        } else {
          setJawabanDipilih(null);
          setJawabanBenar(null);
        }
      } catch (err) {
        console.error("Gagal mengambil nilai & review:", err);
      }
    };

    fetchNilaiDanReview();
  }, [sesiAktif, userId]);
  const handleJawab = (id_sesi, jawaban, benar) => {
    setJawabanPerSesi((prev) => ({
      ...prev,
      [id_sesi]: { jawaban, benar },
    }));
    setJawabanDipilih(jawaban);
    setJawabanBenar(benar);
  };

  const handleSesiClick = (id_sesi) => {
    setSesiAktif(id_sesi);
    if (jawabanPerSesi[id_sesi]) {
      setJawabanDipilih(jawabanPerSesi[id_sesi].jawaban);
      setJawabanBenar(jawabanPerSesi[id_sesi].benar);
    } else {
      setJawabanDipilih(null);
      setJawabanBenar(null);
    }
  };

  const handleJawabanClick = async (jawabanTeks, benar, id_jawaban) => {
    setJawabanDipilih(jawabanTeks);
    try {
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (!id_jawaban) {
        console.error("id_jawaban undefined");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/log_quiz",
        {
          id_user: payload.id,
          id_jawaban,
          benar: benar ? 1 : 0,
          salah: benar ? 0 : 1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setQuizTerjawab({ id_jawaban, benar });

      if (benar) {
        toast.success("Jawaban Benar! YAAAAAAAAAAAAY");
      } else {
        const benarJawaban = sesiSekarang.quiz[0]?.jawaban.find(
          (j) => j.benar
        )?.teks;
        setJawabanBenar(benarJawaban);
        toast.error("Jawaban salah! Booooooo");
      }
    } catch (err) {
      console.error("Gagal menyimpan jawaban:", err);
    }
  };

  const handleCobaLagi = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));

      await axios.delete(
        `http://localhost:5000/api/log_quiz/${payload.id}/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setJawabanDipilih(null);
      setJawabanBenar(null);
      setQuizTerjawab(null);
    } catch (err) {
      console.error("Gagal menghapus log quiz:", err);
      toast.error("Gagal coba lagi.");
    }
  };

  const sesiSekarang = kelas?.sesi.find((s) => s.id === sesiAktif);

  if (!kelas) return <div className="p-4 text-white">Memuat data kelas...</div>;

  return (
    <div className="flex min-h-screen w-screen overflow-x-hidden max-w-full">
      <aside className="w-64 bg-[#000045] text-white p-4 space-y-4">
        <img src="/Logo Karisma 2.png" className="h-12 mx-auto" />
        <div className="mb-2 text-sm font-medium text-white">
          Progress : {Math.round(progress)}%
        </div>
        <div className="w-full bg-white rounded h-2 mb-4 overflow-hidden">
          <div
            className="bg-blue-500 h-2 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {kelas.sesi.map((sesi, i) => (
          <div
            key={sesi.id}
            onClick={() => handleSesiClick(sesi.id)}
            className={`py-2 px-3 rounded cursor-pointer hover:bg-white/20 ${
              sesiAktif === sesi.id
                ? "bg-white text-[#000045] font-semibold"
                : submittedSessions.includes(sesi.id)
                ? "text-green-400 font-semibold"
                : "hover:bg-white/20"
            }`}
          >
            Sesi {i + 1}: {sesi.judul_sesi}
          </div>
        ))}
      </aside>

      <main className="flex-1 p-6 bg-white">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

        <h1 className="text-center text-3xl font-bold mb-4">{kelas.judul}</h1>

        {sesiSekarang ? (
          <>
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <video
                key={sesiSekarang.id}
                controls
                className="w-full max-h-[500px] rounded object-contain mx-auto"
              >
                <source
                  src={`http://localhost:5000/uploads/${sesiSekarang.video}`}
                  type="video/mp4"
                />
                Browser tidak mendukung video.
              </video>
            </div>

            <div className="text-black mb-6">
              <h2 className="text-xl font-semibold">Deskripsi</h2>
              <p>{sesiSekarang.topik}</p>
            </div>

            {sesiSekarang.quiz && sesiSekarang.quiz.length > 0 && (
              <div className="bg-gray-200 p-4 rounded mb-4">
                <h3 className="text-lg font-bold">Quiz</h3>
                <p className="text-sm mb-2">{sesiSekarang.quiz[0]?.soal}</p>
                <div className="grid grid-cols-2 gap-4">
                  {sesiSekarang.quiz[0]?.jawaban.map((j, idx) => {
                    let buttonStyle = "bg-black";
                    const isDipilih = quizTerjawab?.id_jawaban === j.id;

                    if (quizTerjawab) {
                      if (isDipilih && quizTerjawab.benar) {
                        buttonStyle = "bg-green-500";
                      } else if (isDipilih && !quizTerjawab.benar) {
                        buttonStyle = "bg-red-500";
                      } else if (j.benar) {
                        buttonStyle = "bg-green-500";
                      } else {
                        buttonStyle = "bg-gray-700";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={!!quizTerjawab} // ❗ user tidak bisa klik ulang jika sudah menjawab
                        onClick={() => {
                          if (!quizTerjawab) {
                            handleJawabanClick(j.teks, j.benar, j.id);
                          }
                        }}
                        className={`${buttonStyle} text-white py-2 px-4 rounded transition cursor-pointer`}
                      >
                        {j.teks}
                      </button>
                    );
                  })}
                </div>

                {jawabanDipilih &&
                  jawabanBenar &&
                  jawabanDipilih !== jawabanBenar && (
                    <>
                      <p className="text-red-600 mt-4">
                        Jawaban benar:{" "}
                        <span className="font-bold">{jawabanBenar}</span>
                      </p>
                      <button
                        onClick={handleCobaLagi}
                        className="mt-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded"
                      >
                        Coba Lagi
                      </button>
                    </>
                  )}
              </div>
            )}
            <div className="max-w-3xl mx-auto mt-10">
              <label className="block text-black font-semibold mb-1">
                Score
              </label>
              <input
                type="number"
                value={nilai ?? ""}
                readOnly
                className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#766CF1] cursor-not-allowed"
              />
            </div>

            <div className="mt-10 max-w-3xl mx-auto">
              <h3 className="text-lg font-bold gap-2 flex items-center mb-3">
                Review Mentor
              </h3>
              <div className="bg-blue-700 p-4 rounded-xl space-y-4">
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {reviewMentor ? (
                    <article className="flex items-start gap-3 bg-white text-[#0a0a57] p-3 rounded shadow relative">
                      <img
                        src={`http://localhost:5000/uploads/${
                          kelas.foto_pengajar || "default-avatar.png"
                        }`}
                        alt="avatar"
                        className="w-10 h-10 object-cover rounded-full border"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">
                          Mentor {kelas.nama_pengajar || "Mentor"}
                        </p>
                        <p className="text-sm">{reviewMentor}</p>
                      </div>
                    </article>
                  ) : (
                    <p className="text-white text-sm italic">
                      Belum ada review dari mentor.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={() => {
                  navigate(`/tugasUser/${userId}/${sesiSekarang.id}`, {
                    state: { fromKelas: true },
                  });
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded cursor-pointer"
              >
                Tugas
              </button>
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded cursor-pointer flex items-center"
              >
                <FaBackspace className="mr-2" /> Kembali
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Sesi belum tersedia.</p>
        )}
      </main>
    </div>
  );
}