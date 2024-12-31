import React, {useCallback, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";
import Header from "../../components/repeat_etc/Header";
import {isPassword} from "../../util/check";

const ResetPwTokenVerification = () => {

  const location = useLocation(); // 현재 경로 정보 가져오기
  const queryParams = new URLSearchParams(location.search); // URL 쿼리스트링 파싱
  const token = queryParams.get("token"); // 쿼리스트링에서 token 파라미터 값 가져오기

  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false); // 페이지 컨텐츠를 보여줄지 여부를 나타내는 상태
  const [email, setEmail] = useState(null);

  const inputPw = useRef();
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [state, setState] = useState({
        pw: "",
        confirmPw: ""
      }
  );

  const handleEditPasswordChange = (e) => {
    const PW = e.target.value;

    setState((prevState) => ({
      ...prevState,
      pw: PW,
      isValidPassword: isPassword(PW),
    }));
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPW = e.target.value;
    setConfirmPassword(confirmPW);
    setIsPasswordMatch(confirmPW === state.pw);
  };

  useEffect(() => {
    tokenVerification();
  }, []);

  const tokenVerification = () => {
    axios.get(`/api/members/auth/valid-password-reset-token?token=${token}`)
    .then((res) => {
      setShowContent(true);
      setEmail(res.data.email);
    }).catch((error) => {

      // TODO 이메일 유효 기간이 지나, 다시 이메일 전송하라는 알림 띄우기
      if (error.response && error.response.status === 403) {
        console.log("토큰 검증 실패");
      } else {
        console.error("에러:", error);
      }
      window.alert("토큰 검증 실패");
    });
  }

  const resetPw = () => {

    if (!isPassword(state.pw)) {
      inputPw.current.focus();
      alert("비밀번호는 8 ~ 15자 영문, 숫자, 특수문자 조합이어야 합니다.");
      return;
    }

    if (!isPasswordMatch) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const passwordUpdateDto = {
      email: email,
      password: state.pw
    };

    axios.put("/api/members/reset-password", passwordUpdateDto)
    .then((res) => {
      console.error("비밀번호 변경 성공");
      window.alert("비밀번호 변경 성공");
      navigate("/login")
    }).catch((error) => {
      console.log("비밀번호 수정 실패", error);
      if (error.response && error.response.status === 409) {
        window.alert("기존 비밀번호와 동일");
      }
    });
  }

  return (
      <div>
        {showContent && (
            <div>
              <Header showSideCenter={false}/>
              <div className={"page_title"}>
                <p id={"find-id"}>새로운 비밀번호 입력</p>
              </div>
              <br/>
              <div className="findwrap">
                <div className={"container_findwrap"}>
                  <div className="container_find" id="logs">

                    <div className="input_infos">
                      <div className="subinfos">비밀번호</div>
                      <div className="inputpw input_bottom">
                        <input
                            ref={inputPw}
                            name={"pw"}
                            type={"password"}
                            placeholder="새로운 비밀번호를 입력해주세요."
                            value={state.pw}
                            onChange={handleEditPasswordChange}
                        /> <br/>
                        {state.password !== "" ? (
                            state.isValidPassword ? (
                                <p style={{color: "blue"}}>유효한 비밀번호입니다.</p>
                            ) : (
                                <p style={{color: "red"}}>비밀번호는 8 ~ 15자 영문, 숫자,
                                  특수문자 조합이어야 합니다.</p>
                            )
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="container_find" id="logs">
                    <div className="input_infos">
                      <div className="subinfos">비밀번호 재확인</div>
                      <div className={"inputpw input_bottom"}>
                        <input
                            id="phonecontent"
                            name={"confirmPw"}
                            type={"password"}
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            placeholder={"비밀번호를 재입력해주세요."}
                        />
                        {confirmPassword && state.pw ? (
                            isPasswordMatch ? (
                                <p style={{color: "blue"}}>비밀번호가 일치합니다.</p>
                            ) : (
                                <p style={{color: "red"}}>비밀번호가 일치하지 않습니다.</p>
                            )
                        ) : null}
                      </div>
                      <div className={"Certification_Number"}>
                        <button onClick={resetPw}>변경하기</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );

};

export default ResetPwTokenVerification;