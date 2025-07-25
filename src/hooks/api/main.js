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

export const submitAnswer = async (token, questionId, answer) => {
    if (!token || !questionId || !answer) {
        throw new Error("Token, Question ID, dan jawaban dibutuhkan");
    }

    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/answers`,
            {
                question_id: questionId,
                answer: answer,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error("Ada kendala pada server. Coba lagi atau hubungi CS");
    }
};

export const predictAksara = async (imageBlob) => {
    if (!imageBlob) {
        throw new Error("Gambar dibutuhkan untuk prediksi");
    }

    try {
        const formData = new FormData();
        formData.append("file", imageBlob, "canvas_drawing.png");

        const response = await axios.post(
            `${import.meta.env.VITE_MODEL_API_BASE_URL}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Prediction error:", error);
        throw new Error("Gagal melakukan prediksi. Coba lagi.");
    }
};
