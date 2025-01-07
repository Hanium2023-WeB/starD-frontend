import React, { useState, useRef, useCallback, useEffect } from "react";
import ToDoInserts from "../../css/todo_css/ToDoInsert.css";
import axios from "axios";

const TeamToDoInsert = ({ onInsert, dueDate, Inserttodostudyid, studyidasnumber, Assignees, progressStatus }) => {
    const accessToken = localStorage.getItem("accessToken");
    const [TaskValue, setTaskValue] = useState(""); // 할 일
    const nextId = useRef(1);

    // 날짜 포맷팅 (ISO 표준)
    const inputDate = new Date(dueDate);
    inputDate.setMinutes(inputDate.getMinutes() - inputDate.getTimezoneOffset());
    const formattedDate = inputDate.toISOString();

    // 할 일 입력 핸들러
    const onChange = useCallback((e) => {
        setTaskValue(e.target.value);
    }, []);

    // 할 일 추가 버튼 함수
    const onSubmit = useCallback(
        async (e) => {
            e.preventDefault(); // 기본 이벤트 방지

            // 유효성 검사
            if (progressStatus === "DISCONTINUE") {
                alert("중단된 스터디는 할 일을 추가할 수 없습니다.");
                return;
            }

            if (!TaskValue.trim()) {
                alert("할 일을 입력해 주세요.");
                return;
            }

            if (!Assignees || Assignees.length === 0) {
                alert("담당자를 지정해주세요.");
                return;
            }

            // Assignees에서 nickname만 추출
            const assigneeNicknames = Assignees.map((assignee) => assignee.nickname);

            // onInsert 호출
            onInsert(TaskValue, studyidasnumber, formattedDate, assigneeNicknames);

            // 상태 초기화
            setTaskValue("");
            nextId.current += 1;
        },
        [TaskValue, studyidasnumber, formattedDate, Assignees, progressStatus, onInsert]
    );

    useEffect(() => {
        console.log("담당자 리스트:", Assignees);
    }, [Assignees]);

    return (
        <form className="TodoInsert" onSubmit={onSubmit}>
            <input
                id="insert-input"
                onChange={onChange}
                value={TaskValue}
                placeholder="할 일을 입력하세요"
                disabled={progressStatus === "DISCONTINUE"}
            />
            <button type="submit">입력</button>
        </form>
    );
};

export default TeamToDoInsert;
