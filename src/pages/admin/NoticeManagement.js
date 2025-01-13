import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import Header from "../../components/repeat_etc/Header";
import AdminCategory from "../../components/repeat_etc/AdminCategory";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Paging from "../../components/repeat_etc/Paging";
import NoticeManagingListItem from "../../components/admin/NoticeManagingListItem";
const NoticeManagement = () => {
    const [members, setMembers] = useState([]);

    const accessToken = localStorage.getItem('accessToken');

    const location = useLocation();
    const navigate = useNavigate();
    const pageparams = location.state ? location.state.page : 1;
    const [page, setPage] = useState(pageparams);
    const [count, setCount] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    const [posts, setPosts] = useState([]);

    const fetchNotices = (pageNumber) => {
        axios.get("/api/notices", {
            params: {
                page: pageNumber,
            },
        })
            .then((res) => {
                setPosts(res.data.posts);
                setItemsPerPage(res.data.currentPage);
                setCount(res.data.totalPages);
            }).catch((error) => {
            console.error("공지사항 데이터 가져오기 실패:", error);
        });
    };

    useEffect(() => {
        fetchNotices(page);
    }, [page]);


    useEffect(() => {
        axios.get("/api/notices", {
            params: {
                page: 1,
            }
        }).then((res) => {
            setPosts(res.data.posts);
            setItemsPerPage(res.data.currentPage);
            setCount(res.data.totalPages);
        })
            .catch((error) => {
                console.error("공지사항 데이터 가져오기 실패:", error);
            });
    }, []);

    const handlePageChange = (selectedPage) => {
        setPage(selectedPage);
        navigate(`/admin/NoticeManagement/page=${selectedPage}`);
    };

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
                    <h2 className="admin_title">공지사항 관리</h2>
                    <div className="admin_table_wrapper">
                        <table className="member_admin_table">
                            <thead>
                            <tr>
                                <th>제목</th>
                                <th>글쓴이</th>
                                <th>날짜</th>
                                <th>조회수</th>
                                <th>삭제</th>
                            </tr>
                            </thead>
                            <tbody>
                            {posts.map((d, index) => (
                                <NoticeManagingListItem setPosts={setPosts} posts={d} d={d}
                                                index={index} key={d.postId}/>
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
export default NoticeManagement;