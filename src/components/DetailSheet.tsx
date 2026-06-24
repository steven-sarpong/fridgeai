"use client";

import { X } from "lucide-react";

interface DetailSheetProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

// Wiederverwendbares Bottom-Sheet für Detailansichten (Fridge-Item, Mahlzeit ...).
// Schließbar per X-Button, Klick auf den abgedunkelten Hintergrund oder Escape.
export default function DetailSheet({ title, onClose, children }: DetailSheetProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl w-full max-w-md p-5 pb-8 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-brand-900">{title}</p>
          <button onClick={onClose} className="text-gray-400" type="button" aria-label="Schließen">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
