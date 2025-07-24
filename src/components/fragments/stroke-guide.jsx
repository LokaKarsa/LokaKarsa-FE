"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"

export function StrokeGuide({ strokes, currentStroke }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [animationStep, setAnimationStep] = useState(0)

  // Inject CSS for stroke animation
  useEffect(() => {
    const styleSheet = document.createElement("style")
    styleSheet.innerText = `
      @keyframes dash {
        to {
          stroke-dashoffset: -20;
        }
      }
    `
    document.head.appendChild(styleSheet)
    return () => {
      document.head.removeChild(styleSheet)
    }
  }, [])

  useEffect(() => {
    let interval

    if (isPlaying) {
      interval = setInterval(() => {
        setAnimationStep((prev) => {
          if (prev >= strokes.length - 1) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1500) // Slower animation for better visibility
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, strokes.length])

  const toggleAnimation = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      setAnimationStep(0)
    }
  }

  // Helper function to extract start point from SVG path
  const getStartPoint = (path) => {
    const match = path.match(/M(\d+),(\d+)/)
    if (match) {
      return { x: parseInt(match[1], 10), y: parseInt(match[2], 10) }
    }
    return { x: 100, y: 40 } // Default fallback
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Panduan Urutan Goresan</h3>
        <Button variant="outline" size="sm" onClick={toggleAnimation}>
          {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
          {isPlaying ? "Jeda" : "Putar"}
        </Button>
      </div>

      <div className="relative bg-muted/30 rounded-lg p-4 h-40">
        <svg width="100%" height="100%" viewBox="0 0 200 120" className="absolute inset-0">
          {/* Background grid for reference */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {strokes.map((stroke, index) => (
            <g key={index}>
              {/* Stroke path */}
              <path
                d={stroke.path}
                stroke={
                  index < currentStroke
                    ? "#22c55e" // Green for completed
                    : index === animationStep && isPlaying
                      ? "#3b82f6" // Blue for current animation
                      : "#9ca3af" // Gray for upcoming
                }
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-all duration-300`}
                style={{
                  opacity: index <= animationStep || index < currentStroke ? 1 : 0.4,
                  strokeDasharray: index === animationStep && isPlaying ? "5,5" : "none",
                  animation: index === animationStep && isPlaying ? "dash 1s linear infinite" : "none",
                }}
              />

              {/* Stroke number */}
              <circle
                cx={getStartPoint(stroke.path).x}
                cy={getStartPoint(stroke.path).y}
                r="10"
                fill={index < currentStroke ? "#22c55e" : index === currentStroke ? "#3b82f6" : "#6b7280"}
                className={`transition-all duration-300 ${index === currentStroke ? "animate-pulse" : ""}`}
                stroke="white"
                strokeWidth="2"
              />
              <text
                x={getStartPoint(stroke.path).x}
                y={getStartPoint(stroke.path).y}
                textAnchor="middle"
                dy="0.35em"
                fontSize="12"
                fill="white"
                fontWeight="bold"
              >
                {stroke.order}
              </text>

              {/* Direction arrow for stroke guidance */}
              {index === animationStep && isPlaying && (
                <g>
                  <defs>
                    <marker
                      id={`arrow-${index}`}
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                    </marker>
                  </defs>
                  <path
                    d={stroke.path}
                    stroke="none"
                    fill="none"
                    markerEnd={`url(#arrow-${index})`}
                    className="animate-pulse"
                  />
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Detailed stroke instructions */}
      <div className="grid grid-cols-1 gap-2">
        {strokes.map((stroke, index) => (
          <div
            key={index}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
              index < currentStroke
                ? "bg-green-500/10 border border-green-500/20"
                : index === currentStroke
                  ? "bg-blue-500/10 border border-blue-500/20 shadow-md"
                  : "bg-muted/30"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                index < currentStroke
                  ? "bg-green-500 text-white scale-110"
                  : index === currentStroke
                    ? "bg-blue-500 text-white animate-pulse"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {stroke.order}
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">{stroke.description}</div>
              <div className="text-xs text-muted-foreground">Arah: {stroke.direction.replace("-", " ")}</div>
            </div>
            {index === currentStroke && (
              <div className="text-blue-500 animate-bounce">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Progress: {currentStroke}/{strokes.length}
        </span>
        <span>{Math.round((currentStroke / strokes.length) * 100)}% selesai</span>
      </div>
    </div>
  )
}
