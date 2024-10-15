import React, {useCallback, useEffect, useState} from "react";
import RealEstate from "../../components/info/RealEstate";
import StudyRegion from "../../components/study/StudyRegion";
import Tag from "../../components/study/Tag";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import Header from "../../components/repeat_etc/Header";
import Backarrow from "../../components/repeat_etc/Backarrow";

const StudyEdit = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const study = location.state && location.state.study;
    const [updatedStudy, setUpdatedStudy] = useState(study);
    const [showSelect, setShowSelect] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [tags, setTags] = useState(study ? study.tags : "");
    const [selectedOnOff, setSelectedOnOff] = useState(study ? study.onOff : "");
    const [selectedField, setSelectedField] = useState(study ? study.field : "");
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");

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
    ];

    const handleGoBack = () => {
        navigate(`/studydetail/${study.id}`);
    }
    const handleRadioChange = useCallback((e) => {
        const selectedValue = e.target.value;
        setSelectedOnOff(selectedValue);
        setUpdatedStudy((prevStudy) => ({
            ...prevStudy,
            onOff: selectedValue,
        }));
        console.log(selectedOption)
        setShowSelect(selectedValue === "offline" || selectedValue === "both");
    }, []);

    const handleRadioFieldChange = useCallback((e) => {
        console.log(e.target.value);
        const selectedfieldValue = e.target.value;
        setSelectedField(selectedfieldValue);
        setUpdatedStudy((prevStudy) => ({
            ...prevStudy,
            field: selectedfieldValue,
        }));
    }, []);

    const handleInputChange = useCallback((e) => {
        const {name, value} = e.target;
        setUpdatedStudy((prevStudy) => ({
            ...prevStudy,
            [name]: value,
        }));
    }, []);

    const handleRegionCityChange = useCallback((newCity) => {
        setCity(newCity);
        setUpdatedStudy((prevStudy) => ({
            ...prevStudy,
            city: newCity,
        }));
    }, []);

    const handleRegionDistrictChange = useCallback((newDistrict) => {
        setDistrict(newDistrict);
        setUpdatedStudy((prevStudy) => ({
            ...prevStudy,
            district: newDistrict,
        }));
    }, []);


    const handleTagChange = useCallback((selectedTag) => {
        setTags(selectedTag);
        setUpdatedStudy((prevStudy) => ({
            ...prevStudy,
            tags: selectedTag,
        }))
    }, []);

    useEffect(() => {
        if (updatedStudy && (updatedStudy.onOff === "offline" || updatedStudy.onOff === "both")) {
            setShowSelect(true);
        } else if (updatedStudy && updatedStudy.onOff === "online") {
            setShowSelect(false);
        }
    }, [updatedStudy]);

    const handleStudyUpdate = useCallback(async () => {
        console.log("수정될 데이터?:", updatedStudy);
        const accessToken = localStorage.getItem('accessToken');

        axios.put(`/api/api/v2/studies/${study.id}`,
            {
                title: updatedStudy.title,
                field: updatedStudy.field,
                capacity: updatedStudy.capacity,
                onOff: updatedStudy.onOff,
                city: updatedStudy.city,
                district: updatedStudy.district,
                recruitmentDeadline: updatedStudy.recruitmentDeadline,
                activityStart: updatedStudy.activityStart,
                activityDeadline: updatedStudy.activityDeadline,
                content: updatedStudy.content,
                tags: updatedStudy.tags,
            },
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then((res) => {
                console.log("API Response:", res.data);
                console.log("수정성공");
            }).catch((error) => {
            console.log(error);
        })
        navigate(`/studydetail/${study.id}`);
    },[updatedStudy,study, navigate]);
    const studyeditform = () => {
        return (
            <form className="study_open_form">
                <div>
                    <div className="left">
                        <div>
                            <span>제목</span>
                            <input type="text" name="title" value={updatedStudy.title} onChange={handleInputChange}
                                   className="inputbox"/>
                        </div>
                        <div>
                            <span>모집 인원</span>
                            <input type="number" name="capacity" value={updatedStudy.capacity}
                                   onChange={handleInputChange}
                                   className="inputbox" disabled />
                        </div>
                        <div>
                            <span>스터디 시작일</span>
                            <input type="date" name="activityStart" value={updatedStudy.activityStart}
                                   onChange={handleInputChange} className="inputbox"/>
                        </div>
                        <div>
                            <span>모집 마감일</span>
                            <input type="date" name="recruitmentDeadline" value={updatedStudy.recruitmentDeadline}
                                   onChange={handleInputChange}
                                   className="inputbox"/>
                        </div>
                    </div>
                    <div className="right">
                        <div>
                            <span>분야</span>
                            <span className="field_wrapper">
                                <select name="field" value={updatedStudy.field} onChange={handleRadioFieldChange} disabled>
                                    {tagoptions.map((interest, idx) =>
                                        <option key={idx} value={interest.value}>{interest.name}</option>
                                    )}
                                </select>
                            </span>
                        </div>
                        <div style={{marginRight: "21px"}}>
                            <span className="onoff_title">진행 방식</span>
                            <div className="onoff">
                                <input type="radio" value="online" name="onOff" onChange={handleRadioChange}
                                       checked={updatedStudy.onOff === "online" || selectedOnOff === "online"}/>온라인
                                <input type="radio" value="offline" name="onOff" onChange={handleRadioChange}
                                       checked={updatedStudy.onOff === "offline" || selectedOnOff === "offline"}/>오프라인
                                <input type="radio" value="both" name="onOff" onChange={handleRadioChange}
                                       checked={updatedStudy.onOff === "both" || selectedOnOff === "both"}/>무관
                                {showSelect && (
                                    <StudyRegion formData={updatedStudy} city={updatedStudy?.city}
                                                 district={updatedStudy?.district}
                                                 handleRegionCityChange={handleRegionCityChange}
                                                 handleRegionDistrictChange={handleRegionDistrictChange}/>
                                )}
                            </div>
                        </div>
                        <div>
                            <span>스터디 종료일</span>
                            <input type="date" name="activityDeadline" value={updatedStudy.activityDeadline}
                                   onChange={handleInputChange}
                                   className="inputbox"/>
                        </div>

                    </div>
                </div>
                <div className="study_open_detail">
                    <span>상세 내용</span>
                    <textarea name="content" onChange={handleInputChange}
                              value={updatedStudy.content}/>
                </div>
                <div className="study_tag">
                    <span>스터디 태그</span>
                    <Tag onTagChange={handleTagChange} tags={tags}/>
                </div>
                <div className="btn">
                    <button onClick={handleStudyUpdate} className="recruit_btn">저장</button>
                    <button onClick={handleGoBack} className="recruit_btn">취소</button>
                </div>
            </form>);
    }
    if (!updatedStudy) {
        return null;
    }
    return (<div className={"main_wrap"} id={"study"}>
        <Header showSideCenter={true}/>
        <div className="study_detail_container" style={{width: "70%"}}>
            <h1>Edit Study</h1>
            <div className="arrow_left">
                <p id={"entry-path"}> 홈 > 스터디 리스트 > 스터디 > 스터디 수정 </p>
                <Backarrow subname={"Edit Study"}/>
                <div>
                    {studyeditform()}
                </div>

            </div>
        </div>
    </div>);
}
export default StudyEdit;