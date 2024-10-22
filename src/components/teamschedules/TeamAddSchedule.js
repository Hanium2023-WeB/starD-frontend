import React, {useState, useRef, useCallback, useEffect} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ScheduleAdd from "../../css/schedule_css/ScheduleAdd.css";
import { CirclePicker } from "react-color";

const TeamAddSchedule = ({studyId,studies,studyTitles, selectedDate, onInsert, onClose,progressStatus }) => {
    const localDate = new Date(selectedDate);
    const localDateString = localDate.toLocaleDateString();const [startDate, setStartDate] = useState(new Date(selectedDate));
    const [endDate, setEndDate] = useState(new Date(selectedDate));
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("");
  const [InsertToDoTitle, setInsertToDoTitle] = useState("")
  const studyIdAsNumber = parseFloat(studyId);
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
  const onChangeContent = useCallback((e) => {
    setContent(e.target.value);
  }, []);

  const onChangeColor = useCallback((color) => {
    setColor(color.hex);
  }, []);


  const onSubmit = useCallback(
      (e) => {
        if (title != "") {
          console.log("addschedule:", endDate.toDateString());
          onInsert(startDate, title, color, studyIdAsNumber);
          onClose()
        }else if(progressStatus === 'DISCONTINUE') {
          alert("중단된 스터디는 일정 추가가 불가능합니다.");
          onClose()
        }
        else {
          alert("모두 입력해주세요.");
        }
        setTitle("");
        e.preventDefault();
      },
      [content, color]
  );


  return (
      <div className="background">
        <form className="Scheduleedit_insert">
          <h2>{localDateString}</h2>
          <div className="selectstudy">

          </div>
          <div className="selectDay">
              <p>시작 날짜:</p>
              <DatePicker
                  className="datePicker"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="yyyy-MM-dd"
                  placeholder="시작 날짜 선택"
                  disabled={progressStatus === 'DISCONTINUE'}
              />
          </div>
          <div className="selecttitle">
            <p>일정 이름:</p>
            <input
                onChange={onChangeTitle}
                value={title}
                placeholder="일정 이름을 입력하세요"
                disabled={progressStatus === 'DISCONTINUE'}
            />
          </div>
          <div className="selectcolor">
            <p>표시 색상:</p>
            <CirclePicker colors={customColors} color={color} onChange={onChangeColor}/>
          </div>
          <ul className="meeting_btn">
            <li>
              <button id="add" type="submit" onClick={onSubmit}>
                생성
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
export default TeamAddSchedule;
