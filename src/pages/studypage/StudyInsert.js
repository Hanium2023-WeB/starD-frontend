import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {useNavigate, useLocation} from "react-router-dom";
import "../../css/study_css/StudyOpenForm.css";
import StudyRegion from "../../components/study/StudyRegion";
import Tag from "../../components/study/Tag";
import axios from "axios";
import Header from "../../components/repeat_etc/Header";
import Backarrow from "../../components/repeat_etc/Backarrow";
import study from "./Study";

const StudyInsert = () => {
    const location = useLocation();
    const [dataId, setDataId] = useState(0);
    const navigate = useNavigate();
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    const formattedCurrentDate = `${currentYear}-${currentMonth}-${currentDay}`;

    const [showSelect, setShowSelect] = useState(false); //온 오프 선택 지역 컴포넌트 호출 여부 관리 상태
    const [selectedOption, setSelectedOption] = useState(null);
    const [studies, setStudies] = useState([]);
    const value = "*스터디 주제: \n*스터디 목표: \n*예상 스터디 일정(횟수): \n*예상 커리큘럼 간략히: \n*스터디 소개와 개설 이유: \n*스터디 관련 주의사항: ";
    const [tags, setTags] = useState("");
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [current, setCurrent] = useState("Recruiting");
    const [formData, setFormData] = useState({
        title: "",
        content: value,
        capacity:"",
        activityType:"",
        city:"",
        district:"",
        field: "취업",
        tags:"",
        activityStart:"",
        activityDeadline:"",
        author: "",
        recruitmentDeadline: "",
        created_date: new Date(),
        current: current,
        scrap: false,
        like: false,
    });
    const updateStudies = (updatedStudies) => {
        setStudies(updatedStudies);
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

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleInputChange = useCallback((e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }, [formData]);

    const handleRegionCityChange = (newCity) => {
        setCity(newCity);
        setFormData({
            ...formData,
            city: newCity,
        })
    };

    const handleRegionDistrictChange = (newDistrict) => {
        setDistrict(newDistrict);
        setFormData({
            ...formData,
            district: newDistrict,
        })
    };


    const handleRadioChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedOption(selectedValue);
        setFormData({
            ...formData,
            activityType: e.target.value,
        })
        setShowSelect(selectedValue === "OFFLINE" || selectedValue === "ONLINE_OFFLINE");
    }

    const onInsertStudy = useCallback((study) => {
        const {
            title,
            content,
            capacity,
            activityType,
            city,
            district,
            field,
            tags,
            activityStart,
            activityDeadline,
            author,
            recruitmentDeadline,
            created_date,
            current
        } = study;
        const selectedField = document.querySelector('select[name="field"]').value;

        let selectedSido = "";
        let selectedGugun = "";
        if (showSelect) {
            const selectedSido = document.querySelector('select[name="sido1"]').value;
            const selectedGugun = document.querySelector('select[name="gugun1"]').value;
        }

        const updatedCity = activityType === "ONLINE" ? "" : selectedSido;
        const updatedDistrict = activityType === "ONLINE" ? "" : selectedGugun;

        const newData = {
            title,
            content,
            capacity,
            activityType,
            city: updatedCity,
            district: updatedDistrict,
            field: selectedField,
            tags,
            activityStart,
            activityDeadline,
            author,
            recruitmentDeadline,
            created_date,
            current: current,
            id: dataId,
            scrap: false,
            like: false,
        };

        console.log("id : " + newData.id);
        console.log("tags : " + newData.tags);
        setStudies((prevStudies) => [...prevStudies, newData]);
        const updatedStudies = [...studies, newData];
        localStorage.setItem("studies", JSON.stringify(updatedStudies));

        updateStudies(updatedStudies);

        setDataId((prevDataId) => prevDataId + 1);

        return newData;

    }, [studies, dataId]);

    const handleTagChange = useCallback((selectedTag) => {
        setTags(selectedTag); // 변경된 부분: 태그 정보를 배열로 변환하여 설정
    },[]);


    useEffect(() => {
        const storedStudies = JSON.parse(localStorage.getItem("studies") || "[]");
        setStudies(storedStudies);
        const lastDataId = storedStudies.length > 0 ? storedStudies[storedStudies.length - 1].id : 0;
        setDataId(lastDataId + 1);
    }, []);

    const handleSubmit = useCallback(e => {
        e.preventDefault(); // 기본 이벤트 방지

        const today = new Date();
        const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환

        // 입력된 날짜들 가져오기
        const recruitmentDeadline = new Date(formData.recruitmentDeadline);
        const activityStart = new Date(formData.activityStart);
        const activityDeadline = new Date(formData.activityDeadline);

        if (
            formData.title.trim() === '' &&
            formData.content.trim() === '' &&
            formData.capacity.trim() === '' &&
            formData.activityStart.trim() === '' &&
            formData.activityDeadline.trim() === '' &&
            formData.recruitmentDeadline.trim() === '' &&
            !formData.activityType
        ) {
            alert('스터디 정보를 입력해주세요.');
            return;
        }
        if (formData.title.trim() === '') {
            alert("제목을 입력해주세요.");
            return;
        }
        if (formData.title.trim().length > 200) {
            alert("제목은 최대 200자까지 입력 가능합니다.");
            return;
        }
        if (formData.capacity.trim() === '') {
            alert("모집 인원을 입력해주세요.");
            return;
        }
        // 모집 마감일 유효성 검사
        if (!formData.recruitmentDeadline.trim() || recruitmentDeadline < today.setHours(0, 0, 0, 0)) {
            alert("모집 마감일은 오늘 이후의 날짜만 선택 가능합니다.");
            return;
        }
        // 스터디 시작일 유효성 검사
        if (!formData.activityStart.trim() || activityStart < today) {
            alert("스터디 시작일은 오늘 이후의 날짜만 선택 가능합니다.");
            return;
        }
        // 스터디 종료일 유효성 검사
        if (!formData.activityDeadline.trim() || activityDeadline < activityStart) {
            alert("스터디 종료일은 시작일과 같거나 그 이후의 날짜만 선택 가능합니다.");
            return;
        }
        if (formData.content.trim() === '') {
            alert("상세 내용을 입력해주세요.");
            return;
        }
        if (formData.content.trim().length > 1000) {
            alert("상세 내용은 최대 1000자까지 입력 가능합니다.");
            return;
        }
        if (!formData.activityType) {
            alert("온라인, 오프라인 여부를 선택해주세요.");
            return;
        }
        if (!formData.field) {
            alert("분야를 선택해주세요.");
            return;
        }

        const tagElement = document.querySelector(".HashWrapInner");
        if (!tagElement) {
            alert('해시태그를 입력해주세요.');
            return; // 창이 넘어가지 않도록 중단
        }

        // `capacity` 숫자 변환
        const numericCapacity = Number(formData.capacity);
        if (isNaN(numericCapacity) || numericCapacity < 3) {
            alert("모집 인원은 3 이상의 숫자여야 합니다.");
            return;
        }

        const studyWithTags = {
            ...formData,
            capacity: numericCapacity,
            tags: tags,
            city: formData.activityType === "ONLINE" ? "" : city,
            district: formData.activityType === "ONLINE" ? "" : district,
            activityStart: formatDate(new Date(formData.activityStart)),
            activityDeadline: formatDate(new Date(formData.activityDeadline)),
            recruitmentDeadline: formatDate(new Date(formData.recruitmentDeadline)),
        };
        localStorage.setItem("studyWithTags", JSON.stringify(studyWithTags));
        setFormData(onInsertStudy(studyWithTags));
        const accessToken = localStorage.getItem('accessToken');
        console.log(studyWithTags);
        console.log(formData);
        console.log(formData.city);
        console.log(formData.district);
        console.log(studyWithTags.city);
        console.log(studyWithTags.district);

        const response = axios.post("/api/studies",
            {
                title: studyWithTags.title,
                content: studyWithTags.content,
                capacity: studyWithTags.capacity,
                activityType: studyWithTags.activityType,
                city: studyWithTags.city,
                district: studyWithTags.district,
                field: studyWithTags.field,
                tags: studyWithTags.tags,
                activityStart: studyWithTags.activityStart,
                activityDeadline: studyWithTags.activityDeadline,
                recruitmentDeadline: studyWithTags.recruitmentDeadline,
            },
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then((res) => {
                console.log("전송 성공");
                alert("게시글이 등록되었습니다.");

                console.log(res.data);
                const id = res.data;
                navigate(`/study/detail/${id}`);
            }).catch((error) => {
                console.log('전송 실패', error.response.data || error);
            })

        console.log("response : ", response);
        e.preventDefault();
    }, [formData, tags, onInsertStudy]);

    const studyinsertform = () => {
        return (
            <form className="study_open_form" onSubmit={handleSubmit}>
                <div>
                    <div className="left">
                        <div>
                            <span>제목</span>
                            <input type="text" name="title" value={formData.title} onChange={handleInputChange}
                                   className="inputbox" placeholder="제목을 입력해주세요" maxLength={100}/>
                        </div>
                        <div>
                            <span>모집 인원</span>
                            <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange}
                                   className="inputbox" placeholder="모집 인원을 입력해주세요"/>
                        </div>
                        <div>
                            <span>스터디 시작일</span>
                            <input type="date" name="activityStart" value={formData.activityStart}
                                   onChange={handleInputChange}
                                   min={formattedCurrentDate} className="inputbox" placeholder="스터디 시작일을 선택해주세요"/>
                        </div>
                        <div>
                            <span>모집 마감일</span>
                            <input type="date" name="recruitmentDeadline" value={formData.recruitmentDeadline}
                                   onChange={handleInputChange}
                                   min={formattedCurrentDate} className="inputbox" placeholder="스터디 모집 마감일을 선택해주세요"/>
                        </div>
                    </div>
                    <div className="right">
                        <div className={"interest"}>
                            <span>분야</span>
                            <span className="field_wrapper">
                                <select name="field" value={formData.field} onChange={handleInputChange}>
                                    {tagoptions.map((interest, idx) =>
                                        <option key={idx} value={interest.value}>{interest.name}</option>
                                    )}
                                </select>
                            </span>
                        </div>
                        <div className={"onoffline"} style={{marginRight: "21px"}}>
                            <span className="onoff_title">진행 방식</span>
                            <div className="onoff">
                                <input type="radio" value="ONLINE" name="activityType" onChange={handleRadioChange}/>온라인
                                <input type="radio" value="OFFLINE" name="activityType" onChange={handleRadioChange}/>오프라인
                                <input type="radio" value="ONLINE_OFFLINE" name="activityType" onChange={handleRadioChange}/>무관
                                {showSelect && (
                                    <StudyRegion formData={formData} city={city} district={district}
                                                 handleRegionCityChange={handleRegionCityChange}
                                                 handleRegionDistrictChange={handleRegionDistrictChange}/>
                                )}
                            </div>
                        </div>
                        <div className={"deadline"}>
                            <span>스터디 종료일</span>
                            <input type="date" name="activityDeadline" value={formData.activityDeadline} onChange={handleInputChange}
                                   min={formData.activityStart || new Date().toISOString().split('T')[0]} className="inputbox" placeholder="스터디 종료일을 선택해주세요"/>
                        </div>

                    </div>
                </div>
                <div className="study_open_detail">
                    <span>상세 내용</span>
                    <textarea value={formData.content} name="content" onChange={handleInputChange}
                              placeholder={value}/>
                </div>
                <div className="study_tag">
                    <span>스터디 태그</span>
                    <Tag onTagChange={handleTagChange} tags={tags}/>
                </div>
                <div className="btn">
                    <input type="submit" value="모집하기" className="recruit_btn"/>
                </div>
            </form>
        )
    }

    return (
        <div className={"main_wrap"} id={"study"}>
            <Header showSideCenter={true}/>
            <div className="study_detail_container" style={{width: "70%"}}>
                <h1>Insert Study</h1>
                <div className="arrow_left">
                    <p id={"entry-path"}> 홈 > 스터디 리스트 > 스터디 추가 </p>
                    <Backarrow subname={"Insert Study"}/>
                    <div>
                        {studyinsertform()}
                    </div>
                </div>
            </div>
        </div>);
}
export default StudyInsert;