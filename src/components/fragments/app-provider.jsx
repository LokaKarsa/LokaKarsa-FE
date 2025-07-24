"use client"

import React, { createContext, useContext, useReducer } from "react"

// Initial state for the application
const initialState = {
  user: {
    id: "user1",
    name: "Wira Aksara",
    avatar: "/placeholder.svg?height=48&width=48",
    xp: 1250,
    streak: 15,
    level: 5,
    charactersLearned: ["ꦲ", "ꦤ", "ꦕ", "ꦫ"],
    badges: ["panglima-carakan", "cendekia-hanacaraka"],
  },
  currentCharacter: {
    aksara: "ꦲ",
    romanization: "ha",
    strokes: [
      { path: "M50,30 L150,30", order: 1 },
      { path: "M100,10 L100,50", order: 2 },
      { path: "M75,40 L125,40", order: 3 },
    ],
  },
  practiceSession: {
    isActive: false,
    currentIndex: 0,
    totalCharacters: 0,
    score: 0,
    accuracy: 0,
    timeStarted: null,
  },
  achievements: [
    { id: "first-character", title: "Aksara Pertama", description: "Tulis aksara pertamamu", icon: "🎯", earned: true },
    {
      id: "streak-7",
      title: "Semangat Seminggu",
      description: "Berlatih 7 hari berturut-turut",
      icon: "🔥",
      earned: true,
    },
    { id: "perfect-accuracy", title: "Sempurna", description: "Raih akurasi 100%", icon: "⭐", earned: false },
    { id: "speed-demon", title: "Kilat", description: "Tulis aksara dalam 5 detik", icon: "⚡", earned: false },
  ],
  settings: {
    soundEnabled: true,
    hapticEnabled: true,
    showGuides: true,
  },
}

// Reducer function to handle state changes
function appReducer(state, action) {
  switch (action.type) {
    case "START_PRACTICE":
      return {
        ...state,
        practiceSession: {
          isActive: true,
          currentIndex: 0,
          totalCharacters: action.characters.length,
          score: 0,
          accuracy: 0,
          timeStarted: Date.now(),
        },
      }

    case "COMPLETE_CHARACTER":
      const newScore = state.practiceSession.score + (action.accuracy > 80 ? 20 : 10)
      return {
        ...state,
        practiceSession: {
          ...state.practiceSession,
          score: newScore,
          accuracy: (state.practiceSession.accuracy + action.accuracy) / 2,
        },
        user: {
          ...state.user,
          xp: state.user.xp + (action.accuracy > 80 ? 20 : 10),
        },
      }

    case "NEXT_CHARACTER":
      return {
        ...state,
        practiceSession: {
          ...state.practiceSession,
          currentIndex: state.practiceSession.currentIndex + 1,
        },
      }

    case "END_PRACTICE":
      return {
        ...state,
        practiceSession: {
          ...state.practiceSession,
          isActive: false,
          timeStarted: null,
        },
      }

    case "UPDATE_STREAK":
      return {
        ...state,
        user: {
          ...state.user,
          streak: state.user.streak + 1,
        },
      }

    case "EARN_ACHIEVEMENT":
      return {
        ...state,
        achievements: state.achievements.map((achievement) =>
          achievement.id === action.achievementId
            ? { ...achievement, earned: true, earnedAt: Date.now() }
            : achievement,
        ),
      }

    case "ADD_XP":
      const newXP = state.user.xp + action.amount
      const newLevel = Math.floor(newXP / 500) + 1
      return {
        ...state,
        user: {
          ...state.user,
          xp: newXP,
          level: newLevel,
        },
      }

    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.settings,
        },
      }

    default:
      return state
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Sound effects
  const playSound = (type) => {
    if (!state.settings.soundEnabled) return

    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    switch (type) {
      case "success":
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1) // E5
        break
      case "error":
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime) // A3
        break
      case "click":
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        break
      case "achievement":
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1)
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2)
        break
      default:
        break
    }

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
  }

  // Haptic feedback
  const triggerHaptic = (type) => {
    if (!state.settings.hapticEnabled || !navigator.vibrate) return

    switch (type) {
      case "light":
        navigator.vibrate(50)
        break
      case "medium":
        navigator.vibrate(100)
        break
      case "heavy":
        navigator.vibrate([100, 50, 100])
        break
      default:
        break
    }
  }

  const contextValue = {
    state,
    dispatch,
    playSound,
    triggerHaptic,
  }

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}
