import React, {useState, useEffect, useCallback} from "react";
import {useLocation} from "react-router-dom";
import Category from "../../components/repeat_etc/Category.js";
import "../../css/study_css/MyParticipateStudy.css";
import Header from "../../components/repeat_etc/Header";
import axios from "axios";
import Backarrow from "../../components/repeat_etc/Backarrow";
import StudyListItem from "../../components/study/StudyListItem";
import {toggleScrapStatus} from "../../util/scrapHandler";
import Paging from "../../components/repeat_etc/Paging";

const MyApplyStudy = ({sideheader}) => {

    const [studies, setStudies] = useState([]);
    const accessToken = localStorage.getItem('accessToken');
    const isLoggedInUserId = localStorage.getItem('isLoggedInUserId');

    const location = useLocation();
    const pageParams = location.state ? location.state.page : 1;
    const [page, setPage] = useState(pageParams);
    const [totalElements, setTotalElements] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [totalPages, setTotalPages] = useState(1);

    const fetchApplyStudies = async (pageNumber) => {
        axios.get("/api/members/studies/apply", {
            params: {page: pageNumber},
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log(res.data);
                setTotalElements(res.data.totalElements); // 전체 개수 업데이트
                setTotalPages(res.data.totalPages); // 전체 페이지 수 업데이트
                setStudies(res.data.studyRecruitPosts);
                localStorage.setItem("ApplyStudy", JSON.stringify(res.data.studyRecruitPosts));
            })
            .catch((error) => {
                console.error("데이터 가져오기 실패:", error);
            });
    };

    useEffect(() => {
        fetchApplyStudies(page);
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

    const myapplystudylist = () => {
        return (
            <div className="study_list">
                {studies.length === 0 && (
                    <div className="no_study">
                        <p>스터디 신청 내역이 없습니다.</p>
                    </div>
                )}
                {studies.map((study, index) => (
                    <StudyListItem key={study.studyId} studies={study} index={index}
                                   toggleScrap={() => toggleScrap(index)}/>
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
                    <p id={"entry-path"}> 마이페이지 > 스터디 신청 내역 </p>
                    <Backarrow subname={"스터디 신청 내역"}/>
                    <div className="content_container">
                        {myapplystudylist()}
                    </div>

                    {studies.length !== 0 && (
                        <div className="pagingDiv">
                            <Paging page={page} totalItemCount={totalElements} itemsPerPage={itemsPerPage}
                                    totalPages={totalPages}
                                    handlePageChange={handlePageChange}/>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
export default MyApplyStudy;
