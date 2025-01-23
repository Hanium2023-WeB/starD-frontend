import React, {useState, useRef, useCallback, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import DatePicker from "react-datepicker";

import {CirclePicker} from "react-color";
import {parseISO} from 'date-fns';


const EditSchedule = ({studies, studyTitles, editdata, onUpdate, onRemove, onClose}) => {

    const [startDate, setStartDate] = useState(editdata.start_date);
    const [isDisabled, setIsDisabled] = useState(true); // 초기 비활성화 상태
    const [title, setTitle] = useState(editdata.title);
    const [color, setColor] = useState(editdata.color);


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
                    editdata.id,
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
        [ title, color]
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
                <h2>{editdata.title}</h2>
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
                    <CirclePicker color={color} onChange={onChangeColor}/>
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
export default EditSchedule;
