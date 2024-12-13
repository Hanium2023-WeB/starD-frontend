import { useCallback, useState } from "react";

const CommentEdit = ({ comment, commentId, onCancel, onSave }) => {
  const [editedContent, setEditedContent] = useState(comment.find((c) => c.replyId === commentId)?.content || "");

  const handleInputChange = useCallback((e) => {
    setEditedContent(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSave(commentId, editedContent);
    },
    [commentId, editedContent, onSave]
  );

  return (
    <form onSubmit={handleSubmit} className="comment_edit_form">
      <input
        type="text"
        className="comment_input_edit"
        name="content"
        value={editedContent}
        onChange={handleInputChange}
      />
      <input type="submit" value="저장" className="comment_submit_btn" />
      <input
        type="button"
        value="취소"
        className="comment_submit_btn"
        onClick={onCancel}
      />
    </form>
  );
};

export default CommentEdit;
