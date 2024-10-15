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
        field: "취업",
        author: "",
        number: "",
        onoff: "",
        sido: "",
        gugun: "",
        deadline: "",
        startDate: "",
        endDate: "",
        description: value,
        tag: "",
        created_date: new Date(),
        current: current,
        scrap: false,
        like: false,
    });
    const updateStudies = (updatedStudies) => {
        setStudies(updatedStudies);
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
    ];


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
            sido: newCity,
        })
    };

    const handleRegionDistrictChange = (newDistrict) => {
        setDistrict(newDistrict);
        setFormData({
            ...formData,
            gugun: newDistrict,
        })
    };


    const handleRadioChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedOption(selectedValue);
        setFormData({
            ...formData,
            onoff: e.target.value,
        })
        setShowSelect(selectedValue === "offline" || selectedValue === "both");
    }

    const onInsertStudy = useCallback((study) => {
        const {
            title,
            field,
            author,
            number,
            onoff,
            sido,
            gugun,
            deadline,
            startDate,
            endDate,
            description,
            tag,
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

        const newData = {
            title,
            field: selectedField,
            author,
            number,
            onoff,
            sido: selectedSido,
            gugun: selectedGugun,
            deadline,
            startDate,
            endDate,
            description,
            tag,
            created_date,
            current: current,
            id: dataId,
            scrap: false,
            like: false,
        };

        console.log("id : " + newData.id);
        console.log("tag : " + newData.tag);
        setStudies((prevStudies) => [...prevStudies, newData]);
        const updatedStudies = [...studies, newData];
        localStorage.setItem("studies", JSON.stringify(updatedStudies));

        console.log("update임 : " + JSON.stringify(updatedStudies));
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

        if (
            formData.title.trim() === '' &&
            formData.number.trim() === '' &&
            formData.deadline.trim() === '' &&
            formData.startDate.trim() === '' &&
            formData.endDate.trim() === '' &&
            formData.description.trim() === '' &&
            !formData.onoff
        ) {
            alert('스터디 정보를 입력해주세요.');
            return;
        }
        if (formData.title.trim() === '') {
            alert("제목을 입력해주세요.");
            return;
        }
        if (formData.number.trim() === '') {
            alert("모집 인원을 입력해주세요.");
            return;
        }
        if (formData.deadline.trim() === '') {
            alert("모집 마감일을 입력해주세요.");
            return;
        }
        if (formData.startDate.trim() === '') {
            alert("스터디 시작일을 입력해주세요.");
            return;
        }
        if (formData.endDate.trim() === '') {
            alert("스터디 종료일을 입력해주세요.");
            return;
        }
        if (formData.description.trim() === '') {
            alert("상세 내용을 입력해주세요.");
            return;
        }
        if (!formData.onoff) {
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

        const studyWithTags = {
            ...formData,
            tag: tags
        };
        localStorage.setItem("studyWithTags", JSON.stringify(studyWithTags));
        setFormData(onInsertStudy(studyWithTags));
        console.log(`formData: ${JSON.stringify(formData)}`)
        const accessToken = localStorage.getItem('accessToken');

        const response = axios.post("/api/api/v2/studies",
            {
                title: studyWithTags.title,
                field: studyWithTags.field,
                capacity: studyWithTags.number,
                onOff: studyWithTags.onoff,
                city: studyWithTags.sido,
                district: studyWithTags.gugun,
                recruitmentDeadline: studyWithTags.deadline,
                activityStart: studyWithTags.startDate,
                activityDeadline: studyWithTags.endDate,
                content: studyWithTags.description,
                tags: studyWithTags.tag,
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
                const id = res.data.id;
                navigate(`/studydetail/${id}`);
            }).catch((error) => {
                console.log('전송 실패', error);
            })

        console.log("response : ", response);
        e.preventDefault();
    }, [formData, navigate, tags, onInsertStudy]);

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
                            <input type="number" name="number" value={formData.number} onChange={handleInputChange}
                                   className="inputbox" placeholder="모집 인원을 입력해주세요"/>
                        </div>
                        <div>
                            <span>스터디 시작일</span>
                            <input type="date" name="startDate" value={formData.startDate}
                                   onChange={handleInputChange}
                                   min={formattedCurrentDate} className="inputbox" placeholder="스터디 시작일을 선택해주세요"/>
                        </div>
                        <div>
                            <span>모집 마감일</span>
                            <input type="date" name="deadline" value={formData.deadline}
                                   onChange={handleInputChange}
                                   min={formattedCurrentDate} className="inputbox" placeholder="스터디 모집 마감일을 선택해주세요"/>
                        </div>
                    </div>
                    <div className="right">
                        <div className={"interest"}>
                            <span id={"inter"}>분야</span>
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
                                <input type="radio" value="online" name="onoff" onChange={handleRadioChange}/>온라인
                                <input type="radio" value="offline" name="onoff" onChange={handleRadioChange}/>오프라인
                                <input type="radio" value="both" name="onoff" onChange={handleRadioChange}/>무관
                                {showSelect && (
                                    <StudyRegion formData={formData} city={formData?.sido} district={formData?.gugun}
                                                 handleRegionCityChange={handleRegionCityChange}
                                                 handleRegionDistrictChange={handleRegionDistrictChange}/>
                                )}
                            </div>
                        </div>
                        <div className={"deadline"}>
                            <span>스터디 종료일</span>
                            <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange}
                                   min={formattedCurrentDate} className="inputbox" placeholder="스터디 종료일을 선택해주세요"/>
                        </div>

                    </div>
                </div>
                <div className="study_open_detail">
                    <span>상세 내용</span>
                    <textarea value={formData.description} name="description" onChange={handleInputChange}
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