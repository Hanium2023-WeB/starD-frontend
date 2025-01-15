import React, {useState, useRef, useCallback, useEffect} from "react";
import Category from "../../components/repeat_etc/Category.js";
import ScheduleCalender from "../../components/schedule/ScheduleCalender.js";
import Backarrow from "../../components/repeat_etc/Backarrow.js";
import AddSchedule from "../../components/schedule/AddSchedule.js";
import Header from "../../components/repeat_etc/Header";
import axios from "axios";
import ToDoListItem from "../../components/todo/ToDoListItem";
import cn from "classnames";
import checkbox from "../../images/check.png";
import uncheckbox from "../../images/unchecked.png";
import editicon from "../../images/edit.png";
import removeicon from "../../images/remove.png";

const Schedule = ({sideheader}) => {
    const [meetings, setMeetings] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [addToggle, setAddToggle] = useState(false);
    const accessToken = localStorage.getItem('accessToken');

    const [studies, setStudies] = useState([]);
    const [selectedTitle, setSelectedTitle] = useState("전체");  // 전체/특정 제목 선택 상태
    const [studyTitles, setStudyTitles] = useState([]);
    const [studyIds, setStudyIds] = useState([]);
    const [studyMems, setStudyMems] = useState([]);

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0"); // 0부터 시작하므로 +1
    const yearMonth = `${year}-${month}`;

    useEffect(() => {
        axios.get("/api/members/studies/participate", {
            params: { page: 1 },
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("모집완료된 스터디, 참여멤버 전송 성공 : ", res.data.studyRecruitPosts);
                const studyList = res.data.studyRecruitPosts;
                setStudies(studyList);
                const studiesTitle = studyList.map(item => item.title);
                setStudyTitles(studiesTitle);
                const studiesIds = studyList.map(item => item.studyId);
                setStudyIds(studiesIds);
            })
            .catch((error) => {
                console.error("모집완료된 스터디, 참여멤버  가져오기 실패:", error);
            });
    }, [accessToken]);

    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        // 선택된 제목에 따른 요청 URL 설정
        const scheduleRequests = selectedTitle === "전체"
            ? studyIds.map((studyId) =>
                axios.get(`/api/studies/${studyId}/schedules`, {
                    params: { year: year, month: month },
                    headers: { Authorization: `Bearer ${accessToken}` }
                })
            )
            : [axios.get(`/api/studies/${studyIds.find(id => studies.find(study => study.title === selectedTitle && study.studyId === id))}/schedules`, {
                params: { year: year, month: month },
                headers: { Authorization: `Bearer ${accessToken}` }
            })];

        // 모든 요청이 완료된 후 결과 처리
        Promise.all(scheduleRequests)
            .then((responses) => {
                const allSchedules = [];

                responses.forEach((response) => {
                    const schedules = response.data;
                    console.log(response.data);

                    // 모든 일정 데이터를 배열에 추가
                    allSchedules.push(...schedules);
                });

                setSchedules(allSchedules);  // setSchedule으로 변경
                console.log("일정 리스트:", allSchedules);
            })
            .catch((error) => {
                console.log("일정 리스트 가져오기 실패:", error);
            });
    }, [selectedTitle, studyIds, year, month, accessToken]);

    const handleSelectChange = (event) => {
        setSelectedTitle(event.target.value);  // "전체" 또는 특정 제목으로 상태 변경
    };

    useEffect(() => {
        console.log("schedules:", schedules);
    }, [schedules]);

    const handleToggle = (day) => {
        setSelectedDate(new Date(day));
        console.log("클릭한 날짜11");
        console.log(new Date(day));
        setAddToggle((prev) => !prev);
    };
    // const nextId = useRef(1);

    const handleDateClick = (month) => {
        setSelectedDate(new Date(month));
        console.log(`선택한 월 : ${month}`);
    };

    return (<div>
            <Header showSideCenter={true}/>
            <div className="container">
                <Category/>
                <div className="main_schedule_container">
                    <Backarrow subname={"스터디 모임 일정"}/>
                    <div style={{display:"flex", alignItems:"center"}}>
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
                            onChange={(e) => handleDateClick(e.target.value)} // 선택된 날짜를 handleDateClick으로 전달
                        />
                    </div>
                    <ul className="schedule_list">
                        {schedules.length === 0 && (
                            <div className="alert_empty_todo">
                                <span>일정이 없습니다.<br />일정을 등록해주세요.</span>
                            </div>
                        )}
                        {Object.entries(
                            schedules.reduce((acc, schedule) => {
                                const date = schedule.startDate; // 날짜를 기준으로 그룹화
                                if (!acc[date]) acc[date] = []; // 날짜 키가 없으면 생성
                                acc[date].push(schedule); // 해당 날짜에 일정 추가
                                return acc;
                            }, {})
                        ).map(([date, scheduleList]) => (
                            <div key={date} style={{ marginBottom: "10px" }}>
                                <p className="schedule_date">📅 {date}</p> {/* 날짜 */}
                                {scheduleList.map((schedule) => (
                                    <li key={schedule.scheduleId} className="schedule_title" style={{background:schedule.color}}>
                                        <p>◽ {schedule.title}</p>
                                    </li>
                                ))}
                            </div>
                        ))}
                    </ul>

                    {/*<div className="sub_container" id="todo_sub" style={{left:"0", width:"135%"}}>*/}
                    {/*    <ScheduleCalender*/}
                    {/*        studies={studies}*/}
                    {/*        studyTitles={studyTitles}*/}
                    {/*        onDateClick={handleToggle}*/}
                    {/*        meetings={meetings}*/}
                    {/*        schedules={schedules}*/}
                    {/*        onUpdate={onUpdate}*/}
                    {/*        onRemove={onRemove}*/}
                    {/*    />*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>);
};
export default Schedule;
