import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "@/provider/AuthProvider";
import {
    getUnitQuestions,
    submitAnswer,
    predictAksara,
} from "@/hooks/api/main";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { WritingCanvas } from "./writing-canvas";

export function PracticeInterface() {
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
    const [canvasData, setCanvasData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const canvasRefs = useRef(null);

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

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeElapsed((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!unitData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg text-muted-foreground">
                        Unit tidak ditemukan
                    </p>
                    <Button onClick={() => navigate(-1)} className="mt-4">
                        Kembali
                    </Button>
                </div>
            </div>
        );
    }

    const currentQuestion = unitData.questions[currentQuestionIndex];
    const progress =
        ((currentQuestionIndex + 1) / unitData.total_questions) * 100;
    const isCanvasQuestion = currentQuestion?.type === "canvas";
    const isMultipleChoiceQuestion =
        currentQuestion?.type === "multiple_choice" &&
        currentQuestion?.content?.choices;

    const handleAnswerSelect = (choice) => {
        if (showResult || isCanvasQuestion) return;
        setSelectedAnswer(choice);
    };

    const handleCanvasSubmit = async () => {
        if (isSubmitting) return;

        const canvasRef = canvasRefs.current;
        if (!canvasRef || !canvasRef.hasDrawn) {
            alert("Silakan gambar terlebih dahulu!");
            return;
        }

        setIsSubmitting(true);

        try {
            // Get canvas blob for AI prediction
            const blob = await canvasRef.getCanvasBlob();
            if (!blob) {
                throw new Error("Gagal mengambil gambar dari canvas");
            }

            // Call AI prediction
            const predictionResult = await predictAksara(blob);

            // Check if prediction matches correct answer
            const isCorrect =
                predictionResult.prediction ===
                currentQuestion.content.correct_answer;

            // Create response with AI prediction
            const mockResponse = {
                is_correct: isCorrect,
                correct_answer: currentQuestion.content.correct_answer,
                predicted_answer: predictionResult.prediction,
                confidence: predictionResult.confidence,
                unit_completion_summary: null,
                newly_unlocked_badges: isCorrect ? ["AI Scholar"] : [],
            };

            setSubmitResponse(mockResponse);
            setShowResult(true);

            if (isCorrect) {
                setScore((prev) => prev + 1);
            }
        } catch (error) {
            console.error("Error processing canvas submission:", error);

            // Fallback response
            const fallbackResponse = {
                is_correct: false,
                correct_answer: currentQuestion.content.correct_answer,
                error_message: "Gagal memproses gambar. Coba lagi.",
                unit_completion_summary: null,
                newly_unlocked_badges: [],
            };

            setSubmitResponse(fallbackResponse);
            setShowResult(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmitAnswer = async () => {
        if (!selectedAnswer || isSubmitting) return;

        setIsSubmitting(true);

        try {
            let answerData = selectedAnswer;

            // For canvas questions, use the canvas data
            if (isCanvasQuestion && canvasData) {
                // For canvas questions, just send a simple identifier
                answerData = "canvas_drawing";
            }

            const response = await submitAnswer(
                token,
                currentQuestion.id,
                answerData
            );
            console.log("Submit response:", response);

            setSubmitResponse(response.data);
            setShowResult(true);

            if (response.data.is_correct) {
                setScore((prev) => prev + 1);
            }
        } catch (error) {
            console.error("Error submitting answer:", error);

            // Create a simple mock response for failed submissions
            let mockResponse = {
                is_correct: false,
                correct_answer: currentQuestion.content.correct_answer,
                unit_completion_summary: null,
                newly_unlocked_badges: [],
            };

            setSubmitResponse(mockResponse);
            setShowResult(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < unitData.total_questions - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedAnswer(null);
            setCanvasData(null);
            setShowResult(false);
            setSubmitResponse(null);
        } else {
            setQuizCompleted(true);
        }
    };

    const handleRetryUnit = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setCanvasData(null);
        setShowResult(false);
        setSubmitResponse(null);
        setScore(0);
        setTimeElapsed(0);
        setQuizCompleted(false);
    };

    if (quizCompleted) {
        // Get all newly unlocked badges from all answers
        const allUnlockedBadges = [];
        // This would be collected during the quiz process - for now just show general completion

        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
                <Card className="w-full max-w-lg">
                    <CardContent className="pt-6 text-center space-y-4">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold">Unit Selesai!</h2>
                        <div className="space-y-2">
                            <p className="text-lg">
                                Skor: {score}/{unitData.total_questions}
                            </p>
                            <p className="text-lg">
                                Waktu: {Math.floor(timeElapsed / 60)}:
                                {(timeElapsed % 60).toString().padStart(2, "0")}
                            </p>
                            <p className="text-muted-foreground">
                                Persentase:{" "}
                                {Math.round(
                                    (score / unitData.total_questions) * 100
                                )}
                                %
                            </p>
                        </div>
                        {allUnlockedBadges.length > 0 && (
                            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm font-medium text-yellow-800 mb-2">
                                    🎖️ Badge Baru Terbuka!
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {allUnlockedBadges.map((badge, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                                        >
                                            {badge}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="flex gap-2 pt-4">
                            <Button
                                onClick={handleRetryUnit}
                                variant="outline"
                                className="flex-1"
                            >
                                Ulangi Unit
                            </Button>
                            <Button
                                onClick={() => navigate("/practice")}
                                className="flex-1"
                            >
                                Kembali ke Level
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate("/practice")}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Button>
                        <div className="text-center">
                            <h1 className="font-semibold">
                                {unitData.unit_info.name}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Soal {currentQuestionIndex + 1} dari{" "}
                                {unitData.total_questions}
                            </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {Math.floor(timeElapsed / 60)}:
                            {(timeElapsed % 60).toString().padStart(2, "0")}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Question Card */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <h2 className="text-xl font-semibold mb-6 text-center">
                            {currentQuestion.content.text}
                        </h2>

                        {isCanvasQuestion ? (
                            /* Canvas Question */
                            <div className="space-y-4">
                                <WritingCanvas
                                    ref={canvasRefs}
                                    disabled={showResult}
                                    expectedAnswer={
                                        currentQuestion.content.correct_answer
                                    }
                                    showGuide={true}
                                    targetCharacter={
                                        currentQuestion.content.correct_answer
                                    }
                                />

                                {/* Submit Button for Canvas */}
                                {!showResult && (
                                    <div className="flex justify-center">
                                        <Button
                                            onClick={() => handleCanvasSubmit()}
                                            disabled={isSubmitting}
                                            size="lg"
                                            className="px-8"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Mengirim Jawaban...
                                                </>
                                            ) : (
                                                "Submit Jawaban"
                                            )}
                                        </Button>
                                    </div>
                                )}
                                {showResult && submitResponse && (
                                    <div
                                        className={`p-4 rounded-lg border-l-4 ${
                                            submitResponse.is_correct
                                                ? "border-green-500 bg-green-50 text-green-700"
                                                : "border-red-500 bg-red-50 text-red-700"
                                        }`}
                                    >
                                        <div className="flex items-center space-x-2">
                                            {submitResponse.is_correct ? (
                                                <CheckCircle className="h-5 w-5" />
                                            ) : (
                                                <XCircle className="h-5 w-5" />
                                            )}
                                            <span className="font-semibold">
                                                {submitResponse.is_correct
                                                    ? "Hebat! Tulisan Anda Benar!"
                                                    : "Belum Tepat, Coba Lagi!"}
                                            </span>
                                        </div>

                                        {submitResponse.predicted_answer && (
                                            <div className="mt-2 space-y-1">
                                                <p className="text-sm">
                                                    <span className="font-medium">
                                                        AI menganalisis gambar
                                                        Anda sebagai:
                                                    </span>
                                                    <span className="ml-2 text-2xl font-bold">
                                                        {
                                                            submitResponse.predicted_answer
                                                        }
                                                    </span>
                                                </p>
                                                {submitResponse.confidence && (
                                                    <p className="text-xs">
                                                        Tingkat kepercayaan AI:{" "}
                                                        {(
                                                            submitResponse.confidence *
                                                            100
                                                        ).toFixed(1)}
                                                        %
                                                    </p>
                                                )}
                                                <p className="text-sm">
                                                    <span className="font-medium">
                                                        Jawaban yang benar:
                                                    </span>
                                                    <span className="ml-2 text-2xl font-bold">
                                                        {
                                                            submitResponse.correct_answer
                                                        }
                                                    </span>
                                                </p>
                                                {!submitResponse.is_correct && (
                                                    <p className="text-sm mt-2 text-blue-600">
                                                        💡 Coba perhatikan
                                                        bentuk dan garis aksara
                                                        "
                                                        {
                                                            submitResponse.correct_answer
                                                        }
                                                        " dengan lebih teliti!
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {submitResponse.error_message && (
                                            <p className="mt-1 text-sm">
                                                {submitResponse.error_message}
                                            </p>
                                        )}
                                        {submitResponse.newly_unlocked_badges &&
                                            submitResponse.newly_unlocked_badges
                                                .length > 0 && (
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
                            </div>
                        ) : isMultipleChoiceQuestion ? (
                            /* Multiple Choice Question */
                            <div className="space-y-3">
                                {currentQuestion.content.choices.map(
                                    (choice, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                handleAnswerSelect(choice)
                                            }
                                            className={`w-full p-4 rounded-lg border transition-all duration-200 text-left ${
                                                selectedAnswer === choice
                                                    ? showResult &&
                                                      submitResponse
                                                        ? submitResponse.is_correct &&
                                                          choice ===
                                                              submitResponse.correct_answer
                                                            ? "border-green-500 bg-green-100 text-green-700"
                                                            : !submitResponse.is_correct &&
                                                              choice ===
                                                                  selectedAnswer
                                                            ? "border-red-500 bg-red-100 text-red-700"
                                                            : showResult &&
                                                              choice ===
                                                                  submitResponse.correct_answer
                                                            ? "border-green-500 bg-green-100 text-green-700"
                                                            : "border-primary bg-primary/10 text-primary"
                                                        : "border-primary bg-primary/10 text-primary"
                                                    : showResult &&
                                                      submitResponse &&
                                                      choice ===
                                                          submitResponse.correct_answer
                                                    ? "border-green-500 bg-green-100 text-green-700"
                                                    : "border-gray-300 hover:border-primary/50 hover:bg-primary/5"
                                            }`}
                                            disabled={showResult}
                                        >
                                            <span className="font-medium">
                                                {choice}
                                            </span>
                                        </button>
                                    )
                                )}
                                {showResult && submitResponse && (
                                    <div
                                        className={`p-4 rounded-lg border-l-4 ${
                                            submitResponse.is_correct
                                                ? "border-green-500 bg-green-50 text-green-700"
                                                : "border-red-500 bg-red-50 text-red-700"
                                        }`}
                                    >
                                        <div className="flex items-center space-x-2">
                                            {submitResponse.is_correct ? (
                                                <CheckCircle className="h-5 w-5" />
                                            ) : (
                                                <XCircle className="h-5 w-5" />
                                            )}
                                            <span className="font-semibold">
                                                {submitResponse.is_correct
                                                    ? "Benar!"
                                                    : "Belum tepat"}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm">
                                            {submitResponse.is_correct
                                                ? "Jawaban kamu benar!"
                                                : `Jawaban yang benar adalah "${submitResponse.correct_answer}".`}
                                        </p>
                                        {submitResponse.newly_unlocked_badges &&
                                            submitResponse.newly_unlocked_badges
                                                .length > 0 && (
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
                            </div>
                        ) : (
                            /* Other Question Types - Fallback */
                            <div className="text-center p-8 text-muted-foreground">
                                <p>
                                    Tipe soal tidak didukung:{" "}
                                    {currentQuestion?.type}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Action Button */}
                <div className="text-center">
                    {!showResult ? (
                        <Button
                            onClick={handleSubmitAnswer}
                            disabled={!selectedAnswer || isSubmitting}
                            className="px-8 py-3"
                            size="lg"
                        >
                            {isSubmitting ? "Mengirim..." : "Kirim Jawaban"}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNextQuestion}
                            className="px-8 py-3"
                            size="lg"
                        >
                            {currentQuestionIndex < unitData.total_questions - 1
                                ? "Lanjut"
                                : "Lihat Hasil"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
