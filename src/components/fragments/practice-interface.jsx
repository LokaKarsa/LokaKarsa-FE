"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { WritingCanvas } from "@/components/writing-canvas"
import { FeedbackModal } from "@/components/feedback-modal"
import { StrokeGuide } from "@/components/stroke-guide"
import { useApp } from "@/components/app-provider"
import { ArrowLeft, RotateCcw, Check, SkipForward, Play, Clock, Target, Zap, Lightbulb } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const characters = [
  {
    aksara: "ꦲ",
    romanization: "ha",
    strokes: [
      {
        path: "M60,25 Q80,20 100,25 Q120,30 140,25",
        order: 1,
        direction: "curved-horizontal",
        description: "Garis melengkung atas",
      },
      {
        path: "M100,25 L100,45 Q105,50 110,45",
        order: 2,
        direction: "vertical-hook",
        description: "Garis tegak dengan kait",
      },
      {
        path: "M85,40 Q100,35 115,40",
        order: 3,
        direction: "curved-horizontal",
        description: "Garis melengkung tengah",
      },
      {
        path: "M70,50 Q85,55 100,50 Q115,45 130,50",
        order: 4,
        direction: "curved-horizontal",
        description: "Garis melengkung bawah",
      },
    ],
  },
  {
    aksara: "ꦤ",
    romanization: "na",
    strokes: [
      {
        path: "M70,30 Q90,25 110,30 Q130,35 140,30",
        order: 1,
        direction: "curved-horizontal",
        description: "Garis melengkung atas",
      },
      {
        path: "M105,30 L105,50",
        order: 2,
        direction: "vertical",
        description: "Garis tegak tengah",
      },
      {
        path: "M85,45 Q105,40 125,45",
        order: 3,
        direction: "curved-horizontal",
        description: "Garis melengkung bawah",
      },
    ],
  },
  {
    aksara: "ꦕ",
    romanization: "ca",
    strokes: [
      {
        path: "M75,35 Q95,30 115,35 Q125,40 130,45",
        order: 1,
        direction: "curved",
        description: "Lengkungan utama",
      },
      {
        path: "M110,35 L110,50 Q115,55 120,50",
        order: 2,
        direction: "vertical-hook",
        description: "Garis tegak dengan kait",
      },
      {
        path: "M95,50 Q110,45 125,50",
        order: 3,
        direction: "curved-horizontal",
        description: "Garis melengkung bawah",
      },
    ],
  },
  {
    aksara: "ꦫ",
    romanization: "ra",
    strokes: [
      {
        path: "M80,30 Q100,25 120,30 Q130,35 125,40",
        order: 1,
        direction: "curved",
        description: "Lengkungan atas",
      },
      {
        path: "M100,30 L100,55",
        order: 2,
        direction: "vertical",
        description: "Garis tegak panjang",
      },
      {
        path: "M85,45 Q100,40 115,45 Q125,50 120,55",
        order: 3,
        direction: "curved",
        description: "Lengkungan tengah",
      },
      {
        path: "M90,55 Q105,50 120,55",
        order: 4,
        direction: "curved-horizontal",
        description: "Garis melengkung bawah",
      },
    ],
  },
  {
    aksara: "ꦏ",
    romanization: "ka",
    strokes: [
      {
        path: "M75,25 Q95,20 115,25 Q125,30 130,35",
        order: 1,
        direction: "curved",
        description: "Lengkungan atas kanan",
      },
      {
        path: "M95,25 L95,50 Q100,55 105,50",
        order: 2,
        direction: "vertical-hook",
        description: "Garis tegak dengan kait",
      },
      {
        path: "M80,40 Q95,35 110,40",
        order: 3,
        direction: "curved-horizontal",
        description: "Garis melengkung tengah",
      },
      {
        path: "M70,50 Q85,55 100,50",
        order: 4,
        direction: "curved-horizontal",
        description: "Lengkungan bawah kiri",
      },
    ],
  },
]

export function PracticeInterface() {
  const { state, dispatch, playSound, triggerHaptic } = useApp()
  const router = useRouter()
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [strokeAccuracy, setStrokeAccuracy] = useState(0)
  const [strokeOrder, setStrokeOrder] = useState([])
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [showGuide, setShowGuide] = useState(true)
  const [showStrokeGuide, setShowStrokeGuide] = useState(false)
  const [userStrokes, setUserStrokes] = useState([])
  const [sessionStartTime] = useState(Date.now())
  const canvasRef = useRef(null)
  const timerRef = useRef()

  const currentCharacter = characters[currentCharacterIndex]

  useEffect(() => {
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [currentCharacterIndex])

  useEffect(() => {
    // Initialize stroke order tracking
    setStrokeOrder(new Array(currentCharacter.strokes.length).fill(false))
    setTimeElapsed(0)
    setUserStrokes([])
    setStrokeAccuracy(0)
  }, [currentCharacterIndex])

  const analyzeStrokes = (drawnStrokes) => {
    // Simple stroke analysis - in a real app, this would use ML
    const expectedStrokes = currentCharacter.strokes.length
    const accuracy = Math.min(100, (drawnStrokes.length / expectedStrokes) * 100)

    // Simulate stroke order checking
    const orderCorrect = drawnStrokes.map(
      (_, index) => Math.random() > 0.3, // 70% chance of correct order
    )

    setStrokeAccuracy(accuracy)
    setStrokeOrder(orderCorrect)

    return {
      accuracy,
      orderCorrect: orderCorrect.every(Boolean),
      timeSpent: timeElapsed,
    }
  }

  const handleCheck = () => {
    playSound("click")
    triggerHaptic("medium")

    const analysis = analyzeStrokes(userStrokes)
    const success = analysis.accuracy > 70 && analysis.orderCorrect

    setIsCorrect(success)
    setShowFeedback(true)

    if (success) {
      playSound("success")
      triggerHaptic("heavy")
      dispatch({
        type: "COMPLETE_CHARACTER",
        accuracy: analysis.accuracy,
        timeSpent: analysis.timeSpent,
      })

      // Check for achievements
      if (analysis.accuracy === 100) {
        dispatch({ type: "EARN_ACHIEVEMENT", achievementId: "perfect-accuracy" })
      }
      if (analysis.timeSpent <= 5) {
        dispatch({ type: "EARN_ACHIEVEMENT", achievementId: "speed-demon" })
      }
    } else {
      playSound("error")
      triggerHaptic("light")
    }
  }

  const handleClear = () => {
    playSound("click")
    triggerHaptic("light")

    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
    setUserStrokes([])
    setStrokeAccuracy(0)
    setStrokeOrder(new Array(currentCharacter.strokes.length).fill(false))
  }

  const handleSkip = () => {
    playSound("click")
    triggerHaptic("light")
    handleNext()
  }

  const handleNext = () => {
    if (currentCharacterIndex < characters.length - 1) {
      setCurrentCharacterIndex((prev) => prev + 1)
      dispatch({ type: "NEXT_CHARACTER" })
    } else {
      // End practice session
      dispatch({ type: "END_PRACTICE" })
      router.push("/practice-complete")
    }
    setShowFeedback(false)
  }

  const replayGuide = () => {
    playSound("click")
    triggerHaptic("light")
    setShowGuide(true)
    setTimeout(() => setShowGuide(false), 3000)
  }

  const toggleStrokeGuide = () => {
    playSound("click")
    triggerHaptic("light")
    setShowStrokeGuide(!showStrokeGuide)
  }

  const handleStrokeDrawn = (stroke) => {
    setUserStrokes((prev) => [...prev, stroke])

    // Provide immediate feedback
    const currentStrokeIndex = userStrokes.length
    if (currentStrokeIndex < currentCharacter.strokes.length) {
      // Simple validation - in real app, this would be more sophisticated
      const isCorrectOrder = Math.random() > 0.3
      setStrokeOrder((prev) => {
        const newOrder = [...prev]
        newOrder[currentStrokeIndex] = isCorrectOrder
        return newOrder
      })

      if (isCorrectOrder) {
        playSound("success")
        triggerHaptic("light")
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-16 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Aksara Murda</Badge>
              <div className="text-sm text-muted-foreground">
                {currentCharacterIndex + 1}/{characters.length}
              </div>
            </div>
          </div>
          <Progress value={((currentCharacterIndex + 1) / characters.length) * 100} className="h-2" />
        </div>
      </div>

      {/* Main Practice Area */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Character Display */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="animate-in slide-in-from-top duration-500">
              <CardHeader className="text-center">
                <CardTitle className="text-sm text-muted-foreground mb-2">Tulis aksara ini:</CardTitle>
                <div className="text-8xl font-bold text-primary mb-2 animate-in zoom-in duration-700">
                  {currentCharacter.aksara}
                </div>
                <div className="text-2xl text-muted-foreground">({currentCharacter.romanization})</div>
              </CardHeader>
            </Card>

            {/* Writing Canvas */}
            <Card className="animate-in slide-in-from-left duration-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg">Area Latihan</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={replayGuide}>
                    <Play className="h-4 w-4 mr-2" />
                    Panduan
                  </Button>
                  <Button variant="outline" size="sm" onClick={toggleStrokeGuide}>
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Goresan
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <WritingCanvas
                  ref={canvasRef}
                  showGuide={showGuide}
                  targetCharacter={currentCharacter.aksara}
                  onStrokeDrawn={handleStrokeDrawn}
                />
              </CardContent>
            </Card>

            {/* Stroke Guide */}
            {showStrokeGuide && (
              <Card className="animate-in slide-in-from-bottom duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">Panduan Urutan Goresan</CardTitle>
                </CardHeader>
                <CardContent>
                  <StrokeGuide strokes={currentCharacter.strokes} currentStroke={userStrokes.length} />
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 animate-in slide-in-from-bottom duration-500">
              <Button
                onClick={handleCheck}
                className="flex-1 hover:scale-105 transition-all duration-200"
                disabled={userStrokes.length === 0}
              >
                <Check className="h-4 w-4 mr-2" />
                Periksa
              </Button>
              <Button variant="outline" onClick={handleClear}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Hapus
              </Button>
              <Button variant="ghost" onClick={handleSkip}>
                <SkipForward className="h-4 w-4 mr-2" />
                Lewati
              </Button>
            </div>
          </div>

          {/* Feedback Panel */}
          <div className="space-y-6">
            {/* Timer */}
            <Card className="animate-in slide-in-from-right duration-300">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-3xl font-bold text-blue-500">
                    {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, "0")}
                  </div>
                  <p className="text-sm text-muted-foreground">Waktu latihan</p>
                </div>
              </CardContent>
            </Card>

            {/* Stroke Accuracy */}
            <Card className="animate-in slide-in-from-right duration-500">
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <Target className="h-4 w-4 mr-2 text-blue-500" />
                  Akurasi Goresan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Akurasi</span>
                    <span>{Math.round(strokeAccuracy)}%</span>
                  </div>
                  <Progress value={strokeAccuracy} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Stroke Order */}
            <Card className="animate-in slide-in-from-right duration-700">
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                  Urutan Goresan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  {strokeOrder.map((correct, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                        index < userStrokes.length
                          ? correct
                            ? "bg-green-500 text-white scale-110"
                            : "bg-red-500 text-white"
                          : index === userStrokes.length
                            ? "bg-blue-500 text-white animate-pulse"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Goresan {userStrokes.length + 1} dari {currentCharacter.strokes.length}
                </p>
              </CardContent>
            </Card>

            {/* XP Progress */}
            <Card className="animate-in slide-in-from-right duration-900">
              <CardHeader>
                <CardTitle className="text-sm">XP Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Level {state.user.level}</span>
                    <span>{state.user.xp} XP</span>
                  </div>
                  <Progress value={(state.user.xp % 500) / 5} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {500 - (state.user.xp % 500)} XP untuk level berikutnya
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        isCorrect={isCorrect}
        xpGained={isCorrect ? 20 : 0}
        accuracy={strokeAccuracy}
        timeSpent={timeElapsed}
        character={currentCharacter}
        onContinue={handleNext}
        onRetry={() => {
          setShowFeedback(false)
          handleClear()
        }}
      />
    </div>
  )
}
