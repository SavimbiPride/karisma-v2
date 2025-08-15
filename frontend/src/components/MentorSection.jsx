import React, { useEffect, useState } from "react";
import MentorCard from "./MentorCard";
import axios from "axios";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import MentorSectionBg from "../assets/Background1.png";

export default function MentorSection() {
  const [mentors, setMentors] = useState([]);
  const [mentorIndex, setMentorIndex] = useState(0);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/mentor", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMentors(res.data);
      } catch (err) {
        console.error("Gagal mengambil data mentor:", err);
      }
    };

    fetchMentors();
  }, []);

  const nextMentor = () => {
    if (mentorIndex < mentors.length - 3) {
      setMentorIndex(mentorIndex + 1);
    }
  };

  const prevMentor = () => {
    if (mentorIndex > 0) {
      setMentorIndex(mentorIndex - 1);
    }
  };

  return (
    <section className="relative text-white py-24 rounded-3xl overflow-hidden my-4 mx-4">
      <div className="absolute inset-0 z-0 h-full w-full">
        <img
          src={MentorSectionBg}
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <h2 className="text-[48px] font-bold text-center">
          Para Mentor Siap Membimbing{" "}
          <span className="text-yellow-400">Anda !</span>
        </h2>
        <p className="mt-4 text-white/80 max-w-3xl mx-auto text-center">
          Belajar tak perlu sendirian. Dengan bimbingan mentor, setiap langkah
          Anda akan lebih jelas dan terarah.
        </p>
        <div className="mt-16 flex items-center space-x-4">
          <button
            onClick={prevMentor}
            disabled={mentorIndex === 0}
            className={`p-2 rounded-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 cursor-pointer`}
          >
            <FiChevronLeft size={24} />
          </button>

          <div className="flex overflow-hidden w-full">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${mentorIndex * (100 / 3)}%)` }}
            >
              {mentors.map((mentor) => (
                <div key={mentor.id} className="w-1/3 flex-shrink-0 px-2">
                  <MentorCard
                    mentor={{
                      foto: mentor.foto,
                      username: mentor.username,
                      tentang:
                        mentor.tentang || "Mentor berpengalaman di bidangnya.",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={nextMentor}
            disabled={mentorIndex >= mentors.length - 3}
            className={`p-2 rounded-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 cursor-pointer`}
          >
            <FiChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}