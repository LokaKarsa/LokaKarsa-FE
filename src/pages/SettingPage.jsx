"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useApp } from "@/components/app-provider"
import { Volume2, Vibrate, Eye, RotateCcw } from "lucide-react"

export default function SettingsPage() {
  const { state, dispatch } = useApp()

  const handleSettingChange = (key, value) => {
    dispatch({
      type: "UPDATE_SETTINGS",
      settings: { [key]: value },
    })
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Pengaturan</h1>
          <p className="text-muted-foreground">Sesuaikan pengalaman belajarmu</p>
        </div>

        {/* Audio Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Volume2 className="h-5 w-5 mr-2" />
              Audio & Suara
            </CardTitle>
            <CardDescription>Atur efek suara dan feedback audio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Efek Suara</div>
                <div className="text-sm text-muted-foreground">Suara untuk feedback dan notifikasi</div>
              </div>
              <Switch
                checked={state.settings.soundEnabled}
                onCheckedChange={(checked) => handleSettingChange("soundEnabled", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Haptic Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Vibrate className="h-5 w-5 mr-2" />
              Getaran
            </CardTitle>
            <CardDescription>Feedback haptic untuk interaksi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Getaran Haptic</div>
                <div className="text-sm text-muted-foreground">Getaran saat menulis dan feedback</div>
              </div>
              <Switch
                checked={state.settings.hapticEnabled}
                onCheckedChange={(checked) => handleSettingChange("hapticEnabled", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Visual Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Bantuan Visual
            </CardTitle>
            <CardDescription>Panduan dan bantuan visual saat berlatih</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Panduan Goresan</div>
                <div className="text-sm text-muted-foreground">Tampilkan panduan urutan goresan</div>
              </div>
              <Switch
                checked={state.settings.showGuides}
                onCheckedChange={(checked) => handleSettingChange("showGuides", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Reset Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </CardTitle>
            <CardDescription>Kembalikan semua pengaturan ke default</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={() => {
                dispatch({
                  type: "UPDATE_SETTINGS",
                  settings: {
                    soundEnabled: true,
                    hapticEnabled: true,
                    showGuides: true,
                  },
                })
              }}
            >
              Reset Pengaturan
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
