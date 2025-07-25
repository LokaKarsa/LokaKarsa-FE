import { useState, useRef, useEffect } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    Camera,
    Eye,
    EyeOff,
    Save,
    X,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import { editProfile, fetchProfile } from "@/hooks/api/auth";
import { useAuth } from "@/provider/AuthProvider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

export function EditProfileForm({ onBack }) {
    const fileInputRef = useRef(null);
    const auth = useAuth();
    const token = auth?.token;

    const [profileData, setProfileData] = useState(null);

    const [formData, setFormData] = useState({});

    const [avatarPreview, setAvatarPreview] = useState(null);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isCompLoading, setIsCompLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const res = await fetchProfile(token);

                if (res.success) {
                    setProfileData(res.data.user_info);
                    setFormData(res.data.user_info);
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

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (error) setError("");
        if (success) setSuccess("");
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                // 5MB limit
                setError("Ukuran file maksimal 5MB");
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsCompLoading(true);
        setError("");
        setSuccess("");

        try {
            await editProfile(
                token,
                formData.firstname,
                formData.lastname,
                formData.bio,
                formData.sex,
                formData.region,
                formData.birthdate
            )
                .then((res) => {
                    console.log("Profil berhasil di update");
                    setSuccess("Profil berhasil diperbarui!");
                    setIsCompLoading(false);
                })
                .catch((e) => {
                    console.log("Error : ", error);
                });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Terjadi kesalahan");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (onBack) {
            onBack();
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancel}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Button>
                        <h1 className="text-lg font-semibold">Edit Profil</h1>
                        <div className="w-20" /> {/* Spacer for centering */}
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-8">
                <Card className="animate-in slide-in-from-bottom duration-500">
                    <CardHeader>
                        <CardTitle>Edit Profil</CardTitle>
                        <CardDescription>
                            Perbarui informasi profil dan pengaturan akun Anda
                        </CardDescription>
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
                            <Alert
                                variant="destructive"
                                className="animate-in slide-in-from-top duration-300"
                            >
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Personal Information */}
                            <div className="space-y-6">
                                <Label className="text-base font-semibold">
                                    Informasi Pribadi
                                </Label>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstname">
                                                Nama Depan
                                            </Label>
                                            <Input
                                                id="firstname"
                                                value={formData.firstname}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "firstname",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Masukkan nama depan"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="lastname">
                                                Nama Belakang
                                            </Label>
                                            <Input
                                                id="lastname"
                                                value={formData.lastname}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "lastname",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Masukkan nama belakang"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="sex">
                                                Jenis Kelamin
                                            </Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    handleInputChange(
                                                        "sex",
                                                        value
                                                    )
                                                }
                                                value={formData.sex || ""}
                                            >
                                                <SelectTrigger className="w-full h-12">
                                                    <SelectValue placeholder="Pilih jenis kelamin" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="male">
                                                        Laki-laki
                                                    </SelectItem>
                                                    <SelectItem value="female">
                                                        Perempuan
                                                    </SelectItem>
                                                    <SelectItem value="other">
                                                        Lainnya
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* birthdate */}
                                        <div className="space-y-2">
                                            <Label htmlFor="birthdate">
                                                Tanggal Lahir
                                            </Label>
                                            <Input
                                                id="birthdate"
                                                type="date"
                                                value={formData.birthdate || ""}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "birthdate",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Masukkan tanggal lahir"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="region">Wilayah</Label>
                                        <Input
                                            id="region"
                                            value={formData.region || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "region",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Masukkan wilayah"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Input
                                            id="bio"
                                            type="text"
                                            value={formData.bio}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "bio",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Bio kamu"
                                            className="h-12"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-4 pt-6">
                                <Button
                                    type="submit"
                                    className="flex-1 h-12 hover:scale-105 transition-all duration-200"
                                    disabled={
                                        isCompLoading ||
                                        !formData.firstname ||
                                        !formData.lastname ||
                                        !formData.bio ||
                                        !formData.sex ||
                                        !formData.region ||
                                        !formData.date_of_birth
                                    }
                                >
                                    {isCompLoading ? (
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
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
