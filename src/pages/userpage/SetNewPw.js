import Header from "../../components/repeat_etc/Header";
import React, {useRef, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import axios from "axios";


const SetNewPw = () => {
    // URL에서 토큰 추출
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    const [newPw, setNewPw] = useState();
    const navigate = useNavigate();
    const inputnewpw = useRef();

    const handleEditChange = (e) => { //핸들러 나누기
        // event handler
        console.log(e.target.value.toString());
        setNewPw(e.target.value.toString());
        console.log("token is" ,token);

    };

    const changePassword = () => {
        try {
            axios.put("/api/reset-password", {
                "newPassword" : newPw
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // 인증 토큰을 헤더에 포함
                }
            }).then((response) => {
                console.log("비밀번호 수정 완료: ", response.data);
                // 필요한 작업 수행
            }).catch((error) => {
                console.log("비밀번호 수정 실패", error);
            });
        } catch (error) {
            console.error("Error:", error);
        }
    }




    return (
        <div>
            <Header showSideCenter={false}/>
            <div className={"page_title"}>
                <p id={"find-id"}>새로운 비밀번호 입력</p>
            </div>
            <div className="findwrap">
                <div className={"container_findwrap"}>
                    <div className="container_find" id="phone">
                        <div className="input_phone">
                            <div className="subinfos">
                                새로운 비밀번호
                            </div>
                            <div className={"inputform"}>
                                <input
                                    ref={inputnewpw}
                                    id="phonecontent"
                                    name={"newpw"}
                                    value={newPw}
                                    onChange={handleEditChange}
                                    placeholder={"새로운 비밀번호를 입력해주세요."}
                                ></input>
                            </div>
                            <div className={"Certification_Number"}>
                                <button onClick={changePassword}>비밀번호 변경</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};
export default SetNewPw;