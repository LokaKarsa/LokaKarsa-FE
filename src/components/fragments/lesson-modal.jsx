import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useApp } from "./app-provider";
import { useNavigate } from "react-router";
import {
    Lock,
    Check,
    Play,
    Pencil,
    PuzzleIcon as PuzzlePiece,
    FileText,
} from "lucide-react";

export function LessonModal({ level, isOpen, onClose }) {
    const { playSound, triggerHaptic } = useApp();
    const navigate = useNavigate();

    const getUnitIcon = (levelName) => {
        if (levelName.toLowerCase().includes("mengenal")) {
            return <PuzzlePiece className="h-5 w-5 text-white" />;
        } else if (levelName.toLowerCase().includes("menulis")) {
            return <Pencil className="h-5 w-5 text-white" />;
        }
        return <FileText className="h-5 w-5 text-white" />;
    };

    const getUnitDescription = (levelName) => {
        if (levelName.toLowerCase().includes("mengenal")) {
            return "Latihan pilihan ganda untuk mengenal aksara";
        } else if (levelName.toLowerCase().includes("menulis")) {
            return "Latihan menulis aksara di canvas";
        }
        return "Latihan aksara Jawa";
    };

    const handleStartLesson = (unit) => {
        if (unit.progress?.status === "locked") {
            playSound("error");
            triggerHaptic("light");
            return;
        }

        playSound("click");
        triggerHaptic("medium");
        onClose();

        // Determine if this is a quiz or practice unit
        // You can modify this logic based on your API structure
        const isQuizUnit =
            unit.type === "quiz" ||
            unit.name?.toLowerCase().includes("kuis") ||
            unit.name?.toLowerCase().includes("quiz") ||
            unit.description?.toLowerCase().includes("kuis") ||
            unit.description?.toLowerCase().includes("quiz");

        if (isQuizUnit) {
            navigate(`/quiz/${unit.id}`);
        } else {
            navigate(`/practice/${unit.id}`);
        }
    };

    const availableUnits =
        level.units?.filter((u) => u.progress?.status !== "locked") || [];
    const totalQuestions = availableUnits.reduce(
        (sum, unit) => sum + (unit.questions_count || 0),
        0
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center space-x-4 mb-4">
                        <div>
                            <DialogTitle className="text-2xl">
                                {level.name}
                            </DialogTitle>
                            <p className="text-muted-foreground">
                                {level.description}
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Units List */}
                    <div className="space-y-3">
                        {level.units?.map((unit, index) => (
                            <div
                                key={unit.id}
                                className={`p-4 rounded-lg border transition-all duration-200 ${
                                    unit.progress?.status === "locked"
                                        ? "bg-muted/30 border-muted opacity-60"
                                        : unit.progress?.status === "completed"
                                        ? "bg-green-500/10 border-green-500/20 hover:bg-green-500/20"
                                        : "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 cursor-pointer"
                                }`}
                                onClick={() => handleStartLesson(unit)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={`p-2 rounded-full ${
                                                unit.progress?.status ===
                                                "locked"
                                                    ? "bg-muted"
                                                    : unit.progress?.status ===
                                                      "completed"
                                                    ? "bg-green-500"
                                                    : "bg-blue-500"
                                            }`}
                                        >
                                            {unit.progress?.status ===
                                            "locked" ? (
                                                <Lock className="h-5 w-5 text-muted-foreground" />
                                            ) : unit.progress?.status ===
                                              "completed" ? (
                                                <Check className="h-5 w-5 text-white" />
                                            ) : (
                                                getUnitIcon(level.name)
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">
                                                Unit {index + 1}: {unit.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {getUnitDescription(level.name)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge
                                            variant={
                                                unit.progress?.status ===
                                                "completed"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                            className={
                                                unit.progress?.status ===
                                                "completed"
                                                    ? "bg-green-500"
                                                    : unit.progress?.status ===
                                                      "unlocked"
                                                    ? "bg-blue-500"
                                                    : "bg-muted"
                                            }
                                        >
                                            {unit.progress
                                                ?.completion_percent || 0}
                                            %
                                        </Badge>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {unit.questions_count} soal
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) || (
                            <div className="text-center py-8 text-muted-foreground">
                                Tidak ada unit tersedia
                            </div>
                        )}
                    </div>

                    {/* Start Button */}
                    <div className="pt-4 border-t">
                        <Button
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3"
                            onClick={() => {
                                const nextUnit = level.units?.find(
                                    (u) => u.progress?.status === "unlocked"
                                );
                                if (nextUnit) {
                                    handleStartLesson(nextUnit);
                                }
                            }}
                            disabled={
                                !level.units?.some(
                                    (u) => u.progress?.status === "unlocked"
                                )
                            }
                        >
                            <Play className="h-5 w-5 mr-2" />
                            Mulai Belajar ({totalQuestions} Soal)
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
