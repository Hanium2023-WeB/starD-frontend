import Header from "../../components/repeat_etc/Header";
import React, {useEffect, useRef, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";

import "../../css/community_css/Community.css";
import "../../css/mypage_css/Mypage_Scrap.css";
import axios from "axios";
import Backarrow from "../../components/repeat_etc/Backarrow";
import Category from "../../components/repeat_etc/Category";

const MyWritePost = () => {
    let accessToken = localStorage.getItem('accessToken');
    let isLoggedInUserId = localStorage.getItem('isLoggedInUserId');

    const [writtenPosts, setWrittenPosts] = useState([]); //스크랩한 게시물을 보유할 상태 변수

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
    const [studies, setStudies] = useState([]);
    const [studyId, setStudyId] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("COMM");

    useEffect(() => {
        axios.get("/api/members/studies/participate", {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log(res.data.studyRecruitPosts);
                setStudies(res.data.studyRecruitPosts);
            })
            .catch((error) => {
                console.error("모집완료된 스터디 가져오기 실패:", error);
            });

    }, [accessToken]);

    const fetchMyPosts = (pageNumber, selectedCategory, studyId) => {
        let url;

        if (selectedCategory === "STUDYPOST") {
            // studyId가 없으면 studies 배열의 첫 번째 스터디를 기본으로 설정
            const defaultStudyId = studyId || (studies.length > 0 ? studies[0].studyId : null);

            if (defaultStudyId) {
                url = `/api/members/study-posts/${defaultStudyId}`;
                console.log(url);
            } else {
                console.error("스터디 목록이 비어 있습니다.");
                return; // studies 배열이 비어 있으면 요청하지 않음
            }
        } else {
            url = "/api/members/communities";
            console.log(url);
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
                console.log(res.data);
                console.log(res.data.posts);
                if (selectedCategory === "STUDYPOST") {
                    const postsWithStudyId = res.data.items.map(post => ({
                        ...post,
                        studyId: res.data.studyId, // Attach the studyId from response
                    }));
                    setWrittenPosts(postsWithStudyId); // for STUDYPOST, use items
                    setCount(res.data.items.length);
                } else {
                    setWrittenPosts(res.data.posts); // for COMMUNITY, use posts
                    setCount(res.data.posts.length);
                }
                setItemsPerPage(res.data.currentPage);
            }).catch((error) => {
            console.error("작성한 게시물을 가져오는 중 오류 발생:", error);
        });
    };

    useEffect(() => {
        fetchMyPosts(page, selectedCategory, studyId);
    }, [page, selectedCategory]);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setStudyId(""); // 카테고리 변경 시 studyId 초기화
    };

    const handleStudySelect = (event) => {
        setStudyId(event.target.value);
    };

    const mypost = () => {
        console.log("Written posts:", writtenPosts);

        return (
            <>
                <div className="category-wrapper">
                    <div className="category-box-container">
                        <div
                            className={`category-box ${
                                selectedCategory === 'COMM' ? 'selected' : ''
                            }`}
                            onClick={() => handleCategorySelect('COMM')}
                        >
                            커뮤니티
                        </div>
                        <div
                            className={`category-box ${
                                selectedCategory === 'STUDYPOST' ? 'selected' : ''
                            }`}
                            onClick={() => handleCategorySelect('STUDYPOST')}
                        >
                            팀블로그
                        </div>
                    </div>

                    {selectedCategory === 'STUDYPOST' && (
                        <div style={{marginLeft:"10px"}}>
                            <select id="teamBlogTitles" onChange={handleStudySelect} value={studyId}>
                                {studies.map((study, index) => (
                                    <option key={index} value={study.title}>
                                        {study.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
                <br/><br/><br/>
                <div>
                    {(writtenPosts.length === 0) && <div className="no_study"><p>작성한 게시글이 없습니다.</p></div>}
                    {(writtenPosts.length !== 0) && (
                        <table className="post_table">
                            <thead>
                            <tr>
                                {selectedCategory === "COMM" && (
                                    <th>카테고리</th>
                                )}
                                <th>제목</th>
                                <th>닉네임</th>
                                <th>날짜</th>
                                <th>조회수</th>
                            </tr>
                            </thead>
                            <tbody>
                            {writtenPosts.map((post) => (
                                <tr className="post_list" key={post.postId}>
                                    {selectedCategory === "COMM" && (
                                        <td className="community_category">
                                            {post.category}
                                        </td>
                                    )}
                                    <td className="community_title">
                                        {selectedCategory === 'COMM' ? (
                                            <Link
                                                to={`/community/post/${post.postId}`}
                                                style={{
                                                    textDecoration: "none",
                                                    color: "inherit",
                                                }}
                                            >
                                                {post.title}
                                            </Link>
                                        ) : selectedCategory === 'STUDYPOST' ? (
                                            <Link
                                                to={`/teamblog/${post.studyId}/community/post/${post.studyPostId}`}
                                                style={{
                                                    textDecoration: "none",
                                                    color: "inherit",
                                                }}
                                            >
                                                {post.title}
                                            </Link>
                                        ) : null}
                                    </td>
                                    <td className="community_nickname">{post.writer || '익명'}</td>
                                    <td className="community_datetime">{formatDatetime(post.createdAt)}</td>
                                    <td>{post.hit}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </>
        );
    };


    return (
        <div>
            <Header showSideCenter={true}/>
            <div className="container">
                <Category/>
                <div className="main_container">
                    <p id={"entry-path"}> 마이페이지 > 내가 작성한 게시글 </p>
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