import React, { useState, useEffect } from "react";

const SentenceCompositionInterface = () => {
  const exercises = [
    {
      id: 1,
      targetSentence: "Saya makan nasi.",
      correctWords: ["ꦱꦪ", "ꦩꦏ꧀ꦲꦤ꧀", "ꦤꦱꦶ"],
      distractors: ["ꦏꦸꦛ", "ꦱꦸꦮ", "ꦥꦺꦴꦠ꧀"],
    },
    {
      id: 2,
      targetSentence: "Kamu pergi ke pasar.",
      correctWords: ["ꦏꦩꦸ", "ꦥꦼꦂꦒꦶ", "ꦏ", "ꦥꦱꦂ"],
      distractors: ["ꦥꦼꦤ", "ꦢꦺꦴꦭꦺꦴ", "ꦗꦸꦩ꧀"],
    },
    {
      id: 3,
      targetSentence: "Mereka membaca buku.",
      correctWords: ["ꦩꦺꦫꦏ", "ꦩꦼꦩ꧀ꦧꦕ", "ꦧꦸꦏꦸ"],
      distractors: ["ꦲꦶꦁ", "ꦥꦸꦠ", "ꦏꦺꦴꦭ"],
    },
  ];

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(exercises[0]);
  const [userAnswer, setUserAnswer] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [wordBank, setWordBank] = useState([]);

  useEffect(() => {
    const shuffledWords = shuffleArray([
      ...currentExercise.correctWords,
      ...currentExercise.distractors,
    ]);
    setWordBank(shuffledWords);
    setUserAnswer([]);
    setFeedback("");
  }, [currentExercise]);

  const handleWordClick = (word) => {
    if (userAnswer.includes(word)) return;
    setUserAnswer([...userAnswer, word]);
  };

  const handleUndo = () => {
    setUserAnswer(userAnswer.slice(0, -1));
  };

  const handleSubmit = () => {
    const isCorrect =
      userAnswer.join(" ") === currentExercise.correctWords.join(" ");
    setFeedback(isCorrect ? "✅ Jawaban benar!" : "❌ Jawaban salah, coba lagi.");
  };

  const handleNext = () => {
    const nextIndex = currentExerciseIndex + 1;
    if (nextIndex < exercises.length) {
      setCurrentExerciseIndex(nextIndex);
      setCurrentExercise(exercises[nextIndex]);
    } else {
      setFeedback("🎉 Semua latihan selesai!");
    }
  };

  const shuffleArray = (array) => {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  return (
    <div style={{ padding: 32, maxWidth: 800, margin: "auto" }}>
      {/* Prompt Area */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          marginBottom: 24,
          padding: 24,
          boxShadow: "0 1px 4px #e5e7eb",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 16, color: "#6b7280", marginBottom: 8 }}>
          Terjemahkan kalimat ini ke aksara Jawa:
        </div>
        <div style={{ fontSize: 32, fontWeight: 700, color: "#2563eb" }}>
          "{currentExercise.targetSentence}"
        </div>
      </div>

      {/* Answer Area */}
      <div
        style={{
          minHeight: 64,
          border: "2px dashed #d1d5db",
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        {userAnswer.map((word, index) => (
          <div
            key={index}
            style={{
              background: "#e0f2fe",
              padding: "8px 16px",
              borderRadius: 999,
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            {word}
          </div>
        ))}
      </div>

      {/* Word Bank */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 24,
          justifyContent: "center",
        }}
      >
        {wordBank.map((word, index) => (
          <div
            key={index}
            style={{
              background: "#f3f4f6",
              padding: "8px 16px",
              borderRadius: 999,
              fontSize: 20,
              cursor: "pointer",
              border: userAnswer.includes(word) ? "2px solid #60a5fa" : "none",
            }}
            onClick={() => handleWordClick(word)}
          >
            {word}
          </div>
        ))}
      </div>

      {/* Control Buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
        <button
          onClick={handleUndo}
          style={{
            background: "#f3f4f6",
            padding: "8px 16px",
            borderRadius: 8,
            cursor: "pointer",
            border: "1px solid #d1d5db",
          }}
        >
          Undo
        </button>
        <button
          onClick={handleSubmit}
          style={{
            background: "#2563eb",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: 8,
            cursor: "pointer",
            border: "none",
          }}
        >
          Submit
        </button>
        <button
          onClick={handleNext}
          style={{
            background: "#10b981",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: 8,
            cursor: "pointer",
            border: "none",
          }}
        >
          Next
        </button>
      </div>

      {/* Feedback */}
      {feedback && (
        <div style={{ marginTop: 24, textAlign: "center", fontSize: 18 }}>
          {feedback}
        </div>
      )}
    </div>
  );
};

export default SentenceCompositionInterface;
