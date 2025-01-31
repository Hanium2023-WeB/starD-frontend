import React, {useEffect, useState} from "react";
import styled from "styled-components";
import AOS from "aos";
import "aos/dist/aos.css";
import LOGO from "../images/Logo.png";
import Header from "../components/repeat_etc/Header";
import SearchBar from "../SearchBar";
import HomeDashBoard from "../components/study/HomeDashBoard";
import {useNavigate} from "react-router-dom";
import checkbox from "../images/check.png";
import uncheckbox from "../images/unchecked.png";
import scheduleimg from "../images/schedule.png";
import checktodo from "../images/free-icon-to-do-list.png";
import mapicon from "../images/free-icon-map.png";
import chaticon from "../images/free-icon-chat.png";
import TeamBlog from "../images/TeamBlog.png";
import Chatting from "../images/Chatting.png";
import community from "../images/community.png";
import communityfield from "../images/communityfield.png";
import communityscrap from "../images/communityscrap.png";
import MemoizedLink from "../MemoizedLink";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import axios from "axios";

const CenteredDiv = styled.div`
  display: flex;
  flex-direction: column; // 요소들을 가로로 정렬
  align-items: center; // 가운데 정렬
  justify-content: center; // 가운데 정렬

`;

const Home = () => {
    const [today, setToday] = useState(new Date());
    const [parsedTodos, setParsedTodos] = useState([]);
    const [isLogin, setIsLogin] = useState(""); // Login 여부 상태관리
    const [user, setUser] = useState(""); // 로그인 유저이름 상태관리
    const [top5Field, setTop5Field] = useState([]);
    const Year = today.getFullYear();
    const Month = today.getMonth() + 1;
    const Dates = today.getDate();
    const [firstRow, setFirstRow] = useState([]);
    const [secondRow, setSecondRow] = useState([]);
    const accessToken = localStorage.getItem('accessToken');
    let isLoggedInUserId = localStorage.getItem('isLoggedInUserId');
    const navigate = useNavigate();
    const [filteredToDo, setFilteredToDo] = useState([]);

    useEffect(() => {
        const isLogin = localStorage.getItem("accessToken");
        const user = localStorage.getItem("isLoggedInUserId");
        setIsLogin(isLogin);
        setUser(user);
    }, []);

    useEffect(() => {
        AOS.init();

        axiosInstance.get("/studies/hot-field")
            .then((res) => {
                setTop5Field(res.data);
                setFirstRow(res.data.slice(0, 3));
                setSecondRow(res.data.slice(3));
            }).catch(error => {
            console.log(error);
        });

        if (accessToken) {
            axios.get(`/api/members/to-dos`, {
                params: {
                    year: Year, month: Month,
                }, headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }).then((response) => {
                console.log('전체 투두리스트 가져오기 성공:', response.data);
                setParsedTodos((prevTodos) => (response.data))
            }).catch((error) => {
                console.log('전체 투두리스트 가져오기 실패:', error);
            })
        }

    }, []);

    const getTodoItemClassName = (checked) => {
        return checked ? "checked" : "unchecked";
    };



    useEffect(() => {
        console.log("parsedTodos", parsedTodos);
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

    const handleMoveToStudyInsert = (e) => {
        if (accessToken && isLoggedInUserId) {
            e.preventDefault();
        } else {
            alert("로그인 해주세요");
            navigate("/login");
        }

    };

    const handleTestToast = () => {
        toast((t) => (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: "8px",
                    // fontWeight: "bold",
                    fontSize: "15px"
                }}
            >
            <span>
              테스트 알림! : <b>이건 테스트입니다!</b>
            </span>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    style={{
                        fontSize: "15px",
                        marginLeft: "10px",
                        backgroundColor: "#BBDF9F",
                        color: "white",
                        fontWeight: "bold",
                        borderRadius: "5px",
                        padding: "2px 8px",
                        border: "none",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#A7D487")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#BBDF9F")}
                >
                    close
                </button>
            </div>
        ), {
            position: "top-right", // 여기에서 위치를 설정할 수 있습니다.
        });
    };

    return (

        <div className="main_wrap">

            {/* 알림 테스트 버튼 */}
            {/*  <div*/}
            {/*      className="flex flex-col items-center justify-center min-h-screen bg-gray-100">*/}
            {/*    /!* 테스트 버튼 *!/*/}
            {/*    <button*/}
            {/*        onClick={handleTestToast}*/}
            {/*        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"*/}
            {/*    >*/}
            {/*      테스트 알림 띄우기*/}
            {/*    </button>*/}
            {/*</div>*/}

            <Header showSideCenter={true}/>

            <div className="main_content_wrap">
                <div className="subground">
                    <CenteredDiv>
                        <div className={"display-test"}>
                            <div id={"intro-main"} data-aos="fade-right"
                                 data-aos-offset="300"
                                 data-aos-easing="ease-in-sine">
                                STAR D<br/>
                                한방에 모든 것을,<br/>
                                All In One 스터디 웹 플랫폼 <br/>
                            </div>
                            <div className="LOGO" data-aos="fade-left"
                                 data-aos-offset="300"
                                 data-aos-easing="ease-in-sine">
                                <img src={LOGO} alt="LOGO" width="200px"/>
                            </div>
                        </div>
                        <div className={"below_intro"} data-aos="flip-up">
                        <span id={"intro-sub"}>
                            STARD는 스터디 그룹 구성부터 일정 관리에 이르기까지, 필요한 모든 기능을 한 곳에서 제공합니다.
                        </span>
                        </div>
                        <SearchBar isHome={true}/>
                    </CenteredDiv>

                    <div className={"welcome"}>
                        <span id={"welcome-text"}>“STAR D는 당신의 앞날을 응원합니다.” </span>
                    </div>
                </div>
                {isLogin && user ?
                    <div className={"wrap-01"}>
                        <div className="dashboard">
                            <div className="user_wrap">
                                <div className="dashboard_tag_wrap">
                                    <p id={"tag-title"}>🎯 인기 분야 TOP 5</p>
                                    {/*<p id={"tag-subtitle"}>TOP 5</p>*/}
                                    <div className="dashboard_Tags">
                                        {top5Field.map((item, index) => {
                                            return (
                                                <div className={"dashboard_tagname_wrap"}
                                                     data-aos="fade-down"
                                                     key={index}>
                                                    <p id={"ranking"}>{index + 1}</p>
                                                    <button id={"dashboard_tagbtn"}
                                                            value={item.field}>{item.field}</button>
                                                </div>
                                            )
                                        })
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="dashboard_detail">
                                <HomeDashBoard/>
                            </div>
                            <div className="dashboard_todo">

                <span id="today">📋 {`${Year}. ${Month}. ${Dates} / 오늘의 할 일`}
                    <MemoizedLink to={"/mypage/todo-list"}
                                  style={{
                                      textDecoration: "none",
                                      color: "inherit",
                                  }}> <button
                        id="todo_more">{`ToDo Page >>`}</button></MemoizedLink></span>
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
                                                key={todo.toDoId}
                                                className={getTodoItemClassName(
                                                    todo.toDoStatus)}
                                            >
                                                {todo.toDoStatus ? (
                                                    <img src={checkbox} alt="checked"
                                                         width="20px"/>
                                                ) : (
                                                    <img src={uncheckbox} alt="unchecked"
                                                         width="20px"/>
                                                )}
                                                <div
                                                    // id="mypage-todotext">{todo.toDo.study.title} |
                                                    id="mypage-todotext">{todo.studyTitle} |
                                                </div>
                                                <div id="mypage-todotext">{todo.task}</div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                        </div>
                    </div>
                    : <div>
                        <div className="wrap-01">
                            <div className="tag_wrap" data-aos="fade-up">
                                <div data-aos="fade-up">
                                    <p>지금 가장 핫한 TOP 5 분야<br/>
                                        한 눈에 확인해보세요!</p>
                                </div>
                                <div className="firstRow-tags">
                                    {firstRow.map((item, index) => {
                                        return (

                                            <div className={"tagname_wrap"}
                                                 data-aos="flip-left">
                                                <span id={"tag-grade"}>TOP {index + 1}</span>
                                                <button id={"tagbtn"}
                                                        value={item.field}>{item.field}</button>
                                            </div>

                                        )
                                    })
                                    }
                                </div>
                                <div className="secondRow-tags">
                                    {secondRow.map((item, index) => {
                                        return (
                                            <div className={"tagname_wrap"}
                                                 data-aos="flip-left">
                                                <span id={"tag-grade"}>TOP {index + 4}</span>
                                                <button id={"tagbtn"}
                                                        value={item.field}>{item.field}</button>
                                            </div>
                                        )
                                    })
                                    }
                                </div>

                            </div>
                        </div>
                        <div className="wrap-02">
                            <div className="wrap_content">
                                <div className={"content_show"}>
                                    <div data-aos="zoom-in">
                                        <p id={"content-title"}>올인원</p>
                                        <p id={"content-detail"}>스터디의 A to Z까지<br/>
                                            STAR D가 함께합니다.</p>
                                        <p id={"content-detail_info"}>
                                            스터디를 계획하고 실행하는 것이 이제는 어렵지 않습니다.<br/>
                                            스터디 모집부터 참여, 팀블로그 작성 및 채팅까지 한 번에 처리하세요.</p>
                                    </div>
                                    <div className={"introduce_content_detail"}>
                                        <div id={"detail-01"} data-aos="fade-left">
                                            <div id={"detail-title"}>
                                                <p>스터디<br/>모집,신청,참여</p>
                                            </div>
                                            <div id={"detail-info"}>
                                                <p>STAR D와 함께<br/>
                                                    스터디 모집부터 신청, 그리고 참여까지!<br/>
                                                    당신의 이상적인 스터디를 찾아보세요.</p>
                                            </div>
                                            <div id={"detail-img-btn"}>
                                                <button onClick={handleMoveToStudyInsert}>
                                                    <MemoizedLink to={"/study/studyInsert"}
                                                                  children={"스터디 모집하기"}
                                                                  style={{
                                                                      textDecoration: "none",
                                                                      color: "inherit",
                                                                  }}>

                                                    </MemoizedLink>
                                                </button>

                                            </div>

                                        </div>
                                        <div id={"detail-02"} data-aos="fade-left">
                                            <div id={"detail-title"}>
                                                <p>일정, 투두 관리</p>
                                            </div>
                                            <div id={"detail-info"}>
                                                <p>일정부터 투두리스트까지,<br/>
                                                    모든 것을 STAR D에서 한번에 관리하세요!<br/>
                                                    우아하고 효율적인 학습 경험을 선사합니다.</p>
                                            </div>
                                            <div id={"detail-img-btn"}>
                                                <img src={scheduleimg} width={"41px"}/>
                                                <img src={checktodo} width={"50px"}/>
                                            </div>
                                        </div>
                                        <div id={"detail-03"} data-aos="fade-left">
                                            <div id={"detail-title"}>
                                                <p>실시간 채팅 &<br/>
                                                    중간장소 찾기</p>
                                            </div>
                                            <div id={"detail-info"}>
                                                <p>스터디원들과 실시간 채팅을 즐기며,<br/>
                                                    중간장소 찾기로 각자의 거리를 고려한<br/>
                                                    최적의 장소를 선택하세요!</p>
                                            </div>
                                            <div id={"detail-img-btn"}>
                                                <img src={mapicon} width={"41px"} height={"41px"}/>
                                                <img src={chaticon} width={"41px"} height={"41px"}/>
                                            </div>
                                        </div>
                                        <div id={"detail-04"} data-aos="fade-left">
                                            <div id={"detail-title"}>
                                                <p>팀원 평가 &<br/>
                                                    개인 신뢰도</p>
                                            </div>
                                            <div id={"detail-info"}>
                                                <p>팀원 평가를 통해 협업의 질을 높이고,<br/>
                                                    개인 신뢰도를 통해<br/>
                                                    안정적인 스터디 환경을 구축하세요.</p>
                                            </div>
                                            <div id={"detail-img-btn"}>
                                                <button onClick={handleMoveToStudyInsert}>
                                                    <MemoizedLink to={"/study/studyInsert"}
                                                                  children={"스터디 모집하기"}
                                                                  style={{
                                                                      textDecoration: "none",
                                                                      color: "inherit",
                                                                  }}>
                                                    </MemoizedLink>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="wrap-03">
                            <div className="tag_wrap">
                                <p data-aos="fade-up"
                                   data-aos-anchor-placement="center-center">서로를 돕고 함께
                                    성장하는<br/>
                                    스터디 커뮤니티</p>
                                <div id={"detail-images"}>
                                    <div className="CommunityScreenShot">
                                        <img id="community_main" src={community} width="400px"
                                             data-aos="flip-left"/>
                                        <div className={"community-field_scrap"}>
                                            <img id="c-field" src={communityfield} width="200px"
                                                 data-aos="flip-left"/>
                                            <img id="c-scrap" src={communityscrap} width="200px"
                                                 height={"80px"}
                                                 data-aos="flip-left"/>
                                        </div>
                                        <span id={"c-info"}>다양한 관심사를 가진 사람들과 <br/>
                                            풍부한 소통의 장을 열수 있어요<br/></span>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="wrap-04">
                            <div className="tag_wrap">
                                <span id={"content-title"}>팀블로그</span>
                                <p data-aos="fade-zoom-in"
                                   data-aos-easing="ease-in-back"
                                   data-aos-offset="0">학습은 개인적인 여정이지만,<br/>
                                    함께 나누면 그 가치가 배가 됩니다.</p>
                                <div id={"detail-images"}>
                                    <div className="TeamBlogScreenShot">
                                        <img src={TeamBlog} width="400px" height="400px"
                                             data-aos="fade-up"/>
                                    </div>
                                    <div className="TeamBlogScreenShot">
                                        <img src={Chatting} width="200px" data-aos="fade-up"/>
                                    </div>

                                    <span>스터디원들과의 실시간 채팅과<br/>
                                    할 일, 일정들을 한 눈에 확인할 수 있어요</span>
                                </div>
                            </div>
                        </div>
                    </div>
                }


            </div>
        </div>
    );
};

export default React.memo(Home);
