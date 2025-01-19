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
import toast from "react-hot-toast";

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
                    toast.success("투두를 등록했습니다");
                    console.log("전송 성공:", res.data);
                    setAssignees([]);
                    setTodos((prevTodos) => {
                        // 새로 추가된 Todo를 기존 todos 배열에 합침
                        const updatedTodos = [...prevTodos, res.data];
                        return updatedTodos;
                    });
                    nextId.current++;

                    // 담당자 선택 상태 초기화
                    setSelectedAssigneeIds([]);
                    setAssignees([]);
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


    //할 일 삭제
    const onRemove = useCallback((id) => {
        if (!window.confirm("삭제하시겠습니까?")) {
            return;
        }

        axios.delete(`/api/studies/${studyIdAsNumber}/to-dos/${id}`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((response) => {
                console.log("삭제 성공:", response.data);

                // 응답 데이터를 기반으로 todos 업데이트
                setTodos((prevTodos) => prevTodos.filter((todo) => todo.toDoId !== id));
            })
            .catch((error) => {
                console.error("삭제 실패:", error);
            });
    }, [studyIdAsNumber, accessToken]);


    //할 일 업데이트
    const onUpdate = useCallback((UpdatedToDo) => {
        console.log("selectedTodo..:", UpdatedToDo);
        onInsertToggle();
        const newAssignees = UpdatedToDo.assignees.map(assignee => assignee.nickname);
        console.log(newAssignees);

        const updateToDo = {
            task: UpdatedToDo.task,
            dueDate: UpdatedToDo.dueDate,
            assignees: newAssignees,
        };
        const toDoId = UpdatedToDo.toDoId;

        axios.put(`/api/studies/${studyIdAsNumber}/to-dos/${toDoId}`, updateToDo, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("전송 성공:", res.data);
                setTodos((prevTodos) =>
                    prevTodos.map(todo =>
                        todo.toDoId === toDoId ? res.data : todo
                    )
                );
            })
            .catch((error) => {
                console.error("업데이트 실패:", error);
            });
    }, [studyMems, selectedDate, studies, todoswithAssignee]);


    //체크
    const onToggle = useCallback((assigneeId, toDoId, currentUserTodoIndex, todo_status) => {
        console.log("id::", toDoId);

        if (currentUserTodoIndex === -1) {
            alert("당신의 할 일이 아닙니다.");
            return;
        }

        console.log("assignees=>", assigneeId);
        console.log("currentUserTodoIndex=>", currentUserTodoIndex);
        console.log("todo_status=>", todo_status);

        // Optimistically update the local state
        setTodos((prevTodos) =>
            prevTodos.map((todo) => {
                if (todo.toDoId === toDoId) {
                    const updatedAssignees = todo.assignees.map((assignee) => {
                        if (assignee.assigneeId === assigneeId) {
                            return { ...assignee, toDoStatus: !todo_status };
                        }
                        return assignee;
                    });

                    const allChecked = updatedAssignees.every((assignee) => assignee.toDoStatus);
                    return { ...todo, assignees: updatedAssignees, toDoStatus: allChecked };
                }
                return todo;
            })
        );

        axios
            .put(
                `/api/studies/${studyIdAsNumber}/to-dos/${toDoId}/${assigneeId}`,
                null,
                {
                    params: { status: !todo_status },
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            )
            .then((res) => {
                if (res.status === 200) {
                    console.log("체크 성공:", res.data);

                    toast.success("투두를 완료했습니다! 🎉");
                    axios
                        .get(`/api/todo/${studyIdAsNumber}`, {
                            params: {
                                year: Year,
                                month: Month,
                            },
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        })
                        .then((res) => {
                            console.log("스터디별 투두리스트 가져오기 성공:", res.data);
                            setTodos(res.data);
                        })
                        .catch((error) => {
                            console.error("스터디별 투두리스트 가져오기 실패:", error);
                        });
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
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
                            <h3>{`${Year}년 ${Month}월 ${Dates}일의 투두입니다.`}</h3>
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
                            {filteredTodos.length === 0 && (<div className="alert_empty_todo" style={{marginTop:"25px"}}>
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
                        {insertToggle && (<TeamToDoEdit selectedTodo={selectedTodo} onUpdate={onUpdate} Member={member}
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