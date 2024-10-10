import React, { useState, useEffect } from "react";
import "../../css/mypage_css/Mypage.css";
import ScrapStudySlide from "./ScrapStudySlide.js";
import "../../css/study_css/MyParticipateStudy.css";
import "../../css/mypage_css/Mypage_Scrap.css";

import axios from "axios";

const Slide = ({ type, userId }) => {
    const [slidePx, setSlidePx] = useState(0);
    const [scrapStudies, setScrapStudies] = useState([]);
    const [scrapStates, setScrapStates] = useState(scrapStudies.scrap);
    const [likeStates, setLikeStates] = useState([]);
    const [studiesChanged, setStudiesChanged] = useState(false);

    const [openStudies, setOpenStudies] = useState([]);

    let accessToken = localStorage.getItem('accessToken');

    const config = {
        withCredentials: true,
        headers: {}
    };

    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    useEffect(() => {
        axios.get("/api/study/stars/scraps", config)
            .then (response => {
                setLikeStates(response.data);
            })
            .catch(error => {
                console.log("공감 불러오기 실패", error);
            });
    }, []);

    useEffect(() => {
        axios.get("/api/scrap/study", config)
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

    //다른 사용자 스터디 모집 게시글 조회
    useEffect(() => {
        axios
            .get(`/api/user/mypage/profile/${userId}/open-study`, config)
            .then((res) => {
                console.error("스터디 모집 게시글 가져오기 성공:", res.data);
                setOpenStudies(res.data);
            })
            .catch((error) => {
                console.error("스터디 모집 게시글 가져오기 실패:", error);
            });
    }, []);

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
            config = {
                params: { id: studyId },
                withCredentials: true,
                headers: {}
            };
            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            if (newStudies[index].scrap) {
                axios.delete(`/api/scrap/study/${studyId}`, config)
                    .then(response => {
                        console.log("스크랩 취소 성공 " + response.data);
                    })
                    .catch(error => {
                        console.error("Error:", error);
                        console.log("스크랩 취소 실패");
                    });
            } else {
                axios.post(`/api/scrap/study/${studyId}`, null, config)
                    .then(response => {
                        console.log("스크랩 성공");
                    })
                    .catch(error => {
                        console.error("Error:", error);
                        console.log("스크랩 실패");
                    });
            }
            newStudies[index] = { ...newStudies[index], scrap: !newStudies[index].scrap };
            setStudiesChanged(true);
            return newStudies;
        });
    };

    const toggleLike = (index) => {
        setScrapStudies((prevStudies) => {
            const newStudies = [...prevStudies];
            const studyId = newStudies[index].id;
            config = {
                params: { id: studyId },
                withCredentials: true,
                headers: {}
            };
            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            if (newStudies[index].like) {
                axios.delete(`/api/star/study/${studyId}`, config)
                    .then(response => {
                        console.log("공감 취소 성공 " + response.data);
                    })
                    .catch(error => {
                        console.error("Error:", error);
                        console.log("공감 취소 실패");
                    });
            } else {
                axios.post(`/api/star/study/${studyId}`, null, config)
                    .then(response => {
                        console.log("공감 성공");
                    })
                    .catch(error => {
                        console.error("Error:", error);
                        console.log("공감 실패");
                    });
            }
            newStudies[index] = { ...newStudies[index], like: !newStudies[index].like };
            setStudiesChanged(true);
            return newStudies;
        });
    };

    const studiesPerSlide = 3; // 처음에 보여지는 스터디 개수
    const studiesPerPage = 1;  // 넘어가는 스터디 개수
    const totalStudies = scrapStudies.length;
    const totalSlides = Math.ceil((totalStudies - studiesPerSlide + 1) / studiesPerPage); // 전체 슬라이드 개수
    const maxSlidePx = -286.3 * (totalSlides - 1); // 계산된 최대 슬라이드 위치

    const toPrev = () => {
        if (slidePx < 0) {
            setSlidePx(slidePx + 286.3 * studiesPerPage);
        }
    };

    const toNext = () => {
        if (slidePx > maxSlidePx) {
            setSlidePx(slidePx - 286.3 * studiesPerPage);
        }
    };

    return (
        <>
            {type === "scrap" && (
                <div style={{ position: "relative" }}>
                    <div className="sub_container" id="scrap_study">
                        {scrapStudies.length === 0 ? (
                            <p className="no_scrap">스크랩한 스터디가 없습니다.</p>
                        ) : (
                            <div className="sub_wrap">
                                <ul className="study_list">
                                    {scrapStudies.map((d, index) => (
                                        <ScrapStudySlide key={index} studies={d} toggleLike={toggleLike} toggleScrap={toggleScrap} d={d} index={index} slide={slidePx} />
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    {scrapStudies.length !== 0 && (
                        <div className="scrap_button">
                            <button
                                className="prev_btn"
                                onClick={toPrev}
                                style={{ display: slidePx === 300 ? "none" : "" }}
                            >
                                {"<"}
                            </button>
                            <button
                                className="next_btn"
                                onClick={toNext}
                                style={{ display: slidePx === -2100 ? "none" : "" }}
                            >
                                {">"}
                            </button>
                        </div>
                    )}
                </div>
            )}
            {type === "openStudy" && (
                <div style={{ position: "relative" }}>
                    <div className="sub_container" id="scrap_study">
                        {(openStudies.length === 0 || openStudies.content.length === 0) ? (
                            <p className="no_scrap">개설한 스터디가 없습니다.</p>
                        ) : (
                            <div className="sub_wrap">
                                <ul className="study_list">
                                    {openStudies.content.map((d, index) => (
                                        <ScrapStudySlide key={index} studies={d} toggleLike={toggleLike} toggleScrap={toggleScrap} d={d} index={index} slide={slidePx} />
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    {(openStudies.length !== 0 && openStudies.content.length !== 0) && (
                        <div className="scrap_button">
                            <button
                                className="prev_btn"
                                onClick={toPrev}
                                style={{ display: slidePx === 300 ? "none" : "" }}
                            >
                                {"<"}
                            </button>
                            <button
                                className="next_btn"
                                onClick={toNext}
                                style={{ display: slidePx === -2100 ? "none" : "" }}
                            >
                                {">"}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );

};

export default Slide;

