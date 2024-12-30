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

    const searchQuery = new URLSearchParams(location.search).get("q");
    const categoryOption = new URLSearchParams(location.search).get("category");
    const [isSearchMode, setIsSearchMode] = useState(!!searchQuery || !!categoryOption);
    const [filter, setFilter] = useState(''); // SearchBar에서 전달받은 필터

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
        axios.get("/api/communities", {
            params: {page: pageNumber},
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log(res.data);
                setPosts(res.data.posts);
                setItemsPerPage(res.data.currentPage);
                setCount(res.data.posts.length);
            }).catch((error) => {
            console.error("데이터 가져오기 실패:", error);
        });
    };

    useEffect(() => {
        fetchCommunities(page);
    }, [page]);

    const handleSearchPost = (pageNumber) => {
        let base_url = "/api/communities";
        let params = {
            page:pageNumber
        }
        if (categoryOption && categoryOption !== "전체") {
            // 특정 카테고리를 선택한 경우
            base_url = "/api/communities/category";
            params.category = categoryOption;
        }
        if (searchQuery) {
            // 검색어가 있는 경우
            base_url = "/api/communities/search";
            params.keyword = searchQuery;
            if (categoryOption && categoryOption !== "전체") {
                // 검색어와 카테고리가 동시에 선택된 경우
                base_url = "/api/communities/search/category";
                params.category = categoryOption;
            }
        }

        axios.get(base_url, {
            params,
            withCredentials: true,
            headers: { 'Authorization': `Bearer ${accessToken}` }
        })
            .then((res) => {
                console.log(base_url);
                console.log(params);
                console.log(res.data);
                setPosts(res.data.posts);
                setCount(res.data.posts.length);
            })
            .catch((error) => console.error("데이터 가져오기 실패:", error));
    }
    useEffect(() => {
        handleSearchPost(page);
    }, [page, location.search]);

    useEffect(() => {
        setIsSearchMode(!!searchQuery || !!categoryOption);
    }, [searchQuery, categoryOption]);

    const handlePageChange = (selectedPage) => {
        setPage(selectedPage);
        navigate(`/community/page=${selectedPage}`);
    };

    // 필터 변경 처리
    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
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
                            <SearchBar setIsSearchMode={setIsSearchMode} onFilterChange={handleFilterChange}/>
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
                                            <th>좋아요수</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {posts.map((post) => (
                                            <PostListItem key={post.postId}
                                                          isMyLikePost={false}
                                                          posts={post}/>
                                        ))}
                                    </tbody>
                                </table>
                                {posts.length === 0 && (
                                    <h4 style={{textAlign:"center"}}>검색 결과가 없습니다.</h4>
                                )}
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