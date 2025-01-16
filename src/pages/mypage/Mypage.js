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

const Mypage = () => {
    const dataId = useRef(0);
    const [state, setState] = useState([]);
    const [todos, setTodos] = useState({});
    const [today, setToday] = useState(new Date());
    const [parsedTodos, setParsedTodos] = useState([]);
    const [parsedmeetings, setParsedMeetings] = useState([]);
    const [schedules, setSchedules] = useState([]);

    const [credibility, setCredibility] = useState("");
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');

    const [scrapedPosts, setScrapedPosts] = useState([]); //스크랩한 게시물을 보유할 상태 변수
    const { participateStudies } = useMyPageContext();
    console.log(participateStudies);

    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const Dates = today.getDate();

    //일정 가져오기
    useEffect(() => {
        // 오늘 날짜를 "YYYY-MM-DD" 형식으로 얻기
        const today = new Date();
        const todayDateString = today.toISOString().split('T')[0];

        // 참여한 스터디들의 일정 데이터 가져오기
        axios
            .get(`/api/members/schedules`, {
                params: { year, month },
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then((response) => {
                const schedules = response.data;

                // 오늘 날짜와 일치하는 일정 필터링
                const todaySchedules = schedules
                    .filter((schedule) => {
                        const scheduleDate = new Date(schedule.startDate);
                        // 유효한 날짜인지 확인 및 오늘 날짜와 비교
                        return !isNaN(scheduleDate) &&
                            scheduleDate.toISOString().split('T')[0] === todayDateString;
                    })
                    .map((schedule) => {
                        // 해당 일정에 스터디 제목 추가
                        const study = participateStudies.find(
                            (study) => study.studyId === schedule.studyId
                        );
                        return study
                            ? { ...schedule, studyTitle: study.title }
                            : null;
                    })
                    .filter((schedule) => schedule !== null); // null 값 제거

                setSchedules(todaySchedules); // 오늘 일정만 업데이트
                console.log("오늘 일정 리스트:", todaySchedules);
            })
            .catch((error) => {
                console.error("일정 리스트 가져오기 실패:", error);
            });
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

    useEffect(() => {
        axios.get(`/api/todo/all`, {
            params: {
                year: year, month: month,
            }, headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }).then((response) => {
            console.log('전체 투두리스트 가져오기 성공:', response.data);

            setParsedTodos((prevTodos) => (response.data))
        }).catch((error) => {
            console.log('전체 투두리스트 가져오기 실패:', error);
        })
    }, []);

    //신뢰도 가져오기
    useEffect(() => {
        axios.post("/api/members/credibility", null, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then((res) => {
            console.log("개인 신뢰도 가져오기 성공", res.data);
            setCredibility(res.data.credibility);
        }).catch((error) => {
            console.error("전송 실패", error.response.data); // Log the response data
        });
    }, []);


    const [filteredToDo, setFilteredToDo] = useState([]);
    useEffect(() => {
        if (Array.isArray(parsedTodos)) {
            const filteredToDo = parsedTodos.filter((todo) => {
                const todoDueDate = new Date(todo.toDo.dueDate).toDateString();
                const todayDate = today.toDateString();
                return todoDueDate === todayDate;
            });
            console.log("filteredToDo: ", filteredToDo);
            setFilteredToDo(filteredToDo);
        } else {
            console.error("parsedTodos is not an array.");
        }
    }, [parsedTodos]);

    return (
        <div>
            <Header showSideCenter={true}/>
            <div className="container">
                <Category/>
                <div className="main_container">
                    <p id={"entry-path"}> 홈 > 마이페이지 </p>
                    <Backarrow subname={"마이페이지"}/>
                    <div className="sub_container">
                        <div className="reliability">
                            <div className="tag">
                                <p>개인 신뢰도</p>
                                <Link
                                    to={"/MyPage/myscore"}
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
                                <span id="today">{`${year}. ${month}. ${Dates}`}</span>
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
                                <span id="today">{`${year}. ${month}. ${Dates}`}</span>
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
                                            <li
                                                key={todo.toDo.id}
                                                className={getTodoItemClassName(todo.toDoStatus)}
                                            >
                                                {todo.toDoStatus ? (
                                                    <img src={checkbox} alt="checked" width="20px"/>
                                                ) : (
                                                    <img src={uncheckbox} alt="unchecked" width="20px"/>
                                                )}
                                                <div id="todotext">{todo.toDo.study.title} |</div>
                                                <div id="todotext">{todo.toDo.task}</div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};
export default Mypage;
