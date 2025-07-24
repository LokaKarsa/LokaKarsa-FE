"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AchievementToast({ achievement, onClose }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (achievement) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        // Allow time for the fade-out transition before calling onClose
        setTimeout(onClose, 300)
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [achievement, onClose])

  if (!achievement) return null

  return (
    <div
      className={`fixed top-20 right-4 z-50 transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <Card className="w-80 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="text-3xl animate-bounce">{achievement.icon}</div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <Badge variant="secondary" className="text-xs">
                  Lencana Baru!
                </Badge>
              </div>
              <h3 className="font-bold text-sm">{achievement.title}</h3>
              <p className="text-xs text-muted-foreground">{achievement.description}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
