import React, {useEffect, useState} from "react";
import axios from "axios";
import "../../css/report_css/Report.css";

const Report = ({ show, handleClose, onReportSubmit, targetId, targetType }) => {
    const [selectedReason, setSelectedReason] = useState(null);
    const [customReason, setCustomReason] = useState("");
    const accessToken = localStorage.getItem('accessToken');

    const handleReportReasonClick = (reason) => {
        setSelectedReason(reason);
        if (reason === "기타(사용자 입력)") {
            setCustomReason("");
        }
    };

    const handleReport = () => {
        let reasonToSend = selectedReason;

        if (reasonToSend && accessToken) {
            axios.post("/api/reports",
                {
                    targetId: targetId,
                    postType: targetType,
                    reportReason: reasonToSend,
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
        if (selectedReason === "기타(사용자 입력)") {
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
                                    className={`report-reason ${selectedReason === '욕설/비방' ? 'selected' : ''}`}
                                    onClick={() => handleReportReasonClick('욕설/비방')}
                                >
                                    욕설/비방
                                </div>
                                <div
                                    className={`report-reason ${selectedReason === '광고' ? 'selected' : ''}`}
                                    onClick={() => handleReportReasonClick('광고')}
                                >
                                    광고
                                </div>
                                <div
                                    className={`report-reason ${selectedReason === '음란물' ? 'selected' : ''}`}
                                    onClick={() => handleReportReasonClick('음란물')}
                                >
                                    음란물
                                </div>
                                <div
                                    className={`report-reason ${selectedReason === '도배성 글' ? 'selected' : ''}`}
                                    onClick={() => handleReportReasonClick('도배성 글')}
                                >
                                    도배성 글
                                </div>
                                <div
                                    className={`report-reason ${selectedReason === '기타(사용자 입력)' ? 'selected' : ''}`}
                                    onClick={() => handleReportReasonClick('기타(사용자 입력)')}
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
