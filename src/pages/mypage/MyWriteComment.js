import Header from "../../components/repeat_etc/Header";
import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";

import "../../css/community_css/Community.css";
import axios from "axios";
import Backarrow from "../../components/repeat_etc/Backarrow";
import Paging from "../../components/repeat_etc/Paging";
import Category from "../../components/repeat_etc/Category";

const MyWriteComment = () => {
    const navigate = useNavigate();
    let accessToken = localStorage.getItem('accessToken');
    const [writtenComments, setWrittenComments] = useState([]);

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
    const [totalElements, setTotalElements] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const fetchMyComments = (pageNumber) => {
        axios.get("/api/members/replies", {
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
                const repliesWithWriter = res.data.replies.map(reply => ({
                    ...reply,
                    writer: res.data.writer
                }));
                setWrittenComments(repliesWithWriter);
                setTotalElements(res.data.totalElements);
                setTotalPages(res.data.totalPages);
            }).catch((error) => {
            console.error("작성한 게시물을 가져오는 중 오류 발생:", error);
        });
    };

    useEffect(() => {
        fetchMyComments(page);
    }, [page]);

    const handlePageChange = (selectedPage) => {
        setPage(selectedPage);
        navigate(`/myPage/write-comment/page=${selectedPage}`);
    };

    const mypost = () => {
        console.log("Written posts:", writtenComments);

        if (!Array.isArray(writtenComments)) {
            return <p className="no_scrap">작성한 게시글이 없습니다.</p>;
        }

        return (
            <>
                {(writtenComments.length === 0) && <div className="no_study"><p>작성한 댓글이 없습니다.</p></div>}
                {(writtenComments.length !== 0) &&
                    <table className="post_table">
                        <thead>
                        <tr>
                            <th>타입</th>
                            <th>댓글 내용</th>
                            <th>날짜</th>
                        </tr>
                        </thead>
                        <tbody>
                        {writtenComments.map((comment) => (
                            <tr className="post_list" key={comment.replyId}>
                                <td className="community_category">
                                    {comment.postType === 'COMM' ? '커뮤니티'
                                        : comment.postType === 'STUDY' ? '스터디'
                                            : comment.postType === 'STUDYPOST' ? '팀 커뮤니티' : comment.postType}
                                </td>
                                <td className="community_title">
                                    {['COMM', 'QNA', 'STUDY', 'STUDYPOST'].includes(comment.postType) ? (
                                        <Link
                                            to={
                                                comment.postType === 'COMM'
                                                    ? `/community/post/${comment.targetId}`
                                                    : comment.postType === 'QNA'
                                                        ? `/qna/detail/${comment.targetId}`
                                                        : comment.postType === 'STUDY'
                                                            ? `/study/detail/${comment.targetId}`
                                                            : `/teamblog/${comment.studyId}/community/post/${comment.targetId}`
                                            }
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
        <div>
            <Header showSideCenter={true}/>
            <div className="container">
                <Category/>
                <div className="main_container">
                    <p id={"entry-path"}> 마이페이지 > 내가 작성한 댓글 </p>
                    <Backarrow subname={"내가 작성한 댓글"}/>
                    <div>
                        <div className="community">
                            <div className={"community-content"}>
                                {mypost()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {writtenComments.length !== 0 &&
                <div className="pagingDiv">
                    <Paging page={page} totalItemCount={totalElements} itemsPerPage={itemsPerPage}
                            totalPages={totalPages}
                            handlePageChange={handlePageChange}/>
                </div>
            }
        </div>
    );
}
export default MyWriteComment;