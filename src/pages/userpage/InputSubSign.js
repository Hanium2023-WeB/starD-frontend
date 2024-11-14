import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import {Link} from "react-router-dom";
import Header from "../../components/repeat_etc/Header";
import RealEstate from "../../components/info/RealEstate";
import InputEstates from "../../css/user_css/InputEstates.css";
import axios from "axios";

const InputSubSign = () => {

    const memberId = localStorage.getItem("newMemberId");
    console.log("넘어온 회원 아이디: ", memberId);

    const navigate = useNavigate();

    const onClickSkipBtn = () => {
        navigate("/");
    }

    const onClickSaveBtn = () => {
        axios.post("/api/members/auth/join/additional-info", {
            memberId: memberId,
            interests: tags,
        })
            .then(response => {
                console.log(response.data);
                alert("관심분야가 저장되었습니다.");
                navigate("/");
            })
            .catch(error => {
                console.error("Error sending data to the backend:", error);
            });
    };

    const tagoptions = [
        {value: "개발/IT", name: "개발/IT"},
        {value: "취업/자격증", name: "취업/자격증"},
        {value: "디자인", name: "디자인"},
        {value: "언어", name: "언어"},
        {value: "자기계발", name: "자기계발"},
        {value: "취미", name: "취미"},
        {value: "기타", name: "기타"},
    ];

    const [tags, setTags] = useState(() => {
        const storedTags = localStorage.getItem('tags');
        return storedTags ? storedTags.split(",") : [];
    });

    const Tagoption = (props) => {
        const handletagChange = (value) => {
            if (tags.includes(value)) {
                setTags(tags.filter((tag) => tag !== value));
            } else {
                if (tags.length < 3) { //최대 3개까지만 선택 가능하게
                    setTags([...tags, value]);
                } else {
                    alert("관심분야는 최대 3개까지 입니다.");
                }
            }
        };

        console.log(tags)

        return (
            <div className="tags">
                {props.editoptions.map((editoption) => (
                    <button
                        id="tag"
                        name="TAG"
                        onClick={() => handletagChange(editoption.value)}
                        value={editoption.value}
                        style={{
                            backgroundColor: tags.includes(editoption.value)
                                ? "#fff89c"
                                : tags.length === 3
                                    ? "#efefef"
                                    : "white",
                        }}
                        value={editoption.value}
                    >
                        {editoption.value}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div>
            <Header showSideCenter={false}/>
            <div className="wrap">
                <div className="content">
                    <div className="subcontent">
                        <h2>관심분야 <span style={{color:"red"}}>(선택)</span></h2>
                        <div id="checkestates">
                            <div>
                                <div id="title">
                                    관심분야<span id="sub_title" style={{fontSize: "15px"}}>(최대 3개까지 선택 가능)</span>
                                </div>
                                <Tagoption editoptions={tagoptions} value=""/>
                            </div>
                        </div>
                        <div className="next_btn">
                            <button id="next" onClick={onClickSkipBtn}>건너뛰기</button>
                            <button id="next" onClick={onClickSaveBtn}>가입하기</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default InputSubSign;