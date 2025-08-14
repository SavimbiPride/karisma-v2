import React from "react";

export default function NotifikasiCustom({
  message,
  onConfirm,
  onCancel,
  singleButton = false,
  buttonLabel = "OK",

  pesan,
  onKonfirmasi,
  onTutup,
  tombolDua = false,
  labelTombol,
}) {
  const finalPesan = message || pesan;
  const finalOnKonfirmasi = onConfirm || onKonfirmasi;
  const finalOnTutup = onCancel || onTutup;
  const finalTombolDua = tombolDua || (!singleButton && onCancel);
  const finalLabel = buttonLabel || labelTombol || "OK";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-[#000046] text-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <img src="/1-43.png" alt="Robot" className="w-32 mx-auto mb-6" />
        <h2 className="text-xl font-bold mb-4">{finalPesan}</h2>

        {finalTombolDua ? (
          <div className="flex justify-center gap-6">
            <button
              onClick={finalOnKonfirmasi}
              className="bg-[#162466] hover:bg-[#1e2e91] px-6 py-2 rounded-md cursor-pointer"
            >
              Iya
            </button>
            <button
              onClick={finalOnTutup}
              className="bg-[#162466] hover:bg-[#1e2e91] px-6 py-2 rounded-md cursor-pointer"
            >
              Tidak
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={finalOnKonfirmasi}
              className="bg-[#162466] hover:bg-[#1e2e91] px-6 py-2 rounded-md cursor-pointer"
            >
              {finalLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}