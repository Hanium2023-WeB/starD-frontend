import React, {useState, useEffect} from "react";
import Category from "../../components/repeat_etc/Category.js";
import Backarrow from "../../components/repeat_etc/Backarrow.js";
import Header from "../../components/repeat_etc/Header";
import axios from "axios";
import Loading from "../../components/repeat_etc/Loading";

const Schedule = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loadingStudies, setLoadingStudies] = useState(false); // 스터디 로딩 상태
    const [loadingSchedules, setLoadingSchedules] = useState(false); // 일정 로딩 상태

    const accessToken = localStorage.getItem('accessToken');
    const [studies, setStudies] = useState([]);
    const [selectedTitle, setSelectedTitle] = useState("전체");
    const [studyTitles, setStudyTitles] = useState([]);
    const [studyIds, setStudyIds] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const yearMonth = `${year}-${month}`;

    // 스터디 목록 가져오기
    useEffect(() => {
        setLoadingStudies(true); // 로딩 시작
        axios.get("/api/members/studies/participate", {
            params: { page: 1 },
            withCredentials: true,
            headers: { 'Authorization': `Bearer ${accessToken}` }
        })
            .then((res) => {
                const studyList = res.data.studyRecruitPosts;
                setStudies(studyList);
                setStudyTitles(studyList.map(item => item.title));
                setStudyIds(studyList.map(item => item.studyId));
            })
            .catch((error) => {
                console.error("스터디 가져오기 실패:", error);
            })
            .finally(() => {
                setLoadingStudies(false); // 로딩 종료
            });
    }, [accessToken]);

    // 일정 데이터 가져오기
    useEffect(() => {
        setLoadingSchedules(true); // 로딩 시작

        // URL 설정
        const url = selectedTitle === "전체"
            ? `/api/members/schedules`
            : `/api/members/schedules/${studyIds.find(id =>
                studies.find(study => study.title === selectedTitle && study.studyId === id))}`;

        console.log("Fetching schedules from URL:", url);

        // 데이터 요청
        axios.get(url, {
            params: { year, month },
            headers: { Authorization: `Bearer ${accessToken}` }
        })
            .then((response) => {
                setSchedules(response.data); // 성공적으로 스케줄 설정
            })
            .catch((error) => {
                console.error("일정 가져오기 실패:", error);
            })
            .finally(() => {
                setLoadingSchedules(false); // 로딩 종료
            });
    }, [selectedTitle, studyIds, year, month, accessToken]);


    const handleSelectChange = (event) => {
        setSelectedTitle(event.target.value);
    };

    const handleDateClick = (month) => {
        setSelectedDate(new Date(month));
    };

    return (
        <div>
            <Header showSideCenter={true} />
            <div className="container">
                <Category />
                <div className="main_schedule_container">
                    <Backarrow subname={"스터디 모임 일정"} />
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <select value={selectedTitle} onChange={handleSelectChange}>
                            <option value="전체">전체보기</option>
                            {studyTitles.map((item, index) => (
                                <option key={index} value={item}>{item}</option>
                            ))}
                        </select>
                        <input
                            type="month"
                            value={yearMonth}
                            className="select_month"
                            onChange={(e) => handleDateClick(e.target.value)}
                        />
                    </div>
                    {loadingStudies ? (
                        <Loading loading={true} /> // 스터디 로딩 중 표시
                    ) : (
                        <ul className="schedule_list">
                            {loadingSchedules ? (
                                <Loading loading={true} /> // 일정 로딩 중 표시
                            ) : schedules.length === 0 ? (
                                <div className="alert_empty_todo">
                                    <span>일정이 없습니다.<br />일정을 등록해주세요.</span>
                                </div>
                            ) : (
                                Object.entries(
                                    schedules.reduce((acc, schedule) => {
                                        const date = schedule.startDate;
                                        if (!acc[date]) acc[date] = [];
                                        acc[date].push(schedule);
                                        return acc;
                                    }, {})
                                ).map(([date, scheduleList]) => (
                                    <div key={date} style={{ marginBottom: "30px" }}>
                                        <p className="schedule_date">📅 {date}</p>
                                        {scheduleList.map((schedule) => (
                                            <li key={schedule.scheduleId} className="schedule_title" style={{ background: schedule.color }}>
                                                <p>◽ {schedule.title}</p>
                                            </li>
                                        ))}
                                    </div>
                                ))
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Schedule;
