import axios from "axios";

export const fetchProfile = async (token) => {
    if(!token) {
        throw new Error("Token dibutuhkan untuk mengambil profil");
    }

    try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                ContentType: 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error("Ada kendala pada server. Coba lagi atau hubungi CS");
    }
}

export const login = async (email, password) => {
    if(!email || !password) {
        throw new Error("Email atau password wajib diisi");
    }

    try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/login`, {
            email: email,
            password: password
        }, {
            headers: {
                Accept: 'application/json',
                ContentType: 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error("Ada kendala pada server. Coba lagi atau hubungi CS");
    }
}

export const register = async (email, password, passwordConf) => {
    if(!email || !password || !passwordConf) {
        throw new Error("Semua field wajib diisi");
    }

    if(password !== passwordConf) {
        throw new Error("Password dan konfirmasi password tidak cocok");
    }

    try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/register`, {
            email: email,
            password: password,
            password_confirmation: passwordConf
        });
        return response.data;
    } catch (error) {
        throw new Error("Ada kendala pada server. Coba lagi atau hubungi CS");
    }
}