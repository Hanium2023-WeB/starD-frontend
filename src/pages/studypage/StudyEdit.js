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
    console.log(updatedStudy);
    const [showSelect, setShowSelect] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [tags, setTags] = useState(study ? study.tags : "");
    const [selectedOnOff, setSelectedOnOff] = useState(study ? study.activityType : "");
    const [selectedField, setSelectedField] = useState(study ? study.field : "");
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");

    const tagoptions = [
        {value: "개발/IT", name: "개발/IT"},
        {value: "취업/자격증", name: "취업/자격증"},
        {value: "디자인", name: "디자인"},
        {value: "언어", name: "언어"},
        {value: "자기계발", name: "자기계발"},
        {value: "취미", name: "취미"},
        {value: "기타", name: "기타"},
    ];

    const handleGoBack = () => {
        navigate(`/studydetail/${study.id}`);
    }
    const handleRadioChange = useCallback((e) => {
        const selectedValue = e.target.value;
        setSelectedOnOff(selectedValue);
        setUpdatedStudy((prevStudy) => ({
            ...prevStudy,
            activityType: selectedValue,
        }));
        console.log(selectedOption)
        setShowSelect(selectedValue === "OFFLINE" || selectedValue === "ONLINE_OFFLINE");
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
        if (updatedStudy && (updatedStudy.activityType === "OFFLINE" || updatedStudy.activityType === "ONLINE_OFFLINE")) {
            setShowSelect(true);
        } else if (updatedStudy && updatedStudy.activityType === "ONLINE") {
            setShowSelect(false);
        }
    }, [updatedStudy]);

    const handleStudyUpdate = useCallback(async (e) => {
        e.preventDefault();
        console.log("수정될 데이터?:", updatedStudy);
        const accessToken = localStorage.getItem('accessToken');

        axios.put(`/api/studies/${study.studyId}`,
            {
                title: updatedStudy.title,
                content: updatedStudy.content,
                capacity: updatedStudy.capacity,
                activityType: updatedStudy.activityType,
                city: updatedStudy.city,
                district: updatedStudy.district,
                field: updatedStudy.field,
                tags: updatedStudy.tags,
                activityStart: updatedStudy.activityStart,
                activityDeadline: updatedStudy.activityDeadline,
                recruitmentDeadline: updatedStudy.recruitmentDeadline,
            },
            {
                params:{studyId:updatedStudy.studyId},
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then((res) => {
                alert("스터디가 수정되었습니다.");
                console.log("API Response:", res.data);
                console.log("수정성공");
            }).catch((error) => {
            console.log(error.response.data || error);
        })
        navigate(`/studydetail/${study.studyId}`);
    },[updatedStudy]);
    const studyeditform = () => {
        return (
            <form className="study_open_form study_edit_form">
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
                                <input type="radio" value="ONLINE" name="activityType" onChange={handleRadioChange}
                                       checked={updatedStudy.activityType === "ONLINE" || selectedOnOff === "ONLINE"}/>온라인
                                <input type="radio" value="OFFLINE" name="activityType" onChange={handleRadioChange}
                                       checked={updatedStudy.activityType === "OFFLINE" || selectedOnOff === "OFFLINE"}/>오프라인
                                <input type="radio" value="ONLINE_OFFLINE" name="activityType" onChange={handleRadioChange}
                                       checked={updatedStudy.activityType === "ONLINE_OFFLINE" || selectedOnOff === "ONLINE_OFFLINE"}/>무관
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