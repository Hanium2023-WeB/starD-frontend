import Header from "../../components/repeat_etc/Header";
import React, {useEffect, useState} from "react";
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

const MyScrapStudy = () => {
    const [slidePx, setSlidePx] = useState(0);
    const [scrapStudies, setScrapStudies] = useState([]);
    const [scrapStates, setScrapStates] = useState(scrapStudies.scrap);
    const [likeStates, setLikeStates] = useState([]);
    const [studiesChanged, setStudiesChanged] = useState(false);

    let accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        axios.get("/api/members/scraps", {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => {
                console.log(response.data.studyRecruitPosts);

                // const updateStudies = response.data.studyRecruitPosts.map((study, index) => {
                //     study.scrap = true;
                //     return study;
                // });

                setScrapStudies(response.data.studyRecruitPosts);
                localStorage.setItem("studies", JSON.stringify(scrapStudies));
            })
            .catch(error => {
                console.error("데이터 가져오기 실패:", error);
            });

    }, [likeStates, scrapStates]);

    useEffect(() => {
        if (studiesChanged) {
            localStorage.setItem("studies", JSON.stringify(scrapStudies));
            localStorage.setItem("ScrapStudies", JSON.stringify(scrapStates));
            // Reset studiesChanged to false
            setStudiesChanged(false);
        }
    }, [studiesChanged, scrapStudies, scrapStates]);

    const toggleScrap = (index) => {
        setScrapStudies((prevStudies) => {
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
                        {scrapStudies.map((study, index) => (
                            <StudyListItem key={study.id} studies={study} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
        ;
}
export default MyScrapStudy;