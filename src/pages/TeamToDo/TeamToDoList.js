import React, {useState, useRef, useCallback, useEffect} from "react";
import Calender from "../../components/calender/Calender.js";
import {format, subMonths, addMonths} from "date-fns";
import Backarrow from "../../components/repeat_etc/Backarrow.js";
import Header from "../../components/repeat_etc/Header";
import {useLocation} from "react-router-dom";
import axios from "axios";
import TeamToDoInsert from "../../components/teamtodo/TeamToDoInsert";
import TeamToDoEdit from "../../components/teamtodo/TeamToDoEdit";
import TeamToDoListItem from "../../components/teamtodo/TeamToDoListItem";
import TeamToDoList_css from "../../css/todo_css/TeamToDoList.css";
import Category from "../../components/repeat_etc/Category";

const TeamToDoList = () => {
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [insertToggle, setInsertToggle] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const accessToken = localStorage.getItem('accessToken');
    const Year = selectedDate.getFullYear();
    let Month = selectedDate.getMonth() + 1;
    const Dates = selectedDate.getDate();
    const location = useLocation();
    const {studyId, Member, selecteStudy, progressStatus} = location.state;
    const [studies, setStudy] = useState([]);
    const [studyMems, setStudyMems] = useState([]);
    const [member, setMember] = useState(Member);
    const [Assignees, setAssignees] = useState([]);
    const studyIdAsNumber = parseFloat(studyId);
    const [selectedAssigneeIds, setSelectedAssigneeIds] = useState([]); // 선택된 담당자 ID 추적
    const [showIncomplete, setShowIncomplete] = useState(true); // 미완료 보여주기 상태
    const [showCompleted, setShowCompleted] = useState(false); // 완료 보여주기 상태
    const [allCheckedStates, setAllCheckedStates] = useState({}); // allChecked 상태를 저장할 객체

    console.log("studyId:", studyId);
    console.log("ss:", progressStatus);

    useEffect(() => {
        const {studyId, Member, selecteStudy, progressStatus} = location.state;
    }, []);
    const onInsertToggle = () => {
        if (selectedTodo) {
            setSelectedTodo(null);
        }
        setInsertToggle((prev) => !prev);
    };

    const onChangeSelectedTodo = (todo) => {
        setSelectedTodo(todo);
    };

    const [todoswithAssignee, setTodoswithAssignee] = useState({});

    const nextId = useRef(1);

    const dateKey = selectedDate.toDateString();

    //담당자 추가 핸들러
    const handleAddAssignees = (e) => {
        const assignId = e.target.getAttribute('data-assign-id');
        const assignNicName = e.target.getAttribute('data-assign-name');

        // 선택된 담당자 상태 업데이트
        if (selectedAssigneeIds.includes(assignId)) {
            // 이미 선택된 담당자라면, 선택 해제
            setSelectedAssigneeIds((prev) => prev.filter((id) => id !== assignId));
            setAssignees((prev) => prev.filter((assignee) => assignee.id !== assignId));
        } else {
            // 새로운 담당자 선택
            setSelectedAssigneeIds((prev) => [...prev, assignId]);
            setAssignees((prev) => [...prev, {id: assignId, nickname: assignNicName}]);
        }
    };

    //담당자 삭제 핸들러
    const handleRemoveAssignees = async (e) => {
        try {
            const removedAssignId = e.target.value;

            //해당 닉네임을 가진 담당자를 선택에서 해제
            const updatedAssignees = Assignees.filter((item) => item.id !== removedAssignId);
            await setAssignees(updatedAssignees);

            console.log("삭제한 후 담당자 상태: ", updatedAssignees);

            //되돌릴 멤버
            const assigneeToAddBack = Member.find((item) => item.member.id === removedAssignId);

            //member에 다시 집어 넣음
            if (assigneeToAddBack) {
                const updatedMember = [...member, assigneeToAddBack];
                console.log("updatedMember-assigneeToAddBack : ", updatedMember);
                setMember(updatedMember);
            }

            console.log("삭제 후 선택한 담당자들: ", updatedAssignees);

        } catch (error) {
            console.error("Error in handleRemoveAssignees: ", error);
        }
    };
    useEffect(() => {
        console.log("Assignees ::", Assignees);
    }, [Assignees]);

    //할 일 추가
    const onInsert = useCallback(async (task, studyId, formattedDate, StringAssignees) => {
        console.log("StringAssignees:", StringAssignees);
        const todoData = {
            task: task,
            dueDate: formattedDate,
        };

        if (StringAssignees) {
            const postDataResponse = await axios.post(`/api/todo`, todoData, {
                params: {
                    studyId: studyId,
                    assigneeStr: StringAssignees,
                },
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            console.log("전송 성공:", postDataResponse);
            setAssignees([]);
            setTodoswithAssignee((prevTodos) => ({
                ...prevTodos, [dateKey]: [...(prevTodos[dateKey] || []), postDataResponse.data],
            }));
        } else {
            alert("담당자를 지정해주세요.");
            return;
        }
        nextId.current++;

    }, [selectedDate, studies, todoswithAssignee]);

    const filteredTodos = Object.values(todoswithAssignee[dateKey] || []).filter((todo) => {
        const isCompleted = todo.assignees.some(assignee => assignee.toDoStatus); // 하나라도 완료인 경우 true
        console.log(isCompleted);
        if (showIncomplete && !isCompleted) {
            return true; // 미완료인 경우
        }
        if (showCompleted && isCompleted) {
            return true; // 완료인 경우
        }
        return false; // 둘 다 아니면 제외
    });

//할 일 삭제
    const onRemove = useCallback(
        async (id) => {
            alert("삭제하시겠습니까?");

            const deleteDataResponse = await axios.delete(`/api/todo/${id}`, {
                withCredentials: true, headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            console.log("삭제 성공:", deleteDataResponse.data);
            setTodoswithAssignee((prevTodos) => {
                const updatedTodos = {...prevTodos};
                Object.keys(updatedTodos).forEach((dateKey) => {
                    updatedTodos[dateKey] = updatedTodos[dateKey].filter((todo) => todo.id !== id);
                });
                return updatedTodos;
            });
        }, []);

//할 일 업데이트
    const onUpdate = useCallback(async (UpdatedToDo) => {
        console.log("selectedTodo..:", UpdatedToDo);
        onInsertToggle();
        const assigneeIds = UpdatedToDo.assignees.map(assignee => assignee.id);
        const assigneeStr = assigneeIds.toString();

        const updateToDo = {
            task: UpdatedToDo.toDo.task, dueDate: UpdatedToDo.toDo.dueDate,
        };
        const toDoId = UpdatedToDo.toDo.id;

        const postDataResponse = await axios.put(`/api/todo/${toDoId}`, updateToDo, {
            params: {
                assigneeStr: assigneeStr,
            },
            withCredentials: true, headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        console.log("전송 성공:", postDataResponse.data);

        setTodoswithAssignee((prevTodos) => {

            const updatedTodos = {
                ...prevTodos,
                [dateKey]: prevTodos[dateKey].map((todo) => {
                    if (todo.id === UpdatedToDo.toDo.id) {
                        return {
                            ...todo,
                            task: UpdatedToDo.toDo.task,
                            assignees: postDataResponse.data.assignees,
                        };
                    } else {
                        return todo;
                    }
                }),
            };
            return updatedTodos;
        });
    }, [studyMems, selectedDate, studies, todoswithAssignee]);


    //체크
    const onToggle = useCallback(async (assignees, toDoId, currentUserTodoIndex, todo_status) => {
        console.log("id::", toDoId);
        if (currentUserTodoIndex == -1) {
            alert("당신의 할 일이 아닙니다.");
            return;
        } else {
            console.log("assignees=>", assignees);
            console.log("currentUserTodoIndex=>", currentUserTodoIndex);
            console.log("todo_status=>", todo_status);

            const loggedInUserId = localStorage.getItem('isLoggedInUserId');
            console.log("loggedInUserId=>", loggedInUserId);

            console.log("진행 중이다.");
            try {
                const response = await axios.post(
                    `/api/todo/${toDoId}/status`,
                    null,
                    {
                        params: {status: !todo_status},
                        withCredentials: true,
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    }
                );
                if (response.status === 200) {
                    console.log("체크 성공:", response);

                    axios.get(`/api/todo/${studyIdAsNumber}`, {
                        params: {
                            year: Year, month: Month,
                        }, headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }).then((response) => {
                        console.log('스터디별 투두리스트 가져오기 성공:', response.data);
                        const maxId = Math.max(...response.data.map(schedule => schedule.id));
                        nextId.current = maxId + 1;
                        const groupedTodos = {};
                        response.data.forEach((todoItem) => {
                            const dueDate = new Date(todoItem.dueDate).toDateString();
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

                    setTodoswithAssignee((prevTodos) => {
                        const updatedTodos = {...prevTodos};
                        Object.keys(updatedTodos).forEach((dateKey) => {
                            updatedTodos[dateKey] = updatedTodos[dateKey].map((todo) => todo.id === toDoId ? {
                                ...todo,
                                toDoStatus: !todo_status,
                            } : todo);
                        });
                        return updatedTodos;
                    });

                }
            } catch (error) {
                console.error("Error:", error);
            }

        }
    }, []);

    const handleDateClick = (day) => {
        setSelectedDate(new Date(day));
    };

    useEffect(() => {
        setMember(Member);
    }, [todoswithAssignee, Member, onUpdate]);


    const [currentMonth, setCurrentMonth] = useState(new Date());

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

    const handleAllCheckedChange = (todoId, isChecked) => {
        setAllCheckedStates((prev) => ({
            ...prev,
            [todoId]: isChecked, // 해당 todoId에 대한 allChecked 상태 업데이트
        }));
    };

    useEffect(() => {
        Month = format(currentMonth, "M")
    }, [currentMonth]);

    useEffect(() => {
        axios.get(`/api/todo/${studyIdAsNumber}`, {
            params: {
                year: Year, month: Month,
            }, headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }).then((response) => {
            console.log('스터디별 투두리스트 가져오기 성공:', response.data);
            const maxId = Math.max(...response.data.map(schedule => schedule.id));
            nextId.current = maxId + 1;
            const groupedTodos = {};
            response.data.forEach((todoItem) => {
                const dueDate = new Date(todoItem.dueDate).toDateString();
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
    }, [studyIdAsNumber, currentMonth]);

    useEffect(() => {
        console.log("todoswithAssignee: ", todoswithAssignee);
        console.log("filteredTodos:", filteredTodos);
    }, [todoswithAssignee, filteredTodos]);


    return (<div>
        <Header showSideCenter={true}/>
        <div className="container">
            <Category/>
            <div className="main_container">
                <p id={"entry-path"}> 스터디 참여내역 > 팀블로그 > 팀 투두 리스트 </p>
                <Backarrow subname={"팀 투두 리스트"}/>
                <div className="sub_container" id="todo_sub">
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
                            <h3>{`${Year}년 ${Month}월 ${Dates}의 투두입니다.`}</h3>
                            <input
                                type="date"
                                placeholder={"날짜를 선택해주세요."}
                                value={new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000)).toISOString().substring(0, 10)}
                                onChange={(e) => handleDateClick(e.target.value)} // 선택된 날짜를 handleDateClick으로 전달
                            />
                        </div>
                        <div className={"select_assignee"}>
                            <p>담당자</p>
                            {Array.isArray(member) && member.length > 0 && member.map((item, index) => {
                                const isSelected = selectedAssigneeIds.includes(item.member.id); // 선택 여부 확인
                                return (
                                    <div key={index}>
                                        <div
                                            className="assignees"
                                            data-assign-id={item.member.id}
                                            data-assign-name={item.member.nickname}
                                            onClick={handleAddAssignees}
                                            style={{
                                                backgroundColor: isSelected ? "#99a98f" : "rgba(242, 241, 238, 0.6)", // 선택된 경우 배경색 변경
                                                color: isSelected ? "white" : "black" // 선택된 경우 텍스트 색상 변경
                                            }}
                                        >
                                            {item.member.nickname}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <TeamToDoInsert onInsert={onInsert} dueDate={selectedDate} Inserttodostudyid={studyId}
                                        studyidasnumber={studyIdAsNumber} Assignees={Assignees}
                                        progressStatus={progressStatus}/>
                        <ul className="TodoList">
                            {filteredTodos.length === 0 && (<div className="alert_empty_todo">
                                <span>할 일이 없습니다.<br/>  할 일을 입력해주세요.</span>
                            </div>)}
                            {filteredTodos.map((todo => {
                                if (todo) {
                                    return (<TeamToDoListItem
                                        key={todo.id}
                                        todo={todo}
                                        todos={todo.assignees}
                                        onRemove={onRemove}
                                        onToggle={onToggle}
                                        onChangeSelectedTodo={onChangeSelectedTodo}
                                        onInsertToggle={onInsertToggle}
                                        selectedDate={selectedDate}
                                        onAllCheckedChange={handleAllCheckedChange} // 상태 변경 함수 전달
                                        isAllChecked={allCheckedStates[todo.id]} // 현재 allChecked 상태 전달
                                        onClose={() => {
                                            setInsertToggle((prev) => !prev);
                                        }}
                                    />)
                                }
                            }))}
                        </ul>
                        {insertToggle && (<TeamToDoEdit selectedTodo={selectedTodo} onUpdate={onUpdate} Member={Member}
                                                        Assignees={Assignees} onClose={() => {
                            setInsertToggle((prev) => !prev);
                        }}/>)}
                    </div>
                </div>
            </div>
        </div>
    </div>);
};
export default TeamToDoList;