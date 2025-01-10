import React, {useState, useEffect, useCallback} from "react";
import {Link} from "react-router-dom";
import Category from "../../components/repeat_etc/Category.js";
import "../../css/study_css/MyParticipateStudy.css";
import Header from "../../components/repeat_etc/Header";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from "@fortawesome/free-solid-svg-icons";
import LikeButton from "../../components/repeat_etc/LikeButton";
import ScrapButton from "../../components/repeat_etc/ScrapButton";
import axios from "axios";
import Backarrow from "../../components/repeat_etc/Backarrow";
import ImageComponent from "../../components/image/imageComponent";
import StudyListItem from "../../components/study/StudyListItem";
import {toggleScrapStatus} from "../../util/scrapHandler";

const MyApplyStudy = ({sideheader}) => {

    const [studies, setStudies] = useState([]);
    const [scrapStates, setScrapStates] = useState([]);
    const [likeStates, setLikeStates] = useState([]);
    const [studiesChanged, setStudiesChanged] = useState(false);
    const accessToken = localStorage.getItem('accessToken');
    const isLoggedInUserId = localStorage.getItem('isLoggedInUserId');
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [scrapTwoStates, setScrapTwoStates] = useState([]);

    useEffect(() => {
        axios.get("/api/members/studies/apply", {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("전송 성공 : ", res.data.studyRecruitPosts);
                setStudies(res.data.studyRecruitPosts);
                localStorage.setItem("ApplyStudy",JSON.stringify(res.data.studyRecruitPosts));
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

    const myapplystudylist = () => {
        return (
            <div className="study_list">
                {studies.length === 0 && (
                    <div className="no_study">
                        <p>스터디 신청 내역이 없습니다.</p>
                    </div>
                )}
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
                    <p id={"entry-path"}> 홈 > 스터디 신청 내역 </p>
                    <Backarrow subname={"스터디 신청 내역"}/>
                    <div className="content_container">
                        {myapplystudylist()}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default MyApplyStudy;
