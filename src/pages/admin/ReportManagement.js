import React, {useEffect, useState} from "react";
import axios from "axios";
import "../../css/admin_css/Admin.css";
import Header from "../../components/repeat_etc/Header";
import AdminCategory from "../../components/repeat_etc/AdminCategory";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Paging from "../../components/repeat_etc/Paging";

const ReportManagement = () => {
    const [reports, setReports] = useState([]);
    const [reportReason, setReportReason] = useState([]);
    const [customReason, setCustomReason] = useState([]);
    const [showReasonModal, setShowReasonModal] = useState(false);

    const accessToken = localStorage.getItem('accessToken');

    const location = useLocation();
    const navigate = useNavigate();
    const pageparams = location.state ? location.state.page : 1;
    const [page, setPage] = useState(pageparams);
    const [count, setCount] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);


    const handlePageChange = (selectedPage) => {
        setPage(selectedPage);
        navigate(`/admin/ReportManagement/page=${selectedPage}`);
    };

    //TODO 신고목록 조회
    useEffect(() => {
        axios.get("/api/reports", {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("전송 성공");
                console.log(res.data);

                setReports(res.data.reports);
                setItemsPerPage(res.data.currentPage);
                setCount(res.data.totalPage);
            })
            .catch((error) => {
                console.error('신고 목록을 가져오는 중 오류 발생: ', error);
            });
    }, []);

    const openReasonModal = (report) => {
        // TODO 신고 사유 조회
        axios.get(`/api/reports/${report.targetId}`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("전송 성공");
                console.log("신고 사유: ", res.data);

                setReportReason(res.data.reportReasons);
                setCustomReason(res.data.customReasons)
                setShowReasonModal(true);
            })
            .catch((error) => {
                console.error('신고 사유를 가져오는 중 오류 발생: ', error);
            });

        document.body.classList.add("modal-open");
    }

    const closeReasonModal = () => {
        setShowReasonModal(false);
        document.body.classList.add("modal-open");
    }

    const tableType = (report) => {
        if (report.postType === "COMM") {
            return "커뮤니티";
        } else if (report.postType === "STUDY") {
            return "스터디";
        }
        // 예시: 삭제할 대상이 댓글인 경우
        else if (report.postType === "REPLY") {
            return "댓글";
        } else if (report.postType === "STUDYPOST") {
            return "스터디 게시글";
        }
    }

    //TODO 신고승인
    const handleReportAccept = (report) => {
        const confirmReject = window.confirm("신고를 승인하시겠습니까?");

        if (confirmReject) {
            axios.post(`/api/reports/${report.targetId}/approve?postType=${report.postType}`, null, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then((res) => {
                    console.log("신고 승인 성공");
                    alert("신고가 승인되었습니다.");

                    // 리포트 삭제 또는 갱신 로직 추가
                    setReports((prevReports) => {
                        return prevReports.filter((prevReport) => prevReport.targetId !== report.targetId);
                    });
                })
                .catch((error) => {
                    console.error('신고 승인 중 오류 발생: ', error);
                    alert("신고 승인에 실패하였습니다.");
                });
        }
    }

    //TODO 신고반려
    const handleReportReject = (report) => {
        const confirmReject = window.confirm("신고를 반려하시겠습니까?");

        if (confirmReject) {
            axios.post(`/api/reports/${report.targetId}/reject?postType=${report.postType}`, null, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then((res) => {
                    console.log("신고 반려 성공");
                    alert("신고가 반려되었습니다.");

                    // 리포트 삭제 또는 갱신 로직 추가
                    setReports((prevReports) => {
                        return prevReports.filter((prevReport) => prevReport.targetId !== report.targetId);
                    });
                })
                .catch((error) => {
                    console.error('신고 반려 중 오류 발생: ', error);
                    alert("신고 반려에 실패하였습니다.");

                });
        }
    }

    // TODO 제목 클릭 시 해당 게시글 팝업 창 띄우기
    const openPopup = (report) => {
        let popupUrl;
        if (report.postType === 'COMM') {
            popupUrl = `/postdetail/${report.targetId}`;
            window.open(popupUrl, '_blank', 'width=800,height=600');
        } else if (report.postType === 'STUDY') {
            popupUrl = `/studydetail/${report.targetId}`;
            window.open(popupUrl, '_blank', 'width=800,height=600');
        } else if (report.postType === 'REPLY') {
            // // TODO 댓글 id로 게시글 정보 가져오기
            axios.get(`/api/replies/${report.targetId}/parent`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then((res) => {
                    if (res.data.parentPostType === "STUDY") {
                        popupUrl = `/studydetail/${res.data.parentId}`;
                    } else if (res.data.parentPostType === "COMM") {
                        popupUrl = `/postdetail/${res.data.parentId}`;
                    } else if (res.data.parentPostType === "STUDYPOST") {
                        popupUrl = `/${res.data.parentId}/teamblog/TeamCommunity/studypostdetail/${res.data.targetId}`;
                    }

                    window.open(popupUrl, '_blank', 'width=800,height=600');
                })
                .catch((error) => {
                    console.error('댓글의 부모 게시글 정보를 가져오는 중 오류 발생: ', error);
                });
        } else if (report.tableType === 'STUDYPOST') {
            // TODO studypost id로 study id 알아오기
            axios.get(`/api/studies/${report.targetId}/parent`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then((res) => {
                    popupUrl = `/${res.data.parentId}/teamblog/TeamCommunity/studypostdetail/${res.data.targetId}`;
                    window.open(popupUrl, '_blank', 'width=800,height=600');
                })
                .catch((error) => {
                    console.error('팀블로그 id로 스터디 정보를 가져오는 중 오류 발생: ', error);
                });
        }
    };

    return (
        <div>
            <Header showSideCenter={true}/>
            <div className="container admin_container">
                <h1 className="admin">관리자 페이지</h1>
                <div className={"admin_body_container"}>
                <div className="admin_body">
                    <AdminCategory/>
                </div>

                <div className="admin_sub_container">
                    <h2 className="admin_title">신고 관리</h2>
                    <div className="admin_table_wrapper">
                        <h3>&nbsp;</h3>
                        <table className="report_admin_table">
                            <thead>
                            <tr>
                                <th>구분</th>
                                <th>게시글 제목 / 댓글 내용</th>
                                <th>신고 횟수</th>
                                <th>신고 사유</th>
                                <th>신고 승인 버튼</th>
                                <th>신고 반려 버튼</th>
                            </tr>
                            </thead>
                            <tbody>
                            {reports.map((report, index) => (
                                <tr key={report.targetId}>
                                    <td>{tableType(report)}</td>
                                    <td>
                                        <div className="report_title"
                                             onClick={() => openPopup(report)}>{report.content}</div>
                                    </td>
                                    <td>{report.reportCount}</td>
                                    <td>
                                        <button className="reason_btn" onClick={() => openReasonModal(report)}>신고 사유
                                        </button>

                                    </td>
                                    <td>
                                        <button className="remove_btn" onClick={() => handleReportAccept(report)}>신고
                                            승인
                                        </button>
                                    </td>
                                    <td>
                                        <button className="reject_btn" onClick={() => handleReportReject(report)}>신고
                                            반려
                                        </button>
                                    </td>
                                    {showReasonModal && (
                                        <div className="modal">
                                            <div className="modal-content">
                                                <span className="close" onClick={closeReasonModal}>&times;</span>
                                                <h3>신고 사유</h3>
                                                <div id="report-reason">
                                                    {/* reportReasons 표시 */}
                                                    {reportReason.map((item, index) => (
                                                        <div key={`reportReason-${index}`}>
                                                            <span>{item.reason}</span>
                                                            {item.count > 0 && <span>: {item.count}회</span>}
                                                        </div>
                                                    ))}

                                                    {/* customReasons 표시 */}
                                                    {reportReason.length > 0 && customReason.length > 0 && <hr />}
                                                    {customReason.map((reason, index) => (
                                                        <div key={`customReason-${index}`}>
                                                            <span>{reason}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                </div>
            </div>
            <div className={"paging"}>
                <Paging page={page} totalItemCount={count} itemsPerPage={itemsPerPage}
                        handlePageChange={handlePageChange}/>
            </div>
        </div>
    )
}
export default ReportManagement;