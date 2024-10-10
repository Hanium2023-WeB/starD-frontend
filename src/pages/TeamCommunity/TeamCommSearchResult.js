import React, {useEffect, useState} from "react";
import Header from "../../components/repeat_etc/Header";
import Category from "../../components/repeat_etc/Category.js";
import Backarrow from "../../components/repeat_etc/Backarrow.js";

import "../../css/community_css/Community.css";
import SearchBar from "../../components/teamcommunity/TeamCommSearchBar";
import PostInsert from "../../components/teamcommunity/TeamPostInsert";
import PostListItem from "../../components/teamcommunity/TeamPostListItem";

import {Link, useNavigate, useLocation} from "react-router-dom";
import axios from "axios";

const TeamCommSearchResult = () => {
    const location = useLocation();
    const {studyId} = location.state;
    const searchQuery = new URLSearchParams(location.search).get("q");
    const selectOption = new URLSearchParams(location.search).get("select");

    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [showPostInsert, setShowPostInsert] = useState(false);
    const accessToken = localStorage.getItem('accessToken');
    const isLoggedInUserId = localStorage.getItem('isLoggedInUserId');

    const handleMoveToPostInsert = (e) => {
        e.preventDefault();
        setShowPostInsert(!showPostInsert);
    };

    useEffect(() => {
        axios.get(`/api/study/post/search/${studyId}`, {
            params: {
                studyId: studyId,
                searchType: selectOption,
                searchWord: searchQuery
            },
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        })
            .then((res) => {
                setPosts(res.data);
            })
            .catch((error) => {
                console.error("데이터 가져오기 실패:", error);
            });
    }, []);

    return (
        <div>
            <Header showSideCenter={true}/>
            <div className="container">
                <Category/>
                <div className="main_schedule_container"> {/* className 수정 필요 */}
                    <p id={"entry-path"}> 스터디 참여내역 > 팀블로그 > 팀 커뮤니티</p>
                    <Backarrow subname={"TEAM COMMUNITY LIST"}/>
                    {showPostInsert && (
                        <PostInsert studyId={studyId} />
                    )}
                    {!showPostInsert && (
                        <div>
                            <div className="community_header">
                                <SearchBar studyId={studyId} />
                                <button onClick={handleMoveToPostInsert} className="new_post_btn">
                                    새 글 작성
                                </button>
                            </div>
                            <div className="community">
                                <div className={"community-content"}>
                                    {posts.length === 0 && <h3>검색 결과가 없습니다.</h3>}
                                    {posts.length > 0 && (
                                        <table className="post_table">
                                            <thead>
                                                <tr>
                                                    <th>제목</th>
                                                    <th>닉네임</th>
                                                    <th>날짜</th>
                                                    <th>조회수</th>
                                                    <th>공감수</th>
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
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default TeamCommSearchResult;