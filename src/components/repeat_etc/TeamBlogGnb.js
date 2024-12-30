import React from "react";
import "../../css/gnb_css/TeamBlogGnb.css";
import {useNavigate} from "react-router-dom";
import teamBlog from "../../pages/studypage/TeamBlog";
const TeamBlogGnb = ({studyIdAsNumber, Member, selectStudy, progressStatus}) => {
    const navigate = useNavigate();
    console.log(studyIdAsNumber);
    console.log(Member);
    console.log(selectStudy);
    console.log(progressStatus);
    const goTeamBlogHome = () => {
        navigate(`/teamblog/${studyIdAsNumber}`,
            {
                state: {
                    studyId: studyIdAsNumber,
                    Member: Member,
                    selectStudy: selectStudy,
                    progressStatus:progressStatus,
                }
            })
    }
    const showAllToDo = () => {
        navigate(`/teamblog/${studyIdAsNumber}/todo-list`,
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
        navigate(`/teamblog/${studyIdAsNumber}/schedule`, {
            state: {
                studyIdAsNumber: studyIdAsNumber,
                Member: Member,
                selectStudy: selectStudy,
                progressStatus:progressStatus,
            }
        })

    }
    const showTeamCommunity = () => {
        navigate(`/teamblog/${studyIdAsNumber}/community`, {
            state: {
                studyId: studyIdAsNumber,
                progressStatus:progressStatus,
            }
        })
    }

    const showTeamMember = () => {
        navigate(`/teamblog/${studyIdAsNumber}/member`, {
            state: {
                studyIdAsNumber: studyIdAsNumber,
                Member: Member,
            }
        })
    }

    return (
        <div className="gnb_bg">
            <ul className="gnb">
                <li onClick={goTeamBlogHome}>팀블로그 홈</li>
                <li onClick={showAllToDo}>TODO</li>
                <li onClick={showAllSchedule}>일정</li>
                <li onClick={showTeamCommunity}>팀 커뮤니티</li>
                <li onClick={showTeamMember}>스터디원</li>
            </ul>
        </div>
    )
}
export default TeamBlogGnb;