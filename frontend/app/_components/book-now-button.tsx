"use client";
import React from "react";
import { useRouter } from "next/navigation";

export function BookNowButton() {
  const router = useRouter();
  
  return (
    <div className="my-22 flex items-center justify-center">
      <button
        onClick={() => router.push('/packages')}
        className="bg-[#2e2e2e] rounded-full px- py-5 dark:bg-white dark:text-black text-white flex justify-center group/modal-btn relative overflow-hidden"
      >
        <span className="text-2xl px-16 group-hover/modal-btn:translate-x-65 text-center transition duration-500">
          Book Now
        </span>
        <div className="-translate-x-48 text-4xl group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
          🚐
        </div>
      </button>
    </div>
  );
}
