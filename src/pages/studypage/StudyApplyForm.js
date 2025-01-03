import React, {useState, useEffect, useRef} from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import Header from "../../components/repeat_etc/Header";
import "../../css/study_css/StudyDetail.css";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import StudyInfo from "../../components/study/StudyInfo";
import Backarrow from "../../components/repeat_etc/Backarrow";
import axios from "axios";

const StudyApplyForm = ({sideheader}) => {

    const { id } = useParams();
    console.log(id);
    // const dataId = useRef(0);
    const contentRef = useRef();
    const [studies, setStudies] = useState([]);
    const [studyDetail, setStudyDetail] = useState([]);
    const [content, setContent] = useState("");
    const accessToken = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    const isLoggedInUserId = localStorage.getItem('isLoggedInUserId');
    const [ApplyMem, setApplyMem] = useState([]);

    useEffect(() => {

        // 백엔드 REST API 호출 코드
        axios.get(`/api/api/v2/studies/${id}`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then((res) => {
            console.log(res.data);
            setStudyDetail(res.data);

            if (res.data.recruiter.id === isLoggedInUserId) {
                console.log("자기 자신의 글");
            }
        }).catch((error) => {
            console.error(error);
        });
    }, [id]);

    const handleSubmit = () => {

        if (content.length < 1) {
            contentRef.current.focus();
            return;
        }

        axios.post(`/api/studies/${id}/applications`, {
            introduce:content
        }, {
            params: {
                studyId: id
            },
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then((res) => {
            console.log(res.data);
            navigate("/mypage/apply-study");
        })
            .catch((error) => {
                console.error("데이터 가져오기 실패:", error);
            });

    };

    const studyinfo = () => {
        return (
            <div className="study_detail">
                <div key={studyDetail.id}>
                    {studyDetail.length > 0 && (
                        <StudyInfo study={studyDetail}/>
                    )}
                    <div className="study_apply_reason">
                        <div>지원 동기 및 각오</div>
                        <textarea
                            placeholder="지원 동기 및 각오를 입력해주세요."
                            ref={contentRef}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <div className="btn">
                        <button
                            className="apply_btn"
                            onClick={handleSubmit}>
                           제출하기
                        </button>
                    </div>
                </div>

            </div>
        );
    };
    return (
        <div>
            <Header showSideCenter={true}/>
            <div className="study_detail_container">
                <h1>STAR TOUR STORY</h1>
                <div className="arrow_left">
                    <Backarrow/>
                </div>
                {studyinfo()}
            </div>
        </div>
    );
};
export default StudyApplyForm;
