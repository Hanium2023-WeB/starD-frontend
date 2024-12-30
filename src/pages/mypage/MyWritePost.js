import Header from "../../components/repeat_etc/Header";
import React, {useEffect, useRef, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";

import "../../css/community_css/Community.css";
import SearchBar from "../../components/community/CommSearchBar";
import PostInsert from "../../components/community/PostInsert";
import PostListItem from "../../components/community/PostListItem";
import axios from "axios";
import Backarrow from "../../components/repeat_etc/Backarrow";
import Paging from "../../components/repeat_etc/Paging";
import Category from "../../components/repeat_etc/Category";
import StudyListItem from "../../components/study/StudyListItem";

const MyWritePost = () => {
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

    const [writtenPosts, setWrittenPosts] = useState([]); //스크랩한 게시물을 보유할 상태 변수

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

    const location = useLocation();
    const pageparams = location.state ? location.state.page : 1;
    const [page, setPage] = useState(pageparams);
    const [count, setCount] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const insertPage = location.state && location.state.page;
    const [selectedCategory, setSelectedCategory] = useState("ALL");

    const fetchMyPosts = (pageNumber, selectedCategory) => {
        let url;

        if (selectedCategory === "STUDYPOST") {
            url = "/api/user/mypage/studypost";
        }
        else {
            url = "/api/user/mypage/post";
        }
        axios.get(url, {
            params: {
                page: pageNumber,
            },
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                setWrittenPosts(res.data.content);
                setItemsPerPage(res.data.pageable.pageSize);
                setCount(res.data.totalElements);
            }).catch((error) => {
            console.error("작성한 게시물을 가져오는 중 오류 발생:", error);
        });
    };

    useEffect(() => {
        fetchMyPosts(page, selectedCategory);
    }, [page, selectedCategory]);

    useEffect(() => {
        axios.get("/api/user/mypage/post", {
            params: {
                page: 1,
            },
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("전송 성공");
                console.log(res.data);

                setWrittenPosts(res.data.content);
                setItemsPerPage(res.data.pageable.pageSize);
                setCount(res.data.totalElements);
            })
            .catch((error) => {
                console.error('작성한 게시물을 가져오는 중 오류 발생: ', error);
            });
    }, [insertPage]);

    const handlePageChange = (selectedPage) => {
        setPage(selectedPage);
        navigate(`/MyPage/mypost/page=${selectedPage}`);
    };

    const handleCategoryChange = (selectedCategory) => {
        setSelectedCategory(selectedCategory);
        fetchMyPosts(page);
    };

    const mypost = () => {
        console.log("Written posts:", writtenPosts);

        if (!Array.isArray(writtenPosts)) {
            return <p className="no_scrap">작성한 게시글이 없습니다.</p>;
        }

        return (
            <>
                <div>
                    <select id="sub"  value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)}>
                        <option value="ALL">전체</option>
                        <option value="STUDYPOST">팀블로그</option>
                    </select>
                </div>
                <br/><br/><br/>
                <div>
                {(writtenPosts.length === 0) && <p className="no_scrap">작성한 게시글이 없습니다.</p>}
                {(writtenPosts.length !== 0) &&
                    <table className="post_table">
                        <thead>
                        <tr>
                            <th>타입</th>
                            <th>제목</th>
                            <th>닉네임</th>
                            <th>날짜</th>
                            <th>조회수</th>
                        </tr>
                        </thead>
                        <tbody>
                        {writtenPosts.map((post) => (
                            <tr className="post_list" key={post.id}>
                                <td className="community_category">
                                    {post.type === 'COMM' ? '커뮤니티'
                                        : post.type === 'STUDYPOST' ? '팀 커뮤니티'
                                        : post.type === 'NOTICE' ? '공지사항' : post.type}
                                </td>
                                <td className="community_title">
                                    {post.type === 'COMM' ? (
                                        <Link
                                            to={`/postdetail/${post.id}`}
                                            style={{
                                                textDecoration: "none",
                                                color: "inherit",
                                            }}
                                        >
                                            {post.title}
                                        </Link>
                                    ) : post.type === 'QNA'  || post.type === 'FAQ' ? (
                                        <Link
                                            to={`/qnadetail/${post.id}`}
                                            style={{
                                                textDecoration: "none",
                                                color: "inherit",
                                            }}
                                        >
                                            {post.title}
                                        </Link>
                                    ) : post.type === 'NOTICE' ? (
                                        <Link
                                            to={`/noticedetail/${post.id}`}
                                            style={{
                                                textDecoration: "none",
                                                color: "inherit",
                                            }}
                                        >
                                            {post.title}
                                        </Link>
                                    ) : post.type === 'STUDYPOST' ? (
                                        <Link
                                            to={`/${post.study.id}/teamblog/TeamCommunity/studypostdetail/${post.id}`}
                                            style={{
                                                textDecoration: "none",
                                                color: "inherit",
                                            }}
                                        >
                                            {post.title}
                                        </Link>
                                    ) : (
                                        <span>{post.title}</span>
                                    )}
                                </td>
                                <td className="community_nickname">{post.member?.nickname || '익명'}</td>
                                <td className="community_datetime">{formatDatetime(post.createdAt)}</td>
                                <td>{post.viewCount}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                }
                </div>
            </>
        );
    };

    return (
        // <div className={"main_wrap"} id={"community"}>
        //     <Header showSideCenter={true}/>
        //     <div className="community_container">
        //         <p id={"entry-path"}> 홈 > 내가 작성한 글 </p>
        //         <Backarrow subname={"My Write Post"}/>
        //         <div>
        //             <div className="community">
        //                 <div className={"community-content"}>
        //                     {mypost()}
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        //     <div className={"paging"}>
        //         <Paging page={page} totalItemCount={count} itemsPerPage={itemsPerPage}
        //                 handlePageChange={handlePageChange}/>
        //     </div>
        // </div>
        <div>
            <Header showSideCenter={true}/>
            <div className="container">
                <Category/>
                <div className="main_container">
                    <p id={"entry-path"}> 홈 > 마이페이지 > 내가 작성한 게시글 </p>
                    <Backarrow subname={"내가 작성한 게시글"}/>
                    <div>
                        <div className="community">
                            <div className={"community-content"}>
                                {mypost()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default MyWritePost;