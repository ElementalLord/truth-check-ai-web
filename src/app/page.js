"use client";
import { useState } from "react";
import ResultTag from "../components/ResultTag";

export default function Home() {
  const [claim, setClaim] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFactCheck = async () => {
    setLoading(true);
    const res = await fetch("/api/factcheck", {
      method: "POST",
      body: JSON.stringify({ claim }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setResult(data.result);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Glowing Blur Background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-indigo-300 opacity-30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-200 opacity-30 rounded-full blur-2xl animate-spin-slow"></div>
      </div>

      {/* Title */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 drop-shadow-lg mb-8 text-center animate-fade-in">
        TRUTHCHECK <span className="italic">AI</span>
      </h1>

      {/* Textarea */}
      <textarea
        placeholder="🔍 Enter a claim or news snippet..."
        value={claim}
        onChange={(e) => setClaim(e.target.value)}
        className="w-full max-w-3xl p-5 text-lg border border-blue-200 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg focus:ring-4 focus:ring-blue-300 outline-none transition-all duration-300"
        rows={6}
      />

      {/* Button */}
      <button
        onClick={handleFactCheck}
        disabled={loading}
        className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out disabled:opacity-60"
      >
        {loading ? "🔄 Checking..." : "✅ Check Claim"}
      </button>

      {/* Result */}
      {result && (
        <div className="mt-10 bg-white/80 backdrop-blur-md border border-blue-100 shadow-xl rounded-2xl p-6 max-w-3xl w-full transition-all duration-300 animate-fade-in">
          <ResultTag result={result} />
          <p className="mt-4 text-gray-800 text-lg leading-relaxed whitespace-pre-line">
            {result}
          </p>
        </div>
      )}
    </main>
  );
}
