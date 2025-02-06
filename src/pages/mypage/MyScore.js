import Header from "../../components/repeat_etc/Header";
import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import Category from "../../components/repeat_etc/Category";
import Backarrow from "../../components/repeat_etc/Backarrow";
import axios from "axios";
import { useMyPageContext } from "../../components/datacontext/MyPageContext";

const MyScore = () => {
    const [studyId, setStudyId] = useState(null); // 초기값을 null로 설정
    const [evaluation, setEvaluation] = useState([]);

    const accessToken = localStorage.getItem('accessToken');

    const { participateStudies } = useMyPageContext();
    const completedStudies = participateStudies.filter(study => study.progressType === "COMPLETED");

    const location = useLocation();
    const { credibility } = location.state;

    // 평가 내역 가져오기
    const fetchMyScore = (id) => {
        if (!id) {
            console.error("완료된 스터디가 없습니다.");
            return;
        }

        const url = `/api/studies/${id}/evaluations/received`;

        axios.get(url, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            console.log("선택된 스터디의 평가 내역 가져오기 성공", response.data);
            setEvaluation(response.data);
        }).catch((error) => {
            console.error("평가 내역 가져오기 실패", error.response?.data || error.message);
        });
    };

    // 스터디 목록이 로드되면 초기값 설정
    useEffect(() => {
        if (completedStudies.length > 0 && studyId === null) {
            setStudyId(completedStudies[0].studyId); // 첫 번째 완료된 스터디 선택
        }
    }, [completedStudies]);

    // studyId가 변경될 때마다 평가 내역 요청
    useEffect(() => {
        if (studyId) {
            fetchMyScore(studyId);
        }
    }, [studyId]);

    const handleStudySelect = (event) => {
        setStudyId(event.target.value);
    };

    return (
        <div>
            <Header showSideCenter={true} />
            <div className="container">
                <Category />
                <div className="main_myscore_container">
                    <Backarrow subname={"개인 신뢰도"} />
                    <div className="sub_container">
                        <h1 className="my_score">내 신뢰도는 {credibility}입니다.</h1>
                        <div className="my_parti_study_select">
                            <h2 style={{ marginRight: "10px" }}>팀원 평가 내역</h2>
                            <select style={{ marginBottom: "30px" }} onChange={handleStudySelect} value={studyId}>
                                {completedStudies.map((study) => (
                                    <option key={study.studyId} value={study.studyId}>
                                        {study.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="evaluate_table_wrapper">
                            <table className="evaluate_table">
                                <thead>
                                <tr>
                                    <th className="member_name">팀원 이름</th>
                                    <th className="star_rating">점수</th>
                                    <th className="reason">사유</th>
                                </tr>
                                </thead>
                                <tbody>
                                {evaluation.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.nickname}</td>
                                        <td>{item.starRating}</td>
                                        <td>{item.starReason}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyScore;
