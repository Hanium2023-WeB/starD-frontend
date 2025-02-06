import ScrapButton from "../repeat_etc/ScrapButton";
import {useNavigate} from "react-router-dom";
import React from "react";
import ImageComponent from "../image/imageComponent";

function calculateDateDifference(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const timeDifference = end - start;
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

    return daysDifference;
}

function checkRecruitStatus(recruitStatus) {
    if (recruitStatus == "RECRUITING")
        return "👐🏻 모집 중";
    else
        return "✅ 모집 완료";
}

function checkProgressStatus(progressStatus) {
    if (progressStatus == "IN_PROGRESS")
        return "🧑🏻‍💻 진행 중";
    else if (progressStatus == "CANCELED")
        return "🚥 중단된 스터디";
    else if (progressStatus == "COMPLETED")
        return "🏁 진행 완료";
}

const StudyListItem = ({studies, toggleScrap, index, isParticipateStudy, goNextTeamBlog, goEvaluationPage}) => {
    const daysDifference = calculateDateDifference(studies.activityStart, studies.activityDeadline);

    const recruitStatus = isParticipateStudy ? checkProgressStatus(studies.progressType) : checkRecruitStatus(studies.recruitmentType, studies.progressType);
    const navigate = useNavigate();


    const GoNextDetailPage = () => {
        // console.log(d.id);
        navigate(`/study/detail/${studies.studyId}`, {state: {id: studies.studyId}});

    }

    return (
        <div className="list studyListHover" key={studies.id}>
            <div className="list_header">
                <div className="list_sub_header">
                    <div className="list_day">
                        ✏️ {daysDifference}일간의 스터디
                    </div>
                    <div className="list_status">{recruitStatus}</div>
                </div>
                <div className="list_btn">
                    <div className="list_scrap">
                        {/* 스크랩 버튼을 클릭하면 해당 스터디 리스트 항목의 스크랩 상태를 토글 */}
                        <ScrapButton scrap={studies.existsScrap}
                                     onClick={() => toggleScrap(index)}/>
                    </div>
                </div>
            </div>
            <div className="top">
                <div className="list_founder">
                    <ImageComponent imageUrl={studies.profileImg}/>
                    <span>{studies.nickname}</span>
                </div>
                {studies.progressType === "COMPLETED" ? (
                    <button className="evaluation_btn" study={studies}
                            onClick={() => goEvaluationPage(studies)}>팀원 평가</button>
                ) : null}
            </div>
            <div className="list_title" onClick={GoNextDetailPage}>{studies.title}</div>
            <div className="list_tag_wrapper" onClick={GoNextDetailPage}>
                {(studies.tagText ? studies.tagText.split(',') : studies.tags ? studies.tags.split(',') : [])
                    .filter(tag => tag) // 빈 태그 필터링
                    .map((tag, idx) => (
                        <div key={idx} className="list_tag">
                            {tag.trim()}
                        </div>
                    ))}
            </div>
            <div className="list_onoff" onClick={GoNextDetailPage}>{studies.activityType}</div>
            <div className="stroke"></div>
            <div style={{display: "flex", justifyContent: "space-between"}}>

                {isParticipateStudy ? (
                    <div className="list_deadline">
                        종료일 | {studies.activityDeadline}
                    </div>
                ) : (
                    <div className="list_deadline">
                        마감일 | {studies.recruitmentDeadline}
                    </div>
                )}

                {isParticipateStudy && (

                    <div className="buttons">
                        <button id="go-teamblog" onClick={() => goNextTeamBlog(studies)}>팀 블로그 가기</button>
                    </div>
                )}

            </div>
        </div>
    )
}
export default StudyListItem;