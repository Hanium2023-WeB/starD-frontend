import React, {useEffect, useState} from "react";
import axios from "axios";
import "../../css/report_css/Report.css";

const Report = ({ show, handleClose, onReportSubmit, targetId }) => {
    const [selectedReason, setSelectedReason] = useState(null);
    const [customReason, setCustomReason] = useState(null);
    const accessToken = localStorage.getItem('accessToken');
    const [type, setType] = useState(null);

    // TODO - 신고 대상 글 타입 알아오기
    useEffect(() => {
        if (targetId) {
            axios
                .get(`/api/replies/type/${targetId}`, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                .then((response) => {
                    const type = response.data;
                    setType(type);
                    console.log("신고 게시글 id, 타입: ", targetId, type);
                })
                .catch((error) => {
                    console.error("스터디 타입을 가져오는 중 에러 발생:", error);
                });
        }
    }, [targetId, accessToken]);


    const handleReportReasonClick = (reason) => {
        setSelectedReason(reason);
        if (reason === "ETC") {
            setCustomReason("");
        }
    };

    const handleReport = () => {
        let url;
        if (type === "QNA" || type === 'COMM') {
            url = "/api/reports/posts";
        } else if (type === "STUDY") {
            url = "/api/reports/studies";
        } else if (type === "REPLY") {
            url = "/api/reports/replies";
        } else if (type === "STUDYPOST") {
            url = "/api/reports/studyposts";
        }

        let reasonToSend = selectedReason;

        if (reasonToSend && accessToken) {
            axios.post(
                url,
                {
                    id: targetId,
                    reason: reasonToSend,
                    customReason: customReason,
                }, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                .then((response) => {
                    alert("신고되었습니다.");
                    onReportSubmit(reasonToSend);
                    handleClose();
                })
                .catch((error) => {
                    if (error.response) {
                        if (error.response.data && error.response.data.message) {
                            alert(error.response.data.message);
                        } else {
                            console.error("Error reporting:", error);
                        }
                        handleClose();
                    }
                });
        }
    };

    const renderCustomReasonInput = () => {
        if (selectedReason === "ETC") {
            return (
                <div>
                    <textarea
                        placeholder="기타 신고 사유를 입력하세요"
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                    />
                </div>
            );
        }
        return null;
    };

    useEffect(() => {
        if (!show) {
            // 모달이 닫힐 때 selectedReason 초기화
            setSelectedReason(null);
            setCustomReason(null);
        }
    }, [show]);

    return (
        <>
            {show && (
                <div className="modal-container">
                    <div className="modal-backdrop" onClick={handleClose}>
                        <div className="modal-view" onClick={(event) => event.stopPropagation()}>
                            <div className="modal-close-button" onClick={handleClose}>X</div>
                            <div id="modal-content">
                                <h3>신고 사유 선택</h3>
                                <div
                                    className={`report-reason ${selectedReason === 'ABUSE' ? 'selected' : ''}`}
                                    onClick={() => handleReportReasonClick('ABUSE')}
                                >
                                    욕설/비방
                                </div>
                                <div
                                    className={`report-reason ${selectedReason === 'PROMOTION' ? 'selected' : ''}`}
                                    onClick={() => handleReportReasonClick('PROMOTION')}
                                >
                                    광고
                                </div>
                                <div
                                    className={`report-reason ${selectedReason === 'ADULT' ? 'selected' : ''}`}
                                    onClick={() => handleReportReasonClick('ADULT')}
                                >
                                    음란물
                                </div>
                                <div
                                    className={`report-reason ${selectedReason === 'SPAM' ? 'selected' : ''}`}
                                    onClick={() => handleReportReasonClick('SPAM')}
                                >
                                    도배성 글
                                </div>
                                <div
                                    className={`report-reason ${selectedReason === 'ETC' ? 'selected' : ''}`}
                                    onClick={() => handleReportReasonClick('ETC')}
                                >
                                    기타(사용자 입력)
                                </div>
                                {renderCustomReasonInput()}
                                <br/>
                                <button className="report-button" onClick={handleReport}>
                                    신고
                                </button>
                                <br/>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Report;
