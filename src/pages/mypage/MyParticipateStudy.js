import React, {useState, useEffect, useCallback} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import Category from "../../components/repeat_etc/Category.js";

import "../../css/study_css/MyParticipateStudy.css";
import Header from "../../components/repeat_etc/Header";
import axios from "axios";
import Paging from "../../components/repeat_etc/Paging";
import Backarrow from "../../components/repeat_etc/Backarrow";
import Loading from "../../components/repeat_etc/Loading";
import StudyListItem from "../../components/study/StudyListItem";
import {toggleScrapStatus} from "../../util/scrapHandler";

const MyParticipateStudy = ({sideheader}) => {
    const accessToken = localStorage.getItem('accessToken');
    const isLoggedInUserId = localStorage.getItem('isLoggedInUserId');
    const [studies, setStudies] = useState([]);

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const pageParams = location.state ? location.state.page : 1;
    const [page, setPage] = useState(pageParams);
    const [totalElements, setTotalElements] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [totalPages, setTotalPages] = useState(1);

    const fetchParticipateStudies = async (pageNumber) => {
        axios.get("/api/members/studies/participate", {
            params: {page: pageNumber},
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                setLoading(false);
                setStudies(res.data.studyRecruitPosts);
                setTotalElements(res.data.totalElements); // 전체 개수 업데이트
                setTotalPages(res.data.totalPages); // 전체 페이지 수 업데이트
            })
            .catch((error) => {
                console.error("모집완료된 스터디 가져오기 실패:", error);
            });
    };

    useEffect(() => {
        fetchParticipateStudies(page);
    }, [page]);

    const handlePageChange = (newPage) => {
        setPage(newPage); // 페이지 상태를 업데이트
    };

    const toggleScrap = useCallback((index) => {
        const study = studies[index];
        toggleScrapStatus(
            study,
            accessToken,
            isLoggedInUserId,
            (isScrapped) => {
                setStudies((prevStudies) => {
                    const updatedStudies = [...prevStudies];
                    updatedStudies[index] = {...study, isScrapped};
                    return updatedStudies;
                });
            },
            (error) => {
                console.error("스크랩 상태 변경 실패:", error);
            }
        );
    }, [studies, accessToken, isLoggedInUserId]);


    const goNextTeamBlog = (item) => {
        navigate(`/teamblog/${item.studyId}`, {
            state: {
                studyId: item.studyId
            }
        });
    }

    const goEvaluationPage = (item) => {
        navigate(`/${item.studyId}/evaluate`, {
            state: {
                studyId: item.studyId
            }
        })
    }

    const mypartistudylist = () => {
        return (
            <div className="study_list">
                {studies.length === 0 && (
                    <div className="no_study">
                        <p>스터디 참여 내역이 없습니다.</p>
                    </div>
                )}
                {studies.map((study, index) => (
                    <StudyListItem key={study.studyId} studies={study} index={index}
                                   toggleScrap={() => toggleScrap(index)} isParticipateStudy={true}
                                   goEvaluationPage={goEvaluationPage} goNextTeamBlog={goNextTeamBlog}/>
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

                    <p id={"entry-path"}> 마이페이지 > 스터디 팀 블로그 </p>
                    <Backarrow subname={"스터디 팀 블로그"}/>
                    {loading ? <Loading/> : (
                        <div className="content_container">
                            {mypartistudylist()}

                    {studies.length !== 0 && (
                        <div className={"paging"}>
                            <Paging page={page} totalItemCount={totalElements} itemsPerPage={itemsPerPage}
                                    handlePageChange={handlePageChange}/>
                        </div>
                    )}

                    <br/>
                </div>
            </div>


        </div>
    );
};
export default MyParticipateStudy;
