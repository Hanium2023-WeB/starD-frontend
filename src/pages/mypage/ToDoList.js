import React, {useState, useRef, useCallback, useEffect} from "react";
import ToDoListItem from "../../components/todo/ToDoListItem";
import ToDoInsert from "../../components/todo/ToDoInsert";
import ToDoEdit from "../../components/todo/ToDoEdit.js";
import Category from "../../components/repeat_etc/Category";
import Mypage from "../../css/mypage_css/Mypage.css";
import Editcss from "../../css/todo_css/ToDoEdit.css";
import ToDo from "../../css/todo_css/ToDo.css";
import ToDoListItems from "../../css/todo_css/ToDoListItem.css";
import ToDoInserts from "../../css/todo_css/ToDoInsert.css";
import Calender from "../../components/calender/Calender.js";
import {format, subMonths, addMonths} from "date-fns";
import Backarrow from "../../components/repeat_etc/Backarrow.js";
import Header from "../../components/repeat_etc/Header";
import {useLocation} from "react-router-dom";
import axios from "axios";


const ToDoList = ({sideheader}) => {
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [insertToggle, setInsertToggle] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const accessToken = localStorage.getItem('accessToken');
    const Year = selectedDate.getFullYear();
    let Month = selectedDate.getMonth() + 1;
    const Dates = selectedDate.getDate();

    const [studies, setStudy] = useState([]);
    const [studyTitles, setStudyTitles] = useState([]);
    const [studyIds, setStudyIds] = useState([]);

    const [todos, setTodos] = useState([]);

    const [studyMems, setStudyMems] = useState([]);
    const [InsertToDoTitle, setInsertToDoTitle] = useState("")
    const [InsertToDoStudyId, setInsertToDoStudyId] = useState("0")
    const [InsertToDoStudy, setInsertToDoStudy] = useState([]);
    const studyIdAsNumber = parseFloat(InsertToDoStudyId);
    const [todoswithAssignee, setTodoswithAssignee] = useState({});

    const [showIncomplete, setShowIncomplete] = useState(true); // 미완료 보여주기 상태
    const [showCompleted, setShowCompleted] = useState(false); // 완료 보여주기 상태

    let lastTodoId = useRef("1");

    useEffect(() => {
        axios.get("/api/members/studies/participate", {
            params: { page: 1 },
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("모집완료된 스터디, 참여멤버 전송 성공 : ", res.data.studyRecruitPosts);
                const studyList = res.data.studyRecruitPosts;
                setStudy(studyList);
                const studiesTitle = studyList.map(item => item.title);
                setStudyTitles(studiesTitle);
                const studiesIds = studyList.map(item => item.studyId);
                setStudyIds(studiesIds);
            })
            .catch((error) => {
                console.error("모집완료된 스터디, 참여멤버  가져오기 실패:", error);
            });
    }, [accessToken]);

    useEffect(() => {
        if (studyIds.length > 0) {
            // 각 studyId별로 API 호출
            const todoRequests = studyIds.map((studyId) =>
                axios.get(`/api/studies/${studyId}/to-dos`, {
                    params: { year: Year, month: Month },
                    headers: { Authorization: `Bearer ${accessToken}` }
                })
            );

            // 모든 요청이 완료된 후 결과 처리
            Promise.all(todoRequests)
                .then((responses) => {
                    const localNickname = localStorage.getItem("nickname");
                    const filteredTodos = [];

                    responses.forEach((response) => {
                        const todos = response.data;
                        console.log(response.data);

                        todos.forEach((todoItem) => {
                            // assignees 배열에서 localNickname과 일치하는 항목이 있는지 확인
                            const hasMatchingAssignee = todoItem.assignees.some(
                                (assignee) => assignee.nickname === localNickname
                            );

                            if (hasMatchingAssignee) {
                                filteredTodos.push(todoItem);
                            }
                        });
                    });

                    setTodos(filteredTodos);
                    console.log("필터링된 투두리스트:", filteredTodos);
                })
                .catch((error) => {
                    console.log("스터디별 투두리스트 가져오기 실패:", error);
                });
        }
    }, [studyIds, Year, Month, accessToken]);

    useEffect(() => {
        console.log(todos);
    }, [todos]);

    const onInsertToggle = () => {
        if (selectedTodo) {
            setSelectedTodo(null);
        }
        setInsertToggle((prev) => !prev);
    };

    const onChangeSelectedTodo = (todo) => {
        setSelectedTodo(todo);
    };

    const onToggle = useCallback(async (id, todo_status) => {
        console.log("체크 스터디 아이디", id);
        console.log("체크 전 상태", todo_status);
        console.log("체크 후 상태", !todo_status);
        const postDataResponse = await axios.post(`/api/todo/${id}/status`, null, {
            params: {status: !todo_status},
            withCredentials: true, headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        console.log("체크 성공:", postDataResponse.data);
        setTodoswithAssignee((prevTodos) => {
            const updatedTodos = {...prevTodos};
            Object.keys(updatedTodos).forEach((dateKey) => {
                updatedTodos[dateKey] = updatedTodos[dateKey].map((todo) => todo.toDo.id === id ? {
                    ...todo,
                    toDo: {
                        ...todo.toDo,
                    },
                    toDoStatus: !todo.toDoStatus
                } : todo);
            });
            return updatedTodos;
        });
    }, [studyIdAsNumber]);

    const handleDateClick = (day) => {
        setSelectedDate(new Date(day));
        console.log(`선택한 날짜 : ${day}`);
    };

    const selectStudy = (e) => {
        setInsertToDoTitle(e.target.value)
        if (e.target.value !== "전체") {
            const selectedStudy = studies.find((study) => study.study.title === e.target.value);
            const selectedId = selectedStudy.study.id;
            setInsertToDoStudyId(selectedId);
            setInsertToDoStudy(selectedStudy);
            console.log(e.target.value);
            console.log("선택한 스터디 아이디", selectedId);
        } else if (e.target.value === "전체") {
            const allselect = "0";
            setInsertToDoStudyId(allselect);
            console.log("전체 select: ", allselect);
        }
    }
    useEffect(() => {
        console.log("InsertToDoStudyId_투두리스트:::", InsertToDoStudyId);
        console.log("studyIdAsNumber_투두리스트:::", studyIdAsNumber);
        console.log("filteredTodos", filteredTodos);

    }, [InsertToDoStudyId, studyIdAsNumber]);

    // 미완료 버튼 클릭 핸들러
    const handleShowIncomplete = () => {
        setShowIncomplete(true);
        setShowCompleted(false);
    };

    // 완료 버튼 클릭 핸들러
    const handleShowCompleted = () => {
        setShowIncomplete(false);
        setShowCompleted(true);
    };

    const filteredTodos = todos.filter((todo) => {
        // Todo의 날짜를 00:00:00으로 설정하여 비교
        const todoDate = new Date(todo.dueDate);
        todoDate.setHours(0, 0, 0, 0); // 시간 부분을 00:00:00으로 설정

        // selectedDate의 시간도 00:00:00으로 설정
        const selectedDateCopy = new Date(selectedDate);
        selectedDateCopy.setHours(0, 0, 0, 0); // 시간 부분을 00:00:00으로 설정

        // 날짜 비교
        const isSameDate = todoDate.getTime() === selectedDateCopy.getTime();

        // 모든 assignee의 toDoStatus가 true일 때 완료로 간주
        const allAssigneesCompleted = todo.assignees.every((assignee) => assignee.toDoStatus === true);

        // assignee 상태에 따른 완료/미완료 여부 체크
        const isIncomplete = todo.assignees.length > 0
            ? !allAssigneesCompleted
            : !todo.toDoStatus;

        const isComplete = allAssigneesCompleted || (todo.assignees.length === 0 && todo.toDoStatus);

        return (
            isSameDate &&
            ((showCompleted && isComplete) || (showIncomplete && isIncomplete))
        );
    });

    return (<div>
        <Header showSideCenter={true}/>
        <div className="container">
            <Category/>
            <div className="main_container">
                <Backarrow subname={"투두 리스트"}/>
                <div className="sub_container" id="todo_sub" style={{left:"40px"}}>
                    <div className="todo_container">
                        <div className="todo_status">
                            <div
                                onClick={handleShowIncomplete}
                                style={{
                                    backgroundColor: showIncomplete ? "#99a98f" : "#F2F1EE99", // 미완료 버튼 색상
                                    color: showIncomplete ? "white" : "black"
                                }}
                            >
                                미완료
                            </div>
                            <div
                                onClick={handleShowCompleted}
                                style={{
                                    backgroundColor: showCompleted ? "#99a98f" : "#F2F1EE99", // 완료 버튼 색상
                                    color: showCompleted ? "white" : "black"
                                }}
                            >
                                완료
                            </div>
                        </div>
                        <div className="today">
                            <h3>{`오늘은 ${Year}년 ${Month}월 ${Dates}일입니다.`}</h3>
                            <input
                                type="date"
                                placeholder={"날짜를 선택해주세요."}
                                value={new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000)).toISOString().substring(0, 10)}
                                onChange={(e) => handleDateClick(e.target.value)} // 선택된 날짜를 handleDateClick으로 전달
                            />
                        </div>
                        <div>
                            <select id="todo-select" onChange={selectStudy} value={InsertToDoTitle}>
                                <option value="전체">전체보기</option>
                                {studyTitles.map((item, index) => (
                                    <option key={index} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                        <ul className="TodoList">
                            {filteredTodos.length === 0 && (<div className="alert_empty_todo">
                                <span>할 일이 없습니다.<br/>  할 일을 입력해주세요.</span>
                            </div>)}
                            {filteredTodos.map((todo => {
                                if (todo.toDo) {
                                    return (<ToDoListItem
                                        todos={todo}
                                        key={todo.toDo.id}
                                        onToggle={onToggle}
                                        onChangeSelectedTodo={onChangeSelectedTodo}
                                        onInsertToggle={onInsertToggle}
                                        selectedDate={selectedDate}
                                    />)
                                }
                            }))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>);
};
export default ToDoList;
