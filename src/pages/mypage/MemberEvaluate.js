import Header from "../../components/repeat_etc/Header";
import Category from "../../components/repeat_etc/Category";
import React, { useEffect, useState } from "react";
import Backarrow from "../../components/repeat_etc/Backarrow";
import { useLocation } from "react-router-dom";
import MemberEvaluateInsert from "../../components/evaluate/MemberEvaluateInsert";
import "../../css/study_css/MyParticipateStudy.css";
import Loading from "../../components/repeat_etc/Loading";

import axios from "axios";
import {useTeamBlogContext} from "../../components/datacontext/TeamBlogContext";

const MemberEvaluate = () => {
    const accessToken = localStorage.getItem('accessToken');

    const [evaluation, setEvaluation] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    const { member, loading } = useTeamBlogContext();

    const study = useLocation();
    const { studyId } = study.state;

    const fetchEvaluations = () => {
        axios.get(`/api/studies/${studyId}/evaluations/given`, {
            withCredentials: true,
            headers: { 'Authorization': `Bearer ${accessToken}` }
        })
            .then((res) => {
                console.log("평가 내역 갱신 성공:", res.data);
                setEvaluation(res.data);
            })
            .catch((error) => {
                console.error("평가 내역 불러오기 실패:", error);
            });
    };

    useEffect(() => {
        fetchEvaluations();
    }, [studyId]);

    const handleOpenPopup = (member) => {
        console.log(member);
        setSelectedMember(member);
        setShowPopup(true);
    };
    const handleClosePopup = () => {
        setShowPopup(false);
        fetchEvaluations(); // 팝업이 닫히면 평가 내역 다시 가져오기
    };

    return (
        <div>
            <Header showSideCenter={true} />
            <div className="container">
                <Category />
                <div className="main_container">
                    <p id={"entry-path"}> 스터디 참여 내역 > 팀원 평가 </p>
                    <Backarrow subname={"팀원 평가"} />
                    <div className="evaluate">
                        {loading ? (
                            <Loading />
                        ) : (
                            <table className="evaluate_table">
                                <thead>
                                <tr>
                                    <th>팀원 이름</th>
                                    <th>점수</th>
                                    <th>사유</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {evaluation.map((eva, index) => (
                                    <tr className="evaluate_list" key={index}>
                                        <td className="member_name">{eva.nickname}</td>
                                        <td className="member_rating">
                                            {eva.evaluationStatus ? eva.starRating : "X"}
                                        </td>
                                        <td className="member_evaluate_reason">
                                            {eva.evaluationStatus ? eva.starReason : "아직 평가되지 않았습니다."}
                                        </td>
                                        <td>
                                            {eva.evaluationStatus ? (
                                                "평가 완료"
                                            ) : (
                                                <button className="evaluate_button" onClick={() => handleOpenPopup(eva)}>
                                                    팀원 평가하기
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}

                        {showPopup && (
                            <div className="popup-overlay">
                                <div className="popup-content">
                                    <MemberEvaluateInsert
                                        studyId={studyId}
                                        member={selectedMember}
                                        onClose={handleClosePopup} // 팝업 닫기 함수 전달
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MemberEvaluate;
