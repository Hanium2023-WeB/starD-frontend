import React, { useState, useEffect, useCallback } from "react";
import Editcss from "../../css/todo_css/ToDoEdit.css";

const TeamToDoEdit = ({ selectedTodo, onUpdate, Member, onClose }) => {
    console.log(selectedTodo);
    const initialAssignees = selectedTodo?.assignees?.map((item) => ({ assigneeId: item.assigneeId, nickname: item.nickname })) || [];
    console.log(initialAssignees);
    const [todoassignees, setTodoAssignees] = useState(initialAssignees);
    const [task, setTask] = useState('');

    // `selectedTodo`와 `selectedTodo.task`가 있는지 확인하여 상태 초기화
    useEffect(() => {
        if (selectedTodo && selectedTodo.task) {
            setTask(selectedTodo.task);
        }
    }, [selectedTodo]);

    const handleToggleAssignee = (nickname) => {
        setTodoAssignees((prevAssignees) => {
            const isSelected = prevAssignees.some((assignee) => assignee.nickname === nickname);
            return isSelected
                ? prevAssignees.filter((assignee) => assignee.nickname !== nickname)
                : [...prevAssignees, { nickname }];
        });
    };

    const handleTaskChange = (e) => {
        setTask(e.target.value);
    };

    const onSubmit = useCallback(
        (e) => {
            e.preventDefault();

            if (todoassignees.length === 0) {
                alert("담당자를 선택해주세요.");
                return;
            }

            if (task.trim() === '') {
                alert("할 일을 적어주세요.");
                return;
            }

            const isAssigneesChanged = () => {
                const normalizeAssignees = (assignees) =>
                    assignees.map((a) => a.nickname).sort();

                const originalAssignees = normalizeAssignees(selectedTodo.assignees || []);
                const currentAssignees = normalizeAssignees(todoassignees);

                return JSON.stringify(originalAssignees) !== JSON.stringify(currentAssignees);
            };

            const isTaskChanged = task.trim() !== selectedTodo.task;
            const isAnyChange = isTaskChanged || isAssigneesChanged();

            if (!isAnyChange) {
                alert("수정된 사항이 없습니다.");
                return;
            }

            const updatedTodo = {
                ...selectedTodo,
                task,
                assignees: todoassignees,
            };

            console.log("업데이트된 todo:", updatedTodo);
            onUpdate(updatedTodo);
            onClose(); // 창 닫기
        },
        [task, todoassignees, onUpdate, onClose, selectedTodo]
    );



    if (!selectedTodo) {
        return null; // selectedTodo가 없을 때 컴포넌트 미표시
    }

    return (
        <div className="background">
            <form onSubmit={onSubmit} className="todoedit_insert">
                <h2>todo 수정</h2>
                <div className="select_assignee">
                    <p>담당자</p>
                    {Member.map((item) => {
                        const isSelected = todoassignees.some((assignee) => assignee.nickname === item.nickname);
                        return (
                            <div
                                key={item.memberId}
                                className={`assignees ${isSelected ? "selected" : "unselected"}`}
                                onClick={() => handleToggleAssignee(item.nickname)} // nickname을 사용
                                style={{
                                    backgroundColor: isSelected ? "#99a98f" : "#f2f1ee99",
                                    color: isSelected ? "white" : "black"
                                }}
                            >
                                {item.nickname}
                            </div>
                        );
                    })}
                </div>
                <input
                    onChange={handleTaskChange}
                    value={task}
                    placeholder="할 일을 입력하세요"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            onSubmit(e);
                        }
                    }}
                />
                <div className="todo-edit-btn">
                    <button type="submit" id="edit">수정</button>
                    <button id="cancel" type="button" onClick={onClose}>
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TeamToDoEdit;
