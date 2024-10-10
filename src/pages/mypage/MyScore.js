import Header from "../../components/repeat_etc/Header";
import React, {useEffect, useState} from "react";
import Category from "../../components/repeat_etc/Category";
import Backarrow from "../../components/repeat_etc/Backarrow";
import axios from "axios";

const MyScore = () => {
    const [myPartiStudy, setMyPartiStudy] = useState([]);
    const [credibility, setCredibility] = useState("");
    const [selectedStudy, setSelectedStudy] = useState(""); // 선택된 스터디 추가
    const [evaluation, setEvaluation] = useState([]);

    const accessToken = localStorage.getItem('accessToken');

    //TODO 참여한스터디 목록
    useEffect(() => {
        axios.get("/api/user/mypage/wrap-up-study", {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("진행 완료 스터디 전송 성공");
                console.log(res.data);

                setMyPartiStudy(res.data);
            })
            .catch((error) => {
                console.error('진행 완료 스터디 가져오는 중 오류 발생: ', error);
            });
    }, []);


    //TODO 개인신뢰도 가져오기
    useEffect(() => {
        axios.get("/api/user/mypage/credibility", {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json'
            }
        }).then((response) => {
            console.log("개인 신뢰도 가져오기 성공", response.data);
            setCredibility(response.data);
        }).catch((error) => {
            console.error("전송 실패", error.response.data); // Log the response data
        });
    }, []);

    //TODO 평가당한 내역 가져오기
    useEffect(() => {
        if (selectedStudy) {
            axios.get(`/api/user/mypage/rate/target/study/${selectedStudy}`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                console.log("선택된 스터디의 평가 내역 가져오기 성공", response.data);
                setEvaluation(response.data);
            }).catch((error) => {
                console.error("평가 내역 가져오기 실패", error.response.data);
            });
        }
    }, [selectedStudy, accessToken]);

    return (
        <div>
            <Header showSideCenter={true} />
            <div className="container">
                <Category/>
                <div className="main_myscore_container">
                    <Backarrow subname={"개인 신뢰도"}/>
                    <div className="sub_container">
                        <h1 className="my_score">내 신뢰도는 {credibility}입니다.</h1>
                        <div className="my_parti_study_select">
                            <h2 style={{marginRight:"10px"}}>팀원 평가 내역</h2>
                            <select style={{marginBottom:"30px"}} onChange={(e) => setSelectedStudy(e.target.value)}>
                                <option value="" disabled selected>스터디 선택</option>
                                {myPartiStudy.map((study) => (
                                    <option key={study.study.id} value={study.study.id}>
                                        {study.study.title}
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
                                    {evaluation.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.member.nickname}</td>
                                            <td>{item.starRating}</td>
                                            <td>{item.reason}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MyScore;