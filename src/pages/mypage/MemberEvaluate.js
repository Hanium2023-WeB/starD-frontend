import Header from "../../components/repeat_etc/Header";
import Category from "../../components/repeat_etc/Category";
import React, { useEffect, useState } from "react";
import Backarrow from "../../components/repeat_etc/Backarrow";
import { useLocation } from "react-router-dom";
import MemberEvaluateInsert from "../../components/evaluate/MemberEvaluateInsert";
import "../../css/study_css/MyParticipateStudy.css";
import Loading from "../../components/repeat_etc/Loading";

import axios from "axios";

const MemberEvaluate = () => {
    const accessToken = localStorage.getItem('accessToken');

    const [loading, setLoading] = useState(true);

    const [evaluation, setEvaluation] = useState([]);
    const [showEvaluateInsert, setShowEvaluateInsert] = useState(false);

    const [Member, setMember] = useState([]);

    const study = useLocation();
    const { studyId } = study.state;

    const handleMoveToEvaluateInsert = (e) => {
        e.preventDefault();
        setShowEvaluateInsert(!showEvaluateInsert); // Toggle the showEvaluateInsert state
    };


    useEffect(() => {
        setLoading(true);

        axios.get(`/api/api/v2/studies/${studyId}/study-member`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("참여멤버 get 성공 : ", res.data);

                const studymemberList = res.data;

                setMember(studymemberList.data);

            })
            .catch((error) => {
                console.error("참여멤버 get 실패:", error);
            });

    }, [accessToken]);

    useEffect(() => {
        setLoading(true);

        axios.get(`/api/rate/member/${studyId}`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("평가 내역 get 성공 : ", res.data);

                setEvaluation(res.data);

                setLoading(false);
            })
            .catch((error) => {
                console.error("평가 내역 불러오기 실패 : ", error);
            });
    }, [accessToken, studyId]);

    return (
        <div>
            <Header showSideCenter={true} />
            <div className="container">
                <Category />
                <div className="main_container">
                    <p id={"entry-path"}> 스터디 참여 내역 > 팀원 평가 </p>
                    <Backarrow subname={"팀원 평가"} />
                    <div className="evaluate">
                        {loading ? <Loading/> : (
                            showEvaluateInsert ? ( // Render MemberEvaluateInsert when showEvaluateInsert is true
                                <MemberEvaluateInsert studyId={studyId} members={Member}
                                    completeEvaluation={evaluation} />
                            ) : evaluation.length === 0 ? (
                                <>
                                    <p>평가 내역이 없습니다.<br/> 팀원 평가를 진행해주세요.</p>
                                </>
                            ) : (
                                <table className="evaluate_table">
                                    <thead>
                                    <tr>
                                        <th>팀원 이름</th>
                                        <th>점수</th>
                                        <th>사유</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {evaluation.map((eva, index) => (
                                        <tr className="evaluate_list">
                                            <td className="member_name">{eva.target.nickname}</td>
                                            <td className="member_rating">{eva.starRating}</td>
                                            <td className="member_evaluate_reason">{eva.reason}</td>
                                        </tr>
                                    ))}

                                    {/*{members.map((member) => (*/}
                                    {/*    <tr className="evaluate_list">*/}
                                    {/*        <td className="community_category">{}</td>*/}
                                    {/*        <td className="community_nickname">{}</td>*/}
                                    {/*        <td className="community_datetime">{}</td>*/}
                                    {/*    </tr>*/}
                                    </tbody>
                                </table>
                            )
                        )}

                        {evaluation.length < Member.length - 1 && !showEvaluateInsert && (
                            <button className="evaluate_button" onClick={handleMoveToEvaluateInsert}>팀원 평가하기</button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MemberEvaluate;
