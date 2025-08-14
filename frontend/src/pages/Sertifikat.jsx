import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Sertifikat({ namaUser, namaKelas }) {
  const pdfRef = useRef();

  const handleDownload = async () => {
    const canvas = await html2canvas(pdfRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [1000, 700],
    });

    pdf.addImage(imgData, "PNG", 0, 0, 1000, 700);
    pdf.save(`sertifikat-${namaUser}.pdf`);
  };

  return (
    <>
      <button
        onClick={handleDownload}
        className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 cursor-pointer"
      >
        Unduh Sertifikat
      </button>

      <div
        ref={pdfRef}
        style={{
          width: "1000px",
          height: "700px",
          position: "absolute",
          left: "-9999px",
          backgroundImage: `url("/template.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          fontFamily: "Georgia, serif",
          color: "#000",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "260px",
            left: "470px",
            width: "420px",
            textAlign: "left",
          }}
        >
          <h1
            style={{
              fontSize: "34px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            {namaUser}
          </h1>

          <p
            style={{
              fontSize: "18px",
              fontWeight: "100",
              paddingTop: "16px",
              marginBottom: "6px",
              wordBreak: "break-word",
            }}
          >
            "{namaKelas}" dengan baik
          </p>
        </div>
      </div>
    </>
  );
}