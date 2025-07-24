"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ContributionGraph } from "@/components/contribution-graph"
import { ShareableAchievement } from "@/components/shareable-achievement"
import { ArrowLeft, Trophy, Lock, Edit } from "lucide-react"
import Link from "next/link"

export function ProfilePage() {
  const [userStats] = useState({
    totalXP: 2450,
    charactersLearned: 28,
    highestStreak: 23,
    currentStreak: 15,
  })

  const [recentAchievement] = useState({
    title: "Cendekia Hanacaraka",
    description: "Berhasil menguasai 20 aksara dasar",
    icon: "🎓",
    stats: {
      time: "25 Menit",
      accuracy: "98%",
      xpGained: 150,
    },
  })

  const badges = [
    { id: 1, name: "Panglima Carakan", description: "Kuasai 20 aksara dasar", icon: "⚔️", earned: true },
    { id: 2, name: "Cendekia Hanacaraka", description: "Raih akurasi 95% dalam 10 sesi", icon: "🎓", earned: true },
    { id: 3, name: "Penjaga Api", description: "Pertahankan streak 30 hari", icon: "🔥", earned: false },
    { id: 4, name: "Mahir Sandhangan", description: "Kuasai semua sandhangan", icon: "📚", earned: false },
    { id: 5, name: "Guru Aksara", description: "Raih 5000 XP total", icon: "👨‍🏫", earned: false },
    { id: 6, name: "Legenda Jawa", description: "Selesaikan semua level", icon: "👑", earned: false },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                <AvatarFallback className="text-2xl">W</AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold">Wira Aksara</h1>
                <p className="text-muted-foreground mb-4">Pelajar Aksara Jawa</p>

                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto md:mx-0">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userStats.totalXP}</div>
                    <div className="text-sm text-muted-foreground">Total XP</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{userStats.charactersLearned}</div>
                    <div className="text-sm text-muted-foreground">Aksara Dikuasai</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">{userStats.highestStreak}</div>
                    <div className="text-sm text-muted-foreground">Api Tertinggi</div>
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <Link href="/profile/edit">
                    <Button className="hover:scale-105 transition-all duration-200">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profil
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shareable Achievement */}
        <ShareableAchievement achievement={recentAchievement} />

        {/* Contribution Graph */}
        <Card>
          <CardHeader>
            <CardTitle>Grafik Kontribusi Belajar</CardTitle>
          </CardHeader>
          <CardContent>
            <ContributionGraph />
          </CardContent>
        </Card>

        {/* Badges Gallery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
              Galeri Lencana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`relative p-4 rounded-lg border text-center transition-all hover:scale-105 ${
                    badge.earned
                      ? "bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20"
                      : "bg-muted/30 border-muted opacity-50"
                  }`}
                >
                  {!badge.earned && <Lock className="absolute top-2 right-2 h-4 w-4 text-muted-foreground" />}
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <h3 className="font-medium text-sm mb-1">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
