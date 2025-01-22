import Header from "../../components/repeat_etc/Header";
import React, {useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import "../../css/community_css/Community.css";
import SearchBar from "../../components/community/CommSearchBar";
import PostInsert from "../../components/community/PostInsert";
import PostListItem from "../../components/community/PostListItem";
import axios from "axios";
import Backarrow from "../../components/repeat_etc/Backarrow";
import Category from "../../components/repeat_etc/Category";

const MyScrapCommunityPost = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [showPostInsert, setShowPostInsert] = useState(false);
    let accessToken = localStorage.getItem('accessToken');
    let isLoggedInUserId = localStorage.getItem('isLoggedInUserId');

    const dataId = useRef(0);
    const [state, setState] = useState([]);
    const [todos, setTodos] = useState({});
    const [today, setToday] = useState(new Date());
    const [parsedTodos, setParsedTodos] = useState([]);
    const [parsedmeetings, setParsedMeetings] = useState([]);
    const [meetings, setMeetings] = useState({});
    const [todayKey, setTodayKey] = useState("");
    const [credibility, setCredibility] = useState("");

    const [scrapedPosts, setScrapedPosts] = useState([]); //스크랩한 게시물을 보유할 상태 변수

    const handleMoveToStudyInsert = (e) => {
        if (accessToken && isLoggedInUserId) {
            e.preventDefault();
            setShowPostInsert(!showPostInsert);
        } else {
            alert("로그인 해주세요");
            navigate("/login");
        }
    };

    useEffect(() => {
        axios.get("/api/members/stars", {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("전송 성공");
                console.log(res.data.posts);
                setScrapedPosts(res.data.posts);
            })
            .catch((error) => {
                console.error('스크랩한 게시물을 가져오는 중 오류 발생: ', error);
            });
    }, [showPostInsert]);

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
                        <PostInsert />
                    )}
                    {!showPostInsert && (
                        <div style={{width:"110%", paddingTop:"10px"}}>
                            <div className="community">
                                <div className={"community-content"}>
                                    {scrapstory()}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default MyScrapCommunityPost;