import Header from "../../components/repeat_etc/Header";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

import "../../css/community_css/Community.css";
import SearchBar from "../../components/community/CommSearchBar";
import PostInsert from "../../components/community/PostInsert";
import PostListItem from "../../components/community/PostListItem";
import axios from "axios";
import Backarrow from "../../components/repeat_etc/Backarrow";
import Category from "../../components/repeat_etc/Category";
import Paging from "../../components/repeat_etc/Paging";

const MyScrapCommunityPost = () => {
    const [showPostInsert, setShowPostInsert] = useState(false);
    let accessToken = localStorage.getItem('accessToken');

    const [scrapedPosts, setScrapedPosts] = useState([]); //스크랩한 게시물을 보유할 상태 변수

    const location = useLocation();
    const pageparams = location.state ? location.state.page : 1;
    const [page, setPage] = useState(pageparams);
    const [totalElements, setTotalElements] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const fetchScrapPosts = async (pageNumber) => {
        axios.get("/api/members/stars", {
            params: {page: pageNumber},
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                setScrapedPosts(res.data.posts);
                setTotalPages(res.data.totalPages);
                setTotalElements(res.data.totalElements);
            })
            .catch((error) => {
                console.error('스크랩한 게시물을 가져오는 중 오류 발생: ', error);
            });
    };

    useEffect(() => {
        fetchScrapPosts(page);
    }, [page]);

    const handlePageChange = (newPage) => {
        setPage(newPage); // 페이지 상태를 업데이트
    };

    const scrapstory = () => {
        return (
            <>
                {(scrapedPosts.length === 0) && <div className="no_scrap"><p>스크랩한 게시글이 없습니다.</p></div>}
                {(scrapedPosts.length !== 0) &&
                    <table className="post_table">
                        <thead>
                        <tr>
                            <th>카테고리</th>
                            <th>제목</th>
                            <th>닉네임</th>
                            <th>날짜</th>
                            <th>조회수</th>
                        </tr>
                        </thead>
                        <tbody>
                        {scrapedPosts.map((post) => (
                            <PostListItem key={post.postId}
                                          isMyLikePost={true}
                                          posts={post}/>
                        ))}
                        </tbody>
                    </table>
                }
            </>
        );
    };
    return (
        <div>
            <Header showSideCenter={true}/>
            <div className="container">
                <Category/>
                <div className="main_container">
                    <p id={"entry-path"}> 마이페이지 > 좋아요한 게시글 </p>
                    <Backarrow subname={"좋아요한 게시글"}/>
                    {showPostInsert && (
                        <PostInsert/>
                    )}
                    {!showPostInsert && (
                        <div style={{width: "110%", paddingTop: "10px"}}>
                            <div className="community">
                                <div className={"community-content"}>
                                    {scrapstory()}
                                </div>
                            </div>
                        </div>
                    )}
                    {scrapedPosts.length !== 0 && (
                        <div className="pagingDiv">
                            <Paging page={page} totalItemCount={totalElements} itemsPerPage={itemsPerPage}
                                    totalPages={totalPages}
                                    handlePageChange={handlePageChange}/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default MyScrapCommunityPost;