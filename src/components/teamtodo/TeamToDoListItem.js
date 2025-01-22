import cn from 'classnames';
import ToDoList from "../../pages/mypage/ToDoList";
import checkbox from "../../images/check.png";
import uncheckbox from "../../images/unchecked.png";
import ToDoListItems from "../../css/todo_css/ToDoListItem.css";
import React, {useEffect, useState} from "react";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { VscTriangleRight, VscTriangleDown } from "react-icons/vsc";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

//할 일 보여주는 컴포넌트
const TeamToDoListItem = ({
                              todo,
                              todos,
                              setTodos,
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
    // console.log(todos);
    const toggleDetails = () => setShowDetails(!showDetails); // 토글 버튼 클릭 시 상태 변경

    const Assignee = todo.assignees.map((item) => item.nickname);
    // const Assignee = null;

    useEffect(() => {
        const allChecked = todos.every((todo) => todo.toDoStatus === true);
        onAllCheckedChange(todo.toDoId, allChecked); // allChecked 상태 변경
    }, [todos]);

    const loggedInUserId = localStorage.getItem('isLoggedInUserId');
    const currentUserTodoIndex = todos.findIndex(todo => todo.email === loggedInUserId);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <li key={todo.toDoId} className="TodoListItem">
            <div className="TodoHeader">
                <TbTriangleInvertedFilled
                    onClick={toggleDetails}
                    style={{
                        cursor: "pointer",
                        transition: "transform 0.3s ease", // 애니메이션 적용
                        transform: showDetails ? "rotate(0deg)" : "rotate(-90deg)" // 상태에 따라 회전 각도 적용
                    }}
                />
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
                <div className="Remove" onClick={() => onRemove(todo.toDoId)}>
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
                                    if (todo.assignees[index].email === loggedInUserId) {
                                        onToggle(todo.assignees[index].assigneeId, todo.toDoId, currentUserTodoIndex, todos[index].toDoStatus);
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