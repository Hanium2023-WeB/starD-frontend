import React, {useEffect, useState} from "react";
import {useParams, useNavigate, useLocation, Link} from "react-router-dom";

import "../../css/study_css/ApplyList.css";
import Header from "../../components/repeat_etc/Header";
import Motive from "../../components/study/Motive";
import axios from "axios";
import ImageComponent from "../../components/image/imageComponent";

const StudyApplyList = () => {
    const [applyList, setApplyList] = useState([]);
    const location = useLocation();
    const {capacity} = location.state || {}; // 전달된 state에서 capacity 가져오기

    const [MotiveToggle, setMotiveToggle] = useState(false);
    const [openMotivationIndex, setOpenMotivationIndex] = useState(-1);
    const accessToken = localStorage.getItem('accessToken');

    const [count, setCount] = useState(0);
    const [clickedRejectStates, setClickedRejectStates] = useState(Array(applyList.length).fill(false));

    let {id} = useParams();
    const navigate = useNavigate();

    const [isCompleted, setIsCompleted] = useState(false);

    // 신청자 조회
    useEffect(() => {
        axios.get(`/api/studies/${id}/applications`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                setCount(res.data.length);
                setApplyList(res.data);
            })
            .catch((error) => {
                console.error("신청자 데이터 가져오기 실패:", error);
            });
    }, []);


    const toggleMotivation = (index) => {
        if (openMotivationIndex === index) {
            setOpenMotivationIndex(-1);
        } else {
            setOpenMotivationIndex(index);
        }
    };

    const handleAction = (member, index, isAccept) => {
        if (isCompleted === true) {
            alert('이미 모집 완료된 게시글입니다.');
        } else {
            const actionText = isAccept ? '수락' : '거절';
            const result = window.confirm(`${member.nickname}님을(를) ${actionText}하시겠습니까?`);

            if (result) {
                axios.post(`/api/studies/${id}/applications/${member.applicantId}/assignment`, {}, {
                    params: {
                        studyId: id,
                        applicationId: member.applicantId,
                    },
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                    .then((res) => {
                        window.alert(`${member.nickname}님을(를) ${actionText}했습니다.`);

                        if (isAccept) {
                            setApplyList((prevApplyList) =>
                                prevApplyList.map((item) => {
                                    if (item.applicantId === member.applicantId) {
                                        return {...item, status: "ACCEPTED"}; // 상태 업데이트
                                    }
                                    return item;
                                })
                            );

                            setClickedRejectStates((prevStates) => {
                                const updatedStates = [...prevStates];
                                updatedStates[index] = false;
                                return updatedStates;
                            });
                        } else {
                            setApplyList((prevApplyList) =>
                                prevApplyList.map((item) => {
                                    if (item.applicantId === member.applicantId) {
                                        return {...item, status: "REJECTED"};
                                    }
                                    return item;
                                })
                            );
                            setClickedRejectStates((prevStates) => {
                                const updatedStates = [...prevStates];
                                updatedStates[index] = true;
                                return updatedStates;
                            });
                        }
                    })
                    .catch((error) => {
                        console.error("상태 변경 실패:", error);
                    });
            }
        }
    }

    const goNextTeamBlog = () => {
        const count = applyList.filter(item => item.status === "ACCEPTED").length;
        if (isCompleted === true) {
            alert('이미 모집 완료된 게시글입니다.');
        } else {
            if (count > capacity - 1) {
                alert("모집인원을 초과하였습니다.");
                return;
            } else {
                axios.post(`/api/studies/${id}/open`, {}, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                    .then((res) => {

                        axios.post(`/api/chats/rooms/${id}`, null, {
                            withCredentials: true,
                            headers: {
                                'Authorization': `Bearer ${accessToken}`
                            }
                        }).then(res => {
                            console.log("채팅방 생성 완료");
                            alert("모집 완료. 팀블로그로 이동합니다.");
                            navigate(`/teamblog/${id}`, {
                                state: {
                                    "studyId": id,
                                }
                            })
                        })
                    })
                    .catch((error) => {
                        console.error("참여완료 데이터 전송 실패:", error);
                    });
            }
        }
    }
    return (
        <div className={"ListWrap"}>
            <Header showSideCenter={true}/>
            <div className={"applylist"}>
                <div className={"ListContent"}>
                    <table className="study_apply_list">
                        <thead>
                        <tr>
                            <th>신청자 이름</th>
                            <th>지원동기 및 각오</th>
                            <th>신청자 / 모집인원 ({count}/{capacity})</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* PENDING 상태인 지원자들만 표시 */}
                        {applyList
                            .filter((item) => item.status === "PENDING" || item.status === "REJECTED")
                            .map((item, index) => (
                                <tr key={index}>
                                    <td id={"apply_name"}>
                                        <div>
                                            <ImageComponent imageUrl={item.profileImg}/>
                                            <Link
                                                to={`/${item.applicantId}/userprofile`}
                                                style={{
                                                    textDecoration: "none",
                                                    color: "inherit",
                                                }}
                                            >
                                                {item.nickname}
                                            </Link>
                                        </div>
                                    </td>
                                    <td>
                                        <button className={"look_motive"}
                                                onClick={() => toggleMotivation(item.applicantId)}>보기
                                        </button>
                                        {openMotivationIndex === item.applicantId && (
                                            <Motive motive={item.introduce} onClose={() => setOpenMotivationIndex(-1)}/>
                                        )}
                                    </td>
                                    <td>
                    <span>
                        <button
                            className={`acceptbtn ${item.status === "ACCEPTED" ? 'clicked' : ''}`}
                            onClick={() => handleAction(item, index, true)}
                        >
                            수락
                        </button>
                    </span>
                                        <span>
                        <button
                            className={`rejectbtn ${item.status === "REJECTED" ? 'clicked' : ''}`}
                            onClick={() => handleAction(item, index, false)}
                        >
                            거절
                        </button>
                    </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
                <div className={"isMember_wrap"}>
                    <p>스터디 멤버</p>
                    <div className={"isMember"}>
                        <table className="study_apply_list">
                            <thead>
                            <tr>
                                <th>신청자 이름</th>
                                <th>지원동기 및 각오</th>
                                <th>상태</th>
                            </tr>
                            </thead>
                            <tbody>
                            {applyList
                                .filter((item) => item.status === "ACCEPTED") // ACCEPTED 상태인 사람만 필터링
                                .map((item, index) => (
                                    <tr key={index}>
                                        <td id={"apply_name"}>
                                            <ImageComponent imageUrl={item.profileImg}/>
                                            <Link
                                                to={`/${item.applicantId}/userprofile`}
                                                style={{
                                                    textDecoration: "none",
                                                    color: "inherit",
                                                    padding: "6.5px 0",
                                                }}
                                            >
                                                {item.nickname}
                                            </Link>
                                        </td>
                                        <td>
                                            <button className={"look_motive"}
                                                    onClick={() => toggleMotivation(item.applicantId)}>보기
                                            </button>
                                            {openMotivationIndex === item.applicantId && (
                                                <Motive motive={item.introduce}
                                                        onClose={() => setOpenMotivationIndex(-1)}/>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                className={`rejectbtn ${clickedRejectStates[index] ? 'clicked' : ''}`}
                                                onClick={() => handleAction(item, index, false)}
                                            >
                                                수락 취소
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {isCompleted === false && (
                    <div className={"apply"}>
                        <button id={"apply-btn"} onClick={() => goNextTeamBlog()}>모집완료</button>
                    </div>
                )}
            </div>
        </div>
    )
}
export default StudyApplyList;