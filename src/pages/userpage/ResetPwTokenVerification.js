import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";
import Header from "../../components/repeat_etc/Header";

const ResetPwTokenVerification = () => {

    const location = useLocation(); // 현재 경로 정보 가져오기
    const queryParams = new URLSearchParams(location.search); // URL 쿼리스트링 파싱
    const token = queryParams.get("token"); // 쿼리스트링에서 token 파라미터 값 가져오기

    const navigate = useNavigate();
    const [showContent, setShowContent] = useState(false); // 페이지 컨텐츠를 보여줄지 여부를 나타내는 상태
    const [accessToken, setAccessToken] = useState(null);

    const inputPw = useRef();
    const inputConfirmPw = useRef();

    const [state, setState] = useState({
            pw: "",
            confirmPw: ""
        }
    );

    const handleEditChange = (e) => {
        console.log(e.target.value.toString());
        setState({
            ...state,
            [e.target.name]: e.target.value.toString(),
        });
    };


    useEffect(() => {
        tokenVerification();
    }, []);

    const tokenVerification = () => {

        axios.get(`/api/reset-password?token=${token}`)
            .then((res) => {
                console.log("토큰 검증 완료");

                setShowContent(true);
                const { accessToken } = res.data;
                setAccessToken(accessToken);

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

        const passwordUpdateDto = {
            newPassword: state.pw
        };

        axios.put("/api/user/mypage/reset-password", passwordUpdateDto,{
            withCredentials: true,
            headers: { 'Authorization': `Bearer ${accessToken}` } })
            .then((res) => {
                console.error("비밀번호 변경 성공");
                window.alert("비밀번호 변경 성공");
        }).catch((error) => {
            console.log("비밀번호 수정 실패", error);

            if (error.response && error.response.status === 409)
                window.alert("기존 비밀번호와 동일");
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
                    <div className="findwrap">
                        <div className={"container_findwrap"}>
                            <div className="container_find" id="logs">
                                <div className="input_infos">
                                    <div className="subinfos">비밀번호</div>
                                    <div className="subinfos2">
                                        <input
                                            ref={inputPw}
                                            name={"pw"}
                                            placeholder="새로운 비밀번호를 입력해주세요"
                                            value={state.pw}
                                            onChange={handleEditChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="container_find" id="phone">
                                <div className="input_phone">
                                    <div className="subinfos">
                                        비밀번호 재확인
                                    </div>
                                    <div className={"inputform"}>
                                        <input
                                            ref={inputConfirmPw}
                                            id="phonecontent"
                                            name={"confirmPw"}
                                            value={state.confirmPw}
                                            onChange={handleEditChange}
                                            placeholder={"비밀번호를 재입력해주세요."}
                                        ></input>
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