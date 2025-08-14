import React, { useState } from "react";

export default function AccordionItem({ index, question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <button
        className="w-full text-left px-4 py-3 bg-white hover:bg-gray-100 font-semibold text-[#0A0A57] flex justify-between items-center"
        onClick={() => setOpen(!open)}
      >
        <span>{question}</span>
        <span>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="px-4 py-2 bg-gray-50 text-gray-700 text-sm whitespace-pre-wrap">
          {answer}
        </div>
      )}
    </div>
  );
}