import React, {useCallback, useEffect, useState} from "react";
import {Link, useNavigate, useParams, useLocation} from "react-router-dom";

import Backarrow from "../../components/repeat_etc/Backarrow";
import Header from "../../components/repeat_etc/Header";
import "../../css/study_css/MyOpenStudy.css";
import "../../css/study_css/StudyDetail.css";
import SearchBar from "../../SearchBar";
import axios from "axios";
import StudyListItem from "../../components/study/StudyListItem";
import Paging from "../../components/repeat_etc/Paging";
import Loading from "../../components/repeat_etc/Loading";

const Study = () => {
    const navigate = useNavigate();
    const [studies, setStudies] = useState([]);
    const [isStudiesInitialized, setStudiesInitialized] = useState(false);
    const [scrapStates, setScrapStates] = useState([]);
    const [likeStates, setLikeStates] = useState([]);
    const [isScrapStates, setIsScrapStates] = useState(false);
    const [isLikeStates, setIsLikeStates] = useState(false);
    const location = useLocation();
    const pageparams = location.state ? location.state.page : 1;
    const [showStudyInsert, setShowStudyInsert] = useState(false);
    const [studiesChanged, setStudiesChanged] = useState(false);
    let accessToken = localStorage.getItem('accessToken');
    let isLoggedInUserId = localStorage.getItem('isLoggedInUserId');
    const [page, setPage] = useState(pageparams);
    const [count, setCount] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [loading, setLoading] = useState(false);
    const [isOnlyRecruting, setIsOnlyRecruting] = useState(false);

    const query = new URLSearchParams(location.search).get("q") || "";
    const option = new URLSearchParams(location.search).get("select") || "";
    console.log(query);
    console.log(option);

    // const updateStudies = (updatedStudies) => {
    //     setStudies(updatedStudies);
    // };
    const insertPage = location.state && location.state.page;

    const handleMoveToStudyInsert = (e) => {
        if (accessToken && isLoggedInUserId) {
            e.preventDefault();
            setShowStudyInsert(!showStudyInsert);
        } else {
            alert("로그인 해주세요");
            navigate("/login");
        }

    };

    const handleStudyInsertClose = () => {
        setShowStudyInsert(false);
    };

    const handleClickRecrutingBtn = () => {
        setIsOnlyRecruting((prev) => !prev);

    }

    const toggleScrap = useCallback((index) => {
        if (!(accessToken && isLoggedInUserId)) {
            alert("로그인 해주세요");
            navigate("/login");
        }

        setStudies((prevStudies) => {
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
    },[accessToken, isLoggedInUserId, studies]);

    const toggleLike = useCallback((index) => {
        if (!(accessToken && isLoggedInUserId)) {
            alert("로그인 해주세요");
            navigate("/login");
        }

        setStudies((prevStudies) => {
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
    },[accessToken, isLoggedInUserId, studies]);

    const handlePageChange = (selectedPage) => {
        setPage(selectedPage);
        navigate(`/study/page=${selectedPage}`);
    };

    const fetchLikeScrap = (pageNumber) => {
        // if (accessToken && isLoggedInUserId) {
        //     const res_like = axios.get("/api/study/stars", {
        //         params: {
        //             page: pageNumber,
        //         },
        //         withCredentials: true,
        //         headers: {
        //             'Authorization': `Bearer ${accessToken}`
        //         }
        //     }).then((response) => {
        //         setLikeStates(response.data);
        //         setIsLikeStates(true);
        //     }).catch((error) => {
        //         console.error("공감 가져오기 실패:", error);
        //     });
        //
        //     const res_scrap = axios.get("/api/study/scraps", {
        //         params: {
        //             page: pageNumber,
        //         },
        //         withCredentials: true,
        //         headers: {
        //             'Authorization': `Bearer ${accessToken}`
        //         }
        //     }).then((response) => {
        //         setScrapStates(response.data);
        //         setIsScrapStates(true);
        //         console.log("스크랩 가져오기 성공");
        //     }).catch((error) => {
        //         console.error("스크랩 가져오기 실패:", error);
        //     });
        // }
    };

    const fetchStudies = (pageNumber) => {
        setLoading(true);

        const requestParams = {
            page: pageNumber,
            size: 9,
        };

        if (isOnlyRecruting) {
            requestParams.recruitmentType = "RECRUITING";
        }

        if (query && option) {
            requestParams.keyword = query;
            requestParams.activityType = option;
        }
        console.log(requestParams);

        axios.get("/api/studies/search", {
            params: requestParams, // 데이터를 params로 전달
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((response) => {
                console.log(response.data);
                setStudies(response.data.studyInfos);
                setItemsPerPage(response.data.currentPage);
                setCount(response.data.studyInfos.length);
                if (response.data.content != null) {
                    setStudiesInitialized(true);
                }
                setLoading(false);
            }).catch((error) => {
                console.error("데이터 가져오기 실패:", error);
            });
    };

    useEffect(() => {
        setStudiesInitialized(false);
        setIsLikeStates(false);
        setIsScrapStates(false);
        fetchStudies(page);
        fetchLikeScrap(page);
    }, [page]);

    useEffect(() => {
        fetchStudies(page);
    }, [isOnlyRecruting, page, query, option]);

    useEffect(() => {
        axios.get("/api/studies/search", {
            params: { page:1, size:9 }, // 데이터를 params로 전달
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((response) => {
            console.log(response.data);
            setStudies(response.data.studyInfos);
            setItemsPerPage(response.data.currentPage);
            setCount(response.data.studyInfos.length);
            if (response.data.content != null) {
                setStudiesInitialized(true);
            }
            setLoading(false);
        })
            .catch((error) => {
                console.error("데이터 가져오기 실패:", error);
            });
    }, [insertPage])

    useEffect(() => {
        if (isStudiesInitialized) {
            if (isLikeStates && isScrapStates) {
                const studyList = studies;
                const updateStudies = studyList.map((study, index) => {
                    study.like = likeStates[index];
                    study.scrap = scrapStates[index];
                    return study;
                });
                setStudies(updateStudies);
            }
        }
    }, [isStudiesInitialized, isLikeStates, isScrapStates])

    return (
        <div className={"main_wrap"} id={"study"}>
            <Header showSideCenter={true}/>
            <div className="study_detail_container" style={{width: "70%"}}>
                <h1>STAR TOUR STORY</h1>
                <div className="arrow_left">
                    <p id={"entry-path"}> 홈 > 스터디 리스트 </p>
                    <Backarrow subname={"STAR TOUR STORY"}/>
                    {!showStudyInsert && (
                        <button onClick={handleMoveToStudyInsert} className="openStudy">
                            스터디 개설
                        </button>
                    )}
                </div>
                <div className="study">
                    {showStudyInsert && (
                        navigate('/study/studyInsert')
                    )}
                    <div>
                        <div><SearchBar isHome={false} handleClickRecrutingBtn={handleClickRecrutingBtn} isOnlyRecruting={isOnlyRecruting}/>
                        </div>
                        <div className="study_count">
                            총 {count} 건
                        </div>
                        {!showStudyInsert && loading ? (
                            <Loading/>) : (
                            <div className="content_container">
                                <div className="study_list">
                                    {studies.map((d, index) => (
                                        <StudyListItem studies={d} toggleLike={toggleLike} toggleScrap={toggleScrap}
                                                       d={d}
                                                       index={index} key={d.id} studiesList={studies}/>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    {!showStudyInsert && studies.length === 0 && !loading && <h3>스터디 리스트가 비었습니다.</h3>}
                </div>
            </div>
            <div className={"paging"}>
                {!showStudyInsert && (
                    <Paging page={page} totalItemCount={itemsPerPage} itemsPerPage={itemsPerPage}
                            handlePageChange={handlePageChange}/>
                )}
            </div>
        </div>
    );
};

export default Study;