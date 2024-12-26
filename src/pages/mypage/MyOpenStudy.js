import React, {useState, useEffect, useRef, useCallback} from "react";
import {Link, useLocation} from "react-router-dom";
import Category from "../../components/repeat_etc/Category.js";
import "../../css/study_css/MyOpenStudy.css";
import Header from "../../components/repeat_etc/Header";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from "@fortawesome/free-solid-svg-icons";
import LikeButton from "../../components/repeat_etc/LikeButton";
import ScrapButton from "../../components/repeat_etc/ScrapButton";
import Paging from "../../components/repeat_etc/Paging";
import Pagination from "../../css/study_css/Pagination.css";
import axios from "axios";
import Backarrow from "../../components/repeat_etc/Backarrow";
import ImageComponent from "../../components/image/imageComponent";
import StudyListItem from "../../components/study/StudyListItem";
import {toggleScrapStatus} from "../../util/scrapHandler";

const MyOpenStudy = ({sideheader}) => {
    const [studies, setStudies] = useState([]);
    const [scrapStates, setScrapStates] = useState([]);
    const [likeStates, setLikeStates] = useState([]);
    const [scrapTwoStates, setScrapTwoStates] = useState([]);
    const [likeTwoStates, setLikeTwoStates] = useState([]);
    const location = useLocation();
    const [studiesChanged, setStudiesChanged] = useState(false);
    const accessToken = localStorage.getItem('accessToken');
    const isLoggedInUserId = localStorage.getItem('isLoggedInUserId');
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(9);

    const handlePageChange = ({page, itemsPerPage, totalItemsCount}) => {
        setPage(page);
        const result = axios.get("/api/user/mypage/open-study", {
            params: {
                page: page,
            }, withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        result.then((response) => {
            setStudies(response.data.content);

            setItemsPerPage(response.data.pageable.pageSize);
            setCount(response.data.totalElements);

            if (accessToken && isLoggedInUserId) {
                const res_like = axios.get("/api/mypage/study/star-scrap", { // 공감
                    params: {
                        page: page,
                        status: "open",
                        type: "star",
                    },
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                const res_scrap = axios.get("/api/mypage/study/star-scrap", { // 스크랩
                    params: {
                        page: page,
                        status: "open",
                        type: "scrap",
                    },
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                setLikeTwoStates(res_like)
                setScrapTwoStates(res_scrap);

                const studyList = response.data.content;

                const updateStudies = studyList.map((study, index) => {
                    study.like = likeTwoStates[index];
                    study.scrap = scrapTwoStates[index];
                    return study;
                });

                setStudies(updateStudies);
            }
        }).catch((error) => {
            console.error("데이터 가져오기 실패:", error);
        });

        setItemsPerPage(itemsPerPage);
        setCount(totalItemsCount);
    };

    useEffect(() => {
        axios.get("/api/members/studies/open", {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("전송 성공 : ", res.data.studyRecruitPosts);

                setStudies(res.data.studyRecruitPosts);
                localStorage.setItem("ApplyStudy",JSON.stringify(res.data.studyRecruitPosts));

				setItemsPerPage(res.data.currentPage);
				setCount(res.data.totalPages);
            })
            .catch((error) => {
                console.error("데이터 가져오기 실패:", error);
            });
    }, [accessToken, likeStates, scrapStates]);

    const toggleScrap = useCallback((index) => {
        const study = studies[index];
        toggleScrapStatus(
            study,
            accessToken,
            isLoggedInUserId,
            (isScrapped) => {
                setStudies((prevStudies) => {
                    const updatedStudies = [...prevStudies];
                    updatedStudies[index] = { ...study, isScrapped };
                    return updatedStudies;
                });
            },
            (error) => {
                console.error("스크랩 상태 변경 실패:", error);
            }
        );
    }, [studies, accessToken, isLoggedInUserId]);

    const mypartistudylist = () => {
        return (
            <div className="study_list">
                {studies.map((study, index) => (
                    <StudyListItem key={study.studyId} studies={study} index={index} toggleScrap={() => toggleScrap(index)} />
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
                    <p id={"entry-path"}> 홈 > 스터디 개설 내역 </p>
                    <Backarrow subname={"스터디 개설 내역"}/>
                    <div className="content_container">
                        {mypartistudylist()}
                    </div>
                </div>

            </div>
            <div className={"paging"}>
                <Paging page={page} totalItemCount={count} itemsPerPage={itemsPerPage}
                        handlePageChange={handlePageChange}/>
            </div>
        </div>
    );
};
export default MyOpenStudy;
