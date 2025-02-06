import React, {useState, useEffect, useCallback} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import ScrapButton from "../../components/repeat_etc/ScrapButton";
import "../../css/study_css/StudyDashBoard.css";
import {toggleScrapStatus} from "../../util/scrapHandler";

const HomeDashBoard = () => {

    const accessToken = localStorage.getItem('accessToken');
    const isLoggedInUserId = localStorage.getItem('isLoggedInUserId');

    const [studies, setStudies] = useState([]);

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
        axios.get("/api/studies/teamBlogs", {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("모집완료된 스터디 전송 성공 : ", res.data);
                setStudies(res.data);
            })
            .catch((error) => {
                console.error("모집완료된 스터디 가져오기 실패:", error);
            });

    }, []);

    const goNextTeamBlog = (item) => {
        console.log("팀블로그에 넘겨주는 item:", item.studyId);
        navigate(`/teamblog/${item.studyId}`, {
            state: {
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
                    {studies.length === 0 ? (
                        <span style={{fontSize:"20px"}}>진행 중인 스터디가 없습니다.</span>
                    ) : (
                        studies.map((study, index) => (
                            <div className="dashboardlist" key={study.studyId} onClick={() => goNextTeamBlog(study)}>
                                <div className="dashboard_header">
                                    <div className="dashboard1">
                                        <div className="dashboard2">{study.title}</div>
                                        <div className="dashboard3">🧳&nbsp;
                                            {calculateDateDifference(study.activityStart, study.activityDeadline)}일간의 스터디
                                        </div>
                                        {study.progressType === "IN_PROGRESS" ? (
                                            <div className="dashboard4">진행 중</div>
                                        ) : (
                                            <div className="dashboard4">진행 완료</div>
                                        )}
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
                                <div className={"contnet"}>
                                    <div className="list_deadline">
                                        마감일 | {study.activityDeadline} / 팀장: {study.nickname}
                                    </div>
                                    <div className={"dashboardsubdetail"}>
                                        <div className="list_tag" style={{ marginRight: "5px" }}>{study.field}</div>
                                        <div className="list_onoff">{study.activityType}</div>
                                        <div className="stroke"></div>
                                        <div className="list_founder"></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="main_dash_container">
                <div className={"View_All"}>
                    <div id={"view-subtitle"}>✔️ 참여중인 스터디</div>
                    <div onClick={viewAllMyParticipateStudy} className="see_all_btn">전체보기 >></div>
                </div>
                <div className="dashboard_container">
                    {mypartistudylist()}
                </div>
            </div>
        </div>
    );
};
export default React.memo(HomeDashBoard);
