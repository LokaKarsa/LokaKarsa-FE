import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "@/provider/AuthProvider";
import { getUnitQuestions, submitAnswer } from "@/hooks/api/main";
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
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [canvasData, setCanvasData] = useState(null);
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

    const handleAnswerSelect = (choice) => {
        if (showResult || isCanvasQuestion) return;
        setSelectedAnswer(choice);
    };

    const handleCanvasSubmit = (imageData) => {
        setCanvasData(imageData);
        setSelectedAnswer("canvas_drawing"); // Placeholder for canvas submission
    };

    const handleSubmitAnswer = async () => {
        if (!selectedAnswer || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const response = await submitAnswer(
                token,
                currentQuestion.id,
                isCanvasQuestion
                    ? currentQuestion.content.correct_answer
                    : selectedAnswer,
                isCanvasQuestion ? canvasData : null
            );

            console.log("Submit response:", response);

            // For now, we'll determine correctness based on the response
            // You might want to adjust this based on your actual API response structure
            const correct =
                response.success ||
                selectedAnswer === currentQuestion.content.correct_answer;

            setIsCorrect(correct);
            setShowResult(true);

            if (correct) {
                setScore((prev) => prev + 1);
            }
        } catch (error) {
            console.error("Error submitting answer:", error);
            // Still show result even if submission fails
            const correct =
                !isCanvasQuestion &&
                selectedAnswer === currentQuestion.content.correct_answer;
            setIsCorrect(correct);
            setShowResult(true);
            if (correct) {
                setScore((prev) => prev + 1);
            }
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
        } else {
            setQuizCompleted(true);
        }
    };

    const handleRetryUnit = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setCanvasData(null);
        setShowResult(false);
        setScore(0);
        setTimeElapsed(0);
        setQuizCompleted(false);
    };

    if (quizCompleted) {
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
                                    onSubmit={handleCanvasSubmit}
                                    disabled={showResult}
                                />
                                {showResult && (
                                    <div
                                        className={`p-4 rounded-lg border-l-4 ${
                                            isCorrect
                                                ? "border-green-500 bg-green-50 text-green-700"
                                                : "border-red-500 bg-red-50 text-red-700"
                                        }`}
                                    >
                                        <div className="flex items-center space-x-2">
                                            {isCorrect ? (
                                                <CheckCircle className="h-5 w-5" />
                                            ) : (
                                                <XCircle className="h-5 w-5" />
                                            )}
                                            <span className="font-semibold">
                                                {isCorrect
                                                    ? "Benar!"
                                                    : "Belum tepat"}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm">
                                            {isCorrect
                                                ? `Bagus! Tulisan kamu sudah benar untuk aksara "${currentQuestion.content.correct_answer}".`
                                                : `Coba lagi! Aksara yang diminta adalah "${currentQuestion.content.correct_answer}".`}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
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
                                                    ? showResult
                                                        ? choice ===
                                                          currentQuestion
                                                              .content
                                                              .correct_answer
                                                            ? "border-green-500 bg-green-100 text-green-700"
                                                            : "border-red-500 bg-red-100 text-red-700"
                                                        : "border-primary bg-primary/10 text-primary"
                                                    : showResult &&
                                                      choice ===
                                                          currentQuestion
                                                              .content
                                                              .correct_answer
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
