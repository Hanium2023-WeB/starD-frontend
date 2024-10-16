import Header from "../../components/repeat_etc/Header";
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import "../../css/community_css/Community.css";
import SearchBar from "../../components/community/CommSearchBar";
import PostInsert from "../../components/community/PostInsert";
import PostListItem from "../../components/community/PostListItem";
import axios from "axios";
import Backarrow from "../../components/repeat_etc/Backarrow";
import LikeButton from "../../components/repeat_etc/LikeButton";
import ScrapButton from "../../components/repeat_etc/ScrapButton";
import "../../css/study_css/MyOpenStudy.css";
import "../../css/study_css/StudyDetail.css";

const MyScrapStudy = () => {
    const [slidePx, setSlidePx] = useState(0);
    const [scrapStudies, setScrapStudies] = useState([]);
    const [scrapStates, setScrapStates] = useState(scrapStudies.scrap);
    const [likeStates, setLikeStates] = useState([]);
    const [studiesChanged, setStudiesChanged] = useState(false);


    let accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        axios.get("/api/study/stars/scraps", {
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
    }, []);

    useEffect(() => {
        axios.get("/api/scrap/study", {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => {
                const studyList = response.data;

                const updateStudies = response.data.map((study, index) => {
                    study.like = likeStates[index];
                    study.scrap = true;

                    return study;
                });

                setScrapStudies(updateStudies);
                localStorage.setItem("studies", JSON.stringify(scrapStudies));
                console.log(updateStudies);
            })
            .catch(error => {
                console.error("데이터 가져오기 실패:", error);
            });

    }, [likeStates, scrapStates]);

    useEffect(() => {
        if (studiesChanged) {
            localStorage.setItem("studies", JSON.stringify(scrapStudies));
            localStorage.setItem("ScrapStudies", JSON.stringify(scrapStates));
            localStorage.setItem("LikeStates", JSON.stringify(likeStates));
            // Reset studiesChanged to false
            setStudiesChanged(false);
        }
    }, [studiesChanged, scrapStudies, scrapStates, likeStates]);

    const toggleScrap = (index) => {
        setScrapStudies((prevStudies) => {
            const newStudies = [...prevStudies];
            const studyId = newStudies[index].id;
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
        setScrapStudies((prevStudies) => {
            const newStudies = [...prevStudies];
            const studyId = newStudies[index].id;
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
    const calculateDateDifference = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const timeDifference = end - start;
        const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

        return daysDifference;
    }
    const checkRecruitStatus = (recruitStatus) => {

        if (recruitStatus == "RECRUITING")
            return "모집 중";
        else
            return "모집 완료";
    }

    const navigate = useNavigate();

    const GoNextDetailPage = (study)=>{
        // console.log(d.id);
        navigate(`/studydetail/${study.id}`, {state: study.id})
    }


    return (
        <div className={"main_wrap"} id={"community"}>
            <Header showSideCenter={true}/>
            <div className="study_detail_container">
                <h1>STAR TOUR STORY</h1>
                <div className="arrow_left">
                    <p id={"entry-path"}> 홈 > 스터디 리스트 </p>
                    <Backarrow subname={"MY SCRAP STUDY"}/>
                </div>
                <div className="content_container">
                    <div className="study_list">
                        {(scrapStudies.length === 0) && <p className="no_scrap">스크랩한 스터디가 없습니다.</p>}
                        {(scrapStudies.length !== 0) &&
                            scrapStudies.map((study, index) => (
                                <div className="list" key={study.id}>
                                    <div className="list_header">
                                        <div className="list_sub_header">
                                            <div className="list_day">
                                                {calculateDateDifference(study.activityStart, study.activityDeadline)}일간의
                                                스터디
                                            </div>
                                            <div className="list_status">{checkRecruitStatus(study.recruitStatus)}</div>
                                        </div>
                                        <div className="list_btn">
                                            <div className="list_like">
                                                <LikeButton like={study.like}
                                                            onClick={() => toggleLike(index)}/>
                                            </div>
                                            <div className="list_scrap">
                                                {/* 스크랩 버튼을 클릭하면 해당 스터디 리스트 항목의 스크랩 상태를 토글 */}
                                                <ScrapButton scrap={study.scrap}
                                                             onClick={() => toggleScrap(index)}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="list_deadline">
                                        마감일 | {study.recruitmentDeadline}
                                    </div>
                                    <div className="list_title" onClick={() => GoNextDetailPage(study)}>{study.title}</div>
                                    <div className="list_tag_wrapper" onClick={GoNextDetailPage}>
                                        {scrapStudies.tags.split(',').map((tag, idx) => (
                                            <div key={idx} className="list_tag">
                                                {tag.trim()}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="list_onoff" onClick={() => GoNextDetailPage(study)}>{study.onOff}</div>
                                    <div className="stroke"></div>
                                    <div className="list_founder">{study.recruiter?.nickname}</div>
                                </div>

                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
        ;
}
export default MyScrapStudy;