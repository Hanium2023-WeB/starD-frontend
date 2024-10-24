import React from "react";
import "../../css/gnb_css/TeamBlogGnb.css";
import {useNavigate} from "react-router-dom";
const TeamBlogGnb = ({studyIdAsNumber, Member, selectStudy, progressStatus}) => {
    const navigate = useNavigate();
    console.log(studyIdAsNumber);
    console.log(Member);
    console.log(selectStudy);
    console.log(progressStatus);
    const showAllToDo = () => {
        navigate(`/${studyIdAsNumber}/teamblog/TeamToDoList`,
            {
                state: {
                    studyIdAsNumber: studyIdAsNumber,
                    Member: Member,
                    selectStudy: selectStudy,
                    progressStatus:progressStatus,
                }
            })
    }
    const showAllSchedule = () => {
        navigate(`/${studyIdAsNumber}/teamblog/TeamSchedule`, {
            state: {
                studyIdAsNumber: studyIdAsNumber,
                Member: Member,
                selectStudy: selectStudy,
                progressStatus:progressStatus,
            }
        })

    }
    const showTeamCommunity = () => {
        navigate(`/${studyIdAsNumber}/teamblog/TeamCommunity`, {
            state: {
                studyIdAsNumber: studyIdAsNumber,
                progressStatus:progressStatus,
            }
        })
    }

    const showTeamMember = () => {
        navigate(`/${studyIdAsNumber}/teamblog/TeamMember`, {
            state: {
                studyIdAsNumber: studyIdAsNumber,
                Member: Member,
            }
        })
    }

    return (
        <div className="gnb_bg">
            <ul className="gnb">
                <li>팀블로그 홈</li>
                <li onClick={showAllToDo}>TODO</li>
                <li onClick={showAllSchedule}>일정</li>
                <li onClick={showTeamCommunity}>팀 커뮤니티</li>
                <li onClick={showTeamMember}>스터디원</li>
            </ul>
        </div>
    )
}
export default TeamBlogGnb;