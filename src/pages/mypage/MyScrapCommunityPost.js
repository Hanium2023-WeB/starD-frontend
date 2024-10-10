import Header from "../../components/repeat_etc/Header";
import React, {useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import "../../css/community_css/Community.css";
import SearchBar from "../../components/community/CommSearchBar";
import PostInsert from "../../components/community/PostInsert";
import PostListItem from "../../components/community/PostListItem";
import axios from "axios";
import Backarrow from "../../components/repeat_etc/Backarrow";

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

    const Year = today.getFullYear();
    const Month = today.getMonth() + 1;
    const Dates = today.getDate()

    const formatDatetime = (datetime) => {
        const date = new Date(datetime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const formattedDatetime = `${year}-${month}-${day} ${hours}:${minutes}`;
        return formattedDatetime;
    };


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
        axios.get("/api/com")
            .then((res) => {
                setPosts(res.data);
            })
            .catch((error) => {
                console.error("데이터 가져오기 실패:", error);
            });
    }, [posts]);

    useEffect(() => {
        axios.get("/api/scrap/post", {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("전송 성공");
                console.log(res.data);

                setScrapedPosts(res.data);
            })
            .catch((error) => {
                console.error('스크랩한 게시물을 가져오는 중 오류 발생: ', error);
            });
    }, [showPostInsert]);

    const scrapstory = () => {
        return (
            <>
                {(scrapedPosts.length === 0) && <p className="no_scrap">스크랩한 게시글이 없습니다.</p>}
                {(scrapedPosts.length !== 0) &&
                    <table className="post_table">
                        <th>카테고리</th>
                        <th>제목</th>
                        <th>닉네임</th>
                        <th>날짜</th>
                        <th>조회수</th>
                        {scrapedPosts.map((post) => (
                            <tr className="post_list">
                                <td className="community_category">{post.category}</td>
                                <Link to={`/postdetail/${post.id}`}
                                      style={{
                                          textDecoration: "none",
                                          color: "inherit",
                                      }}>
                                    <td className="community_title">{post.title}</td>
                                </Link>
                                <td className="community_nickname">{post.member.nickname}</td>
                                <td className="community_datetime">{formatDatetime(post.createdAt)}</td>
                                <td>{post.viewCount}</td>
                            </tr>
                        ))}
                    </table>
                }
            </>
        );
    };
    return (
        <div className={"main_wrap"} id={"community"}>
            <Header showSideCenter={true}/>
            <div className="community_container">
                <p id={"entry-path"}> 홈 > 커뮤니티 </p>
                <Backarrow subname={"My Scrap Community Post"}/>
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
                                {scrapstory()}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default MyScrapCommunityPost;