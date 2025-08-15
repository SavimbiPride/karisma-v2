import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Oval1 from "../components/Oval1";
import FullLogo from "../assets/hero-image.png";
import MotifBackground from "../components/MotifBackground";
import Section2 from "../components/Section2";
import section3BgImage from "../assets/Frame 38.png";
import Dummy from "../assets/Mask group.png";
import KelasCard from "../components/KelasCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import MentorSection from "../components/MentorSection";
import Background2 from "../assets/Background2.png";
import GambarOrang from "../assets/GambarOrang.jpg";
import GambarSection4 from "../assets/1-63.png";
import Section5Bg from "../assets/Background1.png";
import iconMahasiswa from "../assets/Busines 1.png";
import iconDeveloper from "../assets/female 1.png";
import iconFreelancer from "../assets/freelancer 1.png";
import { FaBookOpen, FaBriefcase, FaUsers } from "react-icons/fa";
import robotImage from "../assets/robot-guide.png";
import bookCoverImage from "../assets/guide-book-cover.png";

const AdminLoggedin = () => {
  const navigate = useNavigate();
  const [dataKelas, setDataKelas] = useState([]);
  const [kelasIndex, setKelasIndex] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/kelas")
      .then((res) => {
        console.log("Data dari backend:", res.data);
        setDataKelas(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const nextKelas = () => {
    if (kelasIndex < dataKelas.length - 3) {
      setKelasIndex(kelasIndex + 1);
    }
  };

  const prevKelas = () => {
    if (kelasIndex > 0) {
      setKelasIndex(kelasIndex - 1);
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="relative pt-36 min-h-screen">
        <div className="absolute inset-0 z-10">
          <MotifBackground className="w-full h-full object-cover " />
        </div>
        <div className="absolute right-0 -top-36 z-20 translate-x-1/5">
          <Oval1 className="w-[880px] h-auto" />
        </div>
        <div className="absolute right-33 top-18 z-30 ">
          <img
            src={FullLogo}
            alt="Interactive learning"
            className="w-[300px] md:w-[520px] mx-auto rounded-xl"
          />
        </div>
        <div className="relative z-20 container mx-auto pl-40">
          <h1 className="text-5xl font-black leading-tight">
            Asah <span className="text-yellow-400">Skillmu</span> secara
            <span className="block">Interaktif di Kelas</span>
          </h1>
          <button className="bg-[#000045]  text-[#F3F4F6] font-bold py-3 px-6 rounded-lg text-lg flex items-center justify-center tracking-wide transition-colors mt-8">
            WEBINAR REGULER
          </button>
          <p className="text-gray-800 font-medium text-left max-w-md leading-relaxed text-base mt-8">
            Program kelas reguler merupakan pelatihan online secara intensif dan
            live bersama dengan mentor berpengalaman. Materi Kursus dirancang
            secara terstruktur dari dasar hingga lanjut dengan standar industri
            terkini.
          </p>
          <ul className="grid grid-cols-2 gap-y-3 gap-x-6 text-black text-sm max-w-md mt-8">
            {[
              "Belajar nyaman dimana aja",
              "Pelatihan siap kerja",
              "Instruktur berpengalaman",
              "Mendapat e-sertifikat",
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="material-icons text-black text-lg">
                  check_circle
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-6 mt-8">
            <button
              onClick={() => navigate("/daftar_kelas")}
              className=" bg-yellow-400 hover:bg-yellow-500  text-white font-bold py-3 px-8 rounded-lg text-base tracking-wide transition-colors cursor-pointer"
            >
              Explore Kelas
            </button>

            <button
              onClick={() => navigate("/kelas_saya")}
              className=" bg-[#000045]  text-[#F3F4F6] hover:bg-[#1E1E6F] font-bold py-3 px-8 border border-gray-400 rounded-lg text-base tracking-wide transition-colors cursor-pointer"
            >
              Kelas
            </button>
          </div>
        </div>
      </div>
      <br />
      <div className="relative z-5 w-full h-43 bg-[#1E1E6F] shadow-lg flex justify-center overflow-hidden">
        <div className="absolute inset-0 z-10">
          <MotifBackground className=" absolute w-[1600px] h-[900px]  object-cover opacity-40" />
        </div>
        <div>
          <Section2 />
        </div>
      </div>

      <section className=" py-20 px-4">
        <div className="container mx-auto">
          <div className="relative p-1.5 rounded-3xl bg-gray-600/20 backdrop-blur-sm">
            <div className="bg-gray-800/50 rounded-2xl p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                <div className="hidden lg:flex justify-center">
                  <img
                    src={robotImage}
                    alt="Robot Guide"
                    className="h-96 w-auto drop-shadow-lg"
                  />
                </div>

                <div className="flex flex-col items-center text-center">
                  <div
                    className="relative border-2 border-white/20 p-2 rounded-lg shadow-lg"
                    style={{
                      clipPath:
                        "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)",
                    }}
                  >
                    <img
                      src={bookCoverImage}
                      alt="Guide Book Cover"
                      className="w-56 h-auto rounded"
                    />
                  </div>
                  <a
                    href="/public/GuideBook.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 bg-[#000045] hover:bg-[#1E1E6F] text-white font-bold py-3 px-8 rounded-full text-base transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Akses Guide Book
                  </a>
                </div>

                <div className="text-white text-center lg:text-left">
                  <h2 className="text-5xl font-black uppercase tracking-wider leading-tight">
                    Guide Book
                  </h2>
                  <p className="mt-4 text-lg text-white/80 leading-relaxed max-w-md">
                    Panduan praktis yang dirancang untuk membantu peserta dalam
                    memahami pelaksanaan pelatihan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative grid ">
        <div className="col-start-1 row-start-1 w-full h-230 z-0">
          <img
            src={section3BgImage}
            alt=""
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="col-start-1 row-start-1 relative z-10 container mx-auto  text-white pt-30  px-4 flex flex-col  items-center ">
          <h2 className="text-[50px] font-bold text-center tracking-wide">
            Berbagai Macam Materi{" "}
            <span className="text-[#FFC300]">Tersedia</span>
          </h2>
          <p className="mt-8 w-155 text-[20px] mx-auto text-center leading-7 ">
            Materi materi yang dirancang untuk kamu yang ingin mempersiapkan
            karir digital dan mempelajari skill baru !
          </p>
          <div className="flex items-center space-x-4 mt-8">
            <button
              onClick={prevKelas}
              className="p-2 bg-yellow-400 rounded-full hover:bg-yellow-500 cursor-pointer"
            >
              <FiChevronLeft size={24} />
            </button>

            <div className="flex overflow-hidden w-full">
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${kelasIndex * (100 / 3)}%)` }}
              >
                {dataKelas.map((kelas) => (
                  <div key={kelas.id} className="w-1/3 flex-shrink-0 px-2">
                    <KelasCard kelas={kelas} />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={nextKelas}
              className="p-2 bg-yellow-400 rounded-full hover:bg-yellow-500 cursor-pointer"
            >
              <FiChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      <MentorSection />

      <section
        style={{ backgroundImage: `url(${Background2})` }}
        className="w-full relative bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="flex justify-center items-center py-[60px] px-7">
          <div className="w-full h-full p-8 rounded-3xl bg-white/10 backdrop-blur-sm transition-all duration-300 hover:shadow-xl ">
            <div className="bg-white  w-full py-35 pl-32  rounded-lg ">
              <div className="flex items-center gap-16">
                <div className="flex-shrink-0">
                  <img src={GambarSection4} alt="Karakter" className="w-96" />
                </div>

                <div className="flex flex-col justify-center">
                  <h1 className="text-[64px] font-semibold text-[#000045] leading-[1.1]">
                    Update Skill Tanpa{" "}
                    <span className="text-[#FFC300]">Batas</span>!
                  </h1>
                  <p className="text-[20px] mt-6 w-[380px] font-semibold opacity-70 leading-[25px]">
                    Konsultan kami online 24 jam! Klik tombol chat sekarang
                    untuk tanya apa saja sebelum Anda mendaftar.
                  </p>
                  <a
                    href="https://wa.me/6282143846141?text=halo%20mas%20saya%20blablablabla"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 px-8 rounded-2xl text-lg tracking-wide transition-colors w-max"
                  >
                    Konsultasi Gratis!
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-[#1E1E6F] text-white py-24 rounded-3xl overflow-hidden my-4 mx-4">
        <img
          src={Section5Bg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-10"
          aria-hidden="true"
        />
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Kenapa Harus Join Karisma{" "}
              <span className="text-yellow-400">Academy</span> ?
            </h2>
            <p className="mt-4 text-white/80 max-w-xl mx-auto">
              Belajar tak perlu sendirian. Dengan bimbingan mentor, setiap
              langkah Anda akan lebih jelas dan terarah.
            </p>
          </div>
          <div className="mt-16 max-w-4xl mx-auto space-y-12">
            <div className="flex items-start md:items-center gap-6 md:gap-8">
              <div className="flex-shrink-0 w-24 h-24 rounded-full flex items-center justify-center bg-blue-100">
                <img
                  src={iconMahasiswa}
                  alt=""
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Pelajar & Mahasiswa</h3>
                <p className="mt-2 text-white/80 leading-relaxed">
                  Mulai dari nol! Belajar HTML, CSS, JavaScript & desain UI/UX
                  langsung dari praktik nyata. Cocok untuk portofolio dan modal
                  magang/kerja.
                </p>
              </div>
            </div>
            <div className="flex items-start md:items-center gap-6 md:gap-8">
              <div className="flex-shrink-0 w-24 h-24 rounded-full flex items-center justify-center bg-red-100">
                <img
                  src={iconDeveloper}
                  alt=""
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  Developer & Desainer Pemula
                </h3>
                <p className="mt-2 text-white/80 leading-relaxed">
                  Tanpa pengalaman? Bisa! Pelajari cara buat website menarik
                  pakai VSCode, Figma, Tailwind, hingga React.
                </p>
              </div>
            </div>
            <div className="flex items-start md:items-center gap-6 md:gap-8">
              <div className="flex-shrink-0 w-24 h-24 rounded-full flex items-center justify-center bg-gray-200">
                <img
                  src={iconFreelancer}
                  alt=""
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  Freelancer & Pekerja Kreatif
                </h3>
                <p className="mt-2 text-white/80 leading-relaxed">
                  Tanpa pengalaman? Bisa! Pelajari cara buat website menarik
                  pakai VSCode, Figma, Tailwind, hingga React.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{ backgroundImage: `url(${Background2})` }}
        className="w-full relative bg-cover bg-center py-16 px-4"
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 w-full max-w-7xl mx-auto p-3 rounded-3xl bg-white/10 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
                Hasil Yang Anda Dapatkan Dari{" "}
                <span className="text-yellow-400">Kursus ini</span>
              </h2>

              <div className="space-y-10">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center bg-[#0D285F] text-white">
                    <FaBookOpen size={32} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-900">
                      Pemahaman Dunia Kerja
                    </h3>
                    <p className="mt-2 text-gray-600 leading-relaxed">
                      Setelah 3 bulan pelatihan, Anda akan mengetahui standar
                      industri, proses rekrutmen, dan kebutuhan perusahaan
                      teknologi. Anda akan mendapat wawasan langsung dari mentor
                      atau praktisi industri.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center bg-[#0D285F] text-white">
                    <FaBriefcase size={32} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-900">
                      Kesiapan Karier
                    </h3>
                    <p className="mt-2 text-gray-600 leading-relaxed">
                      Setelah 3 bulan pelatihan, Anda akan mendapatkan CV dan
                      profil LinkedIn lebih profesional. Siap menghadapi
                      wawancara teknikal dan HR. Punya network dengan sesama
                      peserta atau alumni.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center bg-[#0D285F] text-white">
                    <FaUsers size={32} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-900">
                      Peningkatan Soft Skill
                    </h3>
                    <p className="mt-2 text-gray-600 leading-relaxed">
                      Setelah 3 bulan pelatihan, Anda dapat meningkatkan
                      kemampuan komunikasi, kerja tim, dan problem solving.
                      Terbiasa bekerja dalam sistem kolaboratif seperti
                      Agile/Scrum.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-[#1E1E6F] text-white py-20 rounded-3xl overflow-hidden my-4 mx-4">
        <img
          src={Section5Bg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-10"
          aria-hidden="true"
        />
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Bergabung <span className="text-yellow-400">Sekarang</span> !
            </h2>
            <p className="mt-15 text-[20px] w-[1200px] text-white/80 max-w-xl mx-auto">
              Mulailah perjalanan menuju masa depan gemilang bersama kami.
              Tingkatkan keterampilan Anda hari ini dan wujudkan karier impian
              Anda bersama Karisma Academy!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminLoggedin;