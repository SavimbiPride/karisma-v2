import React from "react";

export default function HalamanBeranda() {
  const kompetensiImages = [
    { src: "/arsitektur-3d.png", alt: " " },
    { src: "/digital-marketing.png", alt: " " },
    { src: "/video-editing.png", alt: " " },
    { src: "/desain-grafis.png", alt: " " },
    { src: "/mobile-dev.png", alt: " " },
    { src: "/motion-graphics.png", alt: " " },
    { src: "/ms-office.png", alt: " " },
    { src: "/web-dev.png", alt: " " },
  ];
  return (
    <div className="bg-white font-sans min-h-screen">
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-10 bg-white">
        <div className="max-w-xl">
          <h1 className="text-3xl md:text-6xl font-bold text-gray-900">
            Grow with <span className="text-yellow-500">Skills</span>,<br />
            Shine with Karisma
          </h1>
          <p className="mt-4 text-4xl md:text-2xl font-semibold text-gray-800">
            Bentuk Dirimu Menjadi Pemimpin Digital <br /> yang Berkarakter dan
            Berdampak.
          </p>
          <p className="mt-4 text-lg md:text-xl text-gray-700 leading-relaxed">
            Di Karisma Academy, kami hadir untuk memberdayakan Anda. Kami tidak
            hanya mengajarkan teknologi, tetapi juga membimbing Anda
            mengembangkan karakter kepemimpinan yang kuat dan karisma personal
            untuk menciptakan masa depan digital yang lebih cerah.
          </p>
        </div>

        <div className="relative mt-10 md:mt-0">
          <div className="absolute -top-6 -left-6 w-56 h-56 bg-yellow-400 rounded-full -z-10"></div>
          <img
            src="/robot1.png"
            alt="Robot Hero"
            className="max-w-xs md:max-w-sm"
          />
        </div>
      </section>

      <section className="bg-white py-8 px-4">
        <div className="bg-[#0A0A57] text-white rounded-3xl max-w-screen-x1 mx-auto px-6 md:px-12 py-10 font-sans">
          <div className="text-center mb-4">
            <h2 className="text-xl md:text-5xl font-semibold leading-relaxed">
              Perjalanan{" "}
              <span className="text-yellow-400 font-bold">Membangun Mimpi</span>
              : Lebih dari Sekadar Skill, <br />
              Kami Membentuk Pemimpin Digital Masa Depan.
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-y mb-8">
            <img
              src="/robot_elang.png"
              alt="Robot Karisma"
              className="w-72 md:w-80"
            />
            <div className="text-lg md:text-xl leading-relaxed text-white">
              <p className="mb-5 font-light">
                Di tengah gelombang perubahan digital yang tak henti, banyak
                yang
                <span className="font-semibold text-white">
                  {" "}
                  merasa tersesat, dibayangi keraguan, dan hanya mengejar skill
                  teknis{" "}
                </span>
                tanpa bekal keberanian atau keyakinan. Padahal, era ini menuntut
                lebih: pemimpin yang tak hanya cerdas teknologi, tapi juga
                berkarakter, berani, dan berkarisma, mampu menginspirasi
                perubahan nyata.
              </p>
              <p className="font-light">
                <span className="font-semibold text-white">
                  {" "}
                  Karisma Academy{" "}
                </span>{" "}
                hadirÂ untuk menjawab panggilan ini. Kami percaya setiap
                individu yang bertekad kuat berhak mengembangkan potensi teknis
                dan kepemimpinan mereka. Ini bukan sekadar tentang skill, ini
                tentang menjadi pemimpin digital yang berkarakter dan berdampak.
              </p>
            </div>
          </div>

          {/* Tiga Pilar */}
          <div className="bg-gradient-to-br from-[#0A0A57] to-[#0A0A57] text-white py-16 px-6 font-sans">
            <div className="text-center mb-12">
              <h3 className="text-xl md:text-5xl font-bold">
                Tiga Pilar <span className="text-yellow-400">Utama</span>{" "}
                Karisma Academy
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-10xl mx-auto">
              {/* Pilar 1 */}
              <div className="bg-yellow-400 text-[#000045] rounded-xl shadow-lg p-10 flex flex-col justify-between min-h-[450px] max-w-md w-full mx-auto">
                <div>
                  <h4 className="font-bold text-2xl mb-4">
                    Pemberdayaan Holistik: Lebih dari Sekadar Keterampilan
                    Digital
                  </h4>
                  <p className="text-lg">
                    Karisma Academy berkomitmen memberikan pemberdayaan holistik
                    yang mencakup pengembangan keterampilan digital, soft skill,
                    dan kepercayaan diri untuk menghadapi tantangan dunia kerja
                    modern. Kami percaya bahwa setiap individu memiliki potensi
                    untuk sukses dan berkontribusi dalam masyarakat digital.
                  </p>
                </div>
                <img
                  src="/beruang.png"
                  alt="beruang"
                  className="h-60 mx-auto mt-6"
                />
              </div>

              {/* Pilar 2 */}
              <div className="bg-[#f56565] text-white rounded-xl shadow-lg p-10 flex flex-col justify-between min-h-[450px] max-w-md w-full mx-auto">
                <div>
                  <h4 className="font-bold text-2xl mb-4 text-white">
                    Pengalaman Belajar Inovatif dan Relevan Industri
                  </h4>

                  <p className="text-lg">
                    Kami menawarkan pengalaman belajar revolusioner melalui
                    pembelajaran misi dan gamifikasi yang seru. Kurikulum kami
                    mutakhir dan terintegrasi dengan kebutuhan industri digital
                    serta tren teknologi. memastikan pengetahuan dan
                    keterampilan yang Anda peroleh relevan dan aplikatif di
                    dunia kerja. Kami mengubah proses belajar menjadi
                    petualangan menarik, di mana setiap tantangan adalah
                    kesempatan untuk tumbuh.
                  </p>
                </div>
                <img
                  src="/anak-skate.png"
                  alt="anak skate"
                  className="h-60 mx-auto mt-6"
                />
              </div>

              {/* Pilar 3 */}
              <div className="bg-lime-400 text-[#000045] rounded-xl shadow-lg p-10 flex flex-col justify-between min-h-[450px] max-w-md w-full mx-auto overflow-hidden">
                <div>
                  <h4 className="font-bold text-2xl mb-4 text-[#000045]">
                    Jembatan Karier dan Komunitas Pembentuk Pemimpin
                  </h4>

                  <p className="text-lg">
                    Karisma Academy fokus pada hasil belajar. Kami membangun
                    jembatan karier dengan industri melalui bimbingan portofolio
                    dan proyek nyata. Anda akan menjadi bagian dari komunitas
                    belajar yang inspiratif. Kami membentuk pemimpin digital
                    yang kompeten dan berkarakter, sesuai dengan slogan kami:
                    Grow with Skills.
                  </p>
                </div>
                <div className="flex justify-center gap-4 items-end mt-4">
                  <img
                    src="/rubicon.png"
                    alt="rubicon"
                    className="h-40 md:h-48 object-contain"
                  />
                  <img
                    src="/robot.png"
                    alt="mobil terbang"
                    className="h-40 md:h-48 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-16 max-w-4xl mx-auto">
            <h3 className="text-xl md:text-5xl font-bold mb-4">
              Masa Depan <span className="text-yellow-300">Dimulai</span> di
              Sini
            </h3>
            <p className="text-sm md:text-base leading-relaxed">
              Karisma Academy adalah lebih dari sekadar platform edutech, kami
              adalah katalisator perubahan. Pembentuk pemimpin, dan pemandu
              menuju masa depan yang cemerlang. Kami mendorong individu,
              individu muda yang dibekali dan berorientasi masa depan, untuk
              menghadapi dan perjalanan ini. Bersama Karisma Academy, Anda akan
              mengasah keterampilan teknologi, tapi juga akan menemukan dan
              membentuk arah hidup. Kami percaya potensi karakter kepemimpinan
              akan membuka dunia Anda. Masa depan ada di digital, dan Karisma
              Academy siap membimbing Anda untuk memimpinnya.
            </p>
          </div>
        </div>
      </section>

      <section className="relative min-h-screen bg-gradient-to-br from-[#140f4b] via-[#2b1055] to-[#0f0c29] py-16 px-4 font-sans text-white overflow-hidden">
        {/* Blur Layers */}
        <div className="absolute w-96 h-96 bg-yellow-600 rounded-full blur-3xl opacity-30 top-10 left-10 mix-blend-screen" />
        <div className="absolute w-96 h-96 bg-[#EE00FF] rounded-full blur-3xl opacity-30 bottom-20 right-10 mix-blend-screen" />
        <div className="absolute w-80 h-80 bg-pink-500 rounded-full blur-3xl opacity-30 top-1/2 left-1/3 mix-blend-screen" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="/robott_4.png"
              alt="Robot Karisma"
              className="max-w-xs md:max-w-sm lg:max-w-md"
            />
          </div>

          <div className="w-full md:w-1/2 space-y-10">
            <div className="bg-white text-[#0A0A57] p-6 rounded-xl shadow-xl">
              <h3 className="text-lg md:text-xl font-bold mb-2">
                Masa Depan yang Kami Wujudkan
              </h3>
              <p className="text-sm md:text-base leading-relaxed">
                Menjadi platform edutech terdepan yang membentuk 1 juta talenta
                digital berkarakter, percaya diri, dan berkarisma, siap memimpin
                perubahan dan inovasi di era digital.
              </p>
            </div>

            <div className="bg-white text-[#0A0A57] p-6 rounded-xl shadow-xl">
              <h3 className="text-lg md:text-xl font-bold mb-4">
                Langkah Nyata Kami Menuju Masa Depan
              </h3>
              <ul className="list-disc list-inside text-sm md:text-base space-y-2">
                <li>
                  Menghadirkan pengalaman belajar teknologi digital yang
                  inovatif, seru, dan terstruktur melalui platform berbasis
                  gamifikasi untuk hasil optimal.
                </li>
                <li>
                  Mengembangkan kurikulum mutakhir yang adaptif dan terintegrasi
                  penuh dengan kebutuhan industri digital serta tren teknologi
                  masa depan.
                </li>
                <li>
                  Menanamkan karakter kepemimpinan digital, kepercayaan diri,
                  growth mindset, dan karisma personal pada setiap peserta.
                </li>
                <li>
                  Membangun jembatan karier dengan ekosistem industri dan pelaku
                  kerja generasi melalui bimbingan portofolio, proyek nyata, dan
                  jaringan profesional.
                </li>
                <li>
                  Mendorong kolaborasi aktif untuk menciptakan inovasi digital
                  yang berkelanjutan dan berdampak positif bagi masyarakat.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white font-sans text-gray-800">
        <div className="py-12 px-4 text-center">
          <h2 className="text-5xl font-bold text-[#000045] mb-4">
            The Origins of Our Journey
          </h2>
          <p className="max-w-3xl mx-auto text-base text-[#000045]  mb-6">
            Karisma Academy telah mencapai tonggak penting sebagai Lembaga
            Kursus & Pelatihan berstandar Industri yang didirikan oleh PT.
            Karisma Garuda Mulia sejak tahun 2005. Dengan NPSN K9989817, kami
            bangga memiliki Akreditasi A berdasarkan penilaian kinerja Lembaga
            Kursus & Pelatihan Berbasis Dunia Kerja pada tahun 2022, yang
            diberikan oleh Direktorat Jenderal Pendidikan Vokasi, Direktorat
            Kursus dan Pelatihan.
          </p>

          <div className="overflow-x-auto">
            <div className="flex gap-4 w-max px-2">
              <img
                src="/image_14.png"
                alt="event 1"
                className="h-80 rounded-lg"
              />
              <img
                src="/image_15.png"
                alt="event 2"
                className="h-80 rounded-lg"
              />
              <img
                src="/image_16.png"
                alt="event 3"
                className="h-80 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="py-5 px-4 text-center bg-white">
          <h2 className="text-6xl font-bold text-[#000045] mb-4">
            Meet Our Team
          </h2>
          <p className="max-w-3xl mx-auto text-base text-[#000045] mb-8">
            Di balik Karisma Academy, ada tim pengajar dan mentor yang
            berpengalaman di industri digital. Mereka bukan hanya ahli di
            bidangnya, tetapi juga berdedikasi untuk membantu Anda mengasah
            keterampilan dan membangun kepercayaan diri.
          </p>
          <div className="flex justify-center">
            <img
              src="/struktur.png"
              alt="Struktur Organisasi"
              className="w-full max-w-8xl rounded-xl shadow"
            />
          </div>
        </div>

        <div className="py-12 px-4 text-center">
          <h2 className="text-3xl font-bold text-[#000045] mb-4">
            Berkembang Bersama Karisma Academy
          </h2>
          <p className="max-w-3xl mx-auto text-base text-[#000045] mb-10">
            Didukung oleh kurikulum yang terdepan dan Instruktur yang merupakan
            praktisi profesional, Karisma Academy menjadi opsi solusi untuk
            percepatan pengembangan diri yang terpercaya.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-[#000045] mb-20">
            <div className="flex items-center gap-4 px-2">
              <img
                src="/robo.png"
                alt="Alumni"
                className="w-24 h-24 shrink-0"
              />
              <div>
                <p className="text-3xl font-bold leading-tight">4321+</p>
                <p className="text-sm leading-snug">
                  Alumni telah akselerasi karir dan skill mereka bersama kami
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-1">
              <img
                src="/ijo.png"
                alt="Instruktur"
                className="w-24 h-24 shrink-0"
              />
              <div>
                <p className="text-3xl font-bold leading-tight">69+</p>
                <p className="text-sm leading-snug">
                  Instruktur ahli yang siap membimbing kamu dari 0
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-2">
              <img
                src="/beruang1.png"
                alt="Hiring Partner"
                className="w-24 h-24 shrink-0"
              />
              <div>
                <p className="text-3xl font-bold leading-tight">320+</p>
                <p className="text-sm leading-snug">
                  Hiring partner yang siap untuk jadi tempat kamu berkarir
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-2">
              <img
                src="/elang.png"
                alt="Magang"
                className="w-24 h-24 shrink-0"
              />
              <div>
                <p className="text-3xl font-bold leading-tight">97%</p>
                <p className="text-sm leading-snug">
                  Alumni berhasil disalurkan magang setelah graduate
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative min-h-screen flex justify-center items-center bg-gradient-to-br from-[#140f4b] via-[#2b1055] to-[#0f0c29] px-4 py-16">
        <div className="absolute w-96 h-96 bg-yellow-600 rounded-full blur-3xl opacity-30 top-10 left-10 mix-blend-screen" />
        <div className="absolute w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-30 bottom-20 right-10 mix-blend-screen" />
        <div className="absolute w-80 h-80 bg-pink-500 rounded-full blur-3xl opacity-30 top-1/2 left-1/3 mix-blend-screen" />

        <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-10 max-w-6xl w-full">
          <h3 className="text-3xl md:text-6xl font-bold text-center mb-10 text-[#140f4b]">
            Lini Kompetensi Karisma Academy
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {kompetensiImages.map((img, idx) => (
              <div
                key={idx}
                className="rounded-xl overflow-hidden transition duration-300 hover:scale-105"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-64 object-contain bg-white p-4 rounded-xl"
                />
                <p className="text-center text-base font-semibold text-[#140f4b] mt-3">
                  {img.alt}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-white text-[#000045] font-sans relative overflow-hidden">
        <div className="bg-[#000045]/90 text-white rounded-xl mx-auto max-w-4xl px-6 py-6 mt-10 text-center">
          <h2 className="text-xl md:text-2xl font-bold">
            Bergabung <span className="text-yellow-400">Sekarang</span> !
          </h2>
          <p className="mt-2 text-sm md:text-base">
            Mulailah perjalanan menuju masa depan gemilang bersama kami.
            Tingkatkan keterampilan Anda hari ini dan wujudkan karier impian
            Anda bersama Karisma Academy!
          </p>
        </div>

        <div className="bg-[#000045] text-white mt-10 px-6 py-10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex flex-col items-start gap-4">
              <img
                src="/Logo Karisma 2.png"
                alt="Logo Karisma"
                className="h-20"
              />
              <div className="flex gap-3">
                <img src="/facebook.png" className="w-8 h-8 shrink-0" />
                <img src="/instagram.png" className="w-8 h-8 shrink-0" />
                <img src="/wa.png" className="w-8 h-8 shrink-0" />
                <img src="/yutub.png" className="w-8 h-8 shrink-0" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-lg md:text-x1">
                Jam Operasi
              </h4>
              <p className="text-base md:text-lg">
                Buka : Setiap hari di jam kerja
              </p>
              <p className="text-base md:text-lg">
                Tutup : Hari Libur Nasional
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-lg md:text-x1">
                Pembayaran
              </h4>
              <p className="text-base md:text-lg">Payment Partner : </p>
              <p className="text-base md:text-lg">BRI - BCA - Tokopedia -</p>
              <p className="text-base md:text-lg">OVO - Gopay - DANA -</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-lg md:text-x1">
                Alamat Kami
              </h4>
              <p className="text-base md:text-lg">WA : 08123456789</p>
              <p className="text-base md:text-lg">
                Email : info@karismaacademy.com
              </p>
            </div>
          </div>
          <div className="mt-10 text-center text-white/80 text-xs">
            Â©2025 PT Karisma Garuda Mulia
          </div>
        </div>
      </footer>
    </div>
  );
}