import {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";

const MyPageContext = createContext();

export const MyPageProvider = ({ children }) => {
    const [participateStudies, setParticipateStudies] = useState([]);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const [error, setError] = useState(null); // 에러 상태 추가
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchParticipateStudyData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/members/studies/participate`, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                console.log('ParticipateStudies API Response:', response.data.studyRecruitPosts);
                setParticipateStudies(response.data.studyRecruitPosts);
            } catch (err) {
                console.error('ParticipateStudies API Error:', err.response?.data || err.message || 'Unknown error');
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchParticipateStudyData();
    }, []);

    return (
        <MyPageContext.Provider value={{ participateStudies, setParticipateStudies }}>
            {children}
        </MyPageContext.Provider>
    )
};

export const useMyPageContext = () => useContext(MyPageContext);