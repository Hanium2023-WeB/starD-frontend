import Header from "../../components/repeat_etc/Header";
import React, {useEffect, useState} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";

import "../../css/community_css/Community.css";
import QnaSearchBar from "../../components/qna/QnaSearchBar";
import QnaInsert from "../qna/QnaInsert";
import QnaListItem from "../../components/qna/QnaListItem";
import axios from "axios";
import Paging from "../../components/repeat_etc/Paging";

const QnaSearchResult = () => {
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get("q");
    const selectOption = new URLSearchParams(location.search).get("select");
    const categoryOption = new URLSearchParams(location.search).get("category");

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

    const fetchQnaAndFaq = (pageNumber) => {
        let base_url = "";
        let params = {};
        if (categoryOption === "전체") {
            base_url = "/api/qna/search";
            params = {
                searchType: selectOption,
                searchWord: searchQuery,
                page: pageNumber
            };
        }
        else {
            base_url = "/api/qna/search/category";
            params = {
                searchType: selectOption,
                category: categoryOption,
                searchWord: searchQuery,
                page: pageNumber
            };
        }

        axios.get(base_url, { params })
            .then((res) => {
                setPosts(res.data.content);
                setItemsPerPage(res.data.pageable.pageSize);
                setCount(res.data.totalElements);
            })
            .catch((error) => {
                console.error("데이터 가져오기 실패:", error);
            });
    };

    useEffect(() => {
        fetchQnaAndFaq(page);
    }, [categoryOption, searchQuery, selectOption, page]);

    useEffect(() => {
        let base_url = "";
        let params = {};
        if (categoryOption === "전체") {
            base_url = "/api/qna/search";
            params = {
                searchType: selectOption,
                searchWord: searchQuery,
                page: 1
            };
        }
        else {
            base_url = "/api/qna/search/category";
            params = {
                searchType: selectOption,
                category: categoryOption,
                searchWord: searchQuery,
                page: 1
            };
        }

        axios.get(base_url, { params })
            .then((res) => {
                setPosts(res.data.content);
                setItemsPerPage(res.data.pageable.pageSize);
                setCount(res.data.totalElements);
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
                <h1>QNA LIST</h1>
                {showPostInsert && (
                    <QnaInsert />
                )}
                {!showPostInsert && (
                    <div>
                        <div className="community_header">
                            <QnaSearchBar/>
                            <button onClick={handleMoveToStudyInsert} className="new_post_btn">
                                새 글 작성
                            </button>
                        </div>
                        <div className="community">
                            <div>
                                {posts.length === 0 && <h3>검색 결과가 없습니다.</h3>}
                                {posts.length > 0 && (
                                    <table className="post_table" key={posts.id}>
                                        <th>카테고리</th>
                                        <th>제목</th>
                                        <th>닉네임</th>
                                        <th>날짜</th>
                                        <th>조회수</th>
                                        <th>공감수</th>
                                        {posts.map((d, index) => (
                                            <QnaListItem setPosts={setPosts} posts={d} d={d}
                                                          index={index} key={d.id}/>
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
export default QnaSearchResult;