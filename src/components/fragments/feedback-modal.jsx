import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Star } from "lucide-react"
import { useEffect, useState } from "react"

export function FeedbackModal({ isOpen, onClose, isCorrect, xpGained, onContinue, onRetry }) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen && isCorrect) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 2000)
      // Clear the timer if the component unmounts or dependencies change
      return () => clearTimeout(timer)
    }
  }, [isOpen, isCorrect])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {isCorrect ? (
              <div className="flex items-center justify-center space-x-2 text-green-500">
                <CheckCircle className="h-8 w-8" />
                <span className="text-2xl font-bold">Benar!</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2 text-red-500">
                <XCircle className="h-8 w-8" />
                <span className="text-2xl font-bold">Coba Lagi</span>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="text-center space-y-4">
          {isCorrect ? (
            <>
              {showConfetti && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {/* Simple confetti effect */}
                  {[...Array(20)].map((_, i) => (
                    <Star
                      key={i}
                      className="absolute text-yellow-400 animate-fall"
                      style={{
                        left: `${Math.random() * 100}%`,
                        animationDuration: `${Math.random() * 2 + 1}s`,
                        animationDelay: `${Math.random() * 2}s`,
                        width: `${Math.random() * 10 + 5}px`,
                        height: `${Math.random() * 10 + 5}px`,
                      }}
                    />
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Badge variant="default" className="text-lg px-4 py-2">
                  +{xpGained} XP
                </Badge>
                <p className="text-muted-foreground">Hebat! Kamu berhasil menulis aksara dengan benar.</p>
              </div>

              <Button onClick={onContinue} className="w-full" size="lg">
                Lanjut
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div className="relative h-16 flex items-center justify-center">
                  <div className="text-5xl opacity-30">ꦲ</div>
                  <div className="absolute inset-0 text-5xl text-red-500/50 flex items-center justify-center">
                    {/* Placeholder for user's incorrect drawing */}
                  </div>
                </div>
                <p className="text-muted-foreground">Tidak apa-apa! Coba perhatikan urutan goresan yang benar.</p>
              </div>

              <div className="space-y-2">
                <Button onClick={onRetry} className="w-full" size="lg">
                  Coba Lagi
                </Button>
                <Button onClick={onContinue} variant="outline" className="w-full bg-transparent">
                  Lewati
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
