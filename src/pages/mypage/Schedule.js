import React, {useState, useRef, useCallback, useEffect} from "react";
import Category from "../../components/repeat_etc/Category.js";
import ScheduleCalender from "../../components/schedule/ScheduleCalender.js";
import Backarrow from "../../components/repeat_etc/Backarrow.js";
import AddSchedule from "../../components/schedule/AddSchedule.js";
import Header from "../../components/repeat_etc/Header";
import axios from "axios";

const Schedule = ({sideheader}) => {
    const [meetings, setMeetings] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [addToggle, setAddToggle] = useState(false);
    const accessToken = localStorage.getItem('accessToken');

    const [studies, setStudy] = useState([]);
    const [studyTitles, setStudyTitles] = useState([]);
    const [studyIds, setStudyIds] = useState([]);
    const [studyMems, setStudyMems] = useState([]);

    useEffect(() => {
        axios.get("/api/user/mypage/studying", {
            withCredentials: true, headers: {
                'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json',
            }
        })
            .then((res) => {
                console.log("모집완료된 스터디, 참여멤버 전송 성공 : ", res.data);
                const studyList = res.data.content;
                setStudy(studyList);
                //console.log("모집완료 ? :", studies);
                const studiesTitle = studyList.map(item => item.study.title);
                setStudyTitles(studiesTitle);
                const studiesIds = studyList.map(item => item.study.id);
                setStudyIds(studiesIds);
                const ParticipatedStudiesMem = studyList.map(item => item.member.id);
                setStudyMems(ParticipatedStudiesMem);

            })
            .catch((error) => {
                console.error("모집완료된 스터디, 참여멤버  가져오기 실패:", error);
            });
    }, [accessToken]);

    const [schedules, setSchedules] = useState({});

    useEffect(() => {
        axios.get("/api/schedule/all", {
            params: {
                year: selectedDate.getFullYear(), month: selectedDate.getMonth() + 1,
            }, withCredentials: true, headers: {
                'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json'
            }
        }).then((response) => {
            console.log("일정 가져오기 성공", response.data);
            setSchedules(response.data);
        }).catch((error) => {
            console.error("전송 실패", error.response.data); // Log the response data
        });
    }, []);

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


    const onInsert = useCallback((start_date, title, color, studyIdAsNumber) => {

        const startDay = new Date(start_date);
        const formattedDate = `${startDay.getFullYear()}-${String(startDay.getMonth() + 1).padStart(2, '0')}-${String(startDay.getDate()).padStart(2, '0')}T${String(startDay.getHours()).padStart(2, '0')}:${String(startDay.getMinutes()).padStart(2, '0')}:${String(startDay.getSeconds()).padStart(2, '0')}`;
        const schedule = {
             title: title, startDate: formattedDate, color: color,
        };
        axios.post("/api/schedule", schedule, {
            params: {
                studyId: studyIdAsNumber
            }, withCredentials: true, headers: {
                'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json',
            }
        }).then((res) => {
            console.log("전송 성공", res.data);
            setSchedules([...schedules, res.data]);
        }).catch((error) => {
            console.error("전송 실패", error.response.data);
        });
    }, [meetings, selectedDate]);


    const onUpdate = (id, start_date, newTitle, newColor) => {
        console.log("title:", newTitle);
        console.log("COLOR:", newColor);

        axios.put(`/api/schedule/${id}`, {}, {
            params: {
                title: newTitle, color: newColor,
            }, withCredentials: true, headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        }).then((res) => {
            console.log("전송 성공", res.data);
            setSchedules((schedules) => {
                const updatedSchedules = schedules.map((schedule) => schedule.id === res.data.id ? res.data : schedule);
                return updatedSchedules;
            });
        }).catch((error) => {
            console.error("전송 실패", error);
        });

    };


    //일정 삭제 함수
    const onRemove = (id) => {
        axios.delete(`/api/schedule/${id}`, {
            withCredentials: true, headers: {
                'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json',
            }
        }).then((res) => {
            console.log("삭제 성공", res.data);
            const data = schedules.filter((item) => item.id !== id)
            setSchedules(data);
        }).catch((error) => {
            console.error("삭제 실패", error);
        });

    };

    return (<div>
            <Header showSideCenter={true}/>

            <div className="container">
                <Category/>
                <div className="main_schedule_container">
                    <Backarrow subname={"스터디 모임 일정"}/>
                    <div className="sub_container" id="todo_sub" style={{left:"0", width:"135%"}}>
                        <ScheduleCalender
                            studies={studies}
                            studyTitles={studyTitles}
                            onDateClick={handleToggle}
                            meetings={meetings}
                            schedules={schedules}
                            onUpdate={onUpdate}
                            onRemove={onRemove}
                        />
                    </div>
                    {addToggle && (<AddSchedule
                            studies={studies}
                            studyTitles={studyTitles}
                            selectedDate={selectedDate}
                            onInsert={onInsert}
                            onClose={() => {
                                setAddToggle(false);
                            }}
                        />)}
                </div>
            </div>
        </div>);
};
export default Schedule;
