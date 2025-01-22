import cn from 'classnames';
import ToDoList from "../../pages/mypage/ToDoList";
import checkbox from "../../images/check.png";
import uncheckbox from "../../images/unchecked.png";
import editicon from "../../images/edit.png";
import removeicon from "../../images/remove.png";
import ToDoListItems from "../../css/todo_css/ToDoListItem.css";
import {useEffect} from "react";

//할 일 보여주는 컴포넌트
const ToDoListItem = ({todos, onToggle, onChangeSelectedTodo, onInsertToggle, selectedDate}) => {
     console.log('todo:', todos);

    return(
        <li key={todos.toDoId} className="TodoListItem">
            <div className={cn('checkbox', { checked: todos.toDoStatus })} onClick={() => onToggle(todos.studyId, todos.toDoId, todos.assigneeId, todos.toDoStatus)}>
                {todos.toDoStatus ? <img src={checkbox} width="20px" /> : <img src={uncheckbox} width="20px" />}
                <div className="text">{todos.task}</div>
            </div>
        </li>
    );
};

export default ToDoListItem;
