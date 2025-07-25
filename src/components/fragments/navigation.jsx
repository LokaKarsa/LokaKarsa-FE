"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/components/fragments/app-provider";
import { useAuth } from "@/provider/AuthProvider";
import {
    Home,
    BookOpen,
    Trophy,
    Settings,
    Menu,
    X,
    User,
    LogOut,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navigation() {
    const { state } = useApp();
    const auth = useAuth();
    const user = auth?.user;
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const location = useLocation();

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await auth.logout();
        } catch (error) {
            console.error("Logout failed:", error);
            setIsLoggingOut(false);
        }
    };

    const navItems = [
        { to: "/", icon: Home, label: "Beranda" },
        { to: "/practice", icon: BookOpen, label: "Latihan" },
    ];

    return (
        <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="font-bold text-lg">LokaKarsa</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navItems.map((item) => (
                            <Link key={item.to} to={item.to} className="cursor-pointer">
                                <Button
                                    variant={
                                        location.pathname === item.to
                                            ? "default"
                                            : "ghost"
                                    }
                                    size="sm"
                                    className="flex items-center space-x-2 cursor-pointer"
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </Button>
                            </Link>
                        ))}
                    </div>

                    {/* User Info */}
                    <div className="hidden md:flex items-center space-x-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-primary/20 transition-all hover:ring-primary/40">
                                    <AvatarImage
                                        src={
                                            user?.avatar ||
                                            state.user.avatar ||
                                            "/placeholder.svg"
                                        }
                                        alt={user?.name || state.user.name}
                                    />
                                    <AvatarFallback>
                                        {user?.firstname?.[0] &&
                                        user?.lastname?.[0]
                                            ? user.firstname[0] +
                                              user.lastname[0]
                                            : user?.name?.[0] ||
                                              state.user.name?.[0] ||
                                              "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-2"
                                    >
                                        <User className="h-4 w-4" />
                                        Profil
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="flex items-center gap-2"
                                >
                                    <LogOut className="h-4 w-4" />
                                    {isLoggingOut ? "Keluar..." : "Keluar"}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </Button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden py-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => setIsOpen(false)}
                            >
                                <Button
                                    variant={
                                        location.pathname === item.to
                                            ? "default"
                                            : "ghost"
                                    }
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
                                    <AvatarImage
                                        src={
                                            user?.avatar ||
                                            state.user.avatar ||
                                            "/placeholder.svg"
                                        }
                                        alt={user?.name || state.user.name}
                                    />
                                    <AvatarFallback>
                                        {(user?.name || state.user.name)?.[0] ||
                                            "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium">
                                        {user?.firstname && user?.lastname
                                            ? `${user.firstname} ${user.lastname}`
                                            : user?.name ||
                                              state.user.name ||
                                              "User"}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {user?.xp || state.user.xp || 0} XP •
                                        Level{" "}
                                        {user?.level || state.user.level || 1}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 space-y-1">
                                <Link
                                    to="/profile"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start"
                                    >
                                        <User className="h-4 w-4 mr-2" />
                                        Profil
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start"
                                    disabled={isLoggingOut}
                                    onClick={() => {
                                        setIsOpen(false);
                                        handleLogout();
                                    }}
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    {isLoggingOut ? "Keluar..." : "Keluar"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
