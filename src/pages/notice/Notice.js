import Header from "../../components/repeat_etc/Header";
import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";

import "../../css/community_css/Community.css";
import "../../css/notice_css/Notice.css";
import SearchBar from "../../components/notice/NoticeSearchBar";
import NoticeListItem from "../../components/notice/NoticeListItem";
import axios from "axios";
import Backarrow from "../../components/repeat_etc/Backarrow";
import NoticeInsert from "../../pages/notice/NoticeInsert";
import Paging from "../../components/repeat_etc/Paging";

const Notice = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [showPostInsert, setShowPostInsert] = useState(false);
    let accessToken = localStorage.getItem('accessToken');
    let isLoggedInUserId = localStorage.getItem('isLoggedInUserId');
    const [userIsAdmin, setUserIsAdmin] = useState(false);

    const location = useLocation();
    const pageparams = location.state ? location.state.page : 1;
    const [page, setPage] = useState(pageparams);
    const [totalElements, setTotalElements] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const insertPage = location.state && location.state.page;

    const handleMoveToStudyInsert = (e) => {
        if (accessToken && isLoggedInUserId) {
            e.preventDefault();
            //setShowPostInsert(!showPostInsert);
        } else {
            alert("로그인 해주세요");
            navigate("/login");
        }
    };

    useEffect(() => {

        if (accessToken) {
            axios
                .get("/api/members/auth", {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                .then((res) => {
                    const auth = res.data;
                    console.log("auth :", auth);

                    if (auth === "USER") {
                        setUserIsAdmin(false);
                    } else if (auth === "ADMIN") {
                        setUserIsAdmin(true);
                    }
                })
                .catch((error) => {
                    console.error("권한 조회 실패:", error);
                    setUserIsAdmin(false);
                });
        }

    }, [accessToken]);

    const fetchNotices = (pageNumber) => {
        axios.get("/api/notices", {
            params: {
                page: pageNumber,
            },
        })
            .then((res) => {
                setTotalPages(res.data.totalPages);
                setPosts(res.data.posts);
                setTotalElements(res.data.totalElements);
            }).catch((error) => {
            console.error("데이터 가져오기 실패:", error);
        });
    };

    useEffect(() => {
        fetchNotices(page);
    }, [page]);

    useEffect(() => {
        axios.get("/api/notices", {
            params: {
                page: 1,
            }
        }).then((res) => {
            setPosts(res.data.posts);
            setTotalPages(res.data.totalPages);
            setTotalElements(res.data.totalElements);
        })
            .catch((error) => {
                console.error("데이터 가져오기 실패:", error);
            });
    }, [insertPage]);

    const handlePageChange = (selectedPage) => {
        setPage(selectedPage);
        navigate(`/notice/page=${selectedPage}`);
    };

    return (
        <div className={"main_wrap"} id={"community"}>
            <Header showSideCenter={true}/>
            <div className="community_container">
                <p id={"entry-path"}> 홈 > 공지사항 </p>
                <Backarrow subname={"공지사항"}/>
                {showPostInsert && (
                    <NoticeInsert/>
                )}
                {!showPostInsert && (
                    <div>
                        <div className="community_header">
                            <SearchBar/>
                            {userIsAdmin ? (
                                <Link to={`/admin/notice/insert`}
                                      style={{
                                          textDecoration: "none",
                                          color: "inherit",
                                      }}>
                                    <button className="new_post_btn">
                                        새 글 작성
                                    </button>
                                </Link>
                            ) : null}

                        </div>
                        <div className="community">
                            <div className={"community-content"}>
                                <table className="post_table"
                                       key={posts.postId}>
                                    <th>제목</th>
                                    <th>닉네임</th>
                                    <th>날짜</th>
                                    <th>조회수</th>
                                    {posts.map((d, index) => (
                                        <NoticeListItem setPosts={setPosts}
                                                        posts={d} d={d}
                                                        index={index}
                                                        key={d.postId}/>
                                    ))}
                                </table>
                                {posts.length === 0 && (
                                    <h4 style={{textAlign: "center"}}>검색 결과가 없습니다.</h4>

                                )}
                                <br/>

                            </div>
                        </div>
                        {posts.length !== 0 &&
                            <div className="pagingDiv">
                                <Paging page={page} totalItemCount={totalElements} totalPages={totalPages}
                                        itemsPerPage={itemsPerPage}
                                        handlePageChange={handlePageChange}/>
                            </div>}

                    </div>
                )}
            </div>
        </div>
    );
}
export default Notice;