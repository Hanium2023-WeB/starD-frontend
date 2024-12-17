import React, {useCallback, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const PostInsert = () => {
    const navigate = useNavigate();
    const [dataId, setDataId] = useState(0);
    const [posts, setPosts] = useState([]);
    const [formData, setFormData] = useState({
        title:"",
        category:"",
        content:"",
        created_date:new Date(),
    })

    const tagoptions = [
        { value: "취미", name: "취미" },
        { value: "공부", name: "공부" },
        { value: "잡담", name: "잡담" },
        { value: "기타", name: "기타" },
        { value: "없음", name: "없음" },
    ];

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const onInsertPost = useCallback((post) => {
        const {
            title,
            field,
            content,
            created_date
        } = post;

        const selectedCategory = document.querySelector('select[name="category"]').value;

        const newData = {
            title,
            category: selectedCategory,
            content,
            created_date,
            id: dataId,
        };
        setPosts((prevPosts) => [...prevPosts, newData]);

        setDataId((prevDataId) => prevDataId + 1);
        return newData;
    }, [posts, dataId]);

    const handleSubmit = useCallback(e => {
        e.preventDefault();

        if (
            formData.title.trim() === '' &&
            formData.content.trim() === ''
        ) {
            alert('게시글 정보를 입력해주세요.');

            return;
        }
        if (formData.title.trim() === '') {
            alert("제목을 입력해주세요.");
            return;
        }
        if (formData.content.trim() === '') {
            alert("내용을 입력해주세요.");
            return;
        }
        setFormData(onInsertPost(formData));
        const accessToken = localStorage.getItem('accessToken');
        console.log(formData);
        const response = axios.post("/api/communities",
            {
                title:formData.title,
                category:formData.category,
                content:formData.content,
            },
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then((res) => {
                console.log(res.data);
                const id = res.data.id;
                alert("게시글이 등록되었습니다.");
                window.location.href = `/postdetail/${id}`;
            }).catch((error) => {
                console.log('전송 실패', error);
            })
        e.preventDefault();
    }, [formData])

    return (
        <form className="new_post_form" onSubmit={handleSubmit}>
            <div style={{display:"flex", alignItems:"center"}}>
                <span style={{paddingLeft: "10px"}}>제목</span>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange}/>
            </div>
            <div style={{marginLeft:"2px"}}>
                <span>카테고리</span>
                <span className="field_wrapper">
                    <select name="category" value={formData.category} onChange={handleInputChange}>
                        {tagoptions.map((interest, idx) =>
                            <option key={idx} value={interest.value}>{interest.name}</option>
                        )}
                    </select>
                </span>
            </div>
            <div style={{display:"flex"}}>
                <span style={{paddingLeft: "10px",marginTop:"5px"}}>상세 내용</span>
                <textarea name="content" value={formData.content} onChange={handleInputChange}/>
            </div>
            <div className="btn">
                <input type="submit" value="등록하기" className="register_btn"/>
            </div>
        </form>
    )
}
export default PostInsert;