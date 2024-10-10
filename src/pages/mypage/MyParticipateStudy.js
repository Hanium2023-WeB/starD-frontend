import React, {useState, useEffect, useRef} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Category from "../../components/repeat_etc/Category.js";
import App from "../../App.js";
import "../../css/study_css/MyParticipateStudy.css";
import Header from "../../components/repeat_etc/Header";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import LikeButton from "../../components/repeat_etc/LikeButton";
import ScrapButton from "../../components/repeat_etc/ScrapButton";
import Paging from "../../components/repeat_etc/Paging";
import Backarrow from "../../components/repeat_etc/Backarrow";
import Loading from "../../components/repeat_etc/Loading";
const MyParticipateStudy = ({sideheader}) => {
    const accessToken = localStorage.getItem('accessToken');
    const [ApplyMemberList, setApplyMemberList] = useState([]);
    const [ApplyStudyList, setApplyStudyList] = useState([]);
    const [studies, setStudies] = useState([]);
    const [scrapStates, setScrapStates] = useState([]);
    const [likeStates, setLikeStates] = useState([]);
    const [scrapTwoStates, setScrapTwoStates] = useState([]);
    const [likeTwoStates, setLikeTwoStates] = useState([]);
    const location = useLocation();
    const studyState = location.state;
    const [studiesChanged, setStudiesChanged] = useState(false);

    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const navigate = useNavigate();
    const [ParticipateState, setParticipatedState] = useState({});

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (location.state && location.state.acceptedMembers != null) {
            const Accepted_Members = location.state.acceptedMembers;
            setParticipatedState(prevState => {
                const StudyId = location.state.studyId;
                const newState = {...prevState};
                newState[StudyId] = Accepted_Members;
                localStorage.setItem("ParticipateState", JSON.stringify(newState));

                return newState;
            });
        }

    }, []);

    function calculateDateDifference(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const timeDifference = end - start;
        const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

        return daysDifference;
    }

    const toggleScrap = (index) => {
        setStudies((prevStudies) => {
            const newStudies = [...prevStudies];
            const studyId = newStudies[index].study.id;
            if (newStudies[index].scrap) {
                axios.delete(`/api/scrap/study/${studyId}`, {
                    params: {id: studyId},
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                    .then(response => {
                        console.log("스크랩 취소 성공 " + response.data);
                    })
                    .catch(error => {
                        console.error("Error:", error);
                        console.log("스크랩 취소 실패");
                    });
            } else {
                axios.post(`/api/scrap/study/${studyId}`, null, {
                    params: {id: studyId},
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                    .then(response => {
                        console.log("스크랩 성공");
                    })
                    .catch(error => {
                        console.error("Error:", error);
                        console.log("스크랩 실패");
                    });
            }
            newStudies[index] = {...newStudies[index], scrap: !newStudies[index].scrap};
            setStudiesChanged(true);
            return newStudies;
        });
    };

    const toggleLike = (index) => {
        setStudies((prevStudies) => {
            const newStudies = [...prevStudies];
            const studyId = newStudies[index].study.id;
            if (newStudies[index].like) {
                axios.delete(`/api/star/study/${studyId}`, {
                    params: {id: studyId},
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                    .then(response => {
                        console.log("공감 취소 성공 " + response.data);
                    })
                    .catch(error => {
                        console.error("Error:", error);
                        console.log("공감 취소 실패");
                    });
            } else {
                axios.post(`/api/star/study/${studyId}`, null, {
                    params: {id: studyId},
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                    .then(response => {
                        console.log("공감 성공");
                    })
                    .catch(error => {
                        console.error("Error:", error);
                        console.log("공감 실패");
                    });
            }
            newStudies[index] = {...newStudies[index], like: !newStudies[index].like};
            setStudiesChanged(true);
            return newStudies;
        });
    };

    useEffect(() => {
        axios.get("/api/mypage/study/star-scrap", { // 공감
            params: {
                page: page,
                status: "participate",
                type: "star",
            },
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => {
                setLikeStates(response.data);
            })
            .catch(error => {
                console.log("공감 불러오기 실패", error);
            });

        axios.get("h/api/mypage/study/star-scrap", { // 스크랩
            params: {
                page: page,
                status: "participate",
                type: "scrap",
            },
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => {
                setScrapStates(response.data);
            })
            .catch(error => {
                console.log("스크랩 불러오기 실패", error);
            });
    }, []);

    const handlePageChange = ({page, itemsPerPage, totalItemsCount}) => {

        setPage(page);
        const result = axios.get("/api/user/mypage/studying", {
            params: {
                page: page,
            }, withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        result.then((response) => {
            setStudies(response.data.content);
            setItemsPerPage(response.data.pageable.pageSize);
            setCount(response.data.totalElements);

            const res_like = axios.get("/api/mypage/study/star-scrap", { // 공감
                params: {
                    page: page,
                    status: "participate",
                    type: "star",
                },
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            const res_scrap = axios.get("/api/mypage/study/star-scrap", { // 스크랩
                params: {
                    page: page,
                    status: "participate",
                    type: "scrap",
                },
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            setLikeTwoStates(res_like)
            setScrapTwoStates(res_scrap);

            const studyList = response.data.content;

            const updateStudies = studyList.map((study, index) => {
                study.like = likeTwoStates[index];
                study.scrap = scrapTwoStates[index];
                return study;
            });
            setStudies(updateStudies);

        }).catch((error) => {
            console.error("데이터 가져오기 실패:", error);
        });


        setItemsPerPage(itemsPerPage);
        setCount(totalItemsCount);
    };

    useEffect(() => {
        setLoading(true);
        axios.get("/api/user/mypage/studying", {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("모집완료된 스터디, 참여멤버 전송 성공 : ", res.data);
                setLoading(false);
                const studyList = res.data.content;

                const updateStudies = res.data.content.map((study, index) => {
                    study.like = likeStates[index];
                    study.scrap = scrapStates[index];

                    return study;
                });

                setStudies(updateStudies);
                localStorage.setItem("MyParticipatedStudy", JSON.stringify(res.data.content));
                setItemsPerPage(res.data.pageable.pageSize);
                setCount(res.data.totalElements);


            })
            .catch((error) => {
                console.error("모집완료된 스터디 가져오기 실패:", error);
            });

    }, [accessToken]);

    const goNextTeamBlog = (item) => {
        navigate(`/${item.study.id}/teamblog`, {
            state: {
                studyId: item.study.id
            }
        });
    }

    const goEvaluationPage = (item) => {
        navigate(`/${item.study.id}/evaluate`, {
            state: {
                studyId: item.study.id
            }
        })
    }

    const mypartistudylist = () => {
        return (
            <div className="study_list">
                {studies.map((d, index) => (
                    <div className="list" key={d.study.id}>
                        <div className="list_header">
                            <div className="list_sub_header">
                                <div className="list_day">
                                    {calculateDateDifference(d.study.activityStart, d.study.activityDeadline)}일간의 우주여행
                                </div>
                                {d.study.progressStatus === "IN_PROGRESS" ? (
                                    <div className="list_status">진행중</div>
                                ) : d.study.progressStatus === "DISCONTINUE" ? (
                                    <div className="list_status">중단된 스터디</div>
                                ) : (
                                    <div className="list_status">진행 완료</div>
                                )}

                            </div>
                            <div className="list_btn">
                                <div className="list_like">
                                    <LikeButton like={studies[index].like}
                                                onClick={() => toggleLike(index)}/>
                                </div>
                                <div className="list_scrap">
                                    <ScrapButton scrap={studies[index].scrap}
                                                 onClick={() => toggleScrap(index)}/>
                                </div>
                            </div>
                        </div>
                        <div className={"contnet"}>
                            <div className="list_deadline">
                                마감일 | {d.study.recruitmentDeadline}
                            </div>
                            <div className="list_title">{d.study.title}</div>
                            <div className="list_tag">{d.study.field}</div>
                            <div className="list_onoff">{d.study.onOff}</div>
                            <div className="stroke"></div>
                            <div className="list_founder">{d.study.recruiter.nickname}</div>
                            <div className="buttons">
                                <button id="go-teamblog"onClick={() => goNextTeamBlog(d)} >팀블로그 가기</button>
                                {d.study.progressStatus === "WRAP_UP" ? (
                                    <button className="evaluation_btn" study={d} onClick={()=>goEvaluationPage(d)}>팀원 평가</button>
                                ) : null}
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        );
    };
    return (
        <div>
            <Header showSideCenter={true}/>
            <div className="container">
                <Category/>
                <div className="main_container">
                    <p id={"entry-path"}> 홈 > 스터디 참여 내역 </p>
                    <Backarrow subname={"스터디 참여 내역"}/>
                    {loading ? <Loading/>:(
                        <div className="content_container">
                            {mypartistudylist()}
                        </div>
                    )
                    }

                </div>
            </div>
            <div className={"paging"}>
                <Paging page={page} totalItemCount={count} itemsPerPage={itemsPerPage}
                        handlePageChange={handlePageChange}/>
            </div>
        </div>
    );
};
export default MyParticipateStudy;
