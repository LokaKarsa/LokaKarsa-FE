"use client"

import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ContributionGraph() {
  // Generate mock data for the last 180 days
  const generateContributionData = () => {
    const data = []
    const today = new Date()

    for (let i = 179; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      // Random practice intensity (0-4)
      const intensity = Math.floor(Math.random() * 5)
      const minutes = intensity * 15 // 0, 15, 30, 45, or 60 minutes

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
      "bg-muted/30", // No activity
      "bg-green-500/30", // Low
      "bg-green-500/50", // Medium-low
      "bg-green-500/70", // Medium-high
      "bg-green-500/90", // High
    ]
    return colors[intensity]
  }

  // Group data by weeks
  const weeks = []
  for (let i = 0; i < contributionData.length; i += 7) {
    weeks.push(contributionData.slice(i, i + 7))
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Jan</span>
          <span>Mar</span>
          <span>Mei</span>
          <span>Jul</span>
          <span>Sep</span>
          <span>Nov</span>
        </div>

        <div className="grid grid-cols-26 gap-1 max-w-full overflow-x-auto">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-rows-7 gap-1">
              {week.map((day, dayIndex) => (
                <Tooltip key={`${weekIndex}-${dayIndex}`}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className={`w-3 h-3 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 ${getIntensityColor(
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
