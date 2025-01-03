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

const MyWriteComment = () => {
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

    const [writtenComments, setWrittenComments] = useState([]);

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

    const fetchMyComments = (pageNumber) => {
        axios.get("/api/user/mypage/reply", {
            params: {
                page: pageNumber,
            },
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                setWrittenComments(res.data.content);
                setItemsPerPage(res.data.pageable.pageSize);
                setCount(res.data.totalElements);
            }).catch((error) => {
            console.error("작성한 게시물을 가져오는 중 오류 발생:", error);
        });
    };

    useEffect(() => {
        fetchMyComments(page);
    }, [page]);

    useEffect(() => {
        axios.get("/api/user/mypage/reply", {
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

                setWrittenComments(res.data.content);
                setItemsPerPage(res.data.pageable.pageSize);
                setCount(res.data.totalElements);
            })
            .catch((error) => {
                console.error('작성한 댓글을 가져오는 중 오류 발생: ', error);
            });
    }, [insertPage]);

    const handlePageChange = (selectedPage) => {
        setPage(selectedPage);
        navigate(`/MyPage/mycomment/page=${selectedPage}`);
    };

    const mypost = () => {
        console.log("Written posts:", writtenComments);

        if (!Array.isArray(writtenComments)) {
            return <p className="no_scrap">작성한 게시글이 없습니다.</p>;
        }

        return (
            <>
                {(writtenComments.length === 0) && <p className="no_scrap">작성한 댓글이 없습니다.</p>}
                {(writtenComments.length !== 0) &&
                    <table className="post_table">
                        <thead>
                        <tr>
                            <th>타입</th>
                            <th>댓글 내용</th>
                            <th>닉네임</th>
                            <th>날짜</th>
                        </tr>
                        </thead>
                        <tbody>
                        {writtenComments.map((comment) => (
                            <tr className="post_list" key={comment.id}>
                                <td className="community_category">
                                    {comment.type === 'COMM' ? '커뮤니티' 
                                        : comment.type === 'STUDY' ? '스터디'
                                        : comment.type === 'STUDYPOST' ? '팀 커뮤니티' : comment.type}
                                </td>
                                <td className="community_title">
                                    {comment.type === 'COMM' ? (
                                        <Link
                                            to={`/postdetail/${comment.post.id}`}
                                            style={{
                                                textDecoration: "none",
                                                color: "inherit",
                                            }}
                                        >
                                            {comment.content}
                                        </Link>
                                    ) : comment.type === 'QNA' ? (
                                        <Link
                                            to={`/qna/detail/${comment.post.id}`}
                                            style={{
                                                textDecoration: "none",
                                                color: "inherit",
                                            }}
                                        >
                                            {comment.content}
                                        </Link>
                                    ) : comment.type === 'STUDY' ? (
                                        <Link
                                            to={`/studydetail/${comment.study.id}`}
                                            style={{
                                                textDecoration: "none",
                                                color: "inherit",
                                            }}
                                        >
                                            {comment.content}
                                        </Link>
                                    ) : comment.type === 'STUDYPOST' ? (
                                        <Link
                                            to={`/${comment.study.id}/teamblog/TeamCommunity/studypostdetail/${comment.studyPost.id}`}
                                            style={{
                                                textDecoration: "none",
                                                color: "inherit",
                                            }}
                                        >
                                            {comment.content}
                                        </Link>
                                    ) : (
                                        <span>{comment.content}</span>
                                    )}
                                </td>
                                <td className="community_nickname">{comment.member?.nickname || '익명'}</td>
                                <td className="community_datetime">{formatDatetime(comment.createdAt)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                }
            </>
        );
    };
    return (
        <div className={"main_wrap"} id={"community"}>
            <Header showSideCenter={true}/>
            <div className="community_container">
                <p id={"entry-path"}> 홈 > 내가 작성한 댓글 </p>
                <Backarrow subname={"My Write Comment"}/>
                <div>
                    <div className="community">
                        <div className={"community-content"}>
                            {mypost()}
                        </div>
                    </div>
                </div>
            </div>
            <div className={"paging"}>
                <Paging page={page} totalItemCount={count} itemsPerPage={itemsPerPage}
                        handlePageChange={handlePageChange}/>
            </div>
        </div>
    );
}
export default MyWriteComment;