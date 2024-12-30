// TeamBlogContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const TeamBlogContext = createContext();

export const TeamBlogProvider = ({ children }) => {
    const { id } = useParams(); // URL의 id 파라미터 사용
    const [member, setMember] = useState([]);
    const [studyItem, setStudyItem] = useState([]);
    const [progressType, setProgressType] = useState([]);

    const [today, setToday] = useState(new Date());
    const Year = today.getFullYear();
    const Month = today.getMonth() + 1;
    const Dates = today.getDate();
    const [todos, setTodos] = useState([]);
    const [schedules, setSchedules] = useState(null);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const [error, setError] = useState(null); // 에러 상태 추가
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchMemberData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/studies/${id}/members`, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                console.log("Members: " + response.data);
                setMember(response.data);
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        const fetchToDoData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/studies/${id}/to-dos`, {
                    params: {
                        year: Year, month: Month,
                    },
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                console.log('To-Do API Response:', response.data);
                setTodos(response.data);
            } catch (err) {
                console.error('To-Do API Error:', err.response?.data || err.message || 'Unknown error');
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

// 스터디 데이터 가져오기
        const fetchStudyData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/studies/${id}`, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                console.log('Study API Response:', response.data);
                setStudyItem(response.data);
            } catch (err) {
                console.error('Study API Error:', err.response?.data || err.message || 'Unknown error');
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

// 일정 데이터 가져오기
        const fetchScheduleData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/studies/${id}/schedules`, {
                    params: {
                        year: Year, month: Month,
                    },
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                console.log('Schedule API Response:', response.data);
                setSchedules(response.data);
            } catch (err) {
                console.error('Schedule API Error:', err.response?.data || err.message || 'Unknown error');
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchMemberData();
        fetchStudyData();
        fetchToDoData();
        fetchScheduleData();
    }, [id]);

    return (
        <TeamBlogContext.Provider value={{ member, setMember, studyItem, setStudyItem, progressType, setProgressType, todos, setTodos, schedules, setSchedules, loading, error }}>
            {children}
        </TeamBlogContext.Provider>
    );
};

export const useTeamBlogContext = () => useContext(TeamBlogContext);
