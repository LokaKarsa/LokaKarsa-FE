import { isRouteErrorResponse, useRouteError } from "react-router";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const RootBoundary = () => {
    const error = useRouteError();

    const renderErrorContent = () => {
        if (isRouteErrorResponse(error)) {
            switch (error.status) {
                case 404:
                    return { title: "404 - Not Found", message: "This page doesn't exist!" };
                case 401:
                    return { title: "401 - Unauthorized", message: "You aren't authorized to see this." };
                case 503:
                    return { title: "503 - Service Unavailable", message: "Looks like our API is down." };
                case 418:
                    return { title: "418 - I'm a Teapot", message: "🫖" };
                default:
                    return { title: "Error", message: "Something went wrong." };
            }
        }
        return { title: "Error", message: "Something went wrong." };
    };

    const { title, message } = renderErrorContent();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center text-xl font-bold">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-gray-600">{message}</p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button onClick={() => window.location.href = "/"}>Go to Homepage</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default RootBoundary;