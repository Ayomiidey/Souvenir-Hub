"use client";
import { useLoader } from "@/components/providers/loader-provider";

export function GlobalLoader() {
  const { loading } = useLoader();
  if (!loading) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="p-6 rounded-xl bg-white/80 dark:bg-slate-900/80 shadow-xl">
        <span className="sr-only">Loading...</span>
        <svg
          className="animate-spin h-10 w-10 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg>
      </div>
    </div>
  );
}
