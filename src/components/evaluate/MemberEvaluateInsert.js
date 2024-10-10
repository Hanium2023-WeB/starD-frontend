import React, {useCallback, useEffect, useState} from "react";
import { FaStar } from "react-icons/fa";
import styled from 'styled-components';
import axios from "axios";
import {useNavigate} from "react-router-dom";

const MemberEvaluateInsert = ({studyId, members, completeEvaluation}) => {
    const navigate = useNavigate();

    const accessToken = localStorage.getItem('accessToken');
    const isLoggedInUserId = localStorage.getItem('isLoggedInUserId');

    console.log("studyId : " + studyId);

    const [evaluation, setEvaluation] = useState([]);
    const ARRAY = [0, 1, 2, 3, 4];
    let score = null;
    // 별점 기본값 설정
    const [clicked, setClicked] = useState(() => {
        return members.map(() => ({ stars: [false, false, false, false, false] }));
    });


    const handleStarClick = (itemIndex, starIndex) => {
        let clickStates = [...clicked];
//        for (let i = 0; i < 5; i++) {
//            clickStates[i] = i <= index ? true : false;
//        }
        clickStates[itemIndex].stars = clickStates[itemIndex].stars.map((el, idx) => idx <= starIndex);
        setClicked(clickStates);
    };

    useEffect(() => {
        sendReview();
    }, [clicked]);

    const sendReview = () => {
        score = clicked.filter(Boolean).length;
        console.log("starsssssss : " + score);
    };

    const handleInputChange = (e, index) => {
        const {name, value} = e.target;
        const updatedEvaluations = [...evaluation];
        updatedEvaluations[index] = {
            ...updatedEvaluations[index],
            [name]: value,
        };

        setEvaluation(updatedEvaluations);
    };

    const registerEvaluation = (index) => {
        const memberId = members[index].member.id;
        const starRating = clicked[index].stars;
        const score = clicked[index].stars.filter(Boolean).length;
        const reason = evaluation[index]?.reason;

        console.log(memberId + ", " + score + ", " + reason);

        const response = axios.post("/api/rate", null, {
            params: {
                studyId: studyId,
                targetId: memberId,
                starRating: score,
                reason: reason,
            },
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then((res) => {
            console.log(res.data);
            alert('등록되었습니다.');
            navigate("/myparticipatestudy");
        }).catch((error) => {
            console.log('전송 실패', error);
        });

    };

    return (
            <table className="evaluate_table">
                <thead>
                <tr>
                    <th>팀원 이름</th>
                    <th>점수</th>
                    <th>사유</th>
                </tr>
                </thead>
                <tbody>
                {members.map((member, index) => {
                    const isEvaluated = completeEvaluation.some(evaluation => evaluation.target.id === member.member.id);

                    if (!isEvaluated && member.member.id !== isLoggedInUserId) {
                        return (
                            <tr className="evaluate_list">
                                <td className="member_name">{member.member.nickname}</td>
                                <td className="member_rating">
                                    <Wrap>
                                        <Stars>
                                            {ARRAY.map((el, idx) => (
                                                <FaStar
                                                    style={{alignItems:"center"}}
                                                    key={idx}
                                                    size="20"
                                                    onClick={() => handleStarClick(index, el)}
                                                    className={clicked[index].stars[el] && 'yellowStar'}
                                                />
                                            ))}
                                        </Stars>
                                    </Wrap>
                                </td>
                                <td className="member_evaluate_reason">
                                    <textarea name="reason"
                                        value={evaluation[index]?.reason || ''}
                                        onChange={(e) => handleInputChange(e, index)}/>
                                </td>
                                <td>
                                    <button onClick={() => registerEvaluation(index)} className="register_btn">평가하기</button>
                                </td>
                            </tr>
                        );
                    }
                })}

                {/*{members.map((member) => (*/}
                {/*    <tr className="evaluate_list">*/}
                {/*        <td className="community_category">{}</td>*/}
                {/*        <td className="community_nickname">{}</td>*/}
                {/*        <td className="community_datetime">{}</td>*/}
                {/*    </tr>*/}
                {/*))}*/}
                </tbody>
            </table>
    )
}
export default MemberEvaluateInsert;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const Stars = styled.div`
display: flex;

& svg {
  color: gray;
  cursor: pointer;
}

:hover svg {
  color: #fcc419;
}

& svg:hover ~ svg {
  color: gray;
}

.yellowStar {
  color: #fcc419;
}
`;