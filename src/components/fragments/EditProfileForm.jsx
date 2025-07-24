"use client"

import React from "react"
import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useApp } from "@/components/app-provider"
import { ArrowLeft, Camera, Eye, EyeOff, Save, X, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function EditProfileForm() {
  const { state, playSound, triggerHaptic } = useApp()
  const router = useRouter()
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    fullName: state.user.name,
    email: "wira.aksara@email.com", // Mock email
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [avatarPreview, setAvatarPreview] = useState(state.user.avatar)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
    if (success) setSuccess("")
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
    playSound("click")
    triggerHaptic("light")
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("Ukuran file maksimal 5MB")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result)
        playSound("success")
        triggerHaptic("light")
      }
      reader.readAsDataURL(file)
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
    playSound("click")
    triggerHaptic("light")
  }

  const validatePasswordChange = () => {
    if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        throw new Error("Password saat ini harus diisi")
      }
      if (formData.newPassword.length < 6) {
        throw new Error("Password baru minimal 6 karakter")
      }
      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error("Konfirmasi password baru tidak cocok")
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Validate form
      if (!formData.fullName.trim()) {
        throw new Error("Nama lengkap harus diisi")
      }

      validatePasswordChange()

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccess("Profil berhasil diperbarui!")
      playSound("success")
      triggerHaptic("heavy")

      // Clear password fields after successful update
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
      playSound("error")
      triggerHaptic("light")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    playSound("click")
    triggerHaptic("light")
    router.back()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-16 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/profile">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Edit Profil</h1>
            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="animate-in slide-in-from-bottom duration-500">
          <CardHeader>
            <CardTitle>Edit Profil</CardTitle>
            <CardDescription>Perbarui informasi profil dan pengaturan akun Anda</CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Success/Error Messages */}
            {success && (
              <Alert className="border-green-200 bg-green-50 text-green-800 animate-in slide-in-from-top duration-300">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="animate-in slide-in-from-top duration-300">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Avatar Section */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Foto Profil</Label>
                <div className="flex items-center space-x-6">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 cursor-pointer transition-all duration-200 group-hover:scale-105">
                      <AvatarImage src={avatarPreview || "/placeholder.svg"} alt="Profile" />
                      <AvatarFallback className="text-2xl">{formData.fullName[0]}</AvatarFallback>
                    </Avatar>
                    <div
                      className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={handleAvatarClick}
                    >
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAvatarClick}
                      className="hover:scale-105 transition-all duration-200 bg-transparent"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Ubah Foto
                    </Button>
                    <p className="text-xs text-muted-foreground">JPG, PNG atau GIF. Maksimal 5MB.</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
              </div>

              <Separator />

              {/* Personal Information */}
              <div className="space-y-6">
                <Label className="text-base font-semibold">Informasi Pribadi</Label>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nama Lengkap</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder="Masukkan nama lengkap"
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="nama@email.com"
                      className="h-12"
                      required
                    />
                    <p className="text-xs text-muted-foreground">Perubahan email memerlukan verifikasi</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Password Change Section */}
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-semibold">Ubah Password</Label>
                  <p className="text-sm text-muted-foreground mt-1">Kosongkan jika tidak ingin mengubah password</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Password Saat Ini</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        value={formData.currentPassword}
                        onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                        placeholder="Masukkan password saat ini"
                        className="pr-10 h-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => togglePasswordVisibility("current")}
                      >
                        {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Password Baru</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={(e) => handleInputChange("newPassword", e.target.value)}
                        placeholder="Masukkan password baru"
                        className="pr-10 h-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => togglePasswordVisibility("new")}
                      >
                        {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        placeholder="Ulangi password baru"
                        className="pr-10 h-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => togglePasswordVisibility("confirm")}
                      >
                        {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6">
                <Button
                  type="submit"
                  className="flex-1 h-12 hover:scale-105 transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Menyimpan...</span>
                    </div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Simpan Perubahan
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="h-12 hover:scale-105 transition-all duration-200 bg-transparent"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
