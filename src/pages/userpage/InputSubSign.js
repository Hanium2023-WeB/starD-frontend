import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import {Link} from "react-router-dom";
import Header from "../../components/repeat_etc/Header";
import RealEstate from "../../components/info/RealEstate";
import InputEstates from "../../css/user_css/InputEstates.css";
import axios from "axios";

const InputSubSign = () => {

    const memberId = localStorage.getItem("memberId");
    console.log("넘어온 회원 아이디: ", memberId);

    const navigate = useNavigate();

    const [mem, setMem] = useState(
        {city: "", district: "", interests: []});

    useEffect(() => {
        console.log("member상태", mem);
    }, []);

    const onClickSkipBtn = () => {
        navigate("/");
    }

    const onClickSaveBtn = () => {
        axios.post("/api/signup/option-data", {
            id: memberId,
            city: mem.city,
            district: mem.district,
            interestList: tags.join(","),
        })
            .then(response => {
                console.log(response.data);
                alert("회원가입이 완료되었습니다.");
                navigate("/");
            })
            .catch(error => {
                console.error("Error sending data to the backend:", error);
            });
    };

    const tagoptions = [
        {value: "취업", name: "취업"},
        {value: "자소서", name: "자소서"},
        {value: "면접", name: "면접"},
        {value: "취미", name: "취미"},
        {value: "영어 공부", name: "영어 공부"},
        {value: "프로그래밍", name: "프로그래밍"},
        {value: "음악", name: "음악"},
        {value: "미술", name: "미술"},
        {value: "스포츠", name: "스포츠"},
        {value: "요리", name: "요리"},
        {value: "건강", name: "건강"},
        {value: "여행", name: "여행"},
        {value: "독서", name: "독서"},
        {value: "투자", name: "투자"},
        {value: "사회봉사", name: "사회봉사"},
        {value: "뉴스", name: "뉴스"},
        {value: "기술 동향", name: "기술 동향"},
        {value: "건축", name: "건축"},
        {value: "환경", name: "환경"},
        {value: "블로그 운영", name: "블로그 운영"},
        // Add more categories as needed
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
                                ? "lightpink"
                                : tags.length === 3
                                    ? "#dbdbdb"
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
                    <div className="login_info">
                        <p>회원가입 <span style={{color: "red"}}>(STEP 2)</span></p>
                    </div>
                    <div className="subcontent">
                        <div className="change_estates" id="estates">
                            <div id="title">거주지</div>
                            <div id="checkestate">
                                <RealEstate mem={mem}/>
                            </div>
                        </div>
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