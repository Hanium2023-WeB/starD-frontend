import React, { useState } from "react";
import Category from "../repeat_etc/Category";
import { ReactComponent as Arrow } from "../../images/Arrow.svg";
import edit from "../../css/mypage_css/edit.css";
import arrowdown from "../../images/arrowdown.png";
import arrowup from "../../images/arrowup.png";
import axios from "axios";

const Signout = () => {
  const isLoggedInUserId = localStorage.getItem('isLoggedInUserId');
  const accessToken = localStorage.getItem('accessToken');

  const [password, setPassword] = useState("");

  const [toggle4, setToggle4] = useState(false);
  const [arrow4, setarrow4] = useState(`${arrowdown}`);

  const handlertoggle4 = () => {
    if (toggle4) {
      setarrow4(`${arrowdown}`);
      setToggle4((toggle4) => !toggle4);
    } else {
      setarrow4(`${arrowup}`);
      setToggle4((toggle4) => !toggle4);
    }
  };

  const handleSignOutClick = () => {
    const confirmDelete = window.confirm("정말로 탈퇴하시겠습니까?");
    if (confirmDelete) {
        axios.post("/api/user/mypage/delete",null , {
            params: { password: password },
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        }).then((res) => {
            console.log("API Response:", res.data);
            if (res.data === "탈퇴 성공") {
                console.log("탈퇴 성공");

                // 여기서 로그아웃 + 홈 화면으로
                window.location.href = "/logout";
            }
        }).catch((error) => {
            alert(error.response.data);
            console.log("Deletion error:", error);
        });
    }
  }

  return (
    <div className="sub_container" id="sign_out">
      <div className="signout">
        <div className="title_header">
          <div id="title">탈퇴</div>
          <div id="content_btn">
            <img
              src={arrow4}
              width="20px"
              height="20px"
              onClick={handlertoggle4}
            />
          </div>
        </div>
        <div className="signout_content">
          {toggle4 == true && (
            <div id="detail_content">
              <p>탈퇴 안내 소개</p>
              <ul>
                <li>
                  서비스에 만족하지 못하셨나요? 탈퇴하기 전에 먼저 개선 요청을
                  해보시는 건 어떨까요? <br/>그래도 탈퇴하시겠다면 탈퇴 전에 아래
                  유의사항을 꼭 읽어주세요! <br/>🙇🏻‍♂️ 감사합니다 🙇🏻‍♀️
                </li>
                <li>-------------------------유의 사항-----------------------------</li>
              <li>1. 계정 탈퇴 시, STAR D와 랠릿 서비스에서 모두 탈퇴됩니다.</li>
<li>2. 탈퇴 시 계정과 관련된 모든 권한이 사라지며 복구할 수 없습니다.</li>
<li>3. 직접 작성한 콘텐츠(동영상, 게시물, 댓글 등)는 자동으로 삭제되지 않으며, 만일 삭제를 원하시면 탈퇴 이전에 삭제가 필요합니다.</li>
<li>4. 탈퇴 후 동일한 메일로 재가입이 가능하나, 탈퇴한 계정과 연동되지 않습니다.</li>
<li>5. 탈퇴 후 연동된 소셜 계정 정보도 사라지며 소셜 로그인으로 기존 계정 이용이 불가능합니다.</li>
<li>6. 현재 비밀번호를 입력하고 탈퇴하기를 누르시면 위 내용에 동의하는 것으로 간주됩니다.</li>
              </ul>
              <div id="checkpw">
                <input type="password" id="signout_pw" placeholder="현재 비밀번호를 입력해주세요"
                       value={password} onChange={(e) => setPassword(e.target.value)}
                       style={{paddingLeft:"10px"}}
                />
                <button id ="signout_btn" onClick={handleSignOutClick}>탈퇴하기</button>
              </div>
             
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signout;
