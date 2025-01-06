import React, {useState, useRef, useCallback} from "react";
import "../../css/user_css/Log.css";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import Header from "../../components/repeat_etc/Header";
import MemoizedLink from "../../MemoizedLink";

const Login = () => {
  const navigate = useNavigate();
  const inputID = useRef();
  const inputPW = useRef();

  const [state, setState] = useState({
    email: "",
    password: "",
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

  const handleSubmit = () => {

    if (state.email.length < 3) {
      inputID.current.focus();
      return;
    }
    if (state.password.length < 5) {
      inputPW.current.focus();
      return;
    }

    axios
    .post("/api/members/auth/sign-in", {
      email: state.email,
      password: state.password
    }, {
      withCredentials: true
    })
    .then((res) => {
      const accessToken = res.data.accessToken;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('isLoggedInUserId', state.email);

      navigate('/');

    })
    .catch(error => {
      console.log(error);
      if (error.response.status === 400) {
        alert("입력 값을 확인해주세요.");
      }

      if (error.response.status === 404) {
        alert("가입되지 않은 회원입니다.");
      }
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
                  name={"email"}
                  placeholder="아이디를 입력해주세요"
                  value={state.email}
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
                  name={"password"}
                  type={"password"}
                  value={state.password}
                  onChange={onChange}
                  onKeyDown={handleKeyDown}
              />
            </div>
            <div className="loginbtn">
              <button onClick={handleSubmit}>로그인</button>
            </div>
            <div className="findlog">
              <MemoizedLink to={"/subinfo/signup"}
                            children={<span id={"signup"}>&nbsp;회원가입</span>}
                            style={{
                              textDecoration: "none",
                              color: "blue",
                            }}>
              </MemoizedLink>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <MemoizedLink to={"/login/findPW"}
                            children={<span id={"pw"}>&nbsp;비밀번호 찾기</span>}
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
