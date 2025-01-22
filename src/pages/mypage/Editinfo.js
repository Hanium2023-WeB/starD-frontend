import React, {useState, useEffect} from "react";
import axios from "axios";
import Category from "../../components/repeat_etc/Category";
import Signout from "../../components/info/Signout.js";
import RealEstate from "../../components/info/RealEstate.js";
import {isEmail, isPassword} from "../../util/check.js";
import Backarrow from "../../components/repeat_etc/Backarrow.js";
import EditInterest from "../../components/info/EditInterest.js";
import Header from "../../components/repeat_etc/Header";

const Editinfo = ({sideheader}) => {
    const [state, setState] = useState({
        memberId: "",
        nickname: "",
        password: "",
        newPassword: "",
        checkNewPw: "",
        interests:[],
    });
    const [isNicknameDuplicate, setIsNicknameDuplicate] = useState(true); // nickname 중복 여부 상태 변수

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');

        axios.get("/api/members/edit", {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => {
                const member = response.data;
                setState({
                    ...state,
                    memberId: member.memberId,
                    nickname: member.nickname,
                    interests: member.interests
                });
            })
            .catch(error => {
                if (axios.isAxiosError(error)) {
                    console.error("AxiosError:", error.message);
                } else {
                    console.error("데이터 가져오기 중 오류 발생:", error);
                }
            });
    }, []);

    const handleEditChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };
    const handleCheckDuplicateNickname = async () => {

        const nickname = state.nickname;

        if (!nickname) {
            alert("닉네임을 입력해 주세요.");
            return;
        }

        const accessToken = localStorage.getItem('accessToken');

        axios.post("/api/members/auth/check-nickname", {nickname: nickname}, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => {
                const isDuplicate = response.data;
                console.log(isDuplicate);
                setIsNicknameDuplicate(isDuplicate);

                if (!isDuplicate) {
                    alert("이미 존재하는 닉네임입니다.");
                } else {
                    alert("사용 가능한 닉네임입니다.");
                }
            })
            .catch(error => {
                if (axios.isAxiosError(error)) {
                    console.error("AxiosError:", error.message);
                } else {
                    console.error("데이터 가져오기 중 오류 발생:", error);
                }
            });
    };

    const handleSaveNickname = async () => {

        const nickname = state.nickname;

        if (!nickname) {
            alert("닉네임을 입력해 주세요.");
            return;
        }

        if (!isNicknameDuplicate) {
            alert("닉네임 중복 확인을 해주세요.");
            return;
        }

        const accessToken = localStorage.getItem('accessToken');

        axios.post("/api/members/edit/nickname", {nickname: nickname}, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => {
                if (response.status === 200) {
                    console.log("닉네임 변경 성공");
                    alert("닉네임이 변경되었습니다.");
                    setIsNicknameDuplicate(true); // 중복 확인 다시 reset
                } else {
                    console.error("닉네임 변경 실패");
                    alert("닉네임 변경에 실패하였습니다.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("닉네임 변경에 실패하였습니다.");
            });
    };

    const handleSavePassword = async () => {
        const originPassword = state.password;
        const password = state.newPassword;
        const checkNewPw = state.checkNewPw;

        if (!originPassword || !password) {
            alert("비밀번호를 입력해 주세요.");
            return;
        }

        if (password !== checkNewPw) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        const accessToken = localStorage.getItem('accessToken');

        axios.post("/api/members/edit/password", {
            originPassword: originPassword,
            password: password
        }, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => {
                if (response.status === 200) {
                    console.log("비밀번호 변경 성공");
                    alert("비밀번호가 변경되었습니다.");
                } else {
                    console.error("비밀번호 변경 실패");
                    alert("비밀번호 변경에 실패하였습니다.");
                }
            })
            .catch(error => {
                if (error.response.status === 401) {
                    console.log("비밀번호 틀림");
                    alert("비밀번호가 틀렸습니다. 다시 입력해주세요.");
                } else {
                    console.error("Error:", error);
                    alert("비밀번호 변경에 실패하였습니다.");
                }
            });
    };

    return (
        <div>
            <Header showSideCenter={true}/>
            <div className="container">
                <Category/>
                <div className="main_container" id="edit_main">
                    <p id={"entry-path"}> 홈 > 카테고리 > 개인정보 수정</p>
                    <Backarrow subname={"개인정보 수정페이지"}/>
                    <div className="sub_container" id="password">
                        <div className="change_pw">
                            <div id="title">
                                비밀번호
                            </div>
                            <input
                                type="password"
                                id="content"
                                name={"password"}
                                value={state.password}
                                onChange={handleEditChange}
                                placeholder="현재 비밀번호를 입력하세요."
                            ></input>
                            <input
                                type="password"
                                id="content"
                                name={"newPassword"}
                                value={state.newPassword}
                                onChange={handleEditChange}
                                placeholder="새로운 비밀번호를 입력하세요."
                            ></input>
                            <input
                                type="password"
                                id="content"
                                name={"checkNewPw"}
                                value={state.checkNewPw}
                                onChange={handleEditChange}
                                placeholder="비밀번호 확인"
                            ></input>
                            <button id="save" onClick={handleSavePassword}>저장하기</button>
                        </div>
                    </div>
                    <div className="sub_container">
                        <div className="change_nicname">
                            <div id="title">닉네임</div>
                            <div id="checkname">
                                <input
                                    id="content"
                                    name={"nickname"}
                                    value={state.nickname}
                                    onChange={handleEditChange}
                                    placeholder="닉네임을 입력하세요."
                                />
                                <button id="check_double_nicname" onClick={handleCheckDuplicateNickname}>중복확인</button>
                            </div>
                            <button id="save" onClick={handleSaveNickname}>저장하기</button>
                        </div>
                    </div>
                    <div className="sub_container" id="interested">
                        <div className="change_interest">
                            <EditInterest interests={state.interests} memberId={state.memberId}/>
                        </div>
                    </div>
                    <Signout/>
                </div>
            </div>
        </div>
    );
};
export default Editinfo;
