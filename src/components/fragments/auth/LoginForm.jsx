import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { login } from "@/hooks/api/auth";
import { useNavigate } from "react-router";
import { useAuth } from "@/provider/AuthProvider";

export function LoginForm() {
    const auth = useAuth();
    const setToken = auth?.setToken;
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await login(formData.email, formData.password);
            if (response.data) {
                setToken?.(response.data.access_token);
                navigate("/");
            } else {
                setError("Login gagal. Periksa email dan password Anda.");
            }
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        alert(`Login with ${provider}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-in slide-in-from-bottom duration-700">
                <div className="text-center mb-8">
                    <div className="text-4xl mb-2 animate-in zoom-in duration-500">
                        ꦤꦸꦭꦶꦱ꧀
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Nulis Aksara
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Belajar Aksara Jawa dengan Mudah
                    </p>
                </div>

                <Card className="shadow-sm border-1 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="text-center space-y-2">
                        <CardTitle className="text-2xl font-bold">
                            Selamat Datang Kembali!
                        </CardTitle>
                        <CardDescription>
                            Masuk ke akun Anda untuk melanjutkan pembelajaran
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {error && (
                            <Alert
                                variant="destructive"
                                className="animate-in slide-in-from-top duration-300"
                            >
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium"
                                >
                                    Email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="nama@email.com"
                                        value={formData.email}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                        className="pl-10 h-12"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-medium"
                                >
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="Masukkan password"
                                        value={formData.password}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "password",
                                                e.target.value
                                            )
                                        }
                                        className="pl-10 pr-10 h-12"
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="text-right">
                                <a
                                    href="/auth/forgot-password"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Lupa password?
                                </a>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-semibold"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Masuk...</span>
                                    </div>
                                ) : (
                                    "Masuk"
                                )}
                            </Button>
                        </form>

                        <div className="relative">
                            <Separator />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-card px-2 text-xs text-muted-foreground">
                                    atau
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-12 bg-transparent"
                                onClick={() => handleSocialLogin("google")}
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Masuk dengan Google
                            </Button>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                Belum punya akun?{" "}
                                <a
                                    href="/auth/register"
                                    className="text-primary font-medium hover:underline"
                                >
                                    Daftar di sini
                                </a>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
