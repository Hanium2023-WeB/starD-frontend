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
    const [studyMems, setStudyMems] = useState([]);
    const [InsertToDoTitle, setInsertToDoTitle] = useState("")
    const [InsertToDoStudyId, setInsertToDoStudyId] = useState("0")
    const [InsertToDoStudy, setInsertToDoStudy] = useState([]);
    const studyIdAsNumber = parseFloat(InsertToDoStudyId);
    const [todoswithAssignee, setTodoswithAssignee] = useState({});
    let lastTodoId = useRef("1");
    console.log("########: ", studyMems);
    useEffect(() => {
        axios.get("/api/user/mypage/studying", {
            withCredentials: true, headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("모집완료된 스터디, 참여멤버 전송 성공 : ", res.data);
                const studyList = res.data.content;
                setStudy(studyList);
                const studiesTitle = studyList.map(item => item.study.title);
                setStudyTitles(studiesTitle);
                const studiesIds = studyList.map(item => item.study.id);
                setStudyIds(studiesIds);

                //TODO - map으로 돌면 멤버가 두 번 저장되어있길래..
                //const ParticipatedStudiesMem = studyList.map(item => item.member.id);
                const ParticipatedStudiesMem = studyList.length > 0 ? studyList[0].member.id : null;

                console.log("&&&&&&&&   :", studyList);
                console.log("&&&&&&&&   :", ParticipatedStudiesMem);
                setStudyMems(ParticipatedStudiesMem);
            })
            .catch((error) => {
                console.error("모집완료된 스터디, 참여멤버  가져오기 실패:", error);
            });
    }, [accessToken]);
    useEffect(() => {
        if (InsertToDoStudyId === "0") {
            axios.get(`/api/todo/all`, {
                params: {
                    year: Year, month: Month,
                }, headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }).then((response) => {
                console.log('전체 스터디 투두리스트 가져오기 성공:', response.data);
                if (response.data.length > 0) {
                    lastTodoId = response.data[response.data.length - 1].toDo.id;
                    console.log('마지막 데이터의 toDo.id:', lastTodoId);
                } else {
                    console.log('투두 데이터가 없습니다.');
                }
                const groupedTodos = {};
                response.data.forEach((todoItem) => {
                    const dueDate = new Date(todoItem.toDo.dueDate).toDateString();
                    if (!groupedTodos[dueDate]) {
                        groupedTodos[dueDate] = [];
                    }
                    groupedTodos[dueDate].push(todoItem);
                });

                setTodoswithAssignee((prevTodos) => ({
                    ...prevTodos, ...groupedTodos,
                }));
            }).catch((error) => {
                console.log('전체 스터디 투두리스트 가져오기 실패:', error);
            })
        } else {
            axios.get(`/api/todo/user/${studyIdAsNumber}`, {
                params: {
                    year: selectedDate.getFullYear(), month: selectedDate.getMonth() + 1,
                }, headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }).then((response) => {
                console.log('스터디별 투두리스트 가져오기 성공:', response.data);
                const maxId = Math.max(...response.data.map(schedule => schedule.id));
                if (response.data.length > 0) {
                    lastTodoId = response.data[response.data.length - 1].toDo.id;
                    console.log('마지막 데이터의 toDo.id:', lastTodoId);

                } else {
                    console.log('투두 데이터가 없습니다.');
                }
                const groupedTodos = {};
                response.data.forEach((todoItem) => {
                    const dueDate = new Date(todoItem.toDo.dueDate).toDateString();
                    if (!groupedTodos[dueDate]) {
                        groupedTodos[dueDate] = [];
                    }
                    groupedTodos[dueDate].push(todoItem);
                });

                setTodoswithAssignee((prevTodos) => ({
                    ...prevTodos, ...groupedTodos,
                }));
            }).catch((error) => {
                console.log('스터디별 투두리스트 가져오기 실패:', error);
            })
        }
    }, [InsertToDoStudyId]);

    const onInsertToggle = () => {
        if (selectedTodo) {
            setSelectedTodo(null);
        }
        setInsertToggle((prev) => !prev);
    };

    const onChangeSelectedTodo = (todo) => {
        setSelectedTodo(todo);
    };


    const dateKey = selectedDate.toDateString();

    const onInsert = useCallback((title, task, studyId, id) => {
        console.error("studyId:", studyId);
        const filteredObjects = studies.find((item) => item.study.id === studyId);
        if (!filteredObjects) {
            console.error("Study not found for studyId:", studyId);
            return;
        } else {
            console.log("filteredObjects", filteredObjects);
            console.log("title", title);
            const dateKey = selectedDate.toDateString();
            const todo = {
                id: id,
                study: filteredObjects.study,
                task: task,
                date: dateKey,
                assignees: filteredObjects.member,
            };
            const TodoWithAssign = {
                toDo: todo, member: filteredObjects.member, toDoStatus: false,
            }

            setTodoswithAssignee((prevTodos) => ({
                ...prevTodos, [dateKey]: [...(prevTodos[dateKey] || []), TodoWithAssign],
            }));
        }
    }, [selectedDate, studies]);

    const filteredTodos = todoswithAssignee[dateKey] || [];


    const onRemove = useCallback(
        async (id) => {
            console.log("id", id);
            alert("삭제하시겠습니까?");

            try {
                const deleteDataResponse = await axios.delete(`/api/todo/${id}`, {
                    withCredentials: true, headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                console.log("삭제 성공:", deleteDataResponse.data);
                setTodoswithAssignee((prevTodos) => {
                    const updatedTodos = {...prevTodos};
                    Object.keys(updatedTodos).forEach((dateKey) => {
                        updatedTodos[dateKey] = updatedTodos[dateKey].filter((todo) => todo.toDo.id !== id);
                    });
                    return updatedTodos;
                });
            } catch (error) {
                console.error("삭제 실패:", error);
                // Handle the error appropriately (e.g., show an error message to the user)
            }
        }, []);

    const onUpdate = async (UpdatedToDo) => {
        console.log("selectedTodo..:", UpdatedToDo);
        onInsertToggle();
        const assigneeStr = studyMems.toString();
        console.log("assigneeStr..:", assigneeStr);
        console.log("dueDate..:", UpdatedToDo.toDo.date);

        //TODO - (2023-11-06T16:45:12.958) 이런 식으로 날짜 넘기면 오류 안 나요
        const currentDate = new Date();
        const offset = currentDate.getTimezoneOffset();
        currentDate.setMinutes(currentDate.getMinutes() - offset);

        const isoString = currentDate.toISOString(); // 현재 날짜 및 시간을 ISO 8601 형식의 문자열로 변환
        console.log("isoString..:", isoString);

        const todoData = {
            task: UpdatedToDo.toDo.task, dueDate: isoString,
        };
        const postDataResponse = await axios.put(`/api/todo/${UpdatedToDo.toDo.id}`, todoData, {
            params: {
                studyId: UpdatedToDo.toDo.study.id, assigneeStr: assigneeStr,
            }, withCredentials: true, headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((postDataResponse) => {
                console.log("전송 성공:", postDataResponse.data);

                const updatedTodos = {
                    ...todoswithAssignee,
                    [dateKey]: todoswithAssignee[dateKey].map((todo) =>
                        todo.toDo.id === UpdatedToDo.toDo.id
                            ? {
                                toDo: {
                                    ...todo.toDo,
                                    study: {...todo.toDo.study, id: UpdatedToDo.toDo.study.id},
                                    task: UpdatedToDo.toDo.task,
                                },
                                toDoStatus: todo.toDoStatus,
                            }
                            : todo
                    ),
                };

                setTodoswithAssignee(updatedTodos);
                console.log("전송 성공t:", updatedTodos);
            })
            .catch((error) => {
                console.error("전송 실패:", error);
            });
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

    const [currentMonth, setCurrentMonth] = useState(new Date());

    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };
    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    useEffect(() => {
        Month = format(currentMonth, "M")
    }, [currentMonth]);


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

    return (<div>
        <Header showSideCenter={true}/>
        <div className="container">
            <Category/>
            <div className="main_container">
                <Backarrow subname={"투두 리스트"}/>
                <div className="sub_container" id="todo_sub">
                    <div className="todo_container">
                        <div className="today">
                            {" "}
                            <span>{`오늘은 ${Year}년 ${Month}월 ${Dates}일입니다.`}</span>
                        </div>
                        <div>
                            <select id="todo-select" onChange={selectStudy} value={InsertToDoTitle}>
                                <option value="전체">전체보기</option>
                                {studyTitles.map((item, index) => (
                                    <option key={index} value={item}>{item}</option>

                                ))}
                            </select>
                        </div>
                        <ToDoInsert onInsert={onInsert} dueDate={selectedDate} Inserttodostudyid={InsertToDoStudyId}
                                    Inserttodotitle={InsertToDoTitle} Inserttodostudy={InsertToDoStudy}
                                    studyidasnumber={studyIdAsNumber} onClose={() => {
                            setInsertToggle((prev) => !prev);
                        }}/>
                        <ul className="TodoList">
                            {filteredTodos.length === 0 && (<div className="alert_empty_todo">
                                <span>할 일이 없습니다.<br/>  할 일을 입력해주세요.</span>
                            </div>)}
                            {filteredTodos.map((todo => {
                                if (todo.toDo) {
                                    return (<ToDoListItem
                                        todos={todo}
                                        key={todo.toDo.id}
                                        onRemove={onRemove}
                                        onToggle={onToggle}
                                        onChangeSelectedTodo={onChangeSelectedTodo}
                                        onInsertToggle={onInsertToggle}
                                        selectedDate={selectedDate}

                                    />)
                                }
                            }))}
                        </ul>
                        {insertToggle && (<ToDoEdit selectedTodo={selectedTodo} onUpdate={onUpdate}
                                                    participatedstudies={studies} onClose={() => {
                            setInsertToggle((prev) => !prev);
                        }}/>)}
                    </div>
                    <Calender todo={todoswithAssignee} onDateClick={handleDateClick} prevMonth={prevMonth}
                              nextMonth={nextMonth} currentMonth={currentMonth}/>
                </div>
            </div>
        </div>
    </div>);
};
export default ToDoList;
