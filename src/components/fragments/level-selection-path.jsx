"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LessonModal } from "@/components/lesson-modal"
import { useApp } from "@/components/app-provider"
import { ArrowLeft, Lock, Check, Crown } from "lucide-react"
import Link from "next/link"

const levels = [
  {
    id: "level-1",
    title: "Level 1",
    subtitle: "Pengenalan Aksara",
    icon: "ꦲ",
    status: "completed",
    lessons: [
      {
        id: "lesson-1-1",
        title: "Kenali Goresan",
        type: "introduction",
        status: "completed",
        progress: { current: 20, total: 20 },
      },
      {
        id: "lesson-1-2",
        title: "Rangkai Kata",
        type: "basic",
        status: "completed",
        progress: { current: 15, total: 20 },
      },
      {
        id: "lesson-1-3",
        title: "Susun Kalimat",
        type: "advanced",
        status: "available",
        progress: { current: 0, total: 20 },
      },
    ],
  },
  {
    id: "level-2",
    title: "Level 2",
    subtitle: "Aksara Murda",
    icon: "ꦤ",
    status: "available",
    lessons: [
      {
        id: "lesson-2-1",
        title: "Kenali Goresan",
        type: "introduction",
        status: "available",
        progress: { current: 0, total: 20 },
      },
      {
        id: "lesson-2-2",
        title: "Rangkai Kata",
        type: "basic",
        status: "locked",
        progress: { current: 0, total: 20 },
      },
      {
        id: "lesson-2-3",
        title: "Susun Kalimat",
        type: "advanced",
        status: "locked",
        progress: { current: 0, total: 20 },
      },
    ],
  },
  {
    id: "level-3",
    title: "Level 3",
    subtitle: "Sandhangan",
    icon: "꧀",
    status: "locked",
    lessons: [
      {
        id: "lesson-3-1",
        title: "Kenali Goresan",
        type: "introduction",
        status: "locked",
        progress: { current: 0, total: 20 },
      },
      {
        id: "lesson-3-2",
        title: "Rangkai Kata",
        type: "basic",
        status: "locked",
        progress: { current: 0, total: 20 },
      },
      {
        id: "lesson-3-3",
        title: "Susun Kalimat",
        type: "advanced",
        status: "locked",
        progress: { current: 0, total: 20 },
      },
    ],
  },
  {
    id: "level-4",
    title: "Level 4",
    subtitle: "Pasangan",
    icon: "ꦥ",
    status: "locked",
    lessons: [
      {
        id: "lesson-4-1",
        title: "Kenali Goresan",
        type: "introduction",
        status: "locked",
        progress: { current: 0, total: 20 },
      },
      {
        id: "lesson-4-2",
        title: "Rangkai Kata",
        type: "basic",
        status: "locked",
        progress: { current: 0, total: 20 },
      },
      {
        id: "lesson-4-3",
        title: "Susun Kalimat",
        type: "advanced",
        status: "locked",
        progress: { current: 0, total: 20 },
      },
    ],
  },
]

export function LevelSelectionPath() {
  const { state, playSound, triggerHaptic } = useApp()
  const [selectedLevel, setSelectedLevel] = useState(null)

  const handleLevelClick = (level) => {
    if (level.status === "locked") {
      playSound("error")
      triggerHaptic("light")
      return
    }

    playSound("click")
    triggerHaptic("light")
    setSelectedLevel(level)
  }

  const getLevelNodeStyle = (status) => {
    switch (status) {
      case "completed":
        return "bg-gradient-to-br from-green-500 to-green-600 text-white border-green-400 shadow-lg shadow-green-500/25 hover:scale-110"
      case "mastered":
        return "bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-yellow-400 shadow-lg shadow-yellow-500/25 hover:scale-110"
      case "available":
        return "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/25 hover:scale-110 animate-pulse"
      case "locked":
      default:
        return "bg-muted text-muted-foreground border-muted cursor-not-allowed opacity-60"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-16 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">{state.user.xp} XP</Badge>
              <Badge variant="outline">Level {state.user.level}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-in slide-in-from-top duration-500">
          <h1 className="text-4xl font-bold mb-2">Jalur Pembelajaran</h1>
          <p className="text-muted-foreground text-lg">Pilih level untuk memulai petualangan belajar aksara Jawa</p>
        </div>

        {/* Learning Path */}
        <div className="relative">
          {/* Path Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 via-green-500 to-muted h-full rounded-full opacity-30" />

          <div className="space-y-16">
            {levels.map((level, index) => (
              <div
                key={level.id}
                className={`relative flex flex-col items-center animate-in slide-in-from-bottom duration-700`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Level Node */}
                <div
                  className={`relative w-24 h-24 rounded-full border-4 flex items-center justify-center cursor-pointer transition-all duration-300 ${getLevelNodeStyle(
                    level.status,
                  )}`}
                  onClick={() => handleLevelClick(level)}
                >
                  {level.status === "locked" ? (
                    <Lock className="h-8 w-8" />
                  ) : level.status === "mastered" ? (
                    <div className="relative">
                      <div className="text-3xl font-bold">{level.icon}</div>
                      <Crown className="absolute -top-2 -right-2 h-6 w-6 text-yellow-300" />
                    </div>
                  ) : level.status === "completed" ? (
                    <div className="relative">
                      <div className="text-3xl font-bold">{level.icon}</div>
                      <div className="absolute -bottom-1 -right-1 bg-green-400 rounded-full p-1">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-3xl font-bold">{level.icon}</div>
                  )}

                  {/* Glow effect for available level */}
                  {level.status === "available" && (
                    <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                  )}
                </div>

                {/* Level Info */}
                <div className="text-center mt-4 space-y-1">
                  <h3 className="text-xl font-bold">{level.title}</h3>
                  <p className="text-muted-foreground">{level.subtitle}</p>

                  {/* Progress indicator */}
                  {level.status !== "locked" && (
                    <div className="flex items-center justify-center space-x-2 mt-2">
                      {level.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className={`w-2 h-2 rounded-full ${
                            lesson.status === "completed"
                              ? "bg-green-500"
                              : lesson.status === "available"
                                ? "bg-blue-500"
                                : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Connection line to next level */}
                {index < levels.length - 1 && (
                  <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-transparent to-muted opacity-30" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Section */}
        <div className="mt-16 text-center animate-in slide-in-from-bottom duration-1000">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{state.user.charactersLearned.length}</div>
                  <div className="text-sm text-muted-foreground">Aksara Dikuasai</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {levels.filter((l) => l.status === "completed").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Level Selesai</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">{state.user.streak}</div>
                  <div className="text-sm text-muted-foreground">Hari Berturut</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lesson Modal */}
      {selectedLevel && (
        <LessonModal level={selectedLevel} isOpen={!!selectedLevel} onClose={() => setSelectedLevel(null)} />
      )}
    </div>
  )
}
