import Header from "../../components/repeat_etc/Header";
import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";

import "../../css/community_css/Community.css";
import "../../css/notice_css/Notice.css";
import SearchBar from "../../components/qna/QnaSearchBar";
import QnaListItem from "../../components/qna/QnaListItem";
import axios from "axios";
import Backarrow from "../../components/repeat_etc/Backarrow";
import QnaInsert from "../qna/QnaInsert";
import Paging from "../../components/repeat_etc/Paging";

const Qna = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [showQnaInsert, setShowQnaInsert] = useState(false);
    const [showFaqInsert, setShowFaqInsert] = useState(false);
    let accessToken = localStorage.getItem('accessToken');
    let isLoggedInUserId = localStorage.getItem('isLoggedInUserId');
    const [userIsAdmin, setUserIsAdmin] = useState(false);
    const [postType, setPostType] = useState(null);

    const location = useLocation();
    const pageparams = location.state ? location.state.page : 1;
    const [page, setPage] = useState(pageparams);
    const [count, setCount] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const insertPage = location.state && location.state.page;

    const handleMoveToStudyInsert = (e, type) => {
        if (accessToken && isLoggedInUserId) {
            e.preventDefault();
            <Link to={`/insert-QnaAndFaq`}
                  style={{
                      textDecoration: "none",
                      color: "inherit",
                  }}>
            </Link>
            // if (userIsAdmin) {
            //     setPostType(type);
            //     setShowFaqInsert(!showFaqInsert);
            // } else {
            //     setPostType(type);
            //     setShowQnaInsert(!showQnaInsert);
            // }
        } else {
            alert("로그인 해주세요");
            navigate("/login");
        }
    };

    // TODO 권한 조회
    useEffect(() => {
        axios
            .get("/api/member/auth", {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then((res) => {
                const auth = res.data[0].authority;
                console.log("auth :", auth);

                if (auth === "ROLE_USER") {
                    setUserIsAdmin(false);
                } else if (auth === "ROLE_ADMIN") {
                    setUserIsAdmin(true);
                }
            })
            .catch((error) => {
                console.error("권한 조회 실패:", error);
                setUserIsAdmin(false);
            });
    }, [accessToken]);

    const fetchQnaAndFaq = (pageNumber) => {
        axios.get("/api/qna/all", {
            params: {
                page: pageNumber,
            },
        })
            .then((res) => {
                setPosts(res.data.content);
                setItemsPerPage(res.data.pageable.pageSize);
                setCount(res.data.totalElements);
            }).catch((error) => {
            console.error("데이터 가져오기 실패:", error);
        });
    };

    useEffect(() => {
        fetchQnaAndFaq(page);
    }, [page]);

    useEffect(() => {
        axios.get("/api/qna/all", {
            params: {
                page: 1,
            }
        }).then((res) => {
            setPosts(res.data.content);
            setItemsPerPage(res.data.pageable.pageSize);
            setCount(res.data.totalElements);
        })
            .catch((error) => {
                console.error("데이터 가져오기 실패:", error);
            });
    }, [insertPage]);

    const handlePageChange = (selectedPage) => {
        setPage(selectedPage);
        navigate(`/qna/page=${selectedPage}`);
    };

    return (
        <div className={"main_wrap"} id={"community"}>
            <Header showSideCenter={true}/>
            <div className="community_container">
                <p id={"entry-path"}> 홈 > QNA </p>
                <Backarrow subname={"QNA LIST"}/>
                {showFaqInsert && (
                    <QnaInsert postType={postType}/>
                )}
                {showQnaInsert && (
                    <QnaInsert postType={postType}/>
                )}
                {(!showFaqInsert && !showQnaInsert) && (
                    <div>
                        <div className="community_header">
                            <SearchBar/>

                            {userIsAdmin ? (
                                <>
                                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                    <Link to={`/admin/insert-Faq`}
                                          style={{
                                              textDecoration: "none",
                                              color: "inherit",
                                          }}>
                                        <button className="new_post_btn">
                                            FAQ 작성
                                        </button>
                                    </Link>
                                </>
                            ) : <Link to={`/insert-Qna`}
                                      style={{
                                          textDecoration: "none",
                                          color: "inherit",
                                      }}>
                                <button className="new_post_btn">
                                    QNA 작성
                                </button>
                            </Link>}
                        </div>
                        <div className="community">
                            <div>
                                <table className="post_table" key={posts.id}>
                                    <th>카테고리</th>
                                    <th>제목</th>
                                    <th>닉네임</th>
                                    <th>날짜</th>
                                    <th>조회수</th>
                                    <th>공감수</th>
                                    {posts.map((d, index) => (
                                        <QnaListItem setPosts={setPosts} posts={d} d={d}
                                                     index={index} key={d.id}/>
                                    ))}
                                </table>
                            </div>
                        </div>
                        <div className={"paging"}>
                            <Paging page={page} totalItemCount={count} itemsPerPage={itemsPerPage}
                                    handlePageChange={handlePageChange}/>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}
export default Qna;