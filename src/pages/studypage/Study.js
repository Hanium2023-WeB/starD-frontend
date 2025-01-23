import React, {useCallback, useEffect, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";

import Backarrow from "../../components/repeat_etc/Backarrow";
import Header from "../../components/repeat_etc/Header";
import "../../css/study_css/MyOpenStudy.css";
import "../../css/study_css/StudyDetail.css";
import SearchBar from "../../SearchBar";
import axios from "axios";
import StudyListItem from "../../components/study/StudyListItem";
import Paging from "../../components/repeat_etc/Paging";
import Loading from "../../components/repeat_etc/Loading";
import {toggleScrapStatus} from "../../util/scrapHandler";
import toast from "react-hot-toast";

const Study = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const pageparams = location.state ? location.state.page : 1;
    let accessToken = localStorage.getItem('accessToken');
    let isLoggedInUserId = localStorage.getItem('isLoggedInUserId');

    const [studies, setStudies] = useState([]);

    const [page, setPage] = useState(pageparams);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isOnlyRecruting, setIsOnlyRecruting] = useState(false);
    const [filter, setFilter] = useState(''); // SearchBar에서 전달받은 필터

    const toggleScrap = useCallback((index) => {
        const study = studies[index];
        toggleScrapStatus(
            study,
            accessToken,
            isLoggedInUserId,
            (existsScrap) => {
                setStudies((prevStudies) => {
                    const updatedStudies = [...prevStudies];
                    updatedStudies[index] = {...study, existsScrap};
                    return updatedStudies;
                });
            },
            (error) => {
                console.error("스크랩 상태 변경 실패:", error);
            }
        );
    }, [studies, accessToken, isLoggedInUserId]);

    const fetchStudiesData = async (params) => {
        try {
            setLoading(true);
            let response;
            if (accessToken != null) {
                response = await axios.get("/api/studies/search", {
                    params,
                    withCredentials: true,
                    headers: {'Authorization': `Bearer ${accessToken}`}
                });
            } else {
                response = await axios.get("/api/studies/search", {
                    params
                });
            }

            setTotalPages(response.data.totalPages);
            setStudies(response.data.studyInfos);
            setTotalElements(response.data.totalElements);
            setLoading(false);
        } catch (error) {
            console.error("데이터 가져오기 실패:", error);
            setLoading(false);
        }
    }

    // 페이지 변경 시 호출되는 함수
    const handlePageChange = (selectedPage) => {
        setPage(selectedPage);
        navigate(`/study/page=${selectedPage}`);
    };

    // 필터 변경 처리
    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const loadStudies = useCallback(() => {
        const requestParams = {
            page,
            size: 9,
            recruitmentType: isOnlyRecruting ? "RECRUITING" : undefined,
            activityType: filter !== "ALL" ? filter : undefined,
            keyword: new URLSearchParams(location.search).get("q") || "",
        };
        fetchStudiesData(requestParams);
    }, [isOnlyRecruting, page, filter, location.search]);

    useEffect(() => {
        loadStudies();
    }, [loadStudies]);

    const handleMoveToStudyInsert = (e) => {
        if (accessToken && isLoggedInUserId) {
            e.preventDefault();
            navigate(`/study/insert`);
        } else {
            toast.error("로그인 후 이용 가능합니다.");
            // navigate("/login");
        }
    };

    const handleClickRecrutingBtn = () => {
        setIsOnlyRecruting((prev) => !prev);
    }

    return (
        <div className="main_wrap" id="study">
            <Header showSideCenter={true}/>
            <div className="study_detail_container" style={{width: "70%"}}>
                <h1>STAR TOUR STORY</h1>
                <div className="arrow_left">
                    <p id="entry-path"> 홈 > 스터디 리스트 </p>
                    <Backarrow subname="STAR TOUR STORY"/>
                    <button onClick={handleMoveToStudyInsert} className="openStudy">
                        스터디 개설
                    </button>
                </div>
                <div className="study">
                    <SearchBar isHome={false}
                               handleClickRecrutingBtn={handleClickRecrutingBtn}
                               isOnlyRecruting={isOnlyRecruting}
                               onFilterChange={handleFilterChange}/>
                    <div className="study_count">총 {totalElements} 건</div>
                    {loading ? (
                        <Loading/>
                    ) : (
                        <div className="content_container">
                            <div className="study_list">
                                {studies.map((study, index) => (
                                    <StudyListItem key={study.id} studies={study}
                                                   index={index}
                                                   toggleScrap={() => toggleScrap(index)}/>
                                ))}
                            </div>
                        </div>
                    )}
                    {studies.length === 0 && !loading && (
                        <h3>
                            {isOnlyRecruting
                                ? "모집중인 스터디가 없습니다." // 모집중 필터 적용 상태
                                : location.search || filter !== "ALL"
                                    ? "일치하는 스터디가 없습니다." // 검색 상태
                                    : "개설된 스터디가 없습니다." // 일반 상태
                            }
                        </h3>
                    )}
                    <br/>
                </div>
                {studies.length !== 0 &&
                    <div className="pagingDiv">
                        <Paging page={page} totalItemCount={totalElements} itemsPerPage={9} totalPages={totalPages}
                                handlePageChange={handlePageChange}/>
                    </div>
                }
            </div>


        </div>
    );
};

export default Study;