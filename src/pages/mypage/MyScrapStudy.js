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
import Category from "../../components/repeat_etc/Category";

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
                if (!isScrapped) {
                    // 스크랩 해제된 경우 리스트에서 제거
                    setScrapStudies((prevStudies) => prevStudies.filter((_, i) => i !== index));
                } else {
                    // 스크랩 유지된 경우 리스트 업데이트
                    setScrapStudies((prevStudies) => {
                        const updatedStudies = [...prevStudies];
                        updatedStudies[index] = { ...study, isScrapped };
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
                                <StudyListItem key={study.id} studies={study} index={index} toggleScrap={() => toggleScrap(index)} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
}
export default MyScrapStudy;