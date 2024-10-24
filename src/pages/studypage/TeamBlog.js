import Header from "../../components/repeat_etc/Header";
import React, {useEffect, useState} from "react";
import BgImg from "../../images/blue-galaxy-wallpaper.jpg";
import Check from "../../images/unchecked.png";
import "../../css/study_css/TeamBlog.css";
import axios from "axios";
import {Link, useNavigate, useParams} from "react-router-dom";
import TeamBlogcss from "../../css/study_css/TeamBlog.css";
import {useLocation} from "react-router-dom";
import TeamToDoList from "../TeamToDo/TeamToDoList";
import MapNaverDefault from "../../components/map/MapNaverDefault";
import checkbox from "../../images/check.png";
import uncheckbox from "../../images/unchecked.png";
import Category from "../../components/repeat_etc/Category";
import Chat from "../../components/chat/Chat";
import TeamSchedule from "../TeamSchedule/TeamSchedule";
import TeamCommunity from "../TeamCommunity/TeamCommunity";
import TeamMember from "../TeamMember/TeamMember"
import Backarrow from "../../components/repeat_etc/Backarrow";
import TeamBlogGnb from "../../components/repeat_etc/TeamBlogGnb";


const TeamBlog = () => {
    const accessToken = localStorage.getItem('accessToken');
    const study = useLocation();
    const navigate = useNavigate();
    const {studyId} = study.state;
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
    const [studyItem, setStudyItem] = useState([]);
    const getTodoItemClassName = (checked) => {
        return checked ? "checked" : "unchecked";
    };
    const ShowAllToDo = () => {
        navigate(`/${studyIdAsNumber}/teamblog/TeamToDoList`,
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
    const showTeamCommunity = () => {
        navigate(`/${studyIdAsNumber}/teamblog/TeamCommunity`, {
            state: {
                studyIdAsNumber: studyIdAsNumber,
                progressStatus:progressStatus,
            }
        })
    }

    const showTeamMember = () => {
        navigate(`/${studyIdAsNumber}/teamblog/TeamMember`, {
            state: {
                studyIdAsNumber: studyIdAsNumber,
                Member: Member,
            }
        })
    }


    useEffect(() => {
        axios.get(`/api/api/v2/studies/${id}/study-member`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("참여멤버 get 성공 : ", res.data);

                const studymemberList = res.data;

                setMember(studymemberList.data);

            })
            .catch((error) => {
                console.error("참여멤버 get 실패:", error);
            });


        axios.get(`/api/api/v2/studies/${id}`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then((res) => {
            setStudyItem(res.data);
            console.log("스터디 세부 데이터 가져오기 성공:", res.data);
            if(res.data.progressStatus == "DISCONTINUE"){
                alert("중단된 스터디 입니다. 수정은 불가하며 읽기만 가능합니다.");
                setProgressStatus(res.data.progressStatus);
            }
        })
            .catch((error) => {
                console.error("스터디 세부 데이터 가져오기 실패:", error);
            });

    }, [accessToken]);

    useEffect(() => {
        axios.get(`/api/todo/${studyIdAsNumber}`, {
            params: {
                year: Year, month: Month,
            }, headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }).then((response) => {
            console.log('스터디별 투두리스트 가져오기 성공:', response.data);
            setParsedTodos((prevTodos) => (response.data))

        }).catch((error) => {
            console.log('스터디별 투두리스트 가져오기 실패:', error);
        })
    }, [studyIdAsNumber]);

    const [filteredToDo, setFilteredToDo] = useState([]);
    useEffect(() => {
        if (Array.isArray(parsedTodos)) {
            const filteredToDo = parsedTodos.filter((todo) => {
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



    useEffect(() => {
        axios.get(`/api/schedule/${studyIdAsNumber}`, {
            params: {
                year: Year, month: Month,
            }, withCredentials: true, headers: {
                'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json'
            }
        }).then((response) => {
            console.log("스터디별 일정 가져오기 성공", response.data);
            setParsedSchedules(response.data);
        }).catch((error) => {
            console.error("스터디별 일정 가져오기 실패", error.response.data); // Log the response data
        });
    }, []);
    const [filteredSchedule, setFilteredSchedule] = useState([]);
    useEffect(() => {
        if (Array.isArray(parsedSchedules)) {
            const filteredSchedule = parsedSchedules.filter((item) => {
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

    return (
        <div>
            <Header showSideCenter={true}/>
            <div className={"main_content"}>
                <Category/>
                <div className="team_blog">
                    <p id={"entry-path"}> 스터디 참여 내역 > 팀 블로그 </p>
                    <Backarrow subname={"STUDY TEAM BLOG"}/>
                    <div className="img_wrapper">
                        <div className="team_info">
                            <h2 className="study_title">{studyItem.title}</h2>
                            <h3 className="study_duration">{studyItem.activityStart} ~ {studyItem.activityDeadline}</h3>
                        </div>
                    </div>
                    <TeamBlogGnb  studyIdAsNumber={studyIdAsNumber} Member={Member} selectStudy={studyItem} progressStatus={progressStatus}/>
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
                                                        <li key={todo.id}>
                                                            {todo.assignees.map((assign)=>(
                                                                <div id="todotext">{assign.member.nickname}  </div>
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
                                                        <li key={item.id}>
                                                            <div id="todotext">{item.study.title} |</div>
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