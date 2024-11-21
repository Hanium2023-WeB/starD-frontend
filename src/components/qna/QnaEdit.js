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

    const handleUpdateClick = (e) => {
        e.preventDefault();
        onUpdatePost(updatedPost, e);
    }

    return (
        <form className="new_post_form" onSubmit={handleUpdateClick}>
            <div style={{display:"flex", alignItems:"center"}}>
                <span>제목</span>
                <input type="text" name="title" value={updatedPost.title} onChange={handleInputChange}/>
            </div>
            <div>
                <span style={{marginLeft:"-7px"}}>카테고리</span>
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
                <span>상세 내용</span>
                <textarea name="content" value={updatedPost.content} onChange={handleInputChange}/>
            </div>
            <div className="btn">
                <button type="submit" className="register_btn">저장</button>
                <button onClick={onCancel} className="register_btn">취소</button>
            </div>
        </form>
    );
}
export default QnaEdit;