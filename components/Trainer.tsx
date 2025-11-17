"use client";
import { useRouter } from "next/navigation";

import { useState, useRef } from "react";

interface Props {
  target: string;
}

export default function Trainer({ target }: Props) {
  const [input, setInput] = useState("");
  const [cpm, setCpm] = useState(0);
  const [wrongKeys, setWrongKeys] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const startTimeRef = useRef<number | null>(null);

  function finishTest() {
    setIsFinished(true);

    const correct = input.length;
    const wrong = wrongKeys;
    const acc = (correct / (correct + wrong)) * 100;
    setAccuracy(Math.round(acc));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (isFinished) {
      e.preventDefault();
      return;
    }

    const key = e.key;

    // prevent backspace to keep strict mode
    if (key === "Backspace") {
      e.preventDefault();
      return;
    }

    // non-printable keys are fine
    if (key.length !== 1 && key !== "Enter") return;

    const expected = target[input.length];

    // Convert Enter → actual newline for matching
    const actualKey = key === "Enter" ? "\n" : key;

    if (actualKey !== expected) {
      e.preventDefault();
      setWrongKeys((w) => w + 1);

      const correct = input.length;
      const wrong = wrongKeys + 1;
      const acc = (correct / (correct + wrong)) * 100;
      setAccuracy(Math.round(acc));

      return;
    }

    // Start timer on first valid key
    if (!startTimeRef.current) {
      startTimeRef.current = performance.now();
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newInput = e.target.value;
    setInput(newInput);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }

    // CPM
    if (startTimeRef.current) {
      const elapsed = (performance.now() - startTimeRef.current) / 60000;
      const chars = newInput.length;
      const newCPM = Math.round(chars / elapsed);
      if (!isNaN(newCPM)) setCpm(newCPM);
    }

    // AUTO FINISH if user typed the full target
    if (newInput.length === target.length) {
      finishTest();
    }
  }

  function reset() {
    setInput("");
    setCpm(0);
    setWrongKeys(0);
    setAccuracy(100);
    setIsFinished(false);
    startTimeRef.current = null;
  }
  return (
    <div
      className="w-full max-w-5xl mx-auto mt-10 font-mono text-[16px] leading-[20px] tracking-tight
"
    >
      {/* HOME BUTTON */}
      <button
        onClick={() => router.push("/")}
        className="mb-4 px-4 py-1.5 rounded bg-gray-700 hover:bg-gray-600 text-sm text-white"
      >
        ← Home
      </button>

      {/* FLEX LAYOUT: trainer left, stats right */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* LEFT SIDE — Trainer */}
        <div className="relative flex-1">
          {/* FIXED MONO BOX */}
          <div
            className="
      relative
      font-mono text-[16px] leading-[20px] tracking-tight

      whitespace-pre-wrap
      w-full
      min-h-[300px]
      bg-transparent
      p-0
      m-0
    "
          >
            {/* GHOST CODE */}
            <pre
              className="
        absolute inset-0
        text-gray-500 opacity-40
        pointer-events-none
        font-mono text-[16px] leading-[20px] tracking-tight

        whitespace-pre-wrap
        p-0 m-0
      "
            >
              {target}
            </pre>

            {/* TYPED LAYER */}
            <pre
              className="
        absolute inset-0
        text-white pointer-events-none
        font-mono text-[16px] leading-[20px] tracking-tight

        whitespace-pre-wrap
        p-0 m-0
      "
            >
              {target.split("").map((char, i) => (
                <span
                  key={i}
                  className={
                    i < input.length ? "text-white" : "text-transparent"
                  }
                >
                  {char}
                </span>
              ))}
            </pre>

            {/* TEXTAREA EXACTLY OVERLAYED */}
            <textarea
              ref={textareaRef}
              value={input}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              className="
    relative w-full
    bg-transparent text-transparent caret-white
    outline-none resize-none border-none
    font-mono text-[16px] leading-[20px] tracking-tight
    whitespace-pre-wrap
    min-h-[200px]
    overflow-auto
    p-0 m-0
  "
              spellCheck={false}
              autoFocus
            />
          </div>
        </div>

        {/* RIGHT SIDE — Stats */}
        <div className="md:w-48 p-4 border border-gray-700 rounded text-gray-300 h-fit md:sticky md:top-10">
          <h3 className="font-bold text-lg mb-3">Stats</h3>
          <p className="mb-2">
            Characters: {input.length} / {target.length}
          </p>
          <p className="mb-2">CPM: {cpm}</p>
          <p className="mb-2">Accuracy: {accuracy}%</p>
        </div>
      </div>

      {/* RESULT MODAL */}
      {isFinished && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="p-6 bg-gray-900 rounded-xl border border-gray-700 text-center shadow-xl">
            <h2 className="text-2xl font-bold mb-4">🎉 Completed!</h2>
            <p className="text-lg mb-2">
              CPM: <span className="text-green-400">{cpm}</span>
            </p>
            <p className="text-lg mb-4">
              Accuracy: <span className="text-blue-400">{accuracy}%</span>
            </p>

            <button
              onClick={reset}
              className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
