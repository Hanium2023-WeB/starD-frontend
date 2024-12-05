import React, {useEffect, useState} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import Backarrow from "../../components/repeat_etc/Backarrow";
import StudyInsert from "../../pages/studypage/StudyInsert";
import Header from "../../components/repeat_etc/Header";
import "../../css/study_css/MyOpenStudy.css";
import "../../css/study_css/StudyDetail.css";
import SearchBar from "../../SearchBar";
import axios from "axios";
import StudyListItem from "../../components/study/StudyListItem";
import Paging from "../../components/repeat_etc/Paging";
import Loading from "../../components/repeat_etc/Loading";

const SearchResult = () => {

    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get("q");
    const selectOption = new URLSearchParams(location.search).get("select");
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const navigate = useNavigate();
    const [studies, setStudies] = useState([]);
    const [scrapStates, setScrapStates] = useState([]);
    const [likeStates, setLikeStates] = useState([]);
    const [showStudyInsert, setShowStudyInsert] = useState(false);
    const [studiesChanged, setStudiesChanged] = useState(false);
    const [loading, setLoading] = useState(true);

    let accessToken = localStorage.getItem('accessToken');
    let isLoggedInUserId = localStorage.getItem('isLoggedInUserId');

    useEffect(() => {
        if (studiesChanged) {
            localStorage.setItem("studies", JSON.stringify(studies));
            localStorage.setItem("ScrapStudies", JSON.stringify(scrapStates));
            localStorage.setItem("LikeStates", JSON.stringify(likeStates));
            setStudiesChanged(false);
        }
    }, [studiesChanged, studies, scrapStates, likeStates]);

    useEffect(() => {
        if (accessToken && isLoggedInUserId) {
            let starScrapUrl = "";

            if (selectOption === "제목") {
                starScrapUrl = "/api/study/search/title/star-scrap";
            } else if (selectOption === "내용") {
                starScrapUrl = "/api/study/search/content/star-scrap";
            } else {
                starScrapUrl = "/api/study/search/recruiter/star-scrap";
            }

            axios.get(starScrapUrl, {
                params: {
                    page: page,
                    keyword: searchQuery,
                    type: "star"
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

            axios.get(starScrapUrl, {
                params: {
                    page: page,
                    keyword: searchQuery,
                    type: "scrap"
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
    }, [page]);


    useEffect(() => {
        const storedStudies = JSON.parse(localStorage.getItem("studies"));
        if (storedStudies) {
            setStudies(storedStudies);
        }
    }, []);

    const updateStudies = (updatedStudies) => {
        setStudies(updatedStudies);
    };

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

    const handleSideHeaderButtonClick = () => {
        setShowStudyInsert(!showStudyInsert);
    };

    const toggleScrap = (index) => {
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
    };

    const toggleLike = (index) => {
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
    };

    const handlePageChange = (selectedPage) => {
        setPage(selectedPage);
    };

    let base_url = "";

    useEffect(() => {

        if (selectOption === "제목")
            base_url = "/api/api/v2/studies/search-by-title";
        else if (selectOption === "내용")
            base_url = "/api/api/v2/studies/search-by-content";
        else
            base_url = "/api/api/v2/studies/search-by-recruiter";

        const fetchStudies = (pageNumber) => {
            setLoading(true);
            console.log("페이지 번호 : ", pageNumber);
            axios.get(base_url, {
                params: {
                    page: pageNumber,
                    keyword: searchQuery
                },
            })
                .then((response) => {
                    setStudies(response.data.content);
                    setItemsPerPage(response.data.pageable.pageSize);
                    setCount(response.data.totalElements);

                    if (accessToken && isLoggedInUserId) {
                        const studyList = response.data.content;

                        const updateStudies = studyList.map((study, index) => {
                            study.like = likeStates[index];
                            study.scrap = scrapStates[index];
                            return study;
                        });
                        setStudies(updateStudies);
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("데이터 가져오기 실패:", error);
                });
        };
        fetchStudies(page);
    }, [page, searchQuery]);


    return (
        <div className={"main_wrap"} id={"study"}>
            <Header showSideCenter={true}/>
            <div className="study_detail_container" style={{width: "70%"}}>
                <h1>STAR TOUR STORY</h1>
                <div className="arrow_left">
                    <Backarrow subname={"STAR TOUR STORY"}/>
                    {!showStudyInsert && (
                        <button onClick={handleMoveToStudyInsert} className="openStudy">
                            스터디 개설
                        </button>
                    )}
                </div>

                <div className="study">
                    {showStudyInsert && (
                        <StudyInsert
                            updateStudies={updateStudies}
                            onClose={handleStudyInsertClose}
                            study={studies}
                        />
                    )}
                    {!showStudyInsert && (
                        <div>
                            <div><SearchBar isHome={false}/>
                            </div>

                            <div className="study_count">
                                총 {count} 건
                            </div>
                            {loading ?(<Loading/>):(
                                <div className="content_container">
                                    <div className="study_list">
                                        {studies.map((d, index) => (
                                            <StudyListItem studies={d} toggleLike={toggleLike} toggleScrap={toggleScrap}
                                                           d={d}
                                                           index={index} key={d.id}/>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    )}
                    {!showStudyInsert && studies.length === 0 && !loading  && <h3>스터디 리스트가 비었습니다.</h3>}
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

export default SearchResult;