import Header from "../../components/repeat_etc/Header";
import React, {useEffect, useState} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";

import "../../css/community_css/Community.css";
import NoticeSearchBar from "../../components/notice/NoticeSearchBar";
import NoticeInsert from "../../pages/notice/NoticeInsert";
import NoticeListItem from "../../components/notice/NoticeListItem";
import axios from "axios";
import Paging from "../../components/repeat_etc/Paging";

const Notice = () => {
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get("q");

    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [showPostInsert, setShowPostInsert] = useState(false);
    let accessToken = localStorage.getItem('accessToken');
    let isLoggedInUserId = localStorage.getItem('isLoggedInUserId');

    const pageparams = location.state ? location.state.page : 1;
    const [page, setPage] = useState(pageparams);
    const [count, setCount] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const insertPage = location.state && location.state.page;

    const handleMoveToStudyInsert = (e) => {
         if (accessToken && isLoggedInUserId) {
            e.preventDefault();
            setShowPostInsert(!showPostInsert);
         } else {
             alert("로그인 해주세요");
             navigate("/login");
         }
    };

    const fetchNotices = (pageNumber) => {
        let base_url = "/api/notices/search";
        let params = {
            keyword: searchQuery,
            page: pageNumber,
        };
        axios.get(base_url, { params })
            .then((res) => {
                setPosts(res.data.posts);
                setItemsPerPage(res.data.currentPage);
                setCount(res.data.totalPages);
            })
            .catch((error) => {
                console.error("데이터 가져오기 실패:", error);
            });
    };

    useEffect(() => {
        fetchNotices(page);
    }, [searchQuery, page]);

    useEffect(() => {
        let base_url = "/api/notices/search";
        let params = {
            keyword: searchQuery,
            page: 1,
        };
        axios.get(base_url, { params })
            .then((res) => {
                setPosts(res.data.posts);
                setItemsPerPage(res.data.currentPage);
                setCount(res.data.totalPages);
            })
            .catch((error) => {
                console.error("데이터 가져오기 실패:", error);
            });
    }, [insertPage]);

    const handlePageChange = (selectedPage) => {
        setPage(selectedPage);
    };

    return (
        <div className={"main_wrap"} id={"community"}>
            <Header showSideCenter={true}/>
            <div className="community_container">
                <h1>NOTICE LIST</h1>
                {showPostInsert && (
                    <NoticeInsert />
                )}
                {!showPostInsert && (
                    <div>
                        <div className="community_header">
                            <NoticeSearchBar/>
                            <button onClick={handleMoveToStudyInsert} className="new_post_btn">
                                새 글 작성
                            </button>
                        </div>
                        <div className="community">
                            <div>
                                {posts.length === 0 && <h3>검색 결과가 없습니다.</h3>}
                                {posts.length > 0 && (
                                    <table className="post_table" key={posts.id}>
                                        <th>제목</th>
                                        <th>닉네임</th>
                                        <th>날짜</th>
                                        <th>조회수</th>
                                        {posts.map((d, index) => (
                                            <NoticeListItem setPosts={setPosts} posts={d} d={d}
                                                          index={index} key={d.postId}/>
                                        ))}
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                    )}
            </div>
            <div className={"paging"}>
                <Paging page={page} totalItemCount={count} itemsPerPage={itemsPerPage}
                        handlePageChange={handlePageChange}/>
            </div>
        </div>
    );
}
export default Notice;