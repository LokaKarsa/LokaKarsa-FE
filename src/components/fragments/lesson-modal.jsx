"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useApp } from "@/components/app-provider"
import { Lock, Check, Play, Pencil, PuzzleIcon as PuzzlePiece, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

export function LessonModal({ level, isOpen, onClose }) {
  const { playSound, triggerHaptic } = useApp()
  const router = useRouter()

  const getLessonIcon = (type) => {
    switch (type) {
      case "introduction":
        return <Pencil className="h-5 w-5" />
      case "basic":
        return <PuzzlePiece className="h-5 w-5" />
      case "advanced":
        return <FileText className="h-5 w-5" />
      default:
        return <Pencil className="h-5 w-5" />
    }
  }

  const getLessonDescription = (type) => {
    switch (type) {
      case "introduction":
        return "Belajar menggambar aksara dengan benar"
      case "basic":
        return "Menyusun aksara menjadi kata"
      case "advanced":
        return "Menggabungkan kata menjadi kalimat"
      default:
        return "Latihan aksara Jawa"
    }
  }

  const handleStartLesson = (lesson) => {
    if (lesson.status === "locked") {
      playSound("error")
      triggerHaptic("light")
      return
    }

    playSound("click")
    triggerHaptic("medium")
    onClose()

    // Navigate to appropriate lesson interface
    switch (lesson.type) {
      case "introduction":
        router.push(`/lesson/introduction/${lesson.id}`)
        break
      case "basic":
        router.push(`/lesson/basic/${lesson.id}`)
        break
      case "advanced":
        router.push(`/lesson/advanced/${lesson.id}`)
        break
    }
  }

  const availableLessons = level.lessons.filter((l) => l.status !== "locked")
  const totalQuestions = availableLessons.reduce((sum, lesson) => sum + lesson.progress.total, 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white">
              {level.icon}
            </div>
            <div>
              <DialogTitle className="text-2xl">{level.title}</DialogTitle>
              <p className="text-muted-foreground">{level.subtitle}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Lessons List */}
          <div className="space-y-3">
            {level.lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  lesson.status === "locked"
                    ? "bg-muted/30 border-muted opacity-60"
                    : lesson.status === "completed"
                      ? "bg-green-500/10 border-green-500/20 hover:bg-green-500/20"
                      : "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 cursor-pointer"
                }`}
                onClick={() => handleStartLesson(lesson)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-full ${
                        lesson.status === "locked"
                          ? "bg-muted"
                          : lesson.status === "completed"
                            ? "bg-green-500"
                            : "bg-blue-500"
                      }`}
                    >
                      {lesson.status === "locked" ? (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      ) : lesson.status === "completed" ? (
                        <Check className="h-5 w-5 text-white" />
                      ) : (
                        getLessonIcon(lesson.type)
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        Pelajaran {index + 1}: {lesson.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{getLessonDescription(lesson.type)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={lesson.status === "completed" ? "default" : "secondary"}
                      className={
                        lesson.status === "completed"
                          ? "bg-green-500"
                          : lesson.status === "available"
                            ? "bg-blue-500"
                            : "bg-muted"
                      }
                    >
                      {lesson.progress.current}/{lesson.progress.total}
                    </Badge>
                  </div>
                </div>

                {/* Progress Bar */}
                {lesson.status !== "locked" && (
                  <div className="mt-3">
                    <Progress value={(lesson.progress.current / lesson.progress.total) * 100} className="h-2" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Start Button */}
          <div className="pt-4 border-t">
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3"
              onClick={() => {
                const nextLesson = level.lessons.find((l) => l.status === "available")
                if (nextLesson) {
                  handleStartLesson(nextLesson)
                }
              }}
              disabled={!level.lessons.some((l) => l.status === "available")}
            >
              <Play className="h-5 w-5 mr-2" />
              Mulai Belajar ({totalQuestions} Soal)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
