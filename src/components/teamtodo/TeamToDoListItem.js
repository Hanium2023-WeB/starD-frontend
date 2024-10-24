import cn from 'classnames';
import ToDoList from "../../pages/mypage/ToDoList";
import checkbox from "../../images/check.png";
import uncheckbox from "../../images/unchecked.png";
import ToDoListItems from "../../css/todo_css/ToDoListItem.css";
import React, {useEffect, useState} from "react";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

//할 일 보여주는 컴포넌트
const TeamToDoListItem = ({
                              todo,
                              todos,
                              onRemove,
                              onToggle,
                              onChangeSelectedTodo,
                              onInsertToggle,
                              selectedDate,
                              onAllCheckedChange,
                              isAllChecked, // props로 전달받은 allChecked 상태
                          }) => {
    const [showDetails, setShowDetails] = useState(false); // 토글 상태를 관리하는 상태값
    console.log(todo);
    console.log(todos);
    const toggleDetails = () => setShowDetails(!showDetails); // 토글 버튼 클릭 시 상태 변경

    const Assignee = todo.assignees.map((item) => item.member.nickname);

    useEffect(() => {
        const allChecked = todos.every((todo) => todo.toDoStatus === true);
        onAllCheckedChange(todo.id, allChecked); // allChecked 상태 변경
    }, [todos]);

    // useEffect(() => {
    //     console.log("TODO changed:", todo);
    // }, [todo]);
    //
    // console.log('todo:', todo);
    // console.log('todos:', todos);

    // const TODO = todos[0];
    // const [selectedTodo, setSelectedTodo] = useState(null);
    //
    //
    const loggedInUserId = localStorage.getItem('isLoggedInUserId');
    // const currentUserTodoIndex = todos.findIndex(todo => todo.member.id === loggedInUserId);
    //
    // 만약 현재 로그인한 사용자의 할 일이 존재한다면 해당 할 일의 상태를 전달합니다.
    // const currentUserTodoStatus = currentUserTodoIndex !== -1 ? todos[currentUserTodoIndex].toDoStatus : false;
    //
    // console.log("currentUserTodoIndex: ", currentUserTodoIndex);
    // console.log("상태..?: ", currentUserTodoStatus);
    //
    // 모든 담당자의 toDoStatus가 true인지 확인
    // const allTodoStatusTrue = todos.every(todo => todo.toDoStatus === true);
    // console.log("모든 할 일의 상태가 true인가?: ", allTodoStatusTrue);
    //
    // console.log('TODO:', TODO.toDo.id);
    // console.log("넘어온 담당자 닉네임들", Assignee);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <li key={todo.id} className="TodoListItem">
            <div className="TodoHeader">
                {/* 토글 버튼 왼쪽에 배치 */}
                <TbTriangleInvertedFilled onClick={toggleDetails} style={{cursor:"pointer"}}/>
                {/* 변환된 날짜 출력 */}
                <div className="TodoDate">
                    {formatDate(selectedDate)}
                </div>
                {/* 할 일 오른쪽에 배치 */}
                <div className="Todo" style={{ textDecoration: isAllChecked ? 'line-through' : 'none' }}>
                    {todo.task}
                </div>

                {/* 수정 및 삭제 버튼 */}
                <div className="Edit" onClick={() => {
                    onInsertToggle();
                    onChangeSelectedTodo(todo);
                }}>
                    <FaEdit />
                </div>
                <div className="Remove" onClick={() => onRemove(todo.id)}>
                    <FaTrashAlt />
                </div>
            </div>

            {/* 담당자 리스트와 체크박스 */}
            {showDetails && (
                <div className="TodoContent">
                    {Assignee.map((assignee, index) => (
                        <div key={index} className="TodoRows">
                            <p className="assignee">{assignee}</p>
                            <div
                                className={cn('checkbox', { checked: todos[index].toDoStatus })}
                                onClick={() => {
                                    // 현재 사용자가 담당자인 경우에만 체크를 토글
                                    if (todo.assignees[index].member.id === loggedInUserId) {
                                        onToggle(assignee, todo.id, todos[index].toDoStatus);
                                    } else {
                                        // 체크가 불가능함을 알리는 메시지를 표시할 수 있습니다.
                                        alert("본인만 체크할 수 있습니다.");
                                    }
                                }}
                            >
                                {todos[index].toDoStatus ? (
                                    <img src={checkbox} width="20px" />
                                ) : (
                                    <img src={uncheckbox} width="20px" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </li>
    );
};

export default TeamToDoListItem;