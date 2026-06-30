"use client";

import { useRef } from "react";
import { Camera } from "lucide-react";

const AVATAR_KEY = "forma_avatar";
const MAX_SIZE = 200;

export function getStoredAvatar(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AVATAR_KEY);
}

export function clearStoredAvatar() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AVATAR_KEY);
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      const scale = Math.min(MAX_SIZE / img.width, MAX_SIZE / img.height, 1);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = reject;
    img.src = url;
  });
}

interface Props {
  value: string | null;
  onChange: (dataUrl: string) => void;
  initials?: string;
  size?: "sm" | "lg";
}

export default function AvatarUpload({ value, onChange, initials = "?", size = "lg" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImage(file);
      localStorage.setItem(AVATAR_KEY, dataUrl);
      onChange(dataUrl);
    } catch {
      // silently ignore
    }
    e.target.value = "";
  }

  const dim = size === "lg" ? "w-24 h-24" : "w-12 h-12";
  const textSize = size === "lg" ? "text-3xl" : "text-base";
  const badgeSize = size === "lg" ? "w-7 h-7 -bottom-0.5 -right-0.5" : "w-5 h-5 -bottom-0.5 -right-0.5";
  const iconSize = size === "lg" ? 14 : 11;

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className={`relative ${dim} rounded-full shrink-0 group`}
      aria-label="Profilbild ändern"
    >
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="Profilbild"
          className={`${dim} rounded-full object-cover border-2 border-brand-100`}
        />
      ) : (
        <div className={`${dim} rounded-full bg-brand-100 flex items-center justify-center border-2 border-brand-200`}>
          <span className={`${textSize} font-bold text-brand-600`}>
            {initials.slice(0, 1).toUpperCase()}
          </span>
        </div>
      )}
      <span className={`absolute ${badgeSize} rounded-full bg-brand-600 text-white flex items-center justify-center shadow-sm`}>
        <Camera size={iconSize} />
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFile}
        aria-hidden
      />
    </button>
  );
}
