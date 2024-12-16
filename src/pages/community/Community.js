import Header from "../../components/repeat_etc/Header";
import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";

import "../../css/community_css/Community.css";
import SearchBar from "../../components/community/CommSearchBar";
import PostInsert from "../../components/community/PostInsert";
import PostListItem from "../../components/community/PostListItem";
import axios from "axios";
import Backarrow from "../../components/repeat_etc/Backarrow";
import Paging from "../../components/repeat_etc/Paging";

const Community = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [showPostInsert, setShowPostInsert] = useState(false);
    let accessToken = localStorage.getItem('accessToken');
    let isLoggedInUserId = localStorage.getItem('isLoggedInUserId');

    const location = useLocation();
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

    const fetchCommunities = (pageNumber) => {
        axios.get("/api/com", {
            params: {
                page: pageNumber,
            },
        })
            .then((res) => {
                setPosts(res.data.content);
                setItemsPerPage(res.data.pageable.pageSize);
                setCount(res.data.totalElements);
            }).catch((error) => {
            console.error("데이터 가져오기 실패:", error);
        });
    };

    useEffect(() => {
        fetchCommunities(page);
    }, [page]);

    useEffect(() => {
        axios.get("/api/com", {
            params: {
                page: 1,
            }
        }).then((res) => {
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
        navigate(`/community/page=${selectedPage}`);
    };

    return (
        <div className={"main_wrap"} id={"community"}>
            <Header showSideCenter={true}/>
            <div className="community_container">
                <p id={"entry-path"}> 홈 > 커뮤니티 </p>
                <Backarrow subname={"COMMUNITY LIST"}/>
                {showPostInsert && (
                    <PostInsert />
                )}
                {!showPostInsert && (
                    <div>
                        <div className="community_header">
                            <SearchBar/>
                            <button onClick={handleMoveToStudyInsert} className="new_post_btn">
                                새 글 작성
                            </button>
                        </div>
                        <div className="community">
                            <div className={"community-content"}>
                                <table className="post_table">
                                    <thead>
                                        <tr>
                                            <th>카테고리</th>
                                            <th style={{width:"30%"}}>제목</th>
                                            <th>닉네임</th>
                                            <th>날짜</th>
                                            <th>조회수</th>
                                            <th>공감수</th>
                                            <th>스크랩수</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {posts.map((post) => (
                                            <PostListItem key={post.id}
                                                          setPosts={setPosts}
                                                          posts={post}/>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {!showPostInsert && (
                <div className={"paging"}>
                    <Paging page={page} totalItemCount={count} itemsPerPage={itemsPerPage}
                            handlePageChange={handlePageChange}/>
                </div>
            )}
        </div>
    );
}
export default Community;