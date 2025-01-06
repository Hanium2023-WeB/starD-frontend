import React, {useState} from "react";
import Report from "../report/Report.js";
import {Link, useNavigate} from "react-router-dom";
import ImageComponent from "../image/imageComponent";
import default_profile_img from "../../images/default_profile_img.png";

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

const CommentList = ({ comments, onEditClick, onRemoveClick, onReplySubmit }) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportCommentId, setReportCommentId] = useState(null);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
  const handleOpenReportModal = (commentId) => {
    setReportCommentId(commentId);
    setShowReportModal(true);
  };

  const handleCloseReportModal = () => {
    setReportCommentId(null);
    setShowReportModal(false);
  };

  const handleReportSubmit = (reportReason) => {
    console.log("신고 사유:", reportReason);
  };

  if (!comments) {
    comments = [];
  }

  return (
      <div className="comment_list">
        <ul>
          {comments.map((comment, index) => (
              <li key={index} className="comment">
                <div style={{display: "flex", justifyContent: "space-between"}}>
                  <div className="comment_profile">
                    <ImageComponent getImgName={comment.profileImg}
                                    imageSrc={""}/>
                    <Link to={`/${comment.writer}/profile`}
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                          }}>
                      <strong>{comment.writer}</strong>
                    </Link>
                  </div>
                  <div>
                    {comment.isAuthor && (
                        <>
                        <span className="comment_edit_btn"
                              onClick={() => onEditClick(comment.replyId)}>
                          수정
                        </span>
                          <span>&nbsp;&nbsp; | &nbsp;&nbsp;</span>
                          <span className="comment_remove_btn"
                                onClick={() => onRemoveClick(comment.replyId)}>
                          삭제
                        </span>
                        </>
                    )}
                  </div>
                </div>
                <p>{comment.content}</p>
                <span>{formatDatetime(comment.createdAt)}</span>
                {comment.createdAt !== comment.updatedAt && (
                    <>
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <span>( 수정: {formatDatetime(comment.updatedAt)} )</span>
                    </>
                )}
                {!comment.isAuthor && accessToken && (
                    <>
                      <span>&nbsp;&nbsp; | &nbsp;&nbsp;</span>
                      <span className="comment_report_btn"
                            onClick={() => handleOpenReportModal(
                                comment.replyId)}>신고</span>
                    </>
                )}
              </li>
          ))}
        </ul>
        <Report
            show={showReportModal}
            handleClose={handleCloseReportModal}
            onReportSubmit={handleReportSubmit}
            targetId={reportCommentId}
            targetType={"reply"}
        />
      </div>
  );
};

export default CommentList;
