"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share2, Download } from "lucide-react"

export function ShareableAchievement({ achievement }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Pencapaian Baru di Nulis Aksara!`,
          text: `Saya baru saja meraih lencana '${achievement.title}' di Nulis Aksara!`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(
        `Saya baru saja meraih lencana '${achievement.title}' di Nulis Aksara! ${window.location.href}`,
      )
    }
  }

  const handleDownload = () => {
    // In a real app, this would generate and download an image
    console.log("Downloading achievement card...")
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Achievement Card */}
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 p-8 text-white">
          {/* Batik Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3Ccircle cx='50' cy='50' r='2'/%3E%3Ccircle cx='10' cy='50' r='2'/%3E%3Ccircle cx='50' cy='10' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10 text-center space-y-4">
            <h2 className="text-xl font-bold">Pencapaian Baru oleh Wira Aksara!</h2>

            <div className="text-6xl">{achievement.icon}</div>

            <div>
              <h3 className="text-2xl font-bold mb-2">{achievement.title}</h3>
              <p className="text-blue-100">{achievement.description}</p>
            </div>

            <div className="flex justify-center space-x-6 text-sm">
              <div>
                <div className="font-semibold">Waktu</div>
                <div className="text-blue-200">{achievement.stats.time}</div>
              </div>
              <div>
                <div className="font-semibold">Akurasi</div>
                <div className="text-blue-200">{achievement.stats.accuracy}</div>
              </div>
              <div>
                <div className="font-semibold">XP Diperoleh</div>
                <div className="text-blue-200">+{achievement.stats.xpGained}</div>
              </div>
            </div>

            <div className="pt-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Nulis Aksara
              </Badge>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-card">
          <div className="flex space-x-3">
            <Button onClick={handleShare} className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Bagikan ke Sosial Media
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Unduh
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
