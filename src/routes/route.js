import React from "react";
import RootBoundary from "@/components/fragments/error/RootBoundary";
import { Dashboard } from "@/components/fragments/dashboard";

import AuthLayout from "@/components/layouts/AuthLayout";
import MainLayout from "@/components/layouts/MainLayout";
import ProtectedRoute from "@/components/layouts/ProtectedRoute";
import PublicRoute from "@/components/layouts/PublicRoute";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import Homepage from "@/pages/HomePage";
import AdvancedLessonPage from "@/pages/Lesson/AdvancedLessonPage";
import { createBrowserRouter, redirect } from "react-router";
import { ProfilePage } from "@/components/fragments/profile-page";
import EditProfilePage from "@/pages/profile/EditProfilePage";
import IntroductionLessonPage from "@/pages/Lesson/IntroductionLessonPage";
import BasicLessonPage from "@/pages/Lesson/BasicLessonPage";
import PracticePage from "@/pages/PracticePage";
import QuizLessonPage from "@/pages/Lesson/QuizLessonPage";
import { PracticeInterface } from "@/components/fragments/practice-interface";
import QuizInterface from "@/components/fragments/quiz-interface";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        ErrorBoundary: RootBoundary,
        children: [
            {
                index: true,
                Component: Dashboard,
            },
            {
                path: "practice",
                Component: PracticePage,
            },
            {
                path: "practice/:unitId",
                Component: PracticeInterface,
            },
            {
                path: "quiz/:unitId",
                Component: QuizInterface,
            },
        ],
    },
    {
        path: "/profile",
        Component: MainLayout,
        ErrorBoundary: RootBoundary,
        children: [
            {
                index: true,
                Component: ProfilePage,
            },
            {
                path: "edit",
                Component: EditProfilePage,
            },
        ],
    },
    {
        path: "/auth",
        Component: AuthLayout,
        ErrorBoundary: RootBoundary,
        children: [
            {
                index: true,
                loader: () => redirect("/auth/login"),
            },
            {
                path: "login",
                Component: LoginPage,
            },
            {
                path: "register",
                Component: RegisterPage,
            },
        ],
    },
    {
        path: "/lesson",
        Component: MainLayout,
        ErrorBoundary: RootBoundary,
        children: [
            {
                index: true,
                loader: () => redirect("/lesson/intro"),
            },
            {
                path: "intro",
                Component: IntroductionLessonPage,
            },
            {
                path: "basic",
                Component: BasicLessonPage,
            },
            {
                path: "advanced",
                Component: AdvancedLessonPage,
            },
            {
                path: "quiz",
                Component: QuizLessonPage,
            },
        ],
    },
]);
