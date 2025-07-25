import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "@/provider/AuthProvider";
import { getUnitQuestions, submitAnswer } from "@/hooks/api/main";

export default function QuizInterface() {
    const { unitId } = useParams();
    const navigate = useNavigate();
    const auth = useAuth();
    const token = auth?.token;
    const [isLoading, setIsLoading] = useState(true);
    const [unitData, setUnitData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [submitResponse, setSubmitResponse] = useState(null);
    const [score, setScore] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await getUnitQuestions(token, unitId);
                console.log("Unit questions:", response);
                setUnitData(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching questions:", error);
                setIsLoading(false);
            }
        };

        if (token && unitId) {
            fetchQuestions();
        }
    }, [token, unitId]);

    const currentQuestion = unitData?.questions[currentQuestionIndex];
    const progress = unitData
        ? ((currentQuestionIndex + 1) / unitData.total_questions) * 100
        : 0;

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeElapsed((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!unitData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg text-gray-600">
                        Unit tidak ditemukan
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    const handleAnswerSelect = (choice) => {
        if (showResult) return;
        setSelectedAnswer(choice);
    };

    const handleSubmitAnswer = async () => {
        if (!selectedAnswer || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const response = await submitAnswer(
                token,
                currentQuestion.id,
                selectedAnswer
            );
            console.log("Submit response:", response);

            setSubmitResponse(response.data);
            setShowResult(true);

            if (response.data.is_correct) {
                setScore((prev) => prev + 1);
            }
        } catch (error) {
            console.error("Error submitting answer:", error);
            // Show generic error response
            setSubmitResponse({
                is_correct: false,
                correct_answer: currentQuestion.content.correct_answer,
                unit_completion_summary: null,
                newly_unlocked_badges: [],
            });
            setShowResult(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < unitData.total_questions - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedAnswer(null);
            setShowResult(false);
            setSubmitResponse(null);
        } else {
            setQuizCompleted(true);
        }
    };

    const handleRetakeQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setSubmitResponse(null);
        setScore(0);
        setTimeElapsed(0);
        setQuizCompleted(false);
    };

    if (quizCompleted) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 p-4">
                <h2 className="text-3xl font-bold mb-4">Kuis Selesai!</h2>
                <p className="text-lg mb-2">
                    Skor: {score}/{unitData.total_questions}
                </p>
                <p className="text-lg mb-6">
                    Waktu: {Math.floor(timeElapsed / 60)}:
                    {(timeElapsed % 60).toString().padStart(2, "0")}
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={handleRetakeQuiz}
                        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                    >
                        Ulangi Kuis
                    </button>
                    <button
                        onClick={() => navigate("/practice")}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Kembali ke Level
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-6">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <div className="text-center mb-4">
                    <h2 className="text-lg font-semibold">
                        {unitData.unit_info.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                        Soal {currentQuestionIndex + 1} dari{" "}
                        {unitData.total_questions}
                    </p>
                </div>

                <h3 className="text-xl font-semibold mb-4">
                    {currentQuestion.content.text}
                </h3>

                {/* Check if this is a multiple choice question */}
                {currentQuestion.content.choices ? (
                    <div className="grid grid-cols-1 gap-4 mb-6">
                        {currentQuestion.content.choices.map(
                            (choice, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerSelect(choice)}
                                    className={`flex justify-between items-center p-4 rounded-lg border transition-all duration-200 text-left ${
                                        selectedAnswer === choice
                                            ? showResult && submitResponse
                                                ? submitResponse.is_correct &&
                                                  choice ===
                                                      submitResponse.correct_answer
                                                    ? "border-green-500 bg-green-100 text-green-700"
                                                    : !submitResponse.is_correct &&
                                                      choice === selectedAnswer
                                                    ? "border-red-500 bg-red-100 text-red-700"
                                                    : showResult &&
                                                      choice ===
                                                          submitResponse.correct_answer
                                                    ? "border-green-500 bg-green-100 text-green-700"
                                                    : "border-orange-500 bg-orange-100 text-orange-700"
                                                : "border-orange-500 bg-orange-100 text-orange-700"
                                            : showResult &&
                                              submitResponse &&
                                              choice ===
                                                  submitResponse.correct_answer
                                            ? "border-green-500 bg-green-100 text-green-700"
                                            : "border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                                    }`}
                                    disabled={showResult}
                                >
                                    <span className="text-3xl font-bold">
                                        {choice}
                                    </span>
                                </button>
                            )
                        )}
                    </div>
                ) : (
                    /* Not a multiple choice question - could be canvas or other type */
                    <div className="text-center p-8 text-gray-600">
                        <p>Tipe soal ini tidak didukung dalam mode kuis.</p>
                        <p className="text-sm mt-2">
                            Silakan gunakan mode latihan untuk soal jenis ini.
                        </p>
                    </div>
                )}

                {showResult && submitResponse && (
                    <div
                        className={`border-l-4 p-4 rounded mb-6 ${
                            submitResponse.is_correct
                                ? "border-green-500 bg-green-50 text-green-700"
                                : "border-red-500 bg-red-50 text-red-700"
                        }`}
                    >
                        <p className="font-semibold">
                            {submitResponse.is_correct
                                ? "Benar!"
                                : "Belum tepat"}
                        </p>
                        <p className="text-sm mt-1">
                            {submitResponse.is_correct
                                ? "Jawaban kamu benar!"
                                : `Jawaban yang benar adalah "${submitResponse.correct_answer}".`}
                        </p>
                        {submitResponse.newly_unlocked_badges &&
                            submitResponse.newly_unlocked_badges.length > 0 && (
                                <div className="mt-2 p-2 bg-yellow-100 rounded">
                                    <p className="text-sm font-medium text-yellow-800">
                                        🎖️ Badge baru terbuka:{" "}
                                        {submitResponse.newly_unlocked_badges.join(
                                            ", "
                                        )}
                                    </p>
                                </div>
                            )}
                    </div>
                )}

                <div className="text-center">
                    {!showResult ? (
                        currentQuestion.content.choices ? (
                            <button
                                onClick={handleSubmitAnswer}
                                disabled={!selectedAnswer || isSubmitting}
                                className="bg-orange-500 text-white px-6 py-2 rounded disabled:opacity-50 hover:bg-orange-600"
                            >
                                {isSubmitting ? "Mengirim..." : "Kirim Jawaban"}
                            </button>
                        ) : (
                            <button
                                onClick={handleNextQuestion}
                                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                            >
                                Lewati
                            </button>
                        )
                    ) : (
                        <button
                            onClick={handleNextQuestion}
                            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                        >
                            {currentQuestionIndex < unitData.total_questions - 1
                                ? "Lanjut"
                                : "Lihat Hasil"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
