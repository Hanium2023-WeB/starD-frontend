import React, {useState} from "react";

const PostEdit = ({post, onUpdatePost, onCancel}) => {
    const [updatedPost, setUpdatedPost] = useState(post);

    const [selectedCategory, setSelectedCategory] = useState(post.category);

    const tagoptions = [
        { value: "취미", name: "취미" },
        { value: "공부", name: "공부" },
        { value: "잡담", name: "잡담" },
        { value: "기타", name: "기타" },
        { value: "없음", name: "없음" },
    ];

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setUpdatedPost((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    }

    const handleUpdateClick = () => {
        onUpdatePost({ ...updatedPost, category: selectedCategory });
    }

    return (
        <form className="new_post_form">
            <div style={{display:"flex", alignItems:"center"}}>
                <span style={{paddingLeft:"10px"}}>제목</span>
                <input type="text" name="title" value={updatedPost.title} onChange={handleInputChange}/>
            </div>
            <div style={{marginLeft:"2px"}}>
                <span>카테고리</span>
                <span className="field_wrapper">
                    <select name="category" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                        {tagoptions.map((interest, idx) =>
                            <option key={idx} value={interest.value}>{interest.name}</option>
                        )}
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
export default PostEdit;