"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/components/app-provider"
import { Home, BookOpen, Trophy, Settings, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navigation() {
  const { state } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: Home, label: "Beranda" },
    { href: "/practice", icon: BookOpen, label: "Latihan" },
    { href: "/profile", icon: Trophy, label: "Profil" },
    { href: "/settings", icon: Settings, label: "Pengaturan" },
  ]

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl">ꦤꦸꦭꦶꦱ꧀</div>
            <span className="font-bold text-lg">Nulis Aksara</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* User Info */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{state.user.xp} XP</Badge>
              <Badge variant="outline">Level {state.user.level}</Badge>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src={state.user.avatar || "/placeholder.svg"} alt={state.user.name} />
              <AvatarFallback>{state.user.name[0]}</AvatarFallback>
            </Avatar>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                <Button
                  variant={pathname === item.href ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <div className="pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={state.user.avatar || "/placeholder.svg"} alt={state.user.name} />
                  <AvatarFallback>{state.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{state.user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {state.user.xp} XP • Level {state.user.level}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
