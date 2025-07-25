import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RotateCcw, Check, SkipForward, Clock, Target } from "lucide-react";

const exercises = [
  {
    id: "word-1",
    targetWord: "gajah",
    targetWordJavanese: ["ꦒ", "ꦗ", "ꦃ"],
    availableCharacters: ["ꦒ", "ꦗ", "ꦃ"],
    distractors: ["ꦏ", "ꦤ", "ꦲ", "ꦱ"],
  },
  {
    id: "word-2",
    targetWord: "buku",
    targetWordJavanese: ["ꦧ", "ꦸ", "ꦏ", "ꦸ"],
    availableCharacters: ["ꦧ", "ꦸ", "ꦏ"],
    distractors: ["ꦒ", "ꦤ", "ꦲ", "ꦱ", "ꦮ"],
  },
  {
    id: "word-3",
    targetWord: "nama",
    targetWordJavanese: ["ꦤ", "ꦩ"],
    availableCharacters: ["ꦤ", "ꦩ"],
    distractors: ["ꦒ", "ꦗ", "ꦲ", "ꦱ", "ꦏ"],
  },
];

export function WordCompositionInterface() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [composedWord, setComposedWord] = useState([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentExercise = exercises[currentExerciseIndex];
  const allCharacters = [...currentExercise.availableCharacters, ...currentExercise.distractors].sort(
    () => Math.random() - 0.5
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentExerciseIndex]);

  const handleCharacterClick = (character) => {
    if (composedWord.length < currentExercise.targetWordJavanese.length) {
      setComposedWord((prev) => [...prev, character]);
    }
  };

  const handleComposedCharacterClick = (index) => {
    setComposedWord((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCheck = () => {
    if (composedWord.length === 0) return;

    const correct = JSON.stringify(composedWord) === JSON.stringify(currentExercise.targetWordJavanese);
    const calculatedAccuracy = correct
      ? 100
      : Math.max(
          0,
          (composedWord.filter((char, index) => char === currentExercise.targetWordJavanese[index]).length /
            currentExercise.targetWordJavanese.length) *
            100
        );

    setAccuracy(calculatedAccuracy);
    setIsCorrect(correct);
    setShowFeedback(true);
  };

  const handleClear = () => {
    setComposedWord([]);
    setAccuracy(0);
    setShowFeedback(false);
  };

  const handleNext = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
      setComposedWord([]);
      setTimeElapsed(0);
      setAccuracy(0);
      setShowFeedback(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-16 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Rangkai Kata</Badge>
              <div className="text-sm text-muted-foreground">
                {currentExerciseIndex + 1}/{exercises.length}
              </div>
            </div>
          </div>
          <Progress value={((currentExerciseIndex + 1) / exercises.length) * 100} className="h-2" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Composition Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Prompt Area */}
            <Card className="animate-in slide-in-from-top duration-500">
              <CardHeader className="text-center">
                <CardTitle className="text-sm text-muted-foreground mb-2">Tulis kata ini dalam aksara Jawa:</CardTitle>
                <div className="text-6xl font-bold text-primary mb-2 animate-in zoom-in duration-700">
                  {currentExercise.targetWord}
                </div>
                <div className="text-lg text-muted-foreground">({currentExercise.targetWord})</div>
              </CardHeader>
            </Card>

            {/* Composition Area */}
            <Card className="animate-in slide-in-from-left duration-700">
              <CardHeader>
                <CardTitle className="text-xl">Area Susunan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center space-x-4 mb-6">
                  {Array.from({ length: currentExercise.targetWordJavanese.length }).map((_, index) => (
                    <div
                      key={index}
                      className={`w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center text-3xl font-bold transition-all duration-300 ${
                        composedWord[index]
                          ? "border-primary bg-primary/10 text-primary cursor-pointer hover:bg-primary/20"
                          : "border-muted bg-muted/30 text-muted-foreground"
                      }`}
                      onClick={() => composedWord[index] && handleComposedCharacterClick(index)}
                    >
                      {composedWord[index] || "_"}
                    </div>
                  ))}
                </div>

                {/* Character Bank */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Bank Aksara</h3>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                    {allCharacters.map((character, index) => (
                      <Button
                        key={`${character}-${index}`}
                        variant="outline"
                        className="h-16 text-2xl font-bold hover:scale-105 transition-all duration-200 bg-transparent"
                        onClick={() => handleCharacterClick(character)}
                        disabled={composedWord.length >= currentExercise.targetWordJavanese.length}
                      >
                        {character}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feedback */}
            {showFeedback && (
              <Card
                className={`animate-in slide-in-from-bottom duration-300 ${isCorrect ? "border-green-500" : "border-red-500"}`}
              >
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className={`text-2xl font-bold mb-2 ${isCorrect ? "text-green-500" : "text-red-500"}`}>
                      {isCorrect ? "🎉 Benar!" : "❌ Coba Lagi"}
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {isCorrect
                        ? `Hebat! Kata "${currentExercise.targetWord}" benar!`
                        : `Hampir benar! Perhatikan urutan aksara untuk kata "${currentExercise.targetWord}"`}
                    </p>
                    {isCorrect && (
                      <Button onClick={handleNext} className="mr-2">
                        Lanjut
                      </Button>
                    )}
                    <Button variant="outline" onClick={handleClear}>
                      {isCorrect ? "Ulangi" : "Coba Lagi"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Control Buttons */}
            {!showFeedback && (
              <div className="flex space-x-3 animate-in slide-in-from-bottom duration-500">
                <Button
                  onClick={handleCheck}
                  className="flex-1 hover:scale-105 transition-all duration-200"
                  disabled={composedWord.length === 0}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Periksa
                </Button>
                <Button variant="outline" onClick={handleClear}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Hapus
                </Button>
                <Button variant="ghost" onClick={handleNext}>
                  <SkipForward className="h-4 w-4 mr-2" />
                  Lewati
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timer */}
            <Card className="animate-in slide-in-from-right duration-300">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-3xl font-bold text-primary">
                    {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, "0")}
                  </div>
                  <p className="text-sm text-muted-foreground">Waktu latihan</p>
                </div>
              </CardContent>
            </Card>

            {/* Accuracy */}
            <Card className="animate-in slide-in-from-right duration-500">
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <Target className="h-4 w-4 mr-2 text-primary" />
                  Akurasi Susunan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Akurasi</span>
                    <span>{Math.round(accuracy)}%</span>
                  </div>
                  <Progress value={accuracy} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card className="animate-in slide-in-from-right duration-700">
              <CardHeader>
                <CardTitle className="text-sm">Progress Kata</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Kata {currentExerciseIndex + 1}</span>
                    <span>
                      {composedWord.length}/{currentExercise.targetWordJavanese.length}
                    </span>
                  </div>
                  <Progress
                    value={(composedWord.length / currentExercise.targetWordJavanese.length) * 100}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">Aksara tersusun</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
