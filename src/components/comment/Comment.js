import CommentForm from "./CommentForm";
import React, {useState, useEffect} from "react";
import CommentList from "./CommentList";
import CommentEdit from "./CommentEdit";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Paging from "../repeat_etc/Paging";

const Comment = ({type}) => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const accessToken = localStorage.getItem('accessToken');
    const isLoggedInUserId = localStorage.getItem("isLoggedInUserId");
    const [userNickname, setUserNickname] = useState("");
    const location = useLocation();
    let targetId = location.state;

    const [comments, setComments] = useState([]);
    const [editingComment, setEditingComment] = useState(null);

    const [loading, setLoading] = useState(true);

    const {id} = useParams();
    targetId = id;

    const {postId} = useParams(); // 팀블로그 커뮤니티의 postId
    if (postId != null) {
        targetId = postId;
    }

    const [studyStatus, setStudyStatus] = useState("");

    useEffect(() => {
        fetchComments();
    }, [id, accessToken]);

    const fetchComments = async (selectedPage = page) => {
        try {
            const headers = {};

            if (accessToken) {
                headers['Authorization'] = `Bearer ${accessToken}`;
            }

            const response = await axios.get(`/api/replies/${targetId}`, {
                params: {
                    // targetId: targetId,
                    type: type,
                    page: selectedPage
                },
                withCredentials: true,
                headers,
            });

            setPage(response.data.currentPage);
            setCount(response.data.totalElements);
            setLoading(false);
            setComments(response.data.replies);
        } catch (error) {
            console.error("댓글 목록을 불러오는 중 에러 발생:", error);
            throw error;
        }
    };

    const addComment = (newComment) => {
        axios.post(`/api/replies/${targetId}`, {
            type: type,
            content: newComment,
        }, {
            params: {targetId: targetId},
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((response) => {
                alert("댓글이 등록되었습니다.");
                const newCommentData = response.data;
                setComments((prevComments) => [...prevComments, newCommentData]);
                fetchComments();
            })
            .catch((error) => {
                console.error("댓글 추가 중 에러 발생:", error);
            });
    };

    const handleEditClick = (commentId) => {
        setEditingComment(commentId); // 댓글 ID만 설정
        console.log("수정버튼 클릭: ", commentId);
    };

    const handleCommentSave = (commentId, updatedContent) => {
        axios
            .put(`/api/replies/${commentId}`, {
                content: updatedContent,
            }, {
                params: {replyId: commentId},
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then((response) => {
                alert("댓글이 수정되었습니다.");

                const updatedCommentData = response.data;

                const updatedComments = comments.map((comment) =>
                    comment.replyId === commentId ? updatedCommentData : comment
                );
                setEditingComment(null);
                setComments(updatedComments);
                fetchComments();
            })
            .catch((error) => {
                console.error("댓글 수정 중 에러 발생:", error);
            });
    };

    const handleRemoveClick = (commentId) => {
        const confirmDelete = window.confirm("댓글을 삭제하시겠습니까?");

        if (confirmDelete) {
            axios
                .delete(`/api/replies/${commentId}`, {
                    params: {replyId: commentId},
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                .then(() => {
                    alert("댓글이 삭제되었습니다.");
                    const updatedComments = comments.filter(
                        (comment) => comment.replyId !== commentId);
                    setComments(updatedComments);
                })
                .catch((error) => {
                    console.error("댓글 삭제 중 에러 발생:", error);
                });
        }
    };

    if (loading) {
        return <p>로딩 중...</p>;
    }

    // 페이지 변경 시 호출되는 함수
    const handlePageChange = (selectedPage) => {
        setPage(selectedPage); // 선택된 페이지를 상태에 저장
        fetchComments(selectedPage); // 해당 페이지의 댓글 데이터를 가져옴
    };

    return (
        <div className="comment_form">
            <div>
                <h2>💬 댓글 {count}</h2>
                {studyStatus === 'RECRUITMENT_COMPLETE' ? null : (
                    <CommentForm addComment={addComment}/>
                )}

                {comments.length === 0 ? (
                    null
                ) : (
                    <div className="paging">
                        <Paging page={page} totalItemCount={count} itemsPerPage={10}
                                handlePageChange={handlePageChange}/>
                    </div>
                )}

                <br/><br/>
                {comments.length === 0 ? (
                    null
                ) : (
                    <CommentList
                        comments={comments}
                        onEditClick={handleEditClick}
                        onRemoveClick={handleRemoveClick}
                        isLoggedInUserId={isLoggedInUserId}
                    />
                )}
            </div>
            {editingComment && (
                <CommentEdit
                    comment={comments}
                    commentId={editingComment}
                    onCancel={() => setEditingComment(null)}
                    onSave={handleCommentSave}
                />
            )}
        </div>
    );
};

export default Comment;
