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
    const {studyId, Member, selecteStudy} = location.state;
    const [studies, setStudy] = useState([]);
    const [studyMems, setStudyMems] = useState([]);
    const [member, setMember] = useState(Member);
    const [Assignees, setAssignees] = useState([]);
    const studyIdAsNumber = parseFloat(studyId);


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
    ;

    //담당자 추가 핸들러
    const handleAddAssignees = (e) => {
        const assignNicName = e.target.getAttribute('data-assign-name');
        console.log("assignName : ", assignNicName);
        const updatedAssignees = [...Assignees, assignNicName];
        console.log("updatedAssignees : ", updatedAssignees);
        setAssignees(updatedAssignees);

        const updatedMember = member.filter((item) => item.member.nickname !== assignNicName); //지정된 멤버 제외 남은 멤버
        console.log("updatedMember : ", updatedMember);
        setMember(updatedMember);
    };

    //담당자 삭제 핸들러
    const handleRemoveAssignees = async (e) => {
        try {
            const removedAssignName = e.target.value;

            //해당 닉네임을 가진 담당자를 선택에서 해제
            const updatedAssignees = Assignees.filter((item) => item !== removedAssignName);
            await setAssignees(updatedAssignees);

            console.log("삭제한 후 담당자 상태: ", updatedAssignees);

            //되돌릴 멤버
            const assigneeToAddBack = Member.find((item) => item.member.nickname === removedAssignName);

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


    //할 일 추가
    const onInsert = useCallback(async (task, studyId, formattedDate, StringAssignees) => {
        console.log("StringAssignees:", StringAssignees);
        const todoData = {
            task: task,
            dueDate: formattedDate,
        };

        if (StringAssignees) {
            const postDataResponse = await axios.post(`http://localhost:8080/todo`, todoData, {
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

    const filteredTodos = todoswithAssignee[dateKey] || [];

//할 일 삭제
    const onRemove = useCallback(
        async (id) => {
            alert("삭제하시겠습니까?");

            const deleteDataResponse = await axios.delete(`http://localhost:8080/todo/${id}`, {
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
        const assigneeStr = UpdatedToDo.assignees.toString();
        const todoData = {
            task: UpdatedToDo.toDo.task, dueDate: UpdatedToDo.toDo.dueDate,
        };
        const postDataResponse = await axios.put(`http://localhost:8080/todo/${UpdatedToDo.toDo.id}`, todoData, {
            params: {
                studyId: UpdatedToDo.toDo.study.id, assigneeStr: assigneeStr,
            }, withCredentials: true, headers: {
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
    const onToggle = useCallback(async (assignees, id, todo_status) => {
        const postDataPromises = assignees.map(async (item) => {
            const status = !item.toDoStatus;
            return axios.post(
                `http://localhost:8080/todo/${item.toDo.id}/status`,
                null,
                {
                    params: {status: status},
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );
        });

        try {
            const postDataResponses = await Promise.all(postDataPromises);
            console.log("체크 성공:", postDataResponses);
        } catch (error) {
            console.error("Error:", error);

        }

        setTodoswithAssignee((prevTodos) => {
            const updatedTodos = {...prevTodos};
            Object.keys(updatedTodos).forEach((dateKey) => {
                updatedTodos[dateKey] = updatedTodos[dateKey].map((todo) => todo.id === id ? {
                    ...todo,
                    toDoStatus: !todo.toDoStatus,
                } : todo);
            });
            return updatedTodos;
        });
    }, []);

    const handleDateClick = (day) => {
        setSelectedDate(new Date(day));
    };

    useEffect(() => {
        setMember(Member);
    }, [todoswithAssignee, Member, onUpdate]);


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

    useEffect(() => {
        axios.get(`http://localhost:8080/todo/${studyIdAsNumber}`, {
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
        console.log("todoswithAssignee: ",todoswithAssignee);
        console.log("filteredTodos:",filteredTodos);
    }, [todoswithAssignee,filteredTodos]);
    

    return (<div>
        <Header showSideCenter={true}/>
        <div className="container">
            <Category/>
            <div className="main_container">
                <p id={"entry-path"}> 스터디 참여내역 > 팀블로그 > 팀 투두 리스트 </p>
                <Backarrow subname={"팀 투두 리스트"}/>
                <div className="sub_container" id="todo_sub">
                    <div className="todo_container">
                        <div className="today">
                            {" "}
                            <span>{`오늘은 ${Year}년 ${Month}월 ${Dates}일입니다.`}</span>
                        </div>
                        <div className={"select_assignee"}>
                            <p>담당자</p>
                            {Array.isArray(member) && member.length > 0 && member.map((item, index) => (
                                <div className={"assignees"} key={index}>
                                    <div
                                        className="assignee-name"
                                        data-assign-name={item.member.nickname}
                                        value={item}
                                        onClick={handleAddAssignees}>
                                        {item.member.nickname}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={"selected-assignees"}>
                            <p>선택한 담당자</p>
                            {Assignees.map((assignee, index) => (
                                <div className={"assignees"}>
                                    <div key={index}>{assignee}</div>
                                    <button id={"delete_assignees"} value={assignee}
                                            onClick={handleRemoveAssignees}>x
                                    </button>
                                </div>
                            ))}


                        </div>
                        <TeamToDoInsert onInsert={onInsert} dueDate={selectedDate} Inserttodostudyid={studyId}
                                        studyidasnumber={studyIdAsNumber} Assignees={Assignees}/>
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
                                        Assignees={Assignees}
                                        Member = {Member}
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
                    <Calender todo={todoswithAssignee} onDateClick={handleDateClick} prevMonth={prevMonth}
                              nextMonth={nextMonth} currentMonth={currentMonth}/>
                </div>
            </div>
        </div>
    </div>);
};
export default TeamToDoList;