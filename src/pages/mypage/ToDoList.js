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
import toast from "react-hot-toast";


const ToDoList = ({sideheader}) => {
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [insertToggle, setInsertToggle] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTitle, setSelectedTitle] = useState("전체");
    const accessToken = localStorage.getItem('accessToken');
    const year = selectedDate.getFullYear();
    let month = selectedDate.getMonth() + 1;
    const dates = selectedDate.getDate();

    const [studies, setStudy] = useState([]);
    const [studyTitles, setStudyTitles] = useState([]);
    const [studyIds, setStudyIds] = useState([]);

    const [todos, setTodos] = useState([]);

    const [InsertToDoStudyId, setInsertToDoStudyId] = useState("0")
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
        const url = selectedTitle === "전체"
            ? `/api/members/to-dos`
            : `/api/members/to-dos/${studyIds.find(id =>
                studies.find((study => study.title === selectedTitle && study.studyId === id)))}`;

        console.log("Fetching schedules from URL:", url);
        axios.get(url, {
            params: { year, month },
            headers: { Authorization: `Bearer ${accessToken}` },
        })
            .then((res) => {
                console.log(res.data);
                setTodos(res.data);
            })
            .catch((error) => {
                console.error("스터디별 투두리스트 가져오기 실패:", error);
            });
    }, [selectedTitle, studyIds, year, month, accessToken]);


    const onInsertToggle = () => {
        if (selectedTodo) {
            setSelectedTodo(null);
        }
        setInsertToggle((prev) => !prev);
    };

    const onChangeSelectedTodo = (todo) => {
        setSelectedTodo(todo);
    };

    const onToggle = useCallback(
        async (studyId, toDoId, assigneeId, todo_status) => {
            try {
                const updatedStatus = !todo_status;
                const postDataResponse = await axios.put(
                    `/api/studies/${studyId}/to-dos/${toDoId}/${assigneeId}`,
                    null,
                    {
                        params: { status: updatedStatus },
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                setTodos((prevTodos) =>
                    prevTodos.map((todo) =>
                        todo.toDoId === toDoId
                            ? { ...todo, toDoStatus: !todo_status }
                            : todo
                    )
                );

                // Toast notification
                if (updatedStatus) {
                    toast.success("투두를 완료했습니다!");
                } else {
                    toast.success("투두 완료를 취소했습니다.");
                }
            } catch (error) {
                console.error("체크 상태 변경 실패:", error);
                toast.error("체크 상태 변경에 실패했습니다.");
            }
        },
        [accessToken]
    );

    const handleDateClick = (day) => {
        setSelectedDate(new Date(day));
        console.log(`선택한 날짜 : ${day}`);
    };

    const handleSelectChange = (e) => {
        setSelectedTitle(e.target.value);
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

    const filteredTodos = (Array.isArray(todos) ? todos : []).filter((todo) => {
        const todoDate = new Date(todo.dueDate);
        todoDate.setHours(0, 0, 0, 0); // 시간 부분을 00:00:00으로 설정

        const selectedDateCopy = new Date(selectedDate);
        selectedDateCopy.setHours(0, 0, 0, 0); // 시간 부분을 00:00:00으로 설정

        const isSameDate = todoDate.getTime() === selectedDateCopy.getTime();

        const isIncomplete = !todo.toDoStatus;
        const isComplete = todo.toDoStatus;

        return (
            isSameDate &&
            ((showCompleted && isComplete) || (showIncomplete && isIncomplete))
        );
    }).map((todo) => {
        // studyId와 studies의 studyId를 비교해 title을 추가
        const study = studies.find((studyItem) => studyItem.studyId === todo.studyId);
        return {
            ...todo,
            studyTitle: study ? study.title : "스터디 제목 없음", // 일치하는 스터디 제목이 없을 경우 기본값 설정
        };
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
                            <h3>{`오늘은 ${year}년 ${month}월 ${dates}일입니다.`}</h3>
                            <input
                                type="date"
                                placeholder={"날짜를 선택해주세요."}
                                value={new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000)).toISOString().substring(0, 10)}
                                onChange={(e) => handleDateClick(e.target.value)} // 선택된 날짜를 handleDateClick으로 전달
                            />
                        </div>
                        <div>
                            <select value={selectedTitle} onChange={handleSelectChange}>
                                <option value="전체">전체보기</option>
                                {studyTitles.map((item, index) => (
                                    <option key={index} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                        <div className="TodoList">
                            {filteredTodos.length === 0 && (
                                <div className="alert_empty_todo">
                                    <span>할 일이 없습니다.<br /> 할 일을 입력해주세요.</span>
                                </div>
                            )}
                            {Object.entries(
                                filteredTodos.reduce((acc, todo) => {
                                    const { studyTitle } = todo;
                                    if (!acc[studyTitle]) acc[studyTitle] = [];
                                    acc[studyTitle].push(todo);
                                    return acc;
                                }, {})
                            ).map(([studyTitle, todos]) => (
                                <div key={studyTitle} className="study-group">
                                    <h2 className="study-title">{studyTitle}</h2>
                                    <ul>
                                        {todos.map((todo) => (
                                            <ToDoListItem
                                                todos={todo}
                                                key={todo.toDoId}
                                                onToggle={onToggle}
                                                onChangeSelectedTodo={onChangeSelectedTodo}
                                                onInsertToggle={onInsertToggle}
                                                selectedDate={selectedDate}
                                                studyTitle={todo.studyTitle}
                                            />
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>);
};
export default ToDoList;
