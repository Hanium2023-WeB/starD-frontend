import Header from "../../components/repeat_etc/Header";
import React, {useEffect, useState} from "react";
import BgImg from "../../images/blue-galaxy-wallpaper.jpg";
import Check from "../../images/unchecked.png";
import "../../css/study_css/TeamBlog.css";
import axios from "axios";
import {Link, useNavigate, useParams} from "react-router-dom";
import TeamBlogcss from "../../css/study_css/TeamBlog.css";
import {useLocation} from "react-router-dom";
import MapNaverDefault from "../../components/map/MapNaverDefault";
import checkbox from "../../images/check.png";
import uncheckbox from "../../images/unchecked.png";
import Chat from "../../components/chat/Chat";
import Backarrow from "../../components/repeat_etc/Backarrow";
import TeamBlogGnb from "../../components/repeat_etc/TeamBlogGnb";
import {useTeamBlogContext} from "../../components/datacontext/TeamBlogContext";


const TeamBlog = () => {
    const accessToken = localStorage.getItem('accessToken');
    const study = useLocation();
    const navigate = useNavigate();
    const {studyId} = study.state;

    const { member, studyItem, progressType, todos, schedules, loading, error } = useTeamBlogContext();
    const [parsedTodos, setParsedTodos] = useState([]);
    const [parsedSchedules, setParsedSchedules] = useState([]);
    const [today, setToday] = useState(new Date());
    const Year = today.getFullYear();
    const Month = today.getMonth() + 1;
    const Dates = today.getDate()
    const studyIdAsNumber = parseFloat(studyId);
    const [progressStatus, setProgressStatus] = useState(""); //중단된 스터디인지 판별

    if (studyId !== undefined) {
        console.log("Study ID:", studyId);
    } else {
        console.log("Study ID is undefined.");
    }
    const id = parseFloat(studyId);
    const [Member, setMember] = useState([]);
    // const [studyItem, setStudyItem] = useState([]);

    const getTodoItemClassName = (checked) => {
        return checked ? "checked" : "unchecked";
    };
    const ShowAllToDo = () => {
        navigate(`/teamblog/${studyIdAsNumber}/todo-list`,
            {
                state: {
                    studyIdAsNumber: studyIdAsNumber,
                    Member: Member,
                    selectStudy: studyItem,
                    progressStatus:progressStatus,
                }
            })
    }
    const ShowAllSchedule = () => {
        navigate(`/${studyIdAsNumber}/teamblog/TeamSchedule`, {
            state: {
                studyIdAsNumber: studyIdAsNumber,
                Member: Member,
                selectStudy: studyItem,
                progressStatus:progressStatus,
            }
        })

    }

    useEffect(() => {
        axios.get(`/api/studies/${studyId}/members`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("참여멤버 get 성공 : ", res.data);
                setMember(res.data);
            })
            .catch((error) => {
                console.error("참여멤버 get 실패:", error);
            });

    }, [accessToken]);

    const [filteredToDo, setFilteredToDo] = useState([]);
    useEffect(() => {
        if (Array.isArray(todos)) {
            const filteredToDo = todos.filter((todo) => {
                const todoDueDate = new Date(todo.dueDate).toDateString();
                const todayDate = today.toDateString();
                return todoDueDate === todayDate;
            });
            console.log("filteredToDo: ", filteredToDo);
            setFilteredToDo(filteredToDo);
        } else {
            console.error("parsedTodos is not an array.");
        }
    }, [parsedTodos]);

    const [filteredSchedule, setFilteredSchedule] = useState([]);
    useEffect(() => {
        if (Array.isArray(schedules)) {
            const filteredSchedule = schedules.filter((item) => {
                const startDate = new Date(item.startDate).toDateString();
                const todayDate = today.toDateString();
                return startDate === todayDate;
            });
            console.log("filteredSchedule: ", filteredSchedule);
            setFilteredSchedule(filteredSchedule);
        } else {
            console.error("parsedTodos is not an array.");
        }
    }, [parsedSchedules]);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>에러 발생: {error}</div>;
    }


    return (
        <div>
            <Header showSideCenter={true}/>
            <div className={"main_content"}>
                <TeamBlogGnb studyIdAsNumber={studyIdAsNumber} Member={Member} selectStudy={studyItem} progressStatus={progressStatus}/>
                <div className="team_blog">
                    <p id={"entry-path"} style={{marginTop:"50px"}}> 스터디 참여 내역 > 팀 블로그 </p>
                    <Backarrow subname={"STUDY TEAM BLOG"}/>
                    <div className="img_wrapper">
                        <div className="team_info">
                            <h2 className="study_title">{studyItem.title}</h2>
                            <h3 className="study_duration">{studyItem.activityStart} ~ {studyItem.activityDeadline}</h3>
                        </div>
                    </div>
                    <div className="content">
                        <div className={"content-left"}>
                            <div className={"todoAndSchedule"}>
                                <div className={"todo_content"}>
                                    <div className="todos">
                                        <div className="tag">
                                            <p>오늘의 할 일</p>
                                            <button id="more" onClick={ShowAllToDo}>전체보기</button>
                                        </div>
                                        <div id="detail">
                                            <span id="today">{`${Year}. ${Month}. ${Dates}`}</span>
                                            <hr/>
                                            {filteredToDo.length === 0 ? (
                                                <div className="empty_today_todo">
                                                    <span>
                                                        할 일이 없습니다.<br/> 할 일을 입력해주세요.
                                                    </span>
                                                </div>
                                            ) : (
                                                <ul id="todocontent">
                                                    {filteredToDo.map((todo) => (
                                                        <li key={todo.toDoId}>
                                                            {todo.assignees.map((assign)=>(
                                                                <div id="todotext">{assign.nickname}  </div>
                                                            ))}
                                                            <div id="todotext"> | </div>
                                                            <div id="todotext">{todo.task}</div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={"schedule_content"}>
                                    <div className="todos">
                                        <div className="tag">
                                            <p>오늘의 일정</p>
                                            <button id="more" onClick={ShowAllSchedule}>전체보기</button>
                                        </div>
                                        <div id="detail">
                                            <span id="today">{`${Year}. ${Month}. ${Dates}`}</span>
                                            <hr/>
                                            {filteredSchedule.length === 0 ? (
                                                <div className="empty_today_todo">
                                                    <span>
                                                        일정이 없습니다.<br/> 일정을 입력해 주세요.
                                                    </span>
                                                </div>
                                            ) : (
                                                <ul id="todocontent">
                                                    {filteredSchedule.map((item) => (
                                                        <li key={item.scheduleId}>
                                                            {/*<div id="todotext">{item.study.title} |</div>*/}
                                                            <div id="todotext">{item.title}</div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={"location_content"}>
                                <div className="location">
                                    <div className="tag">
                                        <p>중간장소 찾기</p>
                                    </div>
                                    <div id="detail">
                                        <MapNaverDefault studyId={studyId} Member={Member} progressStatus={progressStatus}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"content_right"}>
                            <div className={"chat_content"}>
                                <Chat studyId={studyId} studyTitle={studyItem.title} progressStatus={progressStatus}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default TeamBlog;