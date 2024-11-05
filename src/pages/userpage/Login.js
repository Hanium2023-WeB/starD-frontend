import React, {useState, useRef, useEffect, useCallback} from "react";
import "../../css/user_css/Log.css";
import axios from "axios";
import {Link, useNavigate} from 'react-router-dom';
import Header from "../../components/repeat_etc/Header";
import MemoizedLink from "../../MemoizedLink";

const Login = () => {
    const navigate = useNavigate();
    const f = false;
    const inputID = useRef();
    const inputPW = useRef();

    const [state, setState] = useState({
        ID: "",
        PW: "",
    });
    const onChange = useCallback((e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    },);

    //엔터키 눌렀을 때
    const handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            handleSubmit();
        }
    };
    const login = () => {
        // const accessToken = localStorage.getItem('accessToken');
        const eventSource = new EventSource(`/api/notifications/subscribe/${state.ID}`);

        eventSource.addEventListener("sse", function (event) {
            console.log(event.data);

            // const data = JSON.parse(event.data);
        });

    };

    const handleSubmit = () => {

        if (state.ID.length < 3) {
            inputID.current.focus();
            return;
        }
        if (state.PW.length < 5) {
            inputPW.current.focus();
            return;
        }

        axios
            .post("/api/members/auth/sign-in", {
                memberId: state.ID,
                password: state.PW
            }, {
                withCredentials: true
            })
            .then((res) => {
                const accessToken = res.data.accessToken;
                console.log(state);
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('isLoggedInUserId', state.ID);

                // // SSE를 구독하기 위해 SSEComponent 호출
                login();
                navigate('/'); // useNavigate를 사용하여 페이지를 이동

            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 400)
                    alert("입력 값을 확인해주세요.");

                if (error.response.status === 404)
                    alert("가입되지 않는 회원입니다.");
            });
    };


    return (
        <div>
            <Header showSideCenter={false}/>
            <div className="containers" id="log">
                <div className="login_info">
                    <p>로그인</p>
                </div>

                <div className="input_info">
                    <div className="subinfo">아이디</div>
                    <div className="input_bottom">
                        <input
                            ref={inputID}
                            name={"ID"}
                            placeholder="아이디를 입력해주세요"
                            value={state.ID}
                            onChange={onChange}
                            // onKeyDown={handleKeyDown}
                        />
                    </div>

                    <div className="subinfo">비밀번호</div>
                    <div>
                        <input
                            style={{marginLeft: "0"}}
                            ref={inputPW}
                            placeholder="비밀번호를 입력해주세요"
                            name={"PW"}
                            type={"password"}
                            value={state.PW}
                            onChange={onChange}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <div className="loginbtn">
                        <button onClick={handleSubmit}>로그인</button>
                    </div>
                    <div className="findlog">
                        <MemoizedLink to={"/login/findeID"}
                                      children={<span id={"id"}>아이디 찾기 / </span>}
                                      style={{
                                          textDecoration: "none",
                                          color: "blue",
                                      }}>

                        </MemoizedLink>
                        <MemoizedLink to={"/login/findPW"}
                                      children={<span id={"pw"}>&nbsp;비밀번호 찾기 / </span>}
                                      style={{
                                          textDecoration: "none",
                                          color: "blue",
                                      }}>
                        </MemoizedLink>
                        <MemoizedLink to={"/subinfo/signup"}
                                      children={<span id={"signup"}>&nbsp;회원가입</span>}
                                      style={{
                                          textDecoration: "none",
                                          color: "blue",
                                      }}>
                        </MemoizedLink>
                    </div>
                </div>
            </div>
        </div>

    );
};
export default React.memo(Login);
