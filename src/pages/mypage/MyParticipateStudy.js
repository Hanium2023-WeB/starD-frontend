import React, {useState, useEffect, useRef, useCallback} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Category from "../../components/repeat_etc/Category.js";
import App from "../../App.js";
import "../../css/study_css/MyParticipateStudy.css";
import Header from "../../components/repeat_etc/Header";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import LikeButton from "../../components/repeat_etc/LikeButton";
import ScrapButton from "../../components/repeat_etc/ScrapButton";
import Paging from "../../components/repeat_etc/Paging";
import Backarrow from "../../components/repeat_etc/Backarrow";
import Loading from "../../components/repeat_etc/Loading";
import StudyListItem from "../../components/study/StudyListItem";
import {toggleScrapStatus} from "../../util/scrapHandler";
const MyParticipateStudy = ({sideheader}) => {
    const accessToken = localStorage.getItem('accessToken');
    const isLoggedInUserId = localStorage.getItem('isLoggedInUserId');
    const [ApplyMemberList, setApplyMemberList] = useState([]);
    const [ApplyStudyList, setApplyStudyList] = useState([]);
    const [studies, setStudies] = useState([]);
    const [scrapStates, setScrapStates] = useState([]);
    const [likeStates, setLikeStates] = useState([]);
    const [scrapTwoStates, setScrapTwoStates] = useState([]);
    const [likeTwoStates, setLikeTwoStates] = useState([]);
    const location = useLocation();
    const studyState = location.state;
    const [studiesChanged, setStudiesChanged] = useState(false);

    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const navigate = useNavigate();
    const [ParticipateState, setParticipatedState] = useState({});

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (location.state && location.state.acceptedMembers != null) {
            const Accepted_Members = location.state.acceptedMembers;
            setParticipatedState(prevState => {
                const StudyId = location.state.studyId;
                const newState = {...prevState};
                newState[StudyId] = Accepted_Members;
                localStorage.setItem("ParticipateState", JSON.stringify(newState));

                return newState;
            });
        }

    }, []);

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

    const handlePageChange = ({page, itemsPerPage, totalItemsCount}) => {

        setPage(page);
        const result = axios.get("/api/user/mypage/studying", {
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

            const res_like = axios.get("/api/mypage/study/star-scrap", { // 공감
                params: {
                    page: page,
                    status: "participate",
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
                    status: "participate",
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

        }).catch((error) => {
            console.error("데이터 가져오기 실패:", error);
        });


        setItemsPerPage(itemsPerPage);
        setCount(totalItemsCount);
    };

    useEffect(() => {
        setLoading(true);
        axios.get("/api/members/studies/participate", {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("모집완료된 스터디, 참여멤버 전송 성공 : ", res.data.studyRecruitPosts);
                setLoading(false);
                setStudies(res.data.studyRecruitPosts);
                localStorage.setItem("MyParticipatedStudy", JSON.stringify(res.data.content));

                setItemsPerPage(res.data.currentPage);
                setCount(res.data.totalPages);
            })
            .catch((error) => {
                console.error("모집완료된 스터디 가져오기 실패:", error);
            });

    }, [accessToken]);

    const goNextTeamBlog = (item) => {
        navigate(`/${item.studyId}/teamblog`, {
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
                {studies.map((study, index) => (
                    <StudyListItem key={study.studyId} studies={study} index={index} toggleScrap={() => toggleScrap(index)} isParticipateStudy={true} goEvaluationPage={goEvaluationPage} goNextTeamBlog={goNextTeamBlog} />
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
                    <p id={"entry-path"}> 홈 > 스터디 참여 내역 </p>
                    <Backarrow subname={"스터디 참여 내역"}/>
                    {loading ? <Loading/>:(
                        <div className="content_container">
                            {mypartistudylist()}
                        </div>
                    )
                    }

                </div>
            </div>
            <div className={"paging"}>
                <Paging page={page} totalItemCount={count} itemsPerPage={itemsPerPage}
                        handlePageChange={handlePageChange}/>
            </div>
        </div>
    );
};
export default MyParticipateStudy;
