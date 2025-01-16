import React, {useState, useRef, useCallback, useEffect} from "react";
import {startOfMonth, endOfMonth, startOfWeek, endOfWeek} from "date-fns";
import {isSameMonth, isSameDay, addDays, parse, format} from "date-fns";
import {CgAddR} from "react-icons/cg";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {parseISO} from 'date-fns';
import TeamEditSchedule from "./TeamEditSchedule";


const TeamRenderScheduleCells = ({
                               studies, studyTitles,
                               currentMonth,
                               selectedDate,
                               onDateClick,
                               meetings,
                               schedules,
                               onUpdate,
                               onRemove,
                             }) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";
  const [editScheduleData, setEditScheduleData] = useState("");
  const [editdata, setEditDate]= useState({});
  const navigate = useNavigate();

  const openEditSchedule = (id,item) => {
    console.log("edit", id);
    setEditScheduleData(id);
    setEditDate(item);
  };
  useEffect(()=>{
    console.log("sss:",editdata );
  },[editdata]);

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, "d");
      const cloneDay = new Date(
          day.getFullYear(),
          day.getMonth(),
          day.getDate()
      );

      days.push(
          <div
              className={`col cell ${
                  !isSameMonth(day, monthStart) 
                      ? "disabled"
                      : isSameDay(day, selectedDate) 
                          ? "selected"
                          : format(currentMonth, "M") !== format(day, "M")
                              ? "not-valid"
                              : "valid"
              }`}
              key={day}
          >
          <span
              className={
                format(currentMonth, "M") !== format(day, "M")
                    ? "text not-valid"
                    : ""
              }
          >
            <CgAddR onClick={() => onDateClick(cloneDay)}/>
            {formattedDate}
          </span>
            <div className="meeting_wrap">
              {Array.isArray(schedules) && schedules
                  .filter((item) => isSameDay(parseISO(item.startDate), cloneDay))
                  .map((item) => (
                      <div key={item.scheduleId} className="event" style={{backgroundColor: item.color}}
                           onClick={() => {
                             openEditSchedule(item.scheduleId, item)
                           }}>
                        <div id="meeting_detail">
                          {item.study && <p>{item.study.title}</p>}
                          <p>{item.title}</p>
                        </div>
                      </div>
                  ))}
            </div>
          </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
        <div className="Schedulerow" key={day}>
          {days}
        </div>
    );
    days = [];
  }
  return (
      <div className="SchedulerContainer">
        {rows}
        {editScheduleData && (
            <TeamEditSchedule
                studies={studies}
                studyTitles={studyTitles}
                editdata={editdata}
                onUpdate={onUpdate}
                onRemove={onRemove}
                onClose={() => {
                  setEditScheduleData(null);
                }}
            />
        )}
      </div>
  );
};

export default TeamRenderScheduleCells;
