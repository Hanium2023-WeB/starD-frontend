import Header from "../../components/repeat_etc/Header";
import React, {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const FindPW = () => {

  const [state, setState] = useState({
        email: ""
      }
  );

  const inputEmail = useRef();
  const navigate = useNavigate();

  const handleEditChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value.toString(),
    });
  };

  const vaildateCertificate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(state.email)) {
      toast.error("유효하지 않은 이메일 형식입니다.");
      inputEmail.current.focus();
      return;
    }

    const emailDto = {
      email: state.email
    };

    axios.post("/api/members/auth/find-password", emailDto)
    .then((res) => {
      console.log("이메일 전송 성공");
      navigate("/reset-password/sent")

    }).catch((error) => {

      if (error.response && error.response.status === 404) {
        // 404 에러 발생 시 컨펌 창 띄우기
        window.alert("이메일을 찾을 수 없습니다.");
      } else {
        console.error("에러:", error);
      }

    });
  }

  return (
      <div>
        <Header showSideCenter={false}/>
        <div className={"page_title"}>
          <p id={"find-id"}>비밀번호 찾기</p>
        </div>
        <div className="findwrap">
          <div className={"container_findwrap"}>
            <div className="container_find" id="phone">
              <div className="input_infos infos">
                <div className="subinfos sub">
                  입력한 이메일 주소로 비밀번호 재설정을 위한 인증 메일이 발송됩니다.
                  <br/>이메일을 확인하여 12시간 이내에 비밀번호 재설정을 완료해주세요.
                </div>
                <div className={"inputform"}>
                  <input
                      ref={inputEmail}
                      id="phonecontent"
                      name={"email"}
                      type="email"
                      value={state.email}
                      onChange={handleEditChange}
                      placeholder={"이메일을 입력해주세요."}
                  ></input>
                </div>
                <div className={"Certification_Number"}>
                  <button onClick={vaildateCertificate}>확인</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
};
export default FindPW;