import React, {useState, useEffect, useCallback} from "react";
import {useParams, Link, useNavigate} from "react-router-dom";
import Header from "../../components/repeat_etc/Header";
import "../../css/study_css/StudyDetail.css";
import "../../css/comment_css/Comment.css";

import StudyInfo from "../../components/study/StudyInfo";
import StudyEdit from "../../pages/studypage/StudyEdit";
import Backarrow from "../../components/repeat_etc/Backarrow";
import Comment from "../../components/comment/Comment";
import {useLocation} from "react-router-dom";
import axios from "axios";
import StudyApplyList from "../../pages/studypage/StudyApplyList";


const StudyDetail = ({sideheader}) => {

    const location = useLocation();
    let studyId = location.state;
    console.log("studyId : ", studyId);
    const [studyItem, setStudyItem] = useState();
    const navigate = useNavigate();
    const {id} = useParams();
    console.log("studyId : ", id);
    const [studies, setStudies] = useState([]);
    const [studyDetail, setStudyDetail] = useState([]);
    const [isApply, setIsApply] = useState(false);
    const accessToken = localStorage.getItem('accessToken');
    const isLoggedInUserId = localStorage.getItem('isLoggedInUserId');
    const [applyReason, setApplyReason] = useState([]);
    const [isRecruiter, setIsRecruiter] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    useEffect(() => {
        if (studyId === null) {
            studyId = id;
        }

        axios.get(`/api/studies/${id}`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then((res) => {
            setStudyItem(res.data);
            console.log(res.data);
            if (res.data.isAuthor) {
                setIsRecruiter(true);
            }
        })
            .catch((error) => {
                alert("로그인 해 주세요.");
                // navigate('/login');
                console.error("스터디 세부 데이터 가져오기 실패:", error);
            });

        axios.get(`/api/api/v2/studies/${studyId}/study-member`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then((res) => {
            if (res.data.data.length > 0) {   // 스터디원이 있을 경우 -> 모집 완료
                console.log("모집 완료");
                setIsCompleted(true);
            }
        })
            .catch((error) => {
                console.error("스터디 모집 여부 데이터 가져오기 실패:", error);
            });

        axios.get(`/api/api/v2/studies/${studyId}/apply-reason`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then((res) => {
            const result = res.data;
            if (result.length !== 0) {   // 지원했으면 true
                console.log("지원 O");
                setIsApply(true);
                setApplyReason(res.data.applyReason);
            }
        })
            .catch((error) => {
                console.error("스터디 지원 여부 데이터 가져오기 실패:", error);
            });
    }, [id]);

    const handleStudyDelete = useCallback(() => {
        const confirmDelete = window.confirm("정말로 스터디를 삭제하시겠습니까?");
        if (confirmDelete) {
            axios.delete(`/api/studies/${id}`,
                {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                })
                .then((res) => {
                    console.log("API Response:", res.data);
                    console.log("삭제성공");
                    setStudies(res.data);
                    alert("스터디 모집글이 삭제되었습니다.");
                }).catch((error) => {
                    console.log(error);
                })
            }
    }, [id]);

    return (
        <div>
            <Header showSideCenter={true}/>
            <div className="study_detail_container">
                <h1>STAR TOUR STORY</h1>
                <div className="arrow_left">
                    <Backarrow/>
                </div>
                <div className="study_detail">
                    {studyItem && (
                        <div key={studyItem.id}>
                            <StudyInfo
                                study={studyItem}
                                isRecruiter={isRecruiter}
                                setStudies={setStudies}
                            />
                            <div className="study_intro">
                                <div style={{fontWeight: "bold"}}>스터디 소개</div>
                                {studyItem && (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: studyItem.content.replace(/\n/g, "<br>"),
                                        }}
                                    />
                                )}
                            </div>
                            {isApply === true && applyReason && (
                                <div className="study_apply_reason">
                                    <div>나의 지원동기 및 각오</div>
                                    <div>{applyReason}</div>
                                </div>
                            )}
                            {isApply === false && isRecruiter === false && isCompleted === false && (
                                <div className="btn">
                                    <Link
                                        to={`/studyapplyform/${studyItem.studyId}`}
                                        style={{
                                            textDecoration: "none",
                                            color: "inherit",
                                        }}
                                    >
                                        <button className="apply_btn">참여하기</button>
                                    </Link>
                                </div>
                            )}
                            {isApply === false && isRecruiter === true && (
                                <div className="btn">
                                    <Link
                                        to={`/StudyApplyList/${studyItem.id}`}
                                        style={{
                                            textDecoration: "none",
                                            color: "inherit",
                                        }}
                                    >
                                        <button className="apply_btn">신청자 조회</button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="comment_container">
                <Comment type="STUDY" />
            </div>
        </div>
    );
};

export default StudyDetail;