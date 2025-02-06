import React, {useCallback, useEffect, useState} from "react";
import { FaStar } from "react-icons/fa";
import styled from 'styled-components';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

const MemberEvaluateInsert = ({ studyId, member, onClose }) => {
    console.log(member);
    const accessToken = localStorage.getItem('accessToken');
    const [clicked, setClicked] = useState([false, false, false, false, false]);
    const [reason, setReason] = useState('');

    const handleStarClick = (index) => {
        let newClicked = clicked.map((_, idx) => idx <= index);
        setClicked(newClicked);
    };

    const registerEvaluation = () => {
        const score = clicked.filter(Boolean).length;

        axios.post(`/api/studies/${studyId}/evaluations`,
            {
                target: member.nickname,
                starRating: score,
                starReason: reason,
            },
            {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )
            .then((res) => {
                console.log(res.data);
                toast.success("평가가 완료되었습니다.");
                onClose();
            })
            .catch((error) => {
                console.log("전송 실패", error);
                toast.error("평가 등록에 실패하였습니다.");
            });
    };

    return (
        <div className="evaluate_form">
            <h3>{member.nickname} 평가하기</h3>
            <Wrap>
                <Stars>
                    {[0, 1, 2, 3, 4].map((el) => (
                        <FaStar
                            key={el}
                            size="20"
                            onClick={() => handleStarClick(el)}
                            className={clicked[el] ? 'yellowStar' : ''}
                        />
                    ))}
                </Stars>
            </Wrap>
            <textarea
                name="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
            />
            <button onClick={onClose}>닫기</button>
            <button onClick={registerEvaluation} className="register_btn">평가하기</button>
        </div>
    );
};

export default MemberEvaluateInsert;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 15px 0;
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