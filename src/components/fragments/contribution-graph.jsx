"use client"

import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ContributionGraph({ activity }) {
  const generateContributionData = () => {
    const data = []
    const today = new Date()

    for (let i = 194; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      const isWithinActivityRange = i < (activity > 0 ? activity.length : 0)
      const intensity = isWithinActivityRange ? Math.floor(Math.random() * 5) : 0
      const minutes = isWithinActivityRange ? intensity * 15 : 0

      data.push({
        date: date.toISOString().split("T")[0],
        intensity,
        minutes,
        displayDate: date.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      })
    }
    return data
  }

  const [contributionData] = useState(generateContributionData())

  const getIntensityColor = (intensity) => {
    const colors = [
      "bg-muted/80",
      "bg-green-500/30",
      "bg-green-500/50",
      "bg-green-500/70",
      "bg-green-500/90",
    ]
    return colors[intensity]
  }

  const weeks = []
  for (let i = 0; i < (contributionData?.length > 0 ? contributionData.length : 0); i += 7) {
    weeks.push(contributionData.slice(i, i + 7))
  }

  // Generate dynamic month labels for the last 6 months
  const generateMonthLabels = () => {
    const today = new Date()
    const labels = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
      labels.push(date.toLocaleDateString("id-ID", { month: "short" }))
    }
    return labels
  }

  const monthLabels = generateMonthLabels()

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          {monthLabels.map((label, index) => (
            <span key={index}>{label}</span>
          ))}
        </div>

        <div className="grid grid-cols-28 gap-1 p-2 max-w-full overflow-x-auto">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-rows-7 gap-1">
              {week.map((day, dayIndex) => (
                <Tooltip key={`${weekIndex}-${dayIndex}`}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className={`w-4 h-4 cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 ${getIntensityColor(
                        day.intensity,
                      )}`}
                      tabIndex={0}
                      aria-label={
                        day.minutes > 0
                          ? `Berlatih ${day.minutes} menit pada ${day.displayDate}`
                          : `Tidak berlatih pada ${day.displayDate}`
                      }
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {day.minutes > 0
                        ? `Berlatih ${day.minutes} menit pada ${day.displayDate}`
                        : `Tidak berlatih pada ${day.displayDate}`}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Kurang</span>
          <div className="flex items-center space-x-1">
            {[0, 1, 2, 3, 4].map((intensity) => (
              <div key={intensity} className={`w-2 h-2 rounded-sm ${getIntensityColor(intensity)}`} />
            ))}
          </div>
          <span>Lebih</span>
        </div>
      </div>
    </TooltipProvider>
  )
}
