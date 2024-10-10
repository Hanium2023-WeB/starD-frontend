import React, {useState, useRef, useCallback, useEffect} from "react";
import ToDoInserts from "../../css/todo_css/ToDoInsert.css";
import axios, {post} from "axios";
import {useLocation} from "react-router-dom";

//투두 리스트 추가 함수
//추가할 부분: 서버에서 참여 중인 스터디 내역, 참여 멤버 가지고 오기
//투두리스트 데이터 구조 변경 -> 아이디,스터디 ,할 일,날짜, 담당자

const ToDoInsert = ({onInsert, dueDate, Inserttodostudyid, Inserttodotitle, Inserttodostudy, studyidasnumber}) => {
    const accessToken = localStorage.getItem('accessToken');
    const [studies, setStudy] = useState([]);//참여 중인 스터디 리스트
    const [studyTitles, setStudyTitles] = useState([]); //참여 중인 스터디 제목
    const [studyIds, setStudyIds] = useState([]); //참여 중인 스터디 아이디
    const [studyMems, setStudyMems] = useState(""); //참여 멤버
    const [responseData, setResponseData] = useState([]);
    const isInputDisabled = Inserttodostudyid === "0"; //전체보기일때 input창을 막아두기 위한 변수

    const inputDate = new Date(dueDate);

//서버에 보내줄 날짜 형식 맞추기
//주어진 날짜가 협정 세계시 (UTC)에 맞게 설정되어 있는지 확인
//JavaScript에서는 날짜와 시간을 다룰 때, 기본적으로 현재 로컬 시간대에 따라 처리하므로 UTC로 조정하려면 몇 가지 추가 작업이 필요

    inputDate.setMinutes(inputDate.getMinutes() - inputDate.getTimezoneOffset());
    const year = inputDate.getFullYear();
    const month = inputDate.getMonth() + 1;
    const formattedDate = inputDate.toISOString();


    // TODO 서버에서 참여스터디와 참여멤버 가져오기
    useEffect(() => {
        axios.get("/api/user/mypage/studying", {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("모집완료된 스터디, 참여멤버 전송 성공 : ", res.data);
                const studyList = res.data.content;
                setStudy(studyList);
                // console.log("모집완료 ? :", studies);
                const studiesTitle = studyList.map(item => item.study.title);
                setStudyTitles(studiesTitle);
                const studiesIds = studyList.map(item => item.study.id);
                setStudyIds(studiesIds);
                const ParticipatedStudiesMem = studyList.map(item => item.member.id);
                setStudyMems(ParticipatedStudiesMem[0]);

                console.log("참여 스터디 아이디", studiesIds);
                console.log("참여 스터디 제목", studiesTitle);
                console.log("참여중인 스터디", studyList);
                console.log("참여멤버", ParticipatedStudiesMem);
                console.log('날짜', dueDate);


            })
            .catch((error) => {
                console.error("모집완료된 스터디, 참여멤버  가져오기 실패:", error);
            });

    }, [accessToken]);

    //할 일 state
    const [TaskValue, setTaskValue] = useState('');

    //어떤 스터디의 할 일인지 상태
    const [InsertToDoTitle, setInsertToDoTitle] = useState(Inserttodotitle);
    const [InsertToDoStudyId, setInsertToDoStudyId] = useState(Inserttodostudyid);
    const [InsertToDoStudy, setInsertToDoStudy] = useState(Inserttodostudy); //선택한 스터디 객체
    const studyIdAsNumber = studyidasnumber;
    const nextId = useRef(1);
    const onChange = useCallback(e => {
        setTaskValue(e.target.value);
    }, [])
    //할 일 추가 버튼 함수
    const onSubmit = useCallback(
        async (e) => {
            if (TaskValue === '') {
                alert("할 일을 입력해 주세요.");
                return;
            }
            setTaskValue(''); //value 초기화
            //기본이벤트(새로고침) 방지

            e.preventDefault();

            try {
                // Step 1: 먼저 필요한 데이터를 서버에서 가져옵니다.
/*
                const fetchDataResponse = await axios.get(`/api/todo/all`, {
                    params: {
                        year: year,
                        month: month,
                    },
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                console.log('가져오기 성공:', fetchDataResponse.data);
                setResponseData(fetchDataResponse.data);
                console.log("studyIdAsNumber:", studyIdAsNumber);
*/



                const studyId = studyIdAsNumber;
                const assigneeStr = studyMems;
                const task = TaskValue;
                const study = InsertToDoStudy;

                const todoData = {
                    task: task,
                    dueDate: formattedDate,
                };

                const postDataResponse = await axios.post(`/api/todo`, todoData, {
                    params: {
                        studyId: studyId,
                        assigneeStr: assigneeStr,
                    },
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                console.log("전송 성공:", postDataResponse.data);
                setTaskValue("");

                const createdTodoId = postDataResponse.data.id;
                onInsert(InsertToDoTitle, TaskValue, studyIdAsNumber, createdTodoId);

            } catch (error) {
                console.error("에러:", error);
            }

        },
        [Inserttodotitle, TaskValue, Inserttodostudyid, dueDate, accessToken, onInsert]
    );

    return (
        <form className="TodoInsert" onSubmit={onSubmit}>
            <input id={"insert-input"} onChange={onChange}
                   value={TaskValue}
                   placeholder="할 일을 입력하세요"
                   disabled={isInputDisabled}
                  />
            <button type="submit">입력</button>
        </form>
    );
};
export default ToDoInsert;

