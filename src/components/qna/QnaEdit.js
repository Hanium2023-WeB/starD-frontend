import React, {useState} from "react";

const QnaEdit = ({post, onUpdatePost, onCancel}) => {
    const [updatedPost, setUpdatedPost] = useState(post);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setUpdatedPost((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    }

    const handleUpdateClick = () => {
        onUpdatePost(updatedPost);
    }

    return (
        <form className="new_post_form">
            <div>
                <span>제목</span>
                <input type="text" name="title" value={updatedPost.title} onChange={handleInputChange}/>
            </div>
            <div>
                <span>카테고리</span>
                <span className="field_wrapper">
                    <select name="category" onChange={handleInputChange} disabled>
                        {post.postType === 'FAQ' ? (
                            <option value="qna">FAQ</option>
                        ) : <option value="faq">QNA</option>
                        }
                    </select>
                </span>
            </div>
            <div style={{display:"flex"}}>
                <span style={{paddingLeft: "10px",marginTop:"5px"}}>상세 내용</span>
                <textarea name="content" value={updatedPost.content} onChange={handleInputChange}/>
            </div>
            <div className="btn">
                <button onClick={handleUpdateClick} className="register_btn">저장</button>
                <button onClick={onCancel} className="register_btn">취소</button>
            </div>
        </form>
    );
}
export default QnaEdit;