import React, {useCallback, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Header from "../../components/repeat_etc/Header";
import Backarrow from "../../components/repeat_etc/Backarrow";

const QnaInsert = () => {
    //console.log("type: ",postType);
    const postType = "qna"
    const navigate = useNavigate();
    const [dataId, setDataId] = useState(0);
    const [posts, setPosts] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        created_date: new Date(),
    })

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
            content,
            created_date
        } = post;

        const newData = {
            title,
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

        // let url;
        // if (postType === "FAQ") {
        //     url = "http://localhost:8080/faq"
        // } else if (postType === "QNA") {
        //     url = "http://localhost:8080/qna"
        // }

        const accessToken = localStorage.getItem('accessToken');

        const response = axios.post("/api/qnas",
            {
                title: formData.title,
                content: formData.content,
            },
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then((res) => {
                console.log(res.data);
                const id = res.data.postId;
                alert("게시글이 등록되었습니다.");
                window.location.href = `/qnadetail/${id}`;
            }).catch((error) => {
                console.log('전송 실패', error);
                alert("게시글 등록 실패");
            })
        e.preventDefault();
    }, [formData])

    return (<div className={"main_wrap"} id={"community"}>
            <Header showSideCenter={true}/>
            <div className="community_container">
                <div className="community_container">
                    <p id={"entry-path"}> 홈 > QNA </p>
                    <Backarrow subname={"QNA LIST"}/>
                    <form className="new_post_form" onSubmit={handleSubmit}>
                        <div style={{display: "flex", alignItems:"center"}}>
                            <span>제목</span>
                            <input type="text" name="title" value={formData.title} onChange={handleInputChange}/>
                        </div>
                        <div style={{marginLeft:"-10px"}}>
                            <span>카테고리</span>
                            <span className="field_wrapper">
                    <select name="category" onChange={handleInputChange} disabled>
                        {postType === 'FAQ' ? (
                            <option value="qna">FAQ</option>
                        ) : <option value="faq">QNA</option>
                        }
                    </select>
                </span>
                        </div>
                        <div style={{display: "flex"}}>
                            <span>상세 내용</span>
                            <textarea name="content" value={formData.content} onChange={handleInputChange}/>
                        </div>
                        <div className="btn">
                            <input type="submit" value="등록하기" className="register_btn"/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default QnaInsert;