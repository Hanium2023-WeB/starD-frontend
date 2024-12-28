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
import {toggleScrapStatus} from "../../util/scrapHandler";

const Study = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const pageparams = location.state ? location.state.page : 1;
    let accessToken = localStorage.getItem('accessToken');
    let isLoggedInUserId = localStorage.getItem('isLoggedInUserId');

    const [studies, setStudies] = useState([]);
    const [studiesChanged, setStudiesChanged] = useState(false);

    const [page, setPage] = useState(pageparams);
    const [count, setCount] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(9);
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
                    updatedStudies[index] = { ...study, existsScrap };
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
            const response = await axios.get("/api/studies/search", {
                params,
                withCredentials: true,
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            setStudies(response.data.studyInfos);
            setCount(response.data.studyInfos.length);
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
            size:9,
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
            navigate(`/study/studyInsert`);
        } else {
            alert("로그인 해주세요");
            navigate("/login");
        }
    };

    const handleClickRecrutingBtn = () => {
        setIsOnlyRecruting((prev) => !prev);
    }

    return (
        <div className="main_wrap" id="study">
            <Header showSideCenter={true} />
            <div className="study_detail_container" style={{ width: "70%" }}>
                <h1>STAR TOUR STORY</h1>
                <div className="arrow_left">
                    <p id="entry-path"> 홈 > 스터디 리스트 </p>
                    <Backarrow subname="STAR TOUR STORY" />
                    <button onClick={handleMoveToStudyInsert} className="openStudy">
                        스터디 개설
                    </button>
                </div>
                <div className="study">
                    <SearchBar isHome={false} handleClickRecrutingBtn={handleClickRecrutingBtn} isOnlyRecruting={isOnlyRecruting} onFilterChange={handleFilterChange} />
                    <div className="study_count">총 {count} 건</div>
                    {loading ? (
                        <Loading />
                    ) : (
                        <div className="content_container">
                            <div className="study_list">
                                {studies.map((study, index) => (
                                    <StudyListItem key={study.id} studies={study} index={index} toggleScrap={() => toggleScrap(index)}/>
                                ))}
                            </div>
                        </div>
                    )}
                    {studies.length === 0 && !loading && <h3>스터디 리스트가 비었습니다.</h3>}
                </div>
            </div>
            <div className="paging">
                <Paging page={page} totalItemCount={count} itemsPerPage={9} handlePageChange={handlePageChange} />
            </div>
        </div>
    );
};

export default Study;