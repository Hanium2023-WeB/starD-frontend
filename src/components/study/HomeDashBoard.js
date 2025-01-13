import React, {useState, useEffect, useRef, useCallback} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Category from "../../components/repeat_etc/Category.js";
import App from "../../App.js";
import "../../css/study_css/MyParticipateStudy.css";
import Header from "../../components/repeat_etc/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import LikeButton from "../../components/repeat_etc/LikeButton";
import ScrapButton from "../../components/repeat_etc/ScrapButton";
import Paging from "../../components/repeat_etc/Paging";
import StudyDashBoard from "../../css/study_css/StudyDashBoard.css";
import {toggleScrapStatus} from "../../util/scrapHandler";

const HomeDashBoard = () => {

    const accessToken = localStorage.getItem('accessToken');
    const isLoggedInUserId = localStorage.getItem('isLoggedInUserId');

    const [studies, setStudies] = useState([]);

    const [scrapStates, setScrapStates] = useState([]);
    const [likeStates, setLikeStates] = useState([]);
    const [scrapTwoStates, setScrapTwoStates] = useState([]);
    const [likeTwoStates, setLikeTwoStates] = useState([]);
    const location = useLocation();
    const [studiesChanged, setStudiesChanged] = useState(false);

    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const navigate = useNavigate();

    function calculateDateDifference(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const timeDifference = end - start;
        const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

        return daysDifference;
    }

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

    useEffect(() => {
        axios.get("/api/members/studies/participate", {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("모집완료된 스터디 전송 성공 : ", res.data);
                setStudies(res.data.studyRecruitPosts);
                setItemsPerPage(res.data.currentPage);
                setCount(res.data.studyRecruitPosts.length);
            })
            .catch((error) => {
                console.error("모집완료된 스터디 가져오기 실패:", error);
            });

    }, []);

    const goNextTeamBlog=(item)=>{
        console.log("팀블로그에 넘겨주는 item:", item.studyId);
        navigate(`/teamblog/${item.studyId}`, {
            state:{
                studyId: item.studyId
            }
        });
    }

    const viewAllMyParticipateStudy = () => {
        navigate(`/mypage/participate-study`)
    }

    const mypartistudylist = () => {
        return (
            <div className={"HomeDashBoard"}>
            <div className="study_list">
                {studies.map((study, index) => (
                    <div className="dashboardlist" key={study.studyId} onClick={()=>goNextTeamBlog(study)}>
                        <div className="dashboard_header">
                            <div className="dashboard_sub_header">

                                <div className="list_title">{study.title}</div>
                                <div className="dashboard_day">
                                    {calculateDateDifference(study.activityStart, study.activityDeadline)}일간의 스터디
                                </div>
                                {study.progressType === "IN_PROGRESS" ? (
                                    <div className="list_status">진행중</div>
                                ) : (<div className="list_status">진행 완료</div>)}
                            </div>
                            <div className="list_btn">
                                <div className="list_scrap">
                                    <ScrapButton
                                        scrap={studies[index].existsScrap}
                                        onClick={(event) => {
                                            event.stopPropagation(); // 이벤트 전파 중단
                                            toggleScrap(index);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={"contnet"} >
                            <div className="list_deadline">
                                마감일 | {study.activityDeadline} / 팀장: {study.nickname}
                            </div>
                            <div className={"dashboardsubdetail"}>
                            <div className="list_tag" style={{marginRight:"5px"}}>{study.field}</div>
                            <div className="list_onoff">{study.activityType}</div>
                            <div className="stroke"></div>
                            <div className="list_founder"></div>
                            </div>
                        </div>

                    </div>
                ))}

            </div>
            </div>
        );
    };
    return (
        <div>
            <div className="main_dash_container">
                     <div className={"View_All"}>
                         <div id={"view-subtitle"}>✔️ 참여중인 스터디</div>
                         <div onClick={viewAllMyParticipateStudy} className="see_all_btn">전체보기</div>
                      </div>
                    <div className="dashboard_container">
                        {mypartistudylist()}
                    </div>
            </div>
        </div>
    );
};
export default React.memo(HomeDashBoard);
