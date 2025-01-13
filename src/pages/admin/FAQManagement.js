import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import Header from "../../components/repeat_etc/Header";
import AdminCategory from "../../components/repeat_etc/AdminCategory";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Paging from "../../components/repeat_etc/Paging";
import FaqManagingListItem from "../../components/admin/FaqManagingListItem";
const FAQManagement = () => {
    const [members, setMembers] = useState([]);
    const accessToken = localStorage.getItem('accessToken');

    const location = useLocation();
    const navigate = useNavigate();
    const pageparams = location.state ? location.state.page : 1;
    const [page, setPage] = useState(pageparams);
    const [count, setCount] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);


    const [posts, setPosts] = useState([]);

    const handlePageChange = (selectedPage) => {
        setPage(selectedPage);
        navigate(`/admin/FAQManagement/page=${selectedPage}`);
    };

    //페이지 수마다 가져오기
    const fetchQnaAndFaq = (pageNumber) => {
        axios.get("/api/faqs-and-qnas", {
            params: {
                page: pageNumber,
            },
        })
            .then((res) => {
                setPosts(res.data.posts);
                setItemsPerPage(res.data.pageable.pageSize);
                setCount(res.data.totalElements);
                console.log("전송 성공");
                console.log(res.data);
            }).catch((error) => {
            console.error("데이터 가져오기 실패:", error);
        });
    };

    useEffect(() => {
        axios.get("/api/faqs-and-qnas", {
            params: {
                page: 1,
            }
        }).then((res) => {
            setPosts(res.data.posts);
            setItemsPerPage(res.data.pageable.pageSize);
            setCount(res.data.totalElements);
        })
            .catch((error) => {
                console.error("데이터 가져오기 실패:", error);
            });
    }, []);

    useEffect(() => {
        fetchQnaAndFaq(page);
    }, [page]);

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
                        <h2 className="admin_title">FAQ 관리</h2>
                        <div className="admin_table_wrapper">
                            <table className="member_admin_table">
                                <thead>
                                        <th>제목</th>
                                        <th>닉네임</th>
                                        <th>날짜</th>
                                        <th>조회수</th>
                                        <th>삭제</th>
                                </thead>
                                <tbody>
                                 {posts.map((d, index) => (
                                        <FaqManagingListItem setPosts={setPosts} posts={d} d={d}
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
export default FAQManagement;