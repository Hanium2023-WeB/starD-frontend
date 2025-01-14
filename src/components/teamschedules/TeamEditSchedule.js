import React, {useState, useRef, useCallback, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import {CirclePicker} from "react-color";
import {parseISO} from 'date-fns';
import studyList from "../../pages/studypage/StudyList";

const TeamEditSchedule = ({studies, studyTitles, editdata, onUpdate, onRemove, onClose}) => {
    const [startDate, setStartDate] = useState(editdata.start_date);
    const [isDisabled, setIsDisabled] = useState(true);
    const [title, setTitle] = useState(editdata.title);
    const [color, setColor] = useState(editdata.color);
    const customColors = [
        "#ffbdc5", // 파스텔 핑크
        "#FFDFBA", // 파스텔 오렌지
        "#FFFFBA", // 밝은 노랑
        "#BAFFC9", // 파스텔 민트
        "#BAE1FF", // 파스텔 하늘색
        "#ffddfa", // 라벤더 핑크
        "#C4FAF8", // 밝은 민트블루
        "#A8E6CF", // 부드러운 민트
        "#FFAAA5", // 연한 코랄
        "#C1C1E7", // 연보라
        "#B5EAD7", // 연한 녹색
        "#FFF5BA", // 밝은 레몬색
        "#D1E8E2", // 밝은 청록색
        "#FFCCF9", // 연한 보라핑크
    ];

    const onChangeTitle = useCallback((e) => {
        setTitle(e.target.value);
    }, []);
    const onChangeColor = useCallback((color) => {
        setColor(color.hex);
    }, []);
    const onSubmit = useCallback(
        (e) => {
            if (title !== "") {
                onUpdate(
                    editdata.scheduleId,
                    startDate,
                    title,
                    color
                );
            } else {
                alert("모두 입력해주세요.");
            }
            setTitle("");
            onClose();
            e.preventDefault();
        },
        [title, color]
    );
    const onDelete = useCallback(
        (e) => {
            onRemove(editdata.id);
            onClose();
        },
        []
    );

    return (
        <div className="background">
            <form className="Scheduleedit_insert">
                <h2 style={{marginBottom:"50px"}}>{editdata.title}</h2>
                <div className="selecttitle">
                    <p>일정 이름:</p>
                    <input
                        onChange={onChangeTitle}
                        value={title}
                        placeholder="일정 이름을 입력하세요"
                    />
                </div>

                <div className="selectcolor">
                    <p>표시 색상:</p>
                    <CirclePicker colors={customColors} color={color} onChange={onChangeColor}/>
                </div>
                <ul className="meeting_btn">
                    <li>
                        <button id="add" type="submit" onClick={onSubmit}>
                            수정
                        </button>
                    </li>
                    <li>
                        <button id="del" type="button" onClick={onDelete}>
                            삭제
                        </button>
                    </li>
                    <li>
                        <button id="cancel" type="button" onClick={onClose}>
                            취소
                        </button>
                    </li>
                </ul>
            </form>
        </div>
    );
};
export default TeamEditSchedule;
