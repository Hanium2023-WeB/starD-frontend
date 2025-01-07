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
import TeamBlog from "../studypage/TeamBlog";
import TeamBlogGnb from "../../components/repeat_etc/TeamBlogGnb";
import {useTeamBlogContext} from "../../components/datacontext/TeamBlogContext";

const TeamToDoList = () => {

    const { member, studyItem, progressType, todos, setTodos, schedules, loading, error } = useTeamBlogContext();
    console.log(todos);
    console.log(member);

    const [selectedTodo, setSelectedTodo] = useState(null);
    const [insertToggle, setInsertToggle] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const accessToken = localStorage.getItem('accessToken');
    const Year = selectedDate.getFullYear();
    let Month = selectedDate.getMonth() + 1;
    const Dates = selectedDate.getDate();
    const location = useLocation();
    const {studyIdAsNumber, Member, selecteStudy, progressStatus} = location.state || {};
    const [studies, setStudy] = useState([]);
    const [studyMems, setStudyMems] = useState([]);
    const [Assignees, setAssignees] = useState([]);
    // const studyIdAsNumber = parseFloat(studyId);
    const [selectedAssigneeIds, setSelectedAssigneeIds] = useState([]); // 선택된 담당자 ID 추적
    const [showIncomplete, setShowIncomplete] = useState(true); // 미완료 보여주기 상태
    const [showCompleted, setShowCompleted] = useState(false); // 완료 보여주기 상태
    const [allCheckedStates, setAllCheckedStates] = useState({}); // allChecked 상태를 저장할 객체

    console.log("studyId:", studyIdAsNumber);
    console.log("ss:", progressStatus);
    const onInsertToggle = () => {
        if (selectedTodo) {
            setSelectedTodo(null);
        }
        setInsertToggle((prev) => !prev);
    };

    const onChangeSelectedTodo = (todo) => {
        setSelectedTodo(todo);
        console.log(selectedTodo);
    };

    const [todoswithAssignee, setTodoswithAssignee] = useState({});

    const nextId = useRef(1);

    const dateKey = selectedDate.toDateString();

    //담당자 추가 핸들러
    const handleAddAssignees = (e) => {
        const assignId = parseInt(e.currentTarget.dataset.assignId, 10);
        const isAlreadySelected = selectedAssigneeIds.includes(assignId);

        // Update both selectedAssigneeIds and Assignees together
        setSelectedAssigneeIds((prev) => {
            const newSelectedIds = isAlreadySelected
                ? prev.filter((id) => id !== assignId)
                : [...prev, assignId];

            setAssignees((prevAssignees) => {
                const newAssignee = member.find((m) => m.memberId === assignId);
                if (isAlreadySelected) {
                    return prevAssignees.filter((assignee) => assignee.id !== assignId);
                } else {
                    return newAssignee ? [...prevAssignees, newAssignee] : prevAssignees;
                }
            });

            return newSelectedIds;
        });
    };


    //담당자 삭제 핸들러
    const handleRemoveAssignees = async (e) => {
        try {
            const removedAssignId = e.target.value;

            //해당 닉네임을 가진 담당자를 선택에서 해제
            const updatedAssignees = Assignees.filter((item) => item.memberId !== removedAssignId);
            await setAssignees(updatedAssignees);

            console.log("삭제한 후 담당자 상태: ", updatedAssignees);

            //되돌릴 멤버
            const assigneeToAddBack = Member.find((item) => item.memberId === removedAssignId);

            //member에 다시 집어 넣음
            if (assigneeToAddBack) {
                const updatedMember = [...member, assigneeToAddBack];
                console.log("updatedMember-assigneeToAddBack : ", updatedMember);
                // setMember(updatedMember);
            }

            console.log("삭제 후 선택한 담당자들: ", updatedAssignees);

        } catch (error) {
            console.error("Error in handleRemoveAssignees: ", error);
        }
    };
    useEffect(() => {
        console.log('Updated assignees:', Assignees);  // assignees 상태 변경 시 로그 출력
    }, [Assignees]);

    //할 일 추가
    const onInsert = useCallback((task, studyId, formattedDate, selectedNicknames) => {
        console.log("StringAssignees:", selectedNicknames);
        const todoData = {
            task: task,
            dueDate: formattedDate,
            assignees: selectedNicknames,
        };
        console.log(todoData);

        if (selectedNicknames.length > 0) {
            axios.post(`/api/studies/${studyId}/to-dos`, todoData, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then((res) => {
                    alert("Todo가 등록되었습니다.");
                    console.log("전송 성공:", res.data);
                    setAssignees([]);
                    setTodos((prevTodos) => {
                        // 새로 추가된 Todo를 기존 todos 배열에 합침
                        const updatedTodos = [...prevTodos, res.data];
                        return updatedTodos;
                    });
                    nextId.current++;
                })
                .catch((error) => {
                    console.error("전송 실패:", error);
                    alert("Todo 등록에 실패했습니다.");
                });
        } else {
            alert("담당자를 지정해주세요.");
            return;
        }
    }, [selectedDate, studies, todoswithAssignee]);

    const filteredTodos = todos.filter((todo) => {
        // 모든 담당자가 완료했으면 isCompleted가 true
        const isCompleted = todo.assignees.every(assignee => assignee.toDoStatus);

        // 완료된 할 일만 필터링
        if (showCompleted && isCompleted) {
            return true;
        }

        // 미완료된 할 일만 필터링
        if (showIncomplete && !isCompleted) {
            return true;
        }

        // 조건에 맞지 않으면 제외
        return false;
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
            task: UpdatedToDo.task, dueDate: UpdatedToDo.dueDate,
        };
        const toDoId = UpdatedToDo.id;

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
                    if (todo.id === UpdatedToDo.id) {
                        return {
                            ...todo,
                            task: UpdatedToDo.task,
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
                const response = await axios.put(
                    `/api/studies/{studyId}/to-dos/${toDoId}/{assigneeId}`,
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
        // setMember(Member);
    }, [todoswithAssignee, Member, onUpdate]);

    useEffect(() => {
        console.log('Updated selectedAssigneeIds:', selectedAssigneeIds);
    }, [selectedAssigneeIds]);

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

    // useEffect(() => {
    //     axios.get(`/api/studies/${studyIdAsNumber}/to-dos`, {
    //         params: {
    //             year: Year, month: Month,
    //         }, headers: {
    //             Authorization: `Bearer ${accessToken}`,
    //         },
    //     }).then((response) => {
    //         console.log('스터디별 투두리스트 가져오기 성공:', response.data);
    //         const maxId = Math.max(...response.data.map(schedule => schedule.id));
    //         nextId.current = maxId + 1;
    //         const groupedTodos = {};
    //         response.data.forEach((todoItem) => {
    //             const dueDate = new Date(todoItem.dueDate).toDateString();
    //             if (!groupedTodos[dueDate]) {
    //                 groupedTodos[dueDate] = [];
    //             }
    //             groupedTodos[dueDate].push(todoItem);
    //         });
    //
    //         setTodoswithAssignee((prevTodos) => ({
    //             ...prevTodos, ...groupedTodos,
    //         }));
    //     }).catch((error) => {
    //         console.log('스터디별 투두리스트 가져오기 실패:', error);
    //     })
    // }, [studyIdAsNumber, currentMonth]);

    useEffect(() => {
        console.log("todoswithAssignee: ", todoswithAssignee);
        console.log("filteredTodos:", filteredTodos);
    }, [todoswithAssignee, filteredTodos]);


    return (<div>
        <Header showSideCenter={true}/>
        <div className="container">
            <TeamBlogGnb studyIdAsNumber={studyIdAsNumber} Member={Member} selectStudy={selecteStudy} progressStatus={progressStatus}/>
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
                        <div className="select_assignee">
                            <p>담당자</p>
                            {Array.isArray(member) && member.length > 0 && member.map((item, index) => {
                                const isSelected = selectedAssigneeIds.includes(item.memberId); // 선택 여부 확인
                                return (
                                    <div key={index}>
                                        <div
                                            className="assignees"
                                            data-assign-id={item.memberId}
                                            data-assign-name={item.nickname}
                                            onClick={handleAddAssignees}
                                            style={{
                                                backgroundColor: isSelected ? "#99a98f" : "rgba(242, 241, 238, 0.6)", // 선택된 경우 배경색 변경
                                                color: isSelected ? "white" : "black" // 선택된 경우 텍스트 색상 변경
                                            }}
                                        >
                                            {item.nickname}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <TeamToDoInsert onInsert={onInsert} dueDate={selectedDate} Inserttodostudyid={studyIdAsNumber}
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