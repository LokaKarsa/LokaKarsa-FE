import axios from "axios";

export const getDashboardData = async (token) => {
    if (!token) {
        throw new Error("Semua field harus diisi");
    }

    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/dashboard`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    ContentType: "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error("Ada kendala pada server. Coba lagi atau hubungi CS");
    }
};

export const getCurriculumData = async (token) => {
    if (!token) {
        throw new Error("Token dibutuhkan untuk mengambil kurikulum");
    }

    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/curriculum`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    ContentType: "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error("Ada kendala pada server. Coba lagi atau hubungi CS");
    }
};

export const getUnitQuestions = async (token, unitId) => {
    if (!token || !unitId) {
        throw new Error("Token dan Unit ID dibutuhkan untuk mengambil soal");
    }

    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/units/${unitId}/questions`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    ContentType: "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error("Ada kendala pada server. Coba lagi atau hubungi CS");
    }
};
