import React from "react";
import alumniMaskot from "../assets/image 2.png";
import instrukturMaskot from "../assets/image 3.png";
import partnerMaskot from "../assets/image 4.png";
import magangMaskot from "../assets/image 5.png";

const statsData = [
  {
    image: alumniMaskot,
    value: "4321+",
    description:
      "Alumni telah diakselerasi karir dan skill mereka bersama kami",
  },
  {
    image: instrukturMaskot,
    value: "54+",
    description: "Instruktur ahli yang siap bimbing kamu dari 0",
  },
  {
    image: partnerMaskot,
    value: "210+",
    description: "Hiring partner yang siap untuk jadi tempat kamu berkarir",
  },
  {
    image: magangMaskot,
    value: "98%",
    description: "alumni Berhasil disalurkan magang setelah graduate",
  },
];

export default function Section2() {
  return (
    <div>
      <section className="bg-[#1E1E6F] py-4 px-9">
        <div className="max-w-7xl mx-auto flex justify-center gap-10 items-center text-white">
          {statsData.map((stat, index) => (
            <div key={index} className="flex items-center space-x-5">
              <img
                src={stat.image}
                alt=""
                className="h-full w-auto"
                aria-hidden="true"
              />

              <div>
                <p className="text-4xl font-bold">{stat.value}</p>
                <p className="text-sm max-w-[200px] mt-2">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}