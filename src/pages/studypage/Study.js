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
    const [loading, setLoading] = useState(true);

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

    const toggleScrap = useCallback((index) => {
        if (!(accessToken && isLoggedInUserId)) {
            alert("로그인 해주세요");
            navigate("/login");
        }

        setStudies((prevStudies) => {
            const newStudies = [...prevStudies];
            const studyId = newStudies[index].id;
            if (newStudies[index].scrap) {
                axios.delete(`http://localhost:8080/scrap/study/${studyId}`, {
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
                axios.post(`http://localhost:8080/scrap/study/${studyId}`, null, {
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
                axios.delete(`http://localhost:8080/star/study/${studyId}`, {
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
                axios.post(`http://localhost:8080/star/study/${studyId}`, null, {
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
        if (accessToken && isLoggedInUserId) {
            const res_like = axios.get("http://localhost:8080/study/stars", {
                params: {
                    page: pageNumber,
                },
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }).then((response) => {
                setLikeStates(response.data);
                setIsLikeStates(true);
            }).catch((error) => {
                console.error("공감 가져오기 실패:", error);
            });

            const res_scrap = axios.get("http://localhost:8080/study/scraps", {
                params: {
                    page: pageNumber,
                },
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }).then((response) => {
                setScrapStates(response.data);
                setIsScrapStates(true);
                console.log("스크랩 가져오기 성공");
            }).catch((error) => {
                console.error("스크랩 가져오기 실패:", error);
            });
        }
    };

    const fetchStudies = (pageNumber) => {
        setLoading(true);
        axios.get("http://localhost:8080/api/v2/studies/all", {
            params: {
                page: pageNumber,
            },
        })
            .then((response) => {
                setStudies(response.data.content);
                setItemsPerPage(response.data.pageable.pageSize);
                setCount(response.data.totalElements);
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
        axios.get("http://localhost:8080/api/v2/studies/all", {
            params: {
                page: 1,
            },
        }).then((response) => {
            setStudies(response.data.content);
            setItemsPerPage(response.data.pageable.pageSize);
            setCount(response.data.totalElements);
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
                        <div><SearchBar/>
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
                    <Paging page={page} totalItemCount={count} itemsPerPage={itemsPerPage}
                            handlePageChange={handlePageChange}/>
                )}
            </div>
        </div>
    );
};

export default Study;