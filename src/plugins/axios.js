import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 5000,
});

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 403) {
            localStorage.removeItem("token");
            alert("Your session has expired. Please log in again.");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
