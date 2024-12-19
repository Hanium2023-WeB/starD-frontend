import axios from "axios";
import { useNavigate } from "react-router-dom";

// Axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: "/api", // 기본 URL 설정
    withCredentials: true, // 쿠키 사용
});

// Axios 요청 인터셉터
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Axios 응답 인터셉터
axiosInstance.interceptors.response.use(
    async (response) => {
        // 로그인 상태 확인
        if (response.config.url === "/members/auth/reissue" && response.status === 200) {
            console.log("accessToken 확인 여부 결과 값 :", response.data);

            if (response.data.refreshTokenExpirationTime !== 0) {
                localStorage.setItem("accessToken", response.data.accessToken); // 갱신된 토큰 저장
                return response;
            } else {
                console.log("토큰 만료");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("isLoggedInUserId");
                const navigate = useNavigate();
                navigate("/login"); // 로그인 페이지로 이동
            }
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const res = await axios.post(
                    "/api/members/auth/reissue",
                    {},
                    {
                        withCredentials: true,
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
                const newAccessToken = res.data.accessToken;
                localStorage.setItem("accessToken", newAccessToken);
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest); // 원래 요청 재시도
            } catch (refreshError) {
                console.error("토큰 갱신 실패:", refreshError);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("isLoggedInUserId");
                const navigate = useNavigate();
                navigate("/login"); // 로그인 페이지로 이동
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
