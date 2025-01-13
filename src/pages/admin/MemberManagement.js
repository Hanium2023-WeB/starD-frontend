import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import Header from "../../components/repeat_etc/Header";
import AdminCategory from "../../components/repeat_etc/AdminCategory";
import {useLocation, useNavigate} from "react-router-dom";
import Paging from "../../components/repeat_etc/Paging";

const MemberManagement = () => {
    const [members, setMembers] = useState([]);

    const accessToken = localStorage.getItem('accessToken');

    const navigate = useNavigate();
    const location = useLocation();
    const pageparams = location.state ? location.state.page : 1;
    const [page, setPage] = useState(pageparams);
    const [totalElements, setTotalElements] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const handlePageChange = (selectedPage) => {
        setPage(selectedPage);
        navigate(`/admin/MemberManagement/page=${selectedPage}`);
    };

    //TODO 신고 횟수 1이상인 멤버 리스트 가져오기
    const fetchReportedMembers = (pageNumber) => {
        axios.get("/api/reports/members", {
            params: {page: pageNumber},
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("전송 성공");
                console.log(res.data);

                setTotalElements(res.data.totalElements);
                setMembers(res.data.members);
                setTotalPages(res.data.totalPages);
            })
            .catch((error) => {
                console.error('회원의 누적 신고 목록을 가져오는 중 오류 발생: ', error);
            });
    };

    useEffect(() => {
        fetchReportedMembers(page);
    }, [page]);

    //TODO 강제탈퇴
    const handleWithdraw = useCallback((member) => {
        const confirmWithdraw = window.confirm("정말로 강제 탈퇴 시키겠습니까?");

        if (confirmWithdraw) {
            axios.post(`/api/reports/members/${member.memberId}`, null,
                {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                }).then((res) => {
                console.log(res.data.deletedMemberId, "번 회원이", res.data.message);
                alert("탈퇴 처리되었습니다.");

                // 탈퇴 후 회원 목록 갱신 로직 추가
                setMembers((prevMembers) => {
                    return prevMembers.filter((prevMember) => prevMember.memberId !== member.memberId);
                });

            }).catch((error) => {
                console.log(error);
                alert("탈퇴 처리에 실패하였습니다.");
            })
        }
    }, []);

    return (
        <div>
            <Header showSideCenter={true}/>
            <div className="container admin_container">
                <h1 className="admin">⚠️ 관리자 페이지</h1>
                <div className={"admin_body_container"}>
                    <div className="admin_body">
                        <AdminCategory/>

                    </div>

                    <div className="admin_sub_container">
                        <h2 className="admin_title">회원 관리</h2>
                        <div className="admin_table_wrapper">
                            <h3>* 누적 신고 수가 10회 이상이면 자동으로 강제 탈퇴 처리됩니다.</h3>
                            <table className="member_admin_table">
                                <thead>
                                <tr>
                                    <th>회원 ID</th>
                                    <th>닉네임</th>
                                    <th>누적 신고 횟수</th>
                                    <th>버튼</th>
                                </tr>
                                </thead>
                                <tbody>
                                {members.map((member) => (
                                    <tr>
                                        <td>{member.memberId}</td>
                                        <td>{member.nickname}</td>
                                        <td>{member.reportCount}</td>
                                        <td>
                                            <button className="withdraw_btn" onClick={() => handleWithdraw(member)}>강제
                                                탈퇴
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {members.length !== 0 &&
                    <div className="pagingDiv">
                        <Paging page={page} totalItemCount={totalElements} totalPages={totalPages}
                                itemsPerPage={itemsPerPage}
                                handlePageChange={handlePageChange}/>
                    </div>}
            </div>
        </div>
    )
}
export default MemberManagement;