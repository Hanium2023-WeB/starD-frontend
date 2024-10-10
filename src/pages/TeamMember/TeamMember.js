import React, {useState, useRef, useCallback, useEffect} from "react";
import Category from "../../components/repeat_etc/Category.js";
import Backarrow from "../../components/repeat_etc/Backarrow.js";
import Header from "../../components/repeat_etc/Header";

import "../../css/study_css/MyParticipateStudy.css"; // 추후 변경

import {useLocation} from "react-router-dom";
import axios from "axios";

const TeamCommunity = () => {
    const accessToken = localStorage.getItem('accessToken');
    const isLoggedInUserId = localStorage.getItem('isLoggedInUserId');

    const location = useLocation();
    const {studyId, Member} = location.state;
    const [member, setMember] = useState(Member);
    const [allow, setAllow] = useState(null); // 사용자 동의 여부 저장

    const formatDeleteAllow = (deleteAllow) => {
        console.log(deleteAllow);
        if (deleteAllow === true) {
            return "동의";
        }
        return "-";
    };

    useEffect(() => {
        axios.get(`/api/api/v2/studies/discontinue/${studyId}`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("전송 성공");
                console.log(res.data);

                setAllow(res.data);
            })
            .catch((error) => {
                console.error('중단 동의여부 가져오는 중 오류 발생: ', error);
            });
    }, []);

    const delete_allow = () => {
        const confirmDelete = window.confirm("스터디 중단을 동의하시겠습니까?");

        if (confirmDelete) {
            axios.post(`/api/api/v2/studies/discontinue/${studyId}`, null, {
                params: {
                    studyId: studyId,
                },
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }).then((res) => {
                console.log(res.data);
                setAllow(true);

                // TODO : 사용자 본인 부분은 '동의'로 표시되게 변경

                alert('동의되었습니다.');
            }).catch((error) => {
                console.log('전송 실패', error);
                alert('실패했습니다. 다시 시도해주세요.');
            });
        }
    };

    return (
        <div>
            <Header showSideCenter={true}/>
            <div className="container">
                <Category/>
                <div className="main_schedule_container"> {/* className 수정 필요 */}
                    <p id={"entry-path"}> 스터디 참여내역 > 팀블로그 > 스터디원</p>
                    <Backarrow subname={"TEAM MEMBER LIST"}/>

                    <div>
                        <table className="evaluate_table">
                            <thead>
                                <tr>
                                    <th>팀원 이름</th>
                                    <th>중단 동의여부</th>
                                </tr>
                            </thead>
                            <tbody>
                                {member.map((mem, index) => (
                                    <tr className="evaluate_list">
                                        <td className="member_name">{mem.member.nickname}</td>
                                        <td className="member_rating">{formatDeleteAllow(mem.deleteAllow)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {!allow && (
                        <button onClick={() => delete_allow()}>중단 동의하기</button>
                    )}
                </div>
            </div>
        </div>
    );
};
export default TeamCommunity;
