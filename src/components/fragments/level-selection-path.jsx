import { useEffect, useState } from "react";
import { useAuth } from "@/provider/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LessonModal } from "./lesson-modal";
import { useApp } from "./app-provider";
import { ArrowLeft, Lock, Check, Crown } from "lucide-react";
import { getCurriculumData } from "@/hooks/api/main";

export function LevelSelectionPath() {
    const auth = useAuth();
    const token = auth?.token;
    const user = auth?.user;
    const { state, playSound, triggerHaptic } = useApp();
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [curriculum, setCurriculum] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCurriculum = async () => {
            try {
                const curriculum = await getCurriculumData(token);
                console.log("Curriculum data fetched:", curriculum);
                setCurriculum(curriculum.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching curriculum data:", error);
            }
        };

        fetchCurriculum();
    }, []);

    if (isLoading || curriculum === null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    console.log("Curriculum after push:", curriculum);

    const handleLevelClick = (level) => {
        if (level.progress?.status === "locked") {
            playSound("error");
            triggerHaptic("light");
            return;
        }

        playSound("click");
        triggerHaptic("light");
        setSelectedLevel(level);
    };

    const getLevelNodeStyle = (progress) => {
        const status = progress?.status || "locked";

        switch (status) {
            case "completed":
                return "bg-gradient-to-br from-green-500 to-green-600 text-white border-green-400 shadow-lg shadow-green-500/25 hover:scale-110";
            case "mastered":
                return "bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-yellow-400 shadow-lg shadow-yellow-500/25 hover:scale-110";
            case "unlocked":
            case "available":
                return "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/25 hover:scale-110 animate-pulse";
            case "locked":
            default:
                return "bg-muted text-muted-foreground border-muted cursor-not-allowed opacity-60";
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card/50 backdrop-blur-sm sticky top-16 z-50">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Button>
                        <div className="flex items-center space-x-4">
                            <Badge variant="secondary">
                                {user.xp_points} XP
                            </Badge>
                            <Badge variant="outline">
                                Level {state.user.level}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12 animate-in slide-in-from-top duration-500">
                    <h1 className="text-4xl font-bold mb-2">
                        Jalur Pembelajaran
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Pilih level untuk memulai petualangan belajar aksara
                        Jawa
                    </p>
                </div>

                {/* Learning Path */}
                <div className="relative">
                    {/* Path Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 via-green-500 to-muted h-full rounded-full opacity-30" />

                    <div className="space-y-16">
                        {curriculum?.map((level, index) => (
                            <div
                                key={level.id}
                                className={`relative flex flex-col items-center animate-in slide-in-from-bottom duration-700`}
                                style={{ animationDelay: `${index * 200}ms` }}
                            >
                                {/* Level Node */}
                                <div
                                    className={`relative w-24 h-24 rounded-full border-4 flex items-center justify-center cursor-pointer transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/25 hover:scale-110`}
                                    onClick={() => handleLevelClick(level)}
                                >
                                    {level.progress?.status === "locked" ? (
                                        <Lock className="h-8 w-8" />
                                    ) : level.progress?.status ===
                                      "mastered" ? (
                                        <div className="relative">
                                            <div className="text-3xl font-bold">
                                                {level.order}
                                            </div>
                                            <Crown className="absolute -top-2 -right-2 h-6 w-6 text-yellow-300" />
                                        </div>
                                    ) : level.progress?.status ===
                                      "completed" ? (
                                        <div className="relative">
                                            <div className="text-3xl font-bold">
                                                {level.order}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 bg-green-400 rounded-full p-1">
                                                <Check className="h-3 w-3 text-white" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-3xl font-bold">
                                            {level.order}
                                        </div>
                                    )}

                                    {/* Glow effect for available level */}
                                    {(level.progress?.status === "unlocked" ||
                                        level.progress?.status ===
                                            "available") && (
                                        <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                                    )}
                                </div>

                                {/* Level Info */}
                                <div className="text-center mt-4 space-y-1">
                                    <h3 className="text-xl font-bold">
                                        {level.name}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {level.description}
                                    </p>

                                    {/* Progress indicator */}
                                    {level.progress?.status !== "locked" &&
                                        level.units && (
                                            <div className="flex items-center justify-center space-x-2 mt-2">
                                                {level.units.map((unit) => (
                                                    <div
                                                        key={unit.id}
                                                        className={`w-2 h-2 rounded-full ${
                                                            unit.progress
                                                                ?.status ===
                                                            "completed"
                                                                ? "bg-green-500"
                                                                : unit.progress
                                                                      ?.status ===
                                                                      "unlocked" ||
                                                                  unit.progress
                                                                      ?.status ===
                                                                      "available"
                                                                ? "bg-blue-500"
                                                                : "bg-muted"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                </div>

                                {/* Connection line to next level */}
                                {index < curriculum.length - 1 && (
                                    <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-transparent to-muted opacity-30" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Achievement Section */}
                {/* <div className="mt-16 text-center animate-in slide-in-from-bottom duration-1000">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-500">
                                        {state.user.charactersLearned.length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Aksara Dikuasai
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-500">
                                        {curriculum?.filter(
                                            (l) =>
                                                l.progress?.status ===
                                                "completed"
                                        ).length || 0}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Level Selesai
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-500">
                                        {state.user.streak}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Hari Berturut
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div> */}
            </div>

            {/* Lesson Modal */}
            {selectedLevel && (
                <LessonModal
                    level={selectedLevel}
                    isOpen={!!selectedLevel}
                    onClose={() => setSelectedLevel(null)}
                />
            )}
        </div>
    );
}
