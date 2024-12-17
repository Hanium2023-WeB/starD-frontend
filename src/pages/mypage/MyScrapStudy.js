import Header from "../../components/repeat_etc/Header";
import React, {useCallback, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import "../../css/community_css/Community.css";
import SearchBar from "../../components/community/CommSearchBar";
import PostInsert from "../../components/community/PostInsert";
import PostListItem from "../../components/community/PostListItem";
import axios from "axios";
import Backarrow from "../../components/repeat_etc/Backarrow";
import LikeButton from "../../components/repeat_etc/LikeButton";
import ScrapButton from "../../components/repeat_etc/ScrapButton";
import "../../css/study_css/MyOpenStudy.css";
import "../../css/study_css/StudyDetail.css";
import StudyListItem from "../../components/study/StudyListItem";
import {toggleScrapStatus} from "../../util/scrapHandler";

const MyScrapStudy = () => {
    const [scrapStudies, setScrapStudies] = useState([]);
    const [studiesChanged, setStudiesChanged] = useState(false);

    let accessToken = localStorage.getItem('accessToken');
    let isLoggedInUserId = localStorage.getItem('isLoggedInUserId');

    useEffect(() => {
        axios.get("/api/members/scraps", {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => {
                console.log(response.data.studyRecruitPosts);
                setScrapStudies(response.data.studyRecruitPosts);
                localStorage.setItem("studies", JSON.stringify(scrapStudies));
            })
            .catch(error => {
                console.error("데이터 가져오기 실패:", error);
            });

    }, []);

    // useEffect(() => {
    //     if (studiesChanged) {
    //         localStorage.setItem("studies", JSON.stringify(scrapStudies));
    //         localStorage.setItem("ScrapStudies", JSON.stringify(scrapStates));
    //         // Reset studiesChanged to false
    //         setStudiesChanged(false);
    //     }
    // }, [studiesChanged, scrapStudies, scrapStates]);

    const toggleScrap = useCallback((index) => {
        const study = scrapStudies[index];
        toggleScrapStatus(
            study,
            accessToken,
            isLoggedInUserId,
            (isScrapped) => {
                scrapStudies((prevStudies) => {
                    const updatedStudies = [...prevStudies];
                    updatedStudies[index] = { ...study, isScrapped };
                    return updatedStudies;
                });
            },
            (error) => {
                console.error("스크랩 상태 변경 실패:", error);
            }
        );
    }, [scrapStudies, accessToken, isLoggedInUserId]);

    return (
        <div className={"main_wrap"} id={"community"}>
            <Header showSideCenter={true}/>
            <div className="study_detail_container">
                <h1>STAR TOUR STORY</h1>
                <div className="arrow_left">
                    <p id={"entry-path"}> 홈 > 스터디 리스트 </p>
                    <Backarrow subname={"MY SCRAP STUDY"}/>
                </div>
                <div className="content_container">
                    <div className="study_list">
                        {scrapStudies.length === 0 && (
                            <div className="no_scrap">
                                <h2>스크랩한 스터디가 없습니다.</h2>
                            </div>
                        )}
                        {scrapStudies.map((study, index) => (
                            <StudyListItem key={study.id} studies={study} index={index} toggleScrap={() => toggleScrap(index)} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
        ;
}
export default MyScrapStudy;