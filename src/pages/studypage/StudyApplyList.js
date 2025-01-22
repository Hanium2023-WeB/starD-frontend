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
    const { capacity } = location.state || {}; // 전달된 state에서 capacity 가져오기
    console.log(capacity);
    const [MotiveToggle, setMotiveToggle] = useState(false);
    const [openMotivationIndex, setOpenMotivationIndex] = useState(-1);
    const accessToken = localStorage.getItem('accessToken');
    const [acceptedMembers, setAcceptedMembers] = useState([]);

    const [count, setCount] = useState(0);
    const [clickedApplyStates, setClickedApplyStates] = useState(Array(applyList.length).fill(false));
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
                console.log(res.data.length);
                console.log(res.data);
                setCount(res.data.length);
                setApplyList(res.data);
            })
            .catch((error) => {
                console.error("신청자 데이터 가져오기 실패:", error);
            });

        axios.get(`/api/api/v2/studies/${id}/study-member`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then((res) => {
            if (res.data.data.length > 0) {   // 스터디원이 있을 경우 -> 모집 완료
                console.log("모집 완료");
                setIsCompleted(true);
            }
        })
            .catch((error) => {
                console.error("스터디 모집 여부 데이터 가져오기 실패:", error);
            });

    }, []);


    const toggleMotivation = (index) => {
        if (openMotivationIndex === index) {
            setOpenMotivationIndex(-1);
        } else {
            setOpenMotivationIndex(index);
        }
    };

    const handleaccept = (memberId, nickname, index) => {
        if (isCompleted === true) {
            alert('이미 모집 완료된 게시글입니다.');
        } else {
            const result = window.confirm(nickname + "님을(를) 수락하시겠습니까?");
            if (result) {
                axios.post(`/api/studies/${id}/applications/${memberId}/assignment`, {}, {
                    params: {
                        studyId: id,
                        applicationId: memberId,
                    },
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                    .then((res) => {
                        console.log(res.data);

                        window.alert(nickname + "님을(를) 수락했습니다.");
                        setApplyList((prevApplyList) =>
                            prevApplyList.map((item) => {
                                if (item.applicantId === memberId) {
                                    return { ...item, status: "ACCEPTED" }; // 상태 업데이트
                                }
                                return item;
                            })
                        );

                            setClickedApplyStates((prevStates) => {
                                const updatedStates = [...prevStates];
                                updatedStates[index] = true;
                                return updatedStates;
                            });

                            setClickedRejectStates((prevStates) => {
                                const updatedStates = [...prevStates];
                                updatedStates[index] = false;
                                return updatedStates;
                            });

                            setAcceptedMembers([...acceptedMembers, memberId]);
                    })
                    .catch((error) => {
                        console.error("수락 실패:", error);
                    });
            }
        }
    }

    useEffect(() => {
        console.log("수락한 멤버", acceptedMembers);
    }, [acceptedMembers]);

    const handlereturn = (memberId, index) => {
        if (isCompleted === true) {
            alert('이미 모집 완료된 게시글입니다.');
        } else {
            const result = window.confirm(memberId + "을(를) 거절하시겠습니까?");

            if (result) {

                //TODO db에서 받아오기 setApplyList로 상태 업데이트
                axios.put(`/api/api/v2/studies/${id}/select`, {}, {
                    params: {
                        applicantId: memberId,
                        isSelect: false
                    },
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                    .then((res) => {
                        console.log(res.data);

                        if (res.data !== "SUCCESS") {
                            window.alert(memberId + "을(를) 거절 실패했습니다.");
                            console.log("거절 실패");
                        } else {
                            window.alert(memberId + "을(를) 거절했습니다.");
                            setApplyList((prevApplyList) => {
                                const updatedList = prevApplyList.map((item) => {
                                    if (item.member.id === memberId) {
                                        return {...item, participationState: false};
                                    }
                                    return item;
                                });
                                return updatedList;
                            });

                            setClickedRejectStates((prevStates) => {
                                const updatedStates = [...prevStates];
                                updatedStates[index] = true;
                                return updatedStates;
                            });
                            setClickedApplyStates((prevStates) => {
                                const updatedStates = [...prevStates];
                                updatedStates[index] = false;
                                return updatedStates;
                            });
                            setAcceptedMembers(acceptedMembers.filter((id) => id !== memberId));
                        }

                    })
                    .catch((error) => {
                        console.error("거절 실패:", error);
                    });
            }
        }
    }
    const goNextTeamBlog = (count) => {
        if (isCompleted === true) {
            alert('이미 모집 완료된 게시글입니다.');
        } else {
            if (count > capacity) {
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
                        console.log(res.data);
                        console.log("모집 완료");

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
                            .filter((item) => item.status === "PENDING")
                            .map((item, index) => (
                                <tr key={index}>
                                    <td id={"apply_name"}>
                                        <div>
                                            <ImageComponent imageUrl={item.imageUrl}/>
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
                                        <button className={"look_motive"} onClick={() => toggleMotivation(index)}>보기</button>
                                        {openMotivationIndex === index && (
                                            <Motive motive={item.introduce} onClose={() => setOpenMotivationIndex(-1)} />
                                        )}
                                    </td>
                                    <td>
                    <span>
                        <button
                            className={`acceptbtn ${item.participationState === true ? 'clicked' : ''}`}
                            onClick={() => handleaccept(item.applicantId, item.nickname, index)}
                        >
                            수락
                        </button>
                    </span>
                                        <span>
                        <button
                            className={`rejectbtn ${item.participationState === false ? 'clicked' : ''}`}
                            onClick={() => handlereturn(item.applicantId, index)}
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
                                            <ImageComponent imageUrl={item.imageUrl} />
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
                                                    onClick={() => toggleMotivation(index)}>보기
                                            </button>
                                            {openMotivationIndex === index && (
                                                <Motive motive={item.introduce}
                                                        onClose={() => setOpenMotivationIndex(-1)} />
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                className={`rejectbtn ${clickedRejectStates[index] ? 'clicked' : ''}`}
                                                onClick={() => handlereturn(item.applicantId, index)}
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
                        <button id={"apply-btn"} onClick={() => goNextTeamBlog(count)}>모집완료</button>
                    </div>
                )}
            </div>
        </div>
    )
}
export default StudyApplyList;