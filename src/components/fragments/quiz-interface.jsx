import React, { useState, useEffect } from "react";

const quizQuestions = [
  {
    id: 1,
    question: "Aksara Jawa untuk 'ha' adalah...",
    options: [
      { id: "a", text: "ha", javanese: "ꦲ", isCorrect: true },
      { id: "b", text: "na", javanese: "ꦤ", isCorrect: false },
      { id: "c", text: "ca", javanese: "ꦕ", isCorrect: false },
      { id: "d", text: "ra", javanese: "ꦫ", isCorrect: false },
    ],
    explanation:
      "Aksara 'ha' (ꦲ) adalah aksara pertama dalam urutan Hanacaraka dan memiliki bentuk yang khas dengan garis melengkung di bagian atas.",
  },
  // Tambahkan soal lainnya sesuai kebutuhan
];

export default function QuizInterface() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (optionId) => {
    if (showResult) return;
    setSelectedAnswer(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const selectedOption = currentQuestion.options.find((opt) => opt.id === selectedAnswer);
    const correct = selectedOption?.isCorrect || false;

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTimeElapsed(0);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 p-4">
        <h2 className="text-3xl font-bold mb-4">Kuis Selesai!</h2>
        <p className="text-lg mb-2">Skor: {score}/{quizQuestions.length}</p>
        <p className="text-lg mb-6">Waktu: {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, "0")}</p>
        <button onClick={handleRetakeQuiz} className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
          Ulangi Kuis
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-6">
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <h3 className="text-xl font-semibold mb-4">{currentQuestion.question}</h3>
        <div className="grid grid-cols-1 gap-4 mb-6">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswerSelect(option.id)}
              className={`flex justify-between items-center p-4 rounded-lg border transition-all duration-200 text-left ${
                selectedAnswer === option.id
                  ? showResult
                    ? option.isCorrect
                      ? "border-green-500 bg-green-100 text-green-700"
                      : "border-red-500 bg-red-100 text-red-700"
                    : "border-orange-500 bg-orange-100 text-orange-700"
                  : showResult && option.isCorrect
                  ? "border-green-500 bg-green-100 text-green-700"
                  : "border-gray-300 hover:border-orange-400 hover:bg-orange-50"
              }`}
              disabled={showResult}
            >
              <span className="text-3xl font-bold">{option.javanese}</span>
              <span className="text-base">({option.text})</span>
            </button>
          ))}
        </div>

        {showResult && currentQuestion.explanation && (
          <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded mb-6">
            <p className="font-semibold">Penjelasan:</p>
            <p className="text-sm">{currentQuestion.explanation}</p>
          </div>
        )}

        <div className="text-center">
          {!showResult ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className="bg-orange-500 text-white px-6 py-2 rounded disabled:opacity-50 hover:bg-orange-600"
            >
              Kirim Jawaban
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              {currentQuestionIndex < quizQuestions.length - 1 ? "Lanjut" : "Lihat Hasil"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
