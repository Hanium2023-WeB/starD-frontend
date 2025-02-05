import React, {useState, useEffect, useRef} from "react";
import {Link, useNavigate} from "react-router-dom";
import Category from "../../components/repeat_etc/Category.js";
import "../../css/study_css/MyParticipateStudy.css";
import "../../css/mypage_css/Mypage_Scrap.css";
import checkbox from "../../images/check.png";
import uncheckbox from "../../images/unchecked.png";
import Header from "../../components/repeat_etc/Header";

//https://jsonplaceholder.typicode.com/comments

import "../../css/mypage_css/Mypage.css";
import Footer from "../../components/repeat_etc/Footer";
import axios from "axios";
import Backarrow from "../../components/repeat_etc/Backarrow";
import {useMyPageContext} from "../../components/datacontext/MyPageContext";
import Loading from "../../components/repeat_etc/Loading";

const MyPage = () => {
    const dataId = useRef(0);
    const [state, setState] = useState([]);
    const [todos, setTodos] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리
    const [today, setToday] = useState(new Date());
    const [schedules, setSchedules] = useState([]);

    const [credibility, setCredibility] = useState("");
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');

    const { participateStudies } = useMyPageContext();
    console.log(participateStudies);

    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const dates = today.getDate();

    //일정 가져오기
    useEffect(() => {
        const fetchSchedulesAndTodos = async () => {
            try {
                setIsLoading(true); // 로딩 시작
                const todayDateString = today.toISOString().split("T")[0];

                // 일정 가져오기
                const scheduleResponse = await axios.get(`/api/members/schedules`, {
                    params: { year, month },
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                const schedules = scheduleResponse.data.filter((schedule) => {
                    const scheduleDate = new Date(schedule.startDate).toISOString().split("T")[0];
                    return scheduleDate === todayDateString;
                }).map((schedule) => {
                    const study = participateStudies.find((s) => s.studyId === schedule.studyId);
                    return study ? { ...schedule, studyTitle: study.title } : null;
                }).filter(Boolean);

                setSchedules(schedules);

                // 투두 가져오기
                const todoResponse = await axios.get(`/api/members/to-dos`, {
                    params: { year, month },
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                const todos = todoResponse.data.filter((todo) => {
                    const todoDate = new Date(todo.dueDate).toISOString().split("T")[0];
                    return todoDate === todayDateString;
                }).map((todo) => {
                    const study = participateStudies.find((s) => s.studyId === todo.studyId);
                    return study ? { ...todo, studyTitle: study.title } : null;
                }).filter(Boolean);

                setTodos(todos);
            } catch (error) {
                console.error("데이터 가져오기 실패:", error);
            } finally {
                setIsLoading(false); // 로딩 종료
            }
        };

        fetchSchedulesAndTodos();
    }, [participateStudies, year, month, accessToken]);

    const getTodoItemClassName = (checked) => {
        return checked ? "checked" : "unchecked";
    };

    const ShowAllToDo = () => {
        navigate("/mypage/todo-list", {
            state: {
                openStudy: state
            }
        })
    }

    //신뢰도 가져오기
    useEffect(() => {
        const fetchCredibility = async () => {
            try {
                setIsLoading(true); // 로딩 시작
                const response = await axios.post(
                    "/api/members/credibility",
                    null,
                    {
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                setCredibility(response.data.credibility);
            } catch (error) {
                console.error("신뢰도 가져오기 실패:", error);
            } finally {
                setIsLoading(false); // 로딩 종료
            }
        };

        fetchCredibility();
    }, [accessToken]);

    return (
        <div>
            <Header showSideCenter={true}/>
            <div className="container">
                <Category/>
                <div className="main_container">
                    <p id={"entry-path"}> 마이페이지 </p>
                    <Backarrow subname={"마이페이지"}/>
                    {isLoading ? (
                        <Loading /> // 로딩 중이면 Loading 컴포넌트 표시
                    ) : (
                    <div className="sub_container">
                        <div className="reliability">
                            <div className="tag">
                                <p>개인 신뢰도</p>
                                <Link
                                    to={"/mypage/score"}
                                    state={{ credibility: credibility }} // 신뢰도 값 전달
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}
                                >
                                    <button id="more">상세보기</button>
                                </Link>
                            </div>
                            <div id="detail">당신의 신뢰도는 {credibility}입니다.</div>
                        </div>

                        <div className="schedule">
                            <div className="tag">
                                <p>오늘의 일정</p>
                                <Link
                                    to={"/mypage/schedule"}
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}
                                >
                                    <button id="more">전체보기</button>
                                </Link>
                            </div>
                            <div id="detail">
                                <span id="today">{`${year}. ${month}. ${dates}`}</span>
                                <hr/>
                                {schedules.length === 0 ? (
                                    <div className="empty_today_todo">
                                        <span>일정이 없습니다. 일정을 입력해주세요.</span>
                                    </div>) : (
                                    <ul id="todocontent">
                                        {schedules.map((schedule) => (
                                            <li key={schedule.scheduleId}>
                                                <div className="meeting-info">
                                                    <span>{schedule.studyTitle}</span><span className="meeting-id">{` ➡️ ${schedule.title}`}</span>
                                                </div>
                                            </li>
                                            )
                                        )}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="todo">
                            <div className="tag">
                                <p>오늘의 할 일</p>
                                <Link
                                    to={"/mypage/todo-list"}
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}
                                >
                                    <button id="more" onClick={ShowAllToDo}>전체보기</button>
                                </Link>
                            </div>
                            <div id="detail">
                                <span id="today">{`${year}. ${month}. ${dates}`}</span>
                                <hr/>
                                {todos.length === 0 ? (
                                    <div className="empty_today_todo">
                                          <span>
                                            할 일이 없습니다.<br/> 할 일을 입력해주세요.
                                          </span>
                                    </div>

                                ) : (
                                    <ul id="todocontent">
                                        {todos.map((todo) => (
                                            <li
                                                key={todo.toDoId}
                                                className={getTodoItemClassName(todo.toDoStatus)}
                                            >
                                                {todo.toDoStatus ? (
                                                    <img src={checkbox} alt="checked" width="20px"/>
                                                ) : (
                                                    <img src={uncheckbox} alt="unchecked" width="20px"/>
                                                )}
                                                <div id="todotext">{todo.studyTitle} |&nbsp;</div>
                                                <div id="todotext">{todo.task}</div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>

    );
};
export default MyPage;
