import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import AOS from "aos";
import "aos/dist/aos.css";
import LOGO from "../images/Logo.png";
import Header from "../components/repeat_etc/Header";
import SearchBar from "../SearchBar";
import HomeDashBoard from "../components/study/HomeDashBoard";
import {Link} from "react-router-dom";
import checkbox from "../images/check.png";
import uncheckbox from "../images/unchecked.png";
import Zoom from "react-reveal/Zoom";
import Flip from "react-reveal/Flip";
import Slide from "react-reveal/Slide";
import Fade from "react-reveal/Fade";
import scheduleimg from "../images/schedule.png";
import checktodo from "../images/free-icon-to-do-list.png";
import mapicon from "../images/free-icon-map.png";
import chaticon from "../images/free-icon-chat.png";
import axios from "axios";

const CenteredDiv = styled.div`
  display: flex;
  flex-direction: column; // 요소들을 가로로 정렬
  align-items: center; // 가운데 정렬
  justify-content: center; // 가운데 정렬

`;

const Home = () => {

    const dataId = useRef(0);
    const [state, setState] = useState([]);
    const [todos, setTodos] = useState({});
    const [today, setToday] = useState(new Date());
    const [parsedTodos, setParsedTodos] = useState({});
    const [todayKey, setTodayKey] = useState("");
    const [isLogin, setIsLogin] = useState(""); // Login 여부 상태관리
    const [user, setUser] = useState(""); // 로그인 유저이름 상태관리
    const [tag, setTag] = useState([{id: 1, tagname: "취업"},
        {id: 2, tagname: "자소서"}, {id: 3, tagname: "프로그래밍"},
        {id: 4, tagname: "독서"}, {id: 5, tagname: "여행"}]);
    const [isTag, setIsTag] = useState("");
    const [top5Field, setTop5Field] = useState([]);

    const Year = today.getFullYear();
    const Month = today.getMonth() + 1;
    const Dates = today.getDate();
    const tags = tag;

    //인기있는 태그 배치
    // const firstRow = tags.slice(0, 3);
    // const secondRow = tags.slice(3, 5);

    const [firstRow, setFirstRow] = useState([]);
    const [secondRow, setSecondRow] = useState([]);

    useEffect(() => {
        localStorage.removeItem('studies');
        // localStorage.removeItem('todos');
        localStorage.removeItem('selectedSido');
        localStorage.removeItem('selectedGugun');
    }, []);

    useEffect(() => {
        // Load todos from localStorage when the component mounts
        const savedTodos = localStorage.getItem("todos");
        if (savedTodos) {
            const parsed = JSON.parse(savedTodos);
            setParsedTodos(parsed);
            console.log(parsedTodos);


            const todayKey = today.toDateString();
            setTodayKey(todayKey);

            console.log(todayKey);
            if (parsedTodos.hasOwnProperty(todayKey)) {
                const todayTodos = parsedTodos[todayKey];

                todayTodos.forEach((todo) => {
                    console.log(todo.text);
                    console.log(todo.checked);
                });
            }
        }
    }, []);

    useEffect(() => {
        // Load todos from localStorage when the component mounts
        const isLogin = localStorage.getItem("accessToken");
        const user = localStorage.getItem("isLoggedInUserId");
        //로그인 accessToken, user을 로컬스토리지에서 불러옴
        setIsLogin(isLogin);
        setUser(user);
        console.log(tags);
    }, []);


    // TODO 가장 인기 있는 분야 Top 5
    useEffect(() => {
        axios.get("/api/api/v2/studies/study-ranking")
            .then((res) => {
                setTop5Field(res.data.data);
                setFirstRow(res.data.data.slice(0, 3));
                setSecondRow(res.data.data.slice(3, 5));
            }).catch(error => {
            console.log('Top 5 전송 실패', error);
        });
    }, []);

    //tag 서버 전달
    // TODO 태그 (로그인 전)
    useEffect(() => {
        axios.post("", {
            data: tag
        }).then((res) => {
            console.log("태그 전송");
            console.log(res.data);
        }).catch(error => {
            console.log('전송 실패', error);
            //태그 인기 순으로 5개 순위 매겨서 객체배열 형식으로
            // 프론트에 넘겨주시면 map을 사용해서 화면에 출력
        });


    }, []);


    const getTodoItemClassName = (checked) => {
        return checked ? "checked" : "unchecked";
    };

    const handleontag = (e) => {
        console.log(e.target.value);
        setIsTag(e.target.value);
        //해당 태그가 있는 스터디 리스트 링크로 넘어갈 수 있도록
    }

    useEffect(() => {
        AOS.init();
    }, []);

    return (
        <div className="main_wrap">
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
                        <span id={"intro-sub"} >
                            STAR D는 여러분의 모든 요구를 한 곳에서 해결하는 통합 온라인 플랫폼입니다.<br/>
                            스터디 그룹 구성부터 일정 관리에 이르기까지, 필요한 모든 기능을 한 곳에서 제공합니다.
                        </span>
                        </div>
                        <SearchBar/>
                    </CenteredDiv>

                    <div className={"welcome"}>
                        <span id={"welcome-text"}>“STAR D는 당신의 앞날을 응원합니다.” </span>
                    </div>
                </div>
                {/*로그인 했을 때 안했을 때 화면 바꾸기*/}
                {isLogin && user ?
                    <div className={"wrap-01"}>
                        <div className="dashboard">
                            <div className="user_wrap">
                                <div className="dashboard_tag_wrap">
                                    <p id={"tag-title"}>STAR_D의 요즘 뜨는 태그</p>
                                    <p id={"tag-subtitle"}>TOP 5</p>
                                    <div className="dashboard_Tags">
                                        {tags.map((item) => {
                                            return (
                                                <div className={"dashboard_tagname_wrap"}>
                                                    <p id={"ranking"}>{item.id}</p>
                                                    <button id={"dashboard_tagbtn"} value={item.tagname}></button>
                                                </div>
                                            )
                                        })
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="dashboard_detail">
                                {/*참여하고있는 스터디 보여주기*/}
                                {/*<br/>*/}
                                {/*클릭 시 팀블로그로 넘어가도록*/}
                                <HomeDashBoard/>
                            </div>
                            <div className="dashboard_todo">

                <span id="today">{`${Year}. ${Month}. ${Dates} / 오늘의 할 일`}
                    <Link to={"/ToDoList"}
                          style={{
                              textDecoration: "none",
                              color: "inherit",
                          }}> <button
                        id="todo_more">{`ToDoList Page >>`}</button></Link></span>
                                <hr/>
                                {parsedTodos.hasOwnProperty(todayKey) ? (
                                    <ul id="todocontent">
                                        {parsedTodos[todayKey].map((todo) => (
                                            <li key={todo.id}
                                                className={getTodoItemClassName(todo.checked)}>
                                                {todo.checked ? (
                                                    <img src={checkbox} alt="checked" width="20px"/>
                                                ) : (
                                                    <img src={uncheckbox} alt="unchecked" width="20px"/>
                                                )}
                                                <div id="todotext">
                                                    {todo.text}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="empty_today_todo">
                                        <span>할 일이 없습니다.<br/>  할 일을 입력해주세요.</span>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                    : <div>
                        <div className="wrap-01">
                            <div className="tag_wrap" data-aos="fade-up">
                                <div data-aos="fade-up">
                                    {/*<p>지금 가장 핫한 TOP 5 태그<br/>*/}
                                    {/*    한 눈에 확인해보세요!</p>*/}
                                    <p>지금 가장 핫한 TOP 5 분야<br/>
                                        한 눈에 확인해보세요!</p>
                                </div>
                                <div className="firstRow-tags">
                                    {firstRow.map((item, index) => {
                                        return (

                                                <div className={"tagname_wrap"} data-aos="flip-left">
                                                    <span id={"tag-grade"}>TOP {index + 1}</span>
                                                    <button id={"tagbtn"} value={item.field}
                                                            onClick={handleontag}>{item.field}</button>
                                                </div>

                                        )
                                    })
                                    }
                                </div>
                                <div className="secondRow-tags">
                                    {secondRow.map((item, index) => {
                                        return (
                                                <div className={"tagname_wrap"} data-aos="flip-left">
                                                    <span id={"tag-grade"}>TOP {index + 4}</span>
                                                    <button id={"tagbtn"} value={item.field}
                                                            onClick={handleontag}>{item.field}</button>
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
                                                    <button>
                                                        스터디 모집하기
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
                                                    <button>
                                                        스터디 모집하기
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
                                       data-aos-anchor-placement="center-center">서로를 돕고 함께 성장하는<br/>
                                        스터디 커뮤니티</p>
                                <div className="firstRow-tags">
                                    {firstRow.map((item) => {
                                        return (
                                            <div className={"tagname_wrap"}>
                                                <span id={"tag-grade"}>TOP {item.id}</span>
                                                <button id={"tagbtn"} value={item.tagname}
                                                        onClick={handleontag}>{item.tagname}</button>
                                            </div>
                                        )
                                    })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="wrap-04">
                            <div className="tag_wrap">

                                    <p data-aos="fade-zoom-in"
                                       data-aos-easing="ease-in-back"
                                       data-aos-delay="300"
                                       data-aos-offset="0">학습은 개인적인 여정이지만,<br/>
                                        함께 나누면 그 가치가 배가 됩니다.</p>
                                <div className="firstRow-tags">
                                    {firstRow.map((item) => {
                                        return (
                                            <div className={"tagname_wrap"}>
                                                <span id={"tag-grade"}>TOP {item.id}</span>
                                                <button id={"tagbtn"} value={item.tagname}
                                                        onClick={handleontag}>{item.tagname}</button>
                                            </div>
                                        )
                                    })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                }


            </div>
        </div>
    );
};

export default Home;
