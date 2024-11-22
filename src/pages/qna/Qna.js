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
    const location = useLocation();

    // 상태 관리
    const [posts, setPosts] = useState([]);
    const [showQnaInsert, setShowQnaInsert] = useState(false);
    const [showFaqInsert, setShowFaqInsert] = useState(false);
    const [userIsAdmin, setUserIsAdmin] = useState(false);

    const [page, setPage] = useState(location.state?.page || 1);
    const [count, setCount] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const searchQuery = new URLSearchParams(location.search).get("q");
    const categoryOption = new URLSearchParams(location.search).get("category");

    const accessToken = localStorage.getItem("accessToken");
    const isLoggedInUserId = localStorage.getItem("isLoggedInUserId");

    // 초기 렌더링 또는 검색 상태 확인
    const [isSearchMode, setIsSearchMode] = useState(!!searchQuery || !!categoryOption);

    // 권한 조회
    useEffect(() => {
        axios
            .get("/api/member/auth", {
                withCredentials: true,
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then((res) => {
                const auth = res.data[0].authority;
                setUserIsAdmin(auth === "ROLE_ADMIN");
            })
            .catch((error) => {
                console.error("권한 조회 실패:", error);
                setUserIsAdmin(false);
            });
    }, [accessToken]);

    // 데이터 가져오기 함수
    const fetchQnaAndFaq = (pageNumber) => {
        console.log("fetchQnaAndFaq 호출됨", { pageNumber, isSearchMode, categoryOption, searchQuery });
        let base_url;

        if (isSearchMode) {
            if (categoryOption === "전체") {
                base_url = "/api/faqs-and-qnas/search";
            } else if (categoryOption === "FAQ") {
                base_url = "/api/faqs/search";
            } else if (categoryOption === "QNA") {
                base_url = "/api/qnas/search";
            }
        } else {
            base_url = "/api/faqs-and-qnas";
        }

        let params = isSearchMode
            ? {
                category: categoryOption,
                keyword: searchQuery,
                page: pageNumber,
            }
            : { page: pageNumber };

        axios
            .get(base_url, { params })
            .then((res) => {
                console.log(res.data);
                const data = res.data;
                setPosts(data.posts);
                setItemsPerPage(data.currentPage);
                setCount(data.totalPages);
            })
            .catch((error) => console.error("데이터 가져오기 실패:", error));
    };

    // 페이지 번호 변경 시 호출
    const handlePageChange = (selectedPage) => {
        setPage(selectedPage);
        fetchQnaAndFaq(selectedPage);
    };

    // 렌더링 시 또는 검색 조건 변경 시 데이터 불러오기
    useEffect(() => {
        fetchQnaAndFaq(page);
    }, [page, location.search]);

    useEffect(() => {
        setIsSearchMode(!!searchQuery || !!categoryOption);
    }, [searchQuery, categoryOption]); // location.search 대신 직접 사용

    // QnA 작성 버튼 핸들러
    const handleMoveToStudyInsert = (e, type) => {
        if (accessToken && isLoggedInUserId) {
            e.preventDefault();
            setShowQnaInsert(type === "QNA");
            setShowFaqInsert(type === "FAQ");
        } else {
            alert("로그인 해주세요");
            navigate("/login");
        }
    };

    return (
        <div className="main_wrap" id="community">
            <Header showSideCenter={true} />
            <div className="community_container">
                <p id="entry-path">홈 > QNA</p>
                <Backarrow subname="QNA LIST" />

                {showFaqInsert && <QnaInsert postType="FAQ" />}
                {showQnaInsert && <QnaInsert postType="QNA" />}
                {!showFaqInsert && !showQnaInsert && (
                    <div>
                        <div className="community_header">
                            <SearchBar setIsSearchMode={setIsSearchMode}/>
                            {userIsAdmin ? (
                                <button
                                    onClick={(e) => handleMoveToStudyInsert(e, "FAQ")}
                                    className="new_post_btn"
                                >
                                    FAQ 작성
                                </button>
                            ) : (
                                <button
                                    onClick={(e) => handleMoveToStudyInsert(e, "QNA")}
                                    className="new_post_btn"
                                >
                                    QNA 작성
                                </button>
                            )}
                        </div>
                        <div className="community">
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
                                {posts && posts.length === 0 && (
                                    <tr>
                                        <td colSpan="5">검색 결과가 없습니다.</td>
                                    </tr>
                                )}
                                {posts && posts.map((d, index) => (
                                    <QnaListItem setPosts={setPosts} posts={d} d={d}
                                                 index={index} key={d.id}/>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="paging">
                            <Paging
                                page={page}
                                totalItemCount={count}
                                itemsPerPage={itemsPerPage}
                                handlePageChange={handlePageChange}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Qna;