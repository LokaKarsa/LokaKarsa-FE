// Auth guards for route loaders
export const requireAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Response("Unauthorized", { status: 401 });
    }
    return null;
};

export const requireGuest = () => {
    const token = localStorage.getItem("token");
    if (token) {
        throw new Response("Already authenticated", {
            status: 302,
            headers: { Location: "/" },
        });
    }
    return null;
};
