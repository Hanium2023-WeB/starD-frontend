import CommentForm from "./CommentForm";
import { useState, useEffect } from "react";
import CommentList from "./CommentList";
import CommentEdit from "./CommentEdit";
import {useLocation, useParams} from "react-router-dom";
import axios from "axios";

const Comment = ({ type }) => {
  const accessToken = localStorage.getItem('accessToken');
  const [userNickname, setUserNickname] = useState("");
  const location = useLocation();
  let targetId = location.state;

  const [comments, setComments] = useState([]);
  const [editingComment, setEditingComment] = useState(null);

  const [loading, setLoading] = useState(true);

  const {id} = useParams();
  targetId = id;

  const {postid} = useParams(); // 팀블로그 커뮤니티의 postId
  if (postid != null) {
    targetId = postid;
  }

  const [studyStatus, setStudyStatus] = useState("");

  useEffect(() => {
    axios.get(`/api/api/v2/studies/${targetId}`, {
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).then((res) => {
      const studyDetail = res.data;
      setStudyStatus(studyDetail.recruitStatus);
    })
        .catch((error) => {
          console.error("스터디 개설 여부 가져오기 실패:", error);
        });

  }, [targetId, accessToken]);

  useEffect(() => {
    fetchComments()
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          console.error("댓글 목록을 불러오는 중 에러 발생:", error);
          setLoading(false); // 에러 발생 시에도 로딩 상태를 false로 설정합니다.
        });
    }, [id, accessToken]);

  useEffect(() => {
    axios
      .get("/api/member/find-nickname", {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      .then((response) => {

        const member = response.data;
        setUserNickname(member.nickname);
      })
      .catch((error) => {
        console.error("서버에서 닉네임을 가져오는 중 에러 발생:", error);
      });
  }, [accessToken]);

  const fetchComments = () => {
    // targetId가 없다면 댓글 목록을 가져올 수 없음
    if (targetId === "") {
      setLoading(false); // 로딩 상태 해제
      return Promise.resolve(); // 빈 Promise를 반환
    }

    let url;
    if (type === "QNA" || type === 'COMM' ) {
      url = `/api/replies/post/${targetId}`;
    } else if (type === "STUDY") {
      url = `/api/replies/study/${targetId}`;
    } else if (type === "STUDYPOST") {
      url = `/api/replies/studypost/${targetId}`;
    }

    return axios
      .get(url, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      .then((response) => {
        const commentsWithIds = response.data.map((comment) => ({
          ...comment,
          id: comment.id,
          author: comment.member.nickname,
        }));
        setComments(commentsWithIds);
        console.log("댓글목록",commentsWithIds);
      })
      .catch((error) => {
        console.error("댓글 목록을 불러오는 중 에러 발생:", error);
        throw error;
      });
  };

  const addComment = (newComment) => {
    axios.post(`/replies/${targetId}`, {
        targetId: targetId,
        replyContent: newComment,
      }, {
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
      .post(`/api/replies/${commentId}`, {
        replyContent: updatedContent,
      }, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      .then((response) => {
        alert("댓글이 수정되었습니다.");

        const updatedCommentData = response.data;

        const updatedComments = comments.map((comment) =>
          comment.id === commentId ? updatedCommentData : comment
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
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          })
          .then(() => {
            alert("댓글이 삭제되었습니다.");
            const updatedComments = comments.filter((comment) => comment.id !== commentId);
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
  return (
    <div className="comment_form">
      <div>
        <h2>댓글</h2>
        {studyStatus === 'RECRUITMENT_COMPLETE' ? null : (
            <CommentForm addComment={addComment} />
        )}

        <br/><br/>
        {comments.length === 0 ? (
            <p className="comment_empty_message">댓글 내역이 없습니다.</p>
        ) : (
            <CommentList
                comments={comments}
                onEditClick={handleEditClick}
                onRemoveClick={handleRemoveClick}
                userNickname={userNickname}
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
