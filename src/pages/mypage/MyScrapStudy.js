import Header from "../../components/repeat_etc/Header";
import React, {useCallback, useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

import "../../css/community_css/Community.css";
import axios from "axios";
import Backarrow from "../../components/repeat_etc/Backarrow";
import "../../css/study_css/MyOpenStudy.css";
import "../../css/study_css/StudyDetail.css";
import StudyListItem from "../../components/study/StudyListItem";
import {toggleScrapStatus} from "../../util/scrapHandler";
import Category from "../../components/repeat_etc/Category";
import Paging from "../../components/repeat_etc/Paging";

const MyScrapStudy = () => {
    const [scrapStudies, setScrapStudies] = useState([]);
    const [studiesChanged, setStudiesChanged] = useState(false);

    let accessToken = localStorage.getItem('accessToken');
    let isLoggedInUserId = localStorage.getItem('isLoggedInUserId');

    const location = useLocation();
    const pageparams = location.state ? location.state.page : 1;
    const [page, setPage] = useState(pageparams);
    const [totalElements, setTotalElements] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [totalPages, setTotalPages] = useState(1);

    const fetchScrapStudies = async (pageNumber) => {
        axios
            .get(`/api/members/scraps`, {
                params: {page: pageNumber},
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((response) => {
                setScrapStudies(response.data.studyRecruitPosts);
                setTotalElements(response.data.totalElements); // 전체 개수 업데이트
                setTotalPages(response.data.totalPages); // 전체 페이지 수 업데이트
            })
            .catch((error) => {
                console.error("데이터 가져오기 실패:", error);
            });
    };

    useEffect(() => {
        fetchScrapStudies(page);
    }, [page]);

    const handlePageChange = (newPage) => {
        setPage(newPage); // 페이지 상태를 업데이트
    };

    const toggleScrap = useCallback((index) => {
        const study = scrapStudies[index];
        toggleScrapStatus(
            study,
            accessToken,
            isLoggedInUserId,
            (isScrapped) => {
                if (!isScrapped) {
                    // 스크랩 해제된 경우 리스트에서 제거
                    setScrapStudies((prevStudies) => prevStudies.filter((_, i) => i !== index));
                } else {
                    // 스크랩 유지된 경우 리스트 업데이트
                    setScrapStudies((prevStudies) => {
                        const updatedStudies = [...prevStudies];
                        updatedStudies[index] = {...study, isScrapped};
                        return updatedStudies;
                    });
                }
            },
            (error) => {
                console.error("스크랩 상태 변경 실패:", error);
            }
        );
    }, [scrapStudies, accessToken, isLoggedInUserId]);

    return (
        <div>
            <Header showSideCenter={true}/>
            <div className="container">
                <Category/>
                <div className="main_container">
                    <p id={"entry-path"}> 홈 > 마이페이지 > 스크랩한 스터디 </p>
                    <Backarrow subname={"스크랩한 스터디"}/>
                    <div className="content_container">
                        <div className="study_list">
                            {scrapStudies.length === 0 && (
                                <div className="no_scrap">
                                    <p>스크랩한 스터디가 없습니다.</p>
                                </div>
                            )}
                            {scrapStudies.map((study, index) => (
                                <StudyListItem key={study.id} studies={study} index={index}
                                               toggleScrap={() => toggleScrap(index)}/>
                            ))}
                        </div>
                    </div>
                    {scrapStudies.length !== 0 && (
                        <div className="pagingDiv">
                            <Paging page={page} totalItemCount={totalElements} itemsPerPage={itemsPerPage}
                                    totalPages={totalPages}
                                    handlePageChange={handlePageChange}/>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
        ;
}
export default MyScrapStudy;