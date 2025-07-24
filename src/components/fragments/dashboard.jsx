"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Flame, Trophy, Users, Target, ChevronRight, Play, BookOpen } from "lucide-react"
import { useNavigate } from "react-router" // Corrected import from 'react-router-dom'
import { ContributionGraph } from "./contribution-graph"
import { useApp } from "./app-provider"

export function Dashboard() {
  const { state, dispatch, playSound, triggerHaptic } = useApp()
  const navigate = useNavigate() // Use useNavigate hook
  const [dailyProgress] = useState({ current: 2, total: 5 })

  const leaderboard = [
    { rank: 1, name: "Budi Santoso", avatar: "/placeholder.svg?height=32&width=32", xp: 2450 },
    { rank: 2, name: "Sari Dewi", avatar: "/placeholder.svg?height=32&width=32", xp: 2100 },
    { rank: 3, name: "Ahmad Wijaya", avatar: "/placeholder.svg?height=32&width=32", xp: 1890 },
  ]

  const activityFeed = [
    {
      user: "Budi",
      avatar: "/placeholder.svg?height=24&width=24",
      action: "baru saja meraih lencana",
      achievement: "Cendekia Hanacaraka",
      time: "2 jam lalu",
    },
    {
      user: "Ani",
      avatar: "/placeholder.svg?height=24&width=24",
      action: "telah menguasai seluruh set",
      achievement: "aksara carakan",
      time: "4 jam lalu",
    },
    {
      user: "Kamu",
      avatar: "/placeholder.svg?height=24&width=24",
      action: "menyelesaikan",
      achievement: "tantangan harian",
      time: "1 hari lalu",
    },
  ]

  const handleStartPractice = () => {
    playSound("click")
    triggerHaptic("light")

    const characters = [
      { aksara: "ꦲ", romanization: "ha" },
      { aksara: "ꦤ", romanization: "na" },
      { aksara: "ꦕ", romanization: "ca" },
      { aksara: "ꦫ", romanization: "ra" },
      { aksara: "ꦏ", romanization: "ka" },
    ]

    dispatch({ type: "START_PRACTICE", characters })
    navigate("/practice") // Changed to use navigate
  }

  const handleViewLeaderboard = () => {
    playSound("click")
    triggerHaptic("light")
    navigate("/leaderboard") // Changed to use navigate
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header with Animation */}
        <div className="flex items-center justify-between animate-in slide-in-from-top duration-500">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sugeng Rawuh, {state.user.name}!</h1>
            <p className="text-muted-foreground mt-1">Siap untuk berlatih hari ini?</p>
          </div>
          <div className="relative">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20 transition-all hover:ring-primary/40">
              <AvatarImage src={state.user.avatar || "/placeholder.svg"} alt="User Avatar" />
              <AvatarFallback>{state.user.name[0]}</AvatarFallback>
            </Avatar>
            {state.user.streak > 0 && (
              <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                {state.user.streak}
              </div>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Row Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Practice Streak Card with Animation */}
              <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20 hover:scale-105 transition-all duration-300 animate-in slide-in-from-left">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-lg">Api Semangat</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Flame className="h-8 w-8 text-orange-500 animate-pulse" />
                    <span className="text-3xl font-bold text-orange-500 animate-in zoom-in duration-700">
                      {state.user.streak}
                    </span>
                    <span className="text-lg text-muted-foreground">Hari</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Terus berlatih setiap hari untuk menjaga apimu tetap menyala!
                  </p>
                </CardContent>
              </Card>

              {/* Daily Challenge Card */}
              <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 hover:scale-105 transition-all duration-300 animate-in slide-in-from-right">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Target className="h-5 w-5 mr-2 text-blue-500" />
                    Tantangan Harian
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">Kuasai 5 aksara murda hari ini</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>
                        {dailyProgress.current}/{dailyProgress.total}
                      </span>
                    </div>
                    <Progress
                      value={(dailyProgress.current / dailyProgress.total) * 100}
                      className="h-2 transition-all duration-500"
                    />
                  </div>
                  <Button
                    className="w-full mt-4 hover:scale-105 transition-all duration-200"
                    size="sm"
                    onClick={handleStartPractice}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Mulai Latihan
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-bottom duration-700">
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 hover:scale-105 transition-all bg-transparent"
                onClick={() => navigate("/tutorial")}
              >
                <BookOpen className="h-6 w-6" />
                <span className="text-xs">Tutorial</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 hover:scale-105 transition-all bg-transparent"
                onClick={() => navigate("/characters")}
              >
                <div className="text-2xl">ꦲ</div>
                <span className="text-xs">Aksara</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 hover:scale-105 transition-all bg-transparent"
                onClick={() => navigate("/games")}
              >
                <Trophy className="h-6 w-6" />
                <span className="text-xs">Mini Game</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 hover:scale-105 transition-all bg-transparent"
                onClick={() => navigate("/community")}
              >
                <Users className="h-6 w-6" />
                <span className="text-xs">Komunitas</span>
              </Button>
            </div>

            {/* Contribution Graph */}
            <Card className="animate-in slide-in-from-bottom duration-1000">
              <CardHeader>
                <CardTitle className="text-lg">Grafik Kontribusi Belajar</CardTitle>
                <CardDescription>Aktivitas latihanmu dalam 6 bulan terakhir</CardDescription>
              </CardHeader>
              <CardContent>
                <ContributionGraph />
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <Card className="animate-in slide-in-from-right duration-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  Papan Peringkat
                </CardTitle>
                <CardDescription>Top 3 minggu ini</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {leaderboard.map((user, index) => (
                  <div
                    key={user.rank}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-all duration-200 animate-in slide-in-from-right"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Badge
                      variant={user.rank === 1 ? "default" : "secondary"}
                      className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {user.rank}
                    </Badge>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.xp} XP</p>
                    </div>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 hover:scale-105 transition-all"
                  onClick={handleViewLeaderboard}
                >
                  Lihat Papan Peringkat Lengkap
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card className="animate-in slide-in-from-right duration-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2 text-green-500" />
                  Kabar Aksara
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activityFeed.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-all duration-200 animate-in slide-in-from-right"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
                      <AvatarFallback className="text-xs">{activity.user[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                        <span className="font-medium text-primary">'{activity.achievement}'</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
