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
        navigate(`/admin/MemberManagement/page=${selectedPage}`);
    };
    //TODO 신고목록 조회
    // TODO 5회 이상 신고된 목록 가져오기
    useEffect(() => {
        axios.get("http://localhost:8080/reports", {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("전송 성공");
                console.log(res.data);

                setReports(res.data);
            })
            .catch((error) => {
                console.error('신고 목록을 가져오는 중 오류 발생: ', error);
            });
    }, []);

    const openReasonModal = (report) => {
        // TODO 신고 사유 조회
        axios.get(`http://localhost:8080/reports/reason/${report.id}`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("전송 성공");
                console.log("신고 사유: ", res.data);

                setReportReason(res.data);
                setShowReasonModal(true);
            })
            .catch((error) => {
                console.error('신고 이유를 가져오는 중 오류 발생: ', error);
            });

        document.body.classList.add("modal-open");
    }

    const closeReasonModal = () => {
        setShowReasonModal(false);
        document.body.classList.add("modal-open");
    }

    const tableType = (report) => {
        if (report.tableType === "COMM") {
            return "커뮤니티";
        } else if (report.tableType === "STUDY") {
            return "스터디";
        }
        // 예시: 삭제할 대상이 댓글인 경우
        else if (report.tableType === "REPLY") {
            return "댓글";
        } else if (report.tableType === "STUDYPOST") {
            return "스터디 게시글";
        }
    }

    const tableTypeID = (report) => {
        if (report.tableType === "COMM") {
            return report.post.id;
        } else if (report.tableType === "STUDY") {
            return report.study.id;
        }
        // 예시: 삭제할 대상이 댓글인 경우
        else if (report.tableType === "REPLY") {
            return report.reply.id;
        } else if (report.tableType === "STUDYPOST") {
            return report.studyPost.id;
        }
    }

    const getTitleOrContent = (report) => {
        if (report.tableType === "COMM") {
            return report.post.title;
        } else if (report.tableType === "STUDY") {
            return report.study.title;
        }
        // 예시: 삭제할 대상이 댓글인 경우
        else if (report.tableType === "REPLY") {
            return report.reply.content;
        } else if (report.tableType === "STUDYPOST") {
            return report.studyPost.title;
        }
    }

    //TODO 신고승인
    const handleReportAccept = (report) => {
        console.log("**** ", report.id);
        const confirmReject = window.confirm("신고를 승인하시겠습니까?");

        if (confirmReject) {
            axios.post(`http://localhost:8080/reports/accept/${report.id}`, null, {
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
                        return prevReports.filter((prevReport) => prevReport.id !== report.id);
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
            axios.delete(`http://localhost:8080/reports/${report.id}`, {
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
                        return prevReports.filter((prevReport) => prevReport.id !== report.id);
                    });
                })
                .catch((error) => {
                    console.error('신고 반려 중 오류 발생: ', error);
                    alert("신고 반려에 실패하였습니다.");

                });
        }
    }

    const getTranslatedReason = (reason) => {
        switch (reason) {
            case 'ABUSE':
                return '욕설/비방';
            case 'PROMOTION':
                return '광고';
            case 'ADULT':
                return '음란물';
            case 'SPAM':
                return '도배성 글';
            default:
                return reason;
        }
    };

    // 렌더링 전에 신고 수 계산
    const reportCounts = reports.map(report => report.reportCount || 0);

    // TODO 신고 수 계산
    useEffect(() => {
        reports.forEach((report) => {
            if (!report.reportCount) {
                axios.get(`http://localhost:8080/reports/report-count/${report.id}`, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                    .then((res) => {
                        setReports((prevReports) => {
                            const updatedReports = prevReports.map((prevReport) => {
                                if (prevReport.id === report.id) {
                                    return {
                                        ...prevReport,
                                        reportCount: res.data
                                    };
                                }
                                return prevReport;
                            });
                            return updatedReports;
                        });
                    })
                    .catch((error) => {
                        console.error('신고 수를 가져오는 중 오류 발생: ', error);
                    });
            }
        });
    }, [reports, accessToken]);

    // TODO 제목 클릭 시 해당 게시글 팝업 창 띄우기
    const openPopup = (report) => {
        let popupUrl;
        if (report.tableType === 'COMM') {
            popupUrl = `/postdetail/${tableTypeID(report)}`;
            window.open(popupUrl, '_blank', 'width=800,height=600');
        } else if (report.tableType === 'STUDY') {
            popupUrl = `/studydetail/${tableTypeID(report)}`;
            window.open(popupUrl, '_blank', 'width=800,height=600');
        } else if (report.tableType === 'REPLY') {
            // TODO 댓글 id로 댓글 객체 가져오기
            axios.get(`http://localhost:8080/replies/${report.reply.id}`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then((res) => {
                    if (res.data.type === "STUDY") {
                        popupUrl = `/studydetail/${res.data.study.id}`;
                    } else if (res.data.type === "COMM") {
                        popupUrl = `/postdetail/${res.data.post.id}`;
                    } else if (res.data.type === "STUDYPOST") {
                        popupUrl = `/${res.data.study.id}/teamblog/TeamCommunity/studypostdetail/${res.data.studyPost.id}`;
                    }

                    window.open(popupUrl, '_blank', 'width=800,height=600');
                })
                .catch((error) => {
                    console.error('댓글 객체를 가져오는 중 오류 발생: ', error);
                });
        } else if (report.tableType === 'STUDYPOST') {
            // TODO studypost id로 study id 알아오기
            axios.get(`http://localhost:8080/study/post/${report.studyPost.id}`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then((res) => {
                    let studyId = res.data.study.id;
                    popupUrl = `/${studyId}/teamblog/TeamCommunity/studypostdetail/${tableTypeID(report)}`;
                    window.open(popupUrl, '_blank', 'width=800,height=600');
                })
                .catch((error) => {
                    console.error('스터디 id를 가져오는 중 오류 발생: ', error);
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
                                {/*<th>게시글 / 댓글 ID</th>*/}
                                <th>게시글 제목 / 댓글 내용</th>
                                <th>신고 횟수</th>
                                <th>신고 사유</th>
                                <th>신고 승인 버튼</th>
                                <th>신고 반려 버튼</th>
                            </tr>
                            </thead>
                            <tbody>
                            {reports.map((report, index) => (
                                <tr key={report.id}>
                                    <td>{tableType(report)}</td>
                                    {/*<td>{tableTypeID(report)}</td>*/}
                                    <td>
                                        <div className="report_title"
                                             onClick={() => openPopup(report)}>{getTitleOrContent(report)}</div>
                                    </td>
                                    <td>{reportCounts[index]}</td>
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
                                                    {Object.entries(reportReason).map(([reason, count], index) => (
                                                        <p id="report-reason"
                                                           key={index}>{getTranslatedReason(reason)}: {count}회</p>
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
        </div>
    )
}
export default ReportManagement;