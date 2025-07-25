import {
    useRef,
    useEffect,
    forwardRef,
    useImperativeHandle,
    useState,
} from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
    RotateCcw,
    Send,
    Sparkles,
    CheckCircle,
    XCircle,
    Loader2,
} from "lucide-react";
import { predictAksara } from "@/hooks/api/main";

export const WritingCanvas = forwardRef(
    (
        {
            showGuide,
            targetCharacter,
            onStrokeDrawn,
            onSubmit,
            disabled,
            expectedAnswer,
        },
        ref
    ) => {
        const canvasRef = useRef(null);
        const isDrawing = useRef(false);
        const lastPoint = useRef(null);
        const currentStroke = useRef([]);
        const [guideOpacity, setGuideOpacity] = useState(0.5);
        const [hasDrawn, setHasDrawn] = useState(false);

        useImperativeHandle(ref, () => ({
            canvas: canvasRef.current,
            getCanvasBlob: () => {
                return new Promise((resolve) => {
                    const canvas = canvasRef.current;
                    if (!canvas) {
                        resolve(null);
                        return;
                    }
                    canvas.toBlob(resolve, "image/png", 0.8);
                });
            },
            hasDrawn: hasDrawn,
        }));

        useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            // Set canvas size based on its displayed size
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

            // Set initial drawing styles
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 4;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            // Clear canvas before drawing guide
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (showGuide) {
                // drawGuide(
                //     ctx,
                //     canvas.width / window.devicePixelRatio,
                //     canvas.height / window.devicePixelRatio
                // );

                // Animate guide opacity
                let opacity = 1;
                const fadeInterval = setInterval(() => {
                    opacity -= 0.02;
                    setGuideOpacity(opacity);
                    if (opacity <= 0.2) {
                        clearInterval(fadeInterval);
                    }
                }, 50);
                return () => clearInterval(fadeInterval);
            }
        }, [showGuide, targetCharacter]); // Rerun when target character changes

        const drawGuide = (ctx, width, height) => {
            ctx.save();
            ctx.strokeStyle = "#fffff";
            ctx.lineWidth = 2;
            ctx.globalAlpha = guideOpacity;

            const centerX = width / 2;
            const centerY = height / 2;

            // Draw accurate Javanese character guides
            switch (targetCharacter) {
                case "ꦲ": // ha
                    ctx.beginPath();
                    ctx.moveTo(centerX - 40, centerY - 25);
                    ctx.quadraticCurveTo(
                        centerX - 20,
                        centerY - 30,
                        centerX,
                        centerY - 25
                    );
                    ctx.quadraticCurveTo(
                        centerX + 20,
                        centerY - 20,
                        centerX + 40,
                        centerY - 25
                    );
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY - 25);
                    ctx.lineTo(centerX, centerY + 5);
                    ctx.quadraticCurveTo(
                        centerX + 5,
                        centerY + 10,
                        centerX + 10,
                        centerY + 5
                    );
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(centerX - 15, centerY - 10);
                    ctx.quadraticCurveTo(
                        centerX,
                        centerY - 15,
                        centerX + 15,
                        centerY - 10
                    );
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(centerX - 30, centerY + 10);
                    ctx.quadraticCurveTo(
                        centerX - 15,
                        centerY + 15,
                        centerX,
                        centerY + 10
                    );
                    ctx.quadraticCurveTo(
                        centerX + 15,
                        centerY + 5,
                        centerX + 30,
                        centerY + 10
                    );
                    ctx.stroke();
                    break;
                case "ꦤ": // na
                    ctx.beginPath();
                    ctx.moveTo(centerX - 30, centerY - 20);
                    ctx.quadraticCurveTo(
                        centerX - 10,
                        centerY - 25,
                        centerX + 10,
                        centerY - 20
                    );
                    ctx.quadraticCurveTo(
                        centerX + 30,
                        centerY - 15,
                        centerX + 40,
                        centerY - 20
                    );
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(centerX + 5, centerY - 20);
                    ctx.lineTo(centerX + 5, centerY + 10);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(centerX - 15, centerY + 5);
                    ctx.quadraticCurveTo(
                        centerX + 5,
                        centerY,
                        centerX + 25,
                        centerY + 5
                    );
                    ctx.stroke();
                    break;
                case "ꦕ": // ca
                    ctx.beginPath();
                    ctx.moveTo(centerX - 25, centerY - 5);
                    ctx.quadraticCurveTo(
                        centerX - 5,
                        centerY - 20,
                        centerX + 15,
                        centerY - 5
                    );
                    ctx.quadraticCurveTo(
                        centerX + 25,
                        centerY,
                        centerX + 30,
                        centerY + 5
                    );
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(centerX + 10, centerY - 5);
                    ctx.lineTo(centerX + 10, centerY + 10);
                    ctx.quadraticCurveTo(
                        centerX + 15,
                        centerY + 15,
                        centerX + 20,
                        centerY + 10
                    );
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(centerX - 5, centerY + 10);
                    ctx.quadraticCurveTo(
                        centerX + 10,
                        centerY + 5,
                        centerX + 25,
                        centerY + 10
                    );
                    ctx.stroke();
                    break;
                case "ꦫ": // ra
                    ctx.beginPath();
                    ctx.moveTo(centerX - 20, centerY - 20);
                    ctx.quadraticCurveTo(
                        centerX,
                        centerY - 25,
                        centerX + 20,
                        centerY - 20
                    );
                    ctx.quadraticCurveTo(
                        centerX + 30,
                        centerY - 15,
                        centerX + 25,
                        centerY - 10
                    );
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY - 20);
                    ctx.lineTo(centerX, centerY + 15);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(centerX - 15, centerY - 5);
                    ctx.quadraticCurveTo(
                        centerX,
                        centerY - 10,
                        centerX + 15,
                        centerY - 5
                    );
                    ctx.quadraticCurveTo(
                        centerX + 25,
                        centerY,
                        centerX + 20,
                        centerY + 5
                    );
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(centerX - 10, centerY + 15);
                    ctx.quadraticCurveTo(
                        centerX + 5,
                        centerY + 10,
                        centerX + 20,
                        centerY + 15
                    );
                    ctx.stroke();
                    break;
                case "ꦏ": // ka
                    ctx.beginPath();
                    ctx.moveTo(centerX - 25, centerY - 25);
                    ctx.quadraticCurveTo(
                        centerX - 5,
                        centerY - 30,
                        centerX + 15,
                        centerY - 25
                    );
                    ctx.quadraticCurveTo(
                        centerX + 25,
                        centerY - 20,
                        centerX + 30,
                        centerY - 15
                    );
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(centerX - 5, centerY - 25);
                    ctx.lineTo(centerX - 5, centerY + 10);
                    ctx.quadraticCurveTo(
                        centerX,
                        centerY + 15,
                        centerX + 5,
                        centerY + 10
                    );
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(centerX - 20, centerY);
                    ctx.quadraticCurveTo(
                        centerX - 5,
                        centerY - 5,
                        centerX + 10,
                        centerY
                    );
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(centerX - 30, centerY + 10);
                    ctx.quadraticCurveTo(
                        centerX - 15,
                        centerY + 15,
                        centerX,
                        centerY + 10
                    );
                    ctx.stroke();
                    break;
                default:
                    // Fallback guide
                    ctx.beginPath();
                    ctx.moveTo(centerX - 40, centerY - 30);
                    ctx.lineTo(centerX + 40, centerY - 30);
                    ctx.moveTo(centerX, centerY - 30);
                    ctx.lineTo(centerX, centerY + 30);
                    ctx.stroke();
            }
            ctx.restore();
        };

        const getEventPos = (e) => {
            const canvas = canvasRef.current;
            if (!canvas) return { x: 0, y: 0 };

            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            return {
                x: clientX - rect.left,
                y: clientY - rect.top,
            };
        };

        const startDrawing = (e) => {
            e.preventDefault();
            isDrawing.current = true;
            const pos = getEventPos(e);
            lastPoint.current = pos;
            currentStroke.current = [pos];
        };

        const draw = (e) => {
            if (!isDrawing.current || !lastPoint.current) return;
            e.preventDefault();

            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (!canvas || !ctx) return;

            const currentPoint = getEventPos(e);
            currentStroke.current.push(currentPoint);

            ctx.beginPath();
            ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
            ctx.lineTo(currentPoint.x, currentPoint.y);
            ctx.stroke();

            lastPoint.current = currentPoint;
        };

        const stopDrawing = () => {
            if (!isDrawing.current) return;

            isDrawing.current = false;
            lastPoint.current = null;

            if (currentStroke.current.length > 5) {
                setHasDrawn(true);
                if (onStrokeDrawn) {
                    onStrokeDrawn(currentStroke.current);
                }
            }

            currentStroke.current = [];
        };

        const clearCanvas = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setHasDrawn(false);
        };

        return (
            <div className="relative space-y-4">
                <canvas
                    ref={canvasRef}
                    className="w-full h-64 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-crosshair bg-card hover:border-primary/50 transition-all duration-300"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />

                {/* Canvas Controls */}
                <div className="flex gap-2 justify-center">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={clearCanvas}
                        disabled={!hasDrawn || disabled}
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Hapus
                    </Button>
                </div>
            </div>
        );
    }
);

WritingCanvas.displayName = "WritingCanvas";
