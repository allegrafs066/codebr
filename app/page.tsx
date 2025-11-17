"use client";

import Link from "next/link";
import { useState } from "react";
import { archetypes } from "@/data/archetypes";

export default function Home() {
  const [customCode, setCustomCode] = useState("");
  const MAX_CHARS = 2000; // cap to prevent huge payload

  const isTooLong = customCode.length > MAX_CHARS;

  return (
    <div className="max-w-2xl mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-6">Code Typing Practice</h1>
      <p className="text-gray-400 mb-6">
        Choose a coding archetype or create your own.
      </p>

      {/* BUILT-IN ARCHETYPES */}
      <div className="grid gap-4 mb-10">
        {archetypes.map((a) => (
          <Link
            key={a.id}
            href={`/trainer?id=${a.id}`}
            className="p-4 border border-gray-600 rounded hover:bg-gray-800 transition"
          >
            {a.title}
          </Link>
        ))}
      </div>

      {/* CUSTOM CODE INPUT */}
      <div className="p-4 border border-gray-700 rounded mb-4">
        <h2 className="text-xl font-semibold mb-3">Custom Code Challenge</h2>

        <textarea
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
          placeholder={`Paste your code here...\n(Max ${MAX_CHARS} chars)`}
          className="
            w-full h-40 p-3 bg-gray-900 border border-gray-700 
            rounded text-white font-mono resize-none outline-none
          "
        />

        {/* Length warning */}
        <p className="text-sm text-gray-400 mt-1">
          {customCode.length} / {MAX_CHARS}
        </p>

        {isTooLong && (
          <p className="text-red-400 text-sm mt-1">
            Code too long! Trim it down.
          </p>
        )}

        <Link
          href={
            !customCode || isTooLong
              ? "#"
              : `/trainer?custom=${encodeURIComponent(customCode)}`
          }
          className={`
            mt-3 inline-block px-4 py-2 rounded 
            text-white transition
            ${
              !customCode || isTooLong
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }
          `}
        >
          Start Custom Challenge
        </Link>
      </div>
    </div>
  );
}
