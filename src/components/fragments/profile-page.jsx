import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShareableAchievement } from "./shareable-achivement";
import { ArrowLeft, Trophy, Lock, Edit } from "lucide-react";
import { ContributionGraph } from "./contribution-graph";
import { useAuth } from "@/provider/AuthProvider";
import { fetchProfile } from "@/hooks/api/auth";
import * as lucideIcons from "lucide-react";

export function ProfilePage() {
    const auth = useAuth();
    const token = auth?.token;
    const user = auth?.user;

    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const res = await fetchProfile(token);

                if (res.success) {
                    setProfileData(res.data);
                    setIsLoading(false);
                } else {
                    throw new Error("Ada kesalahan");
                }
            } catch (error) {
                console.error("error :", error);
            }
        };

        fetchProfileData();
    }, []);

    const userStats = profileData?.stats;

    const [recentAchievement] = useState({
        title: "Cendekia Hanacaraka",
        description: "Berhasil menguasai 20 aksara dasar",
        icon: "🎓",
        stats: {
            time: "25 Menit",
            accuracy: "98%",
            xpGained: 150,
        },
    });

    const badges = profileData?.badge_gallery;

    if (isLoading || profileData === null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                {/* Profile Header */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                            <Avatar className="h-24 w-24">
                                <AvatarImage
                                    src="/placeholder.svg?height=96&width=96"
                                    alt="Profile"
                                />
                                <AvatarFallback className="text-2xl">
                                    {user?.firstname?.[0] && user?.lastname?.[0]
                                        ? user.firstname[0] + user.lastname[0]
                                        : user?.name?.[0] ||
                                          state.user.name?.[0] ||
                                          "U"}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-3xl font-bold">
                                    {user?.firstname} {" "} {user?.lastname}
                                </h1>
                                <p className="text-muted-foreground mb-4">
                                    {user?.bio}
                                </p>

                                <div className="flex justify-between items-start">
                                  <div className="grid grid-cols-3 gap-4 max-w-md mx-auto md:mx-0">
                                      <div className="text-center">
                                          <div className="text-2xl font-bold text-primary">
                                              {userStats.total_xp}
                                          </div>
                                          <div className="text-sm text-muted-foreground">
                                              Total XP
                                          </div>
                                      </div>
                                      <div className="text-center">
                                          <div className="text-2xl font-bold text-green-500">
                                              {userStats.characters_mastered}
                                          </div>
                                          <div className="text-sm text-muted-foreground">
                                              Aksara Dikuasai
                                          </div>
                                      </div>
                                      <div className="text-center">
                                          <div className="text-2xl font-bold text-orange-500">
                                              {userStats.highest_streak}
                                          </div>
                                          <div className="text-sm text-muted-foreground">
                                              Api Tertinggi
                                          </div>
                                      </div>
                                  </div>

                                  <div className="flex justify-center mt-6">
                                      <a href="/profile/edit">
                                          <Button className="hover:scale-105 transition-all duration-200">
                                              <Edit className="h-4 w-4 mr-2" />
                                              Edit Profil
                                          </Button>
                                      </a>
                                  </div>
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
                            {badges.map((badge) => {
                                return (
                                    <div
                                        key={badge.id}
                                        className={`relative p-4 rounded-lg border text-center transition-all hover:scale-105 cursor-pointer ${
                                            badge.is_unlocked
                                                ? "bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20"
                                                : "bg-muted/30 border-muted opacity-50"
                                        }`}
                                    >
                                        {!badge.is_unlocked && (
                                            <Lock className="absolute top-2 right-2 h-4 w-4 text-muted-foreground" />
                                        )}
                                        <div className="text-3xl mb-2">
                                            <Trophy className="h-8 w-8 mx-auto" />
                                        </div>
                                        <h3 className="font-medium text-sm mb-1">
                                            {badge.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            {badge.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
