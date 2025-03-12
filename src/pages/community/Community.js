import Header from "../../components/repeat_etc/Header";
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

import "../../css/community_css/Community.css";
import SearchBar from "../../components/community/CommSearchBar";
import PostInsert from "../../components/community/PostInsert";
import PostListItem from "../../components/community/PostListItem";
import axios from "axios";
import Backarrow from "../../components/repeat_etc/Backarrow";
import Paging from "../../components/repeat_etc/Paging";
import toast from "react-hot-toast";

const Community = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [showPostInsert, setShowPostInsert] = useState(false);
    let accessToken = localStorage.getItem('accessToken');
    let isLoggedInUserId = localStorage.getItem('isLoggedInUserId');

    const location = useLocation();
    const pageparams = location.state ? location.state.page : 1;
    const [page, setPage] = useState(pageparams);
    const [totalElements, setTotalElements] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const searchQuery = new URLSearchParams(location.search).get("q");
    const categoryOption = new URLSearchParams(location.search).get("category");
    const [isSearchMode, setIsSearchMode] = useState(!!searchQuery || !!categoryOption);
    const [filter, setFilter] = useState(''); // SearchBar에서 전달받은 필터

    const handleMoveToStudyInsert = (e) => {
        if (accessToken && isLoggedInUserId) {
            e.preventDefault();
            setShowPostInsert(!showPostInsert);
        } else {
            return toast.error("로그인 후 이용 가능합니다.");
        }
    };

    const fetchCommunities = async (pageNumber) => {
        try {
            const headers = {};
            if (accessToken) {
                headers['Authorization'] = `Bearer ${accessToken}`;
            }

            const response = await axios.get("/api/communities", {
                params: {page: pageNumber},
                withCredentials: true,
                headers,
            });

            setTotalPages(response.data.totalPages);
            setPosts(response.data.posts);
            setTotalElements(response.data.totalElements);
        } catch (error) {
            console.error("데이터 가져오기 실패:", error);
        }
    };

    useEffect(() => {
        fetchCommunities(page);
    }, [page]);

    const handleSearchPost = (pageNumber) => {
        let base_url = "/api/communities";
        let params = {
            page: pageNumber
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

        const headers = {};
        if (accessToken && isLoggedInUserId) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }

        axios.get(base_url, {
            params,
            withCredentials: true,
            headers
        })
            .then((res) => {
                console.log(base_url);
                console.log(params);

                setPosts(res.data.posts);
                setTotalElements(res.data.totalElements);
                setTotalPages(res.data.totalPages);
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
                <Backarrow subname={"커뮤니티"}/>
                {showPostInsert && (
                    <PostInsert/>
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
                                        <th style={{width: "30%"}}>제목</th>
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
                                    <h4 style={{textAlign: "center"}}>검색 결과가 없습니다.</h4>

                                )}
                                <br/>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {posts.length !== 0 && (
                <div className="pagingDiv">
                    <Paging page={page} totalItemCount={totalElements} itemsPerPage={itemsPerPage}
                            totalPages={totalPages}
                            handlePageChange={handlePageChange}/>
                </div>
            )}
        </div>
    );
}
export default Community;