import React, {useState, useRef, useCallback, useEffect} from "react";
import Backarrow from "../../components/repeat_etc/Backarrow.js";
import Header from "../../components/repeat_etc/Header";
import "../../css/study_css/MyParticipateStudy.css"; // 추후 변경

import {useLocation, useParams} from "react-router-dom";
import axios from "axios";
import TeamBlogGnb from "../../components/repeat_etc/TeamBlogGnb";

const TeamCommunity = () => {
    const accessToken = localStorage.getItem('accessToken');

    const location = useLocation();
    const {studyIdAsNumber, Member} = location.state;
    const [allow, setAllow] = useState(null); // 사용자 동의 여부 저장
    const [completion, setCompletion] = useState(null);

    const [members, setMembers] = useState([]);  // 초기값을 빈 배열로 설정

    const {id} = useParams(); // URL 경로에서 studyId를 추출

    // 스터디 삭제 동의 상태 조회
    useEffect(() => {
        axios.get(`/api/studies/${id}/consents`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                const loggedInMember = res.data.find(mem => mem.isLoggedIn === true);
                if (loggedInMember.studyRemoved === true) {
                    setAllow(loggedInMember.studyRemoved);
                }

                if (res.data.length === res.data.filter(mem => mem.studyRemoved === true).length) {
                    setCompletion(true);
                }
                setMembers(res.data);
            })
            .catch((error) => {
                console.error('중단 동의여부 가져오는 중 오류 발생: ', error);
            });
    }, [allow]);


    // 스터디 중단
    const cancelStudy = () => {
        const confirmDelete = window.confirm("스터디 중단 하시겠습니까?");

        if (confirmDelete) {
            axios.delete(`/api/studies/${id}/cancel`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }).then((res) => {
                alert('스터디 중단했습니다.');
            }).catch((error) => {
                console.error('중단 실패: ', error);
                alert('실패했습니다. 다시 시도해주세요.');
            });
        }
    };

    // 스터디 중단 동의
    const delete_allow = () => {
        const confirmDelete = window.confirm("스터디 중단을 동의하시겠습니까?");

        if (confirmDelete) {
            axios.put(`/api/studies/${id}/consent`, null, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }).then((res) => {
                setAllow(true);
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
                <TeamBlogGnb studyIdAsNumber={studyIdAsNumber} Member={Member}/>
                <div className="main_schedule_container"> {/* className 수정 필요 */}
                    <p id={"entry-path"}> 스터디 참여내역 > 팀블로그 > 스터디원</p>
                    <Backarrow subname={"팀 스터디원"}/>

                    <div>
                        <table className="evaluate_table">
                            <thead>
                            <tr>
                                <th>팀원 이름</th>
                                <th>중단 동의여부</th>
                            </tr>
                            </thead>
                            <tbody>
                            {members.map((mem) => (
                                <tr className="evaluate_list">
                                    <td className="member_name">{mem.nickname}</td>
                                    <td className="member_rating">
                                        {mem.studyRemoved === true ? '동의함' :
                                            mem.studyRemoved === false ? '동의하지 않음' : '-'}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {!allow && (
                        <button onClick={() => delete_allow()}>중단 동의하기</button>
                    )}

                    {completion && (
                        <button onClick={() => cancelStudy()}>스터디 중단하기</button>
                    )}
                </div>
            </div>
        </div>
    );
};
export default TeamCommunity;
