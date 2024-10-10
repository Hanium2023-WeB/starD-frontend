import React, {useCallback, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const TeamPostInsert = ( {studyId} ) => {
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');
    const [dataId, setDataId] = useState(0);
    const [posts, setPosts] = useState([]);
    const [formData, setFormData] = useState({
        title:"",
        content:"",
        file:null,
        created_date:new Date(),
    })

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({
            ...prevData,
            file: file,
        }));
    };

    const onInsertPost = useCallback((post) => {
        const {
            title,
            content,
            file,
            created_date
        } = post;

        const newData = {
            title,
            content,
            file,
            created_date,
            id: dataId,
        };
        setPosts((prevPosts) => [...prevPosts, newData]);

        setDataId((prevDataId) => prevDataId + 1);
        return newData;
    }, [posts, dataId]);

    const handleSubmit = useCallback(e => {
        e.preventDefault();

        if (formData.title.trim() === '') {
            alert("제목을 입력해주세요.");
            return;
        }
        if (formData.content.trim() === '' && !formData.file) {
            alert("내용이나 파일을 입력해주세요.");
            return;
        }
        setFormData(onInsertPost(formData));

        const postData = new FormData();
        postData.append('studyId', studyId);
        postData.append('title', formData.title);
        postData.append('content', formData.content);
        if (formData.file) {
            postData.append('file', formData.file);
        }

        axios.post("/api/study/post", postData, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
            }
        }).then((res) => {
            console.log(res.data);
            alert("게시글이 등록되었습니다.");
            navigate(`/${studyId}/teamblog/TeamCommunity/studypostdetail/${res.data.id}`)
        }).catch((error) => {
            console.log('전송 실패', error);
        })

        e.preventDefault();
    }, [formData])

    return (
        <form className="new_post_form" onSubmit={handleSubmit} style={{marginRight:"200px"}}>
            <div style={{display:"flex", alignItems:"center"}}>
                <span style={{paddingLeft: "10px"}}>제목</span>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange}/>
            </div>
            <div style={{display:"flex"}}>
                <span style={{paddingLeft: "10px",marginTop:"5px"}}>상세 내용</span>
                <textarea name="content" value={formData.content} onChange={handleInputChange}/>
            </div>
            <div style={{display:"flex", alignItems:"center"}}>
                <span style={{ paddingLeft: "10px"}}>파일 등록</span>
                <input type="file" name="file" onChange={handleFileChange}/>
            </div>
            <div className="btn">
                <input type="submit" value="등록하기" className="register_btn"/>
            </div>
        </form>
    )
}
export default TeamPostInsert;