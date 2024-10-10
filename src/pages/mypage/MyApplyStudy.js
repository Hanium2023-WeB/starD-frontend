import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import Category from "../../components/repeat_etc/Category.js";
import "../../css/study_css/MyParticipateStudy.css";
import Header from "../../components/repeat_etc/Header";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from "@fortawesome/free-solid-svg-icons";
import LikeButton from "../../components/repeat_etc/LikeButton";
import ScrapButton from "../../components/repeat_etc/ScrapButton";
import axios from "axios";
import Backarrow from "../../components/repeat_etc/Backarrow";

const MyApplyStudy = ({sideheader}) => {

    const [studies, setStudies] = useState([]);
    const [scrapStates, setScrapStates] = useState([]);
    const [likeStates, setLikeStates] = useState([]);
    const [studiesChanged, setStudiesChanged] = useState(false);
    const accessToken = localStorage.getItem('accessToken');
    const isLoggedInUserId = localStorage.getItem('isLoggedInUserId');
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [scrapTwoStates, setScrapTwoStates] = useState([]);
    const [likeTwoStates, setLikeTwoStates] = useState([]);

    useEffect(() => {
        if (accessToken && isLoggedInUserId) {
            axios.get("/api/mypage/study/star-scrap", {
                params: {
                    page: page,
                    status: "apply",
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

            axios.get("/api/mypage/study/star-scrap", {
                params: {
                    page: page,
                    status: "apply",
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
        }
    }, []);

    const handlePageChange = ({page, itemsPerPage, totalItemsCount}) => {
        setPage(page);
        const result = axios.get("/api/user/mypage/apply-study", {
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

            if (accessToken && isLoggedInUserId) {
                const res_like = axios.get("/api/mypage/study/star-scrap", { // 공감
                    params: {
                        page: page,
                        status: "apply",
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
                        status: "apply",
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
            }
        }).catch((error) => {
            console.error("데이터 가져오기 실패:", error);
        });

        setItemsPerPage(itemsPerPage);
        setCount(totalItemsCount);
    };

    useEffect(() => {
        axios.get("/api/user/mypage/apply-study", {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("전송 성공 : ", res.data);
                const studyList = res.data.content;
                const updateStudies = res.data.content.map((study, index) => {
                    study.like = likeStates[index];
                    study.scrap = scrapStates[index];
                    return study;
                });
                setStudies(updateStudies);
                localStorage.setItem("ApplyStudy",JSON.stringify(res.data.content));
            })
            .catch((error) => {
                console.error("데이터 가져오기 실패:", error);
            });
    }, [accessToken, likeStates, scrapStates]);

    const toggleScrap = (index) => {
        setStudies((prevStudies) => {
            const newStudies = [...prevStudies];
            const studyId = newStudies[index].study.id;
            if (newStudies[index].scrap) { // true -> 활성화되어 있는 상태 -> 취소해야 함
                axios.delete(`/api/scrap/study/${studyId}`, {
                    params: { id: studyId },
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
                    params: { id: studyId },
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

    function calculateDateDifference(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const timeDifference = end - start;
        const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

        return daysDifference;
    }

    const toggleLike = (index) => {
        setStudies((prevStudies) => {
            const newStudies = [...prevStudies];
            const studyId = newStudies[index].study.id;
            if (newStudies[index].like) {
                axios.delete(`/api/star/study/${studyId}`, {
                    params: { id: studyId },
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
                    params: { id: studyId },
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


    const myapplystudylist = () => {
        return (
            <div className="study_list">
                {studies.map((d, index) => (
                    <div className="list" key={d.study.id}>

                        <div className="list_header">
                            <div className="list_sub_header">
                                <div className="list_day">
                                    {calculateDateDifference(d.study.activityStart, d.study.activityDeadline)}일간의 우주여행
                                </div>
                                {d.study.recruitStatus === "RECRUITING" ? (
                                    <div className="list_status">모집중</div>
                                ) : (<div className="list_status">진행중</div>)}

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
                        <Link
                            to={{
                                pathname: `/studydetail/${d.study.id}`,
                                state: {
                                    studyId: d.study.id,
                                },
                            }}
                            style={{
                                textDecoration: "none",
                                color: "inherit",
                            }}
                        >
                            <div className="list_deadline">
                                마감일 | {d.study.recruitmentDeadline}
                            </div>
                            <div className="list_title">{d.study.title}</div>
                            <div className="list_tag">{d.study.field}</div>
                            <div className="list_onoff">{d.study.onOff}</div>
                            <div className="stroke"></div>
                            <div className="list_founder">{d.study.recruiter.nickname}</div>
                        </Link>
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
                    <p id={"entry-path"}> 홈 > 스터디 신청 내역 </p>
                    <Backarrow subname={"스터디 신청 내역"}/>
                    <div className="content_container">
                        {myapplystudylist()}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default MyApplyStudy;
