import Header from "../../components/repeat_etc/Header";
import Backarrow from "../../components/repeat_etc/Backarrow";
import {Link, useParams, useNavigate} from "react-router-dom";
import React, {useState, useEffect} from "react";
import axios from "axios";
import NoticeEdit from "../../components/notice/NoticeEdit";
import default_profile_img from "../../images/default_profile_img.png";
import toast from "react-hot-toast";

const NoticeDetail = () => {
    const navigate = useNavigate();

    const {id} = useParams();

    const [postItem, setPostItem] = useState(null);
    const [posts, setPosts] = useState([]);
    const [editing, setEditing] = useState(false);
    const [postDetail, setPostDetail] = useState([]);

    let accessToken = localStorage.getItem('accessToken');
    let isLoggedInUserId = localStorage.getItem('isLoggedInUserId');

    const [isWriter, setIsWriter] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        axios
            .get("/api/members/auth", {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then((res) => {
                const auth = res.data;

                if (auth === "USER") {
                    setIsAdmin(false);
                } else if (auth === "ADMIN") {
                    setIsAdmin(true);
                }
            })
            .catch((error) => {
                console.error("권한 조회 실패:", error);
                setIsAdmin(false);
            });
    }, [accessToken]);

    useEffect(() => {
        const config = {
            headers: {}
        };

        if (accessToken && isLoggedInUserId) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        axios.get(`/api/notices/${id}`, config)
            .then((res) => {
                setPostItem(res.data);
                if (res.data.isAuthor === true) {
                    setIsWriter(true);
                }
            })
            .catch((error) => {
                console.error("게시글 세부 데이터 가져오기 실패:", error);
            });
    }, [id, accessToken, isLoggedInUserId]);

    const handleEditClick = () => {
        setEditing(true);
    }

    const handleCancelEdit = () => {
        setEditing(false);
    }

    const handlePostUpdate = (updatedPost) => {
        if (updatedPost.title.trim() === '') {
            alert("제목을 입력해주세요.");
            return;
        }

        if (updatedPost.content.trim() === '') {
            alert("내용을 입력해주세요.");
            return;
        }

        const config = {
            headers: {}
        };

        if (accessToken && isLoggedInUserId) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        axios.put(`/api/notices/${id}`, {
            title: updatedPost.title,
            content: updatedPost.content,
        }, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => {
                console.log("공지글 수정 성공");
                alert("게시글이 수정되었습니다.");
                setPostItem(response.data)
                setEditing(false);
            })
            .catch(error => {
                console.error("Error:", error);
                console.log("공지글 수정 실패");
                alert("수정에 실패했습니다.");
            });

    }

    const handlePostDelete = () => {
        const confirmDelete = window.confirm("정말로 게시글을 삭제하시겠습니까?");
        if (confirmDelete) {

            axios.delete(`/api/notices/${id}`, {
                // params: { id: id },
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    console.log("공지글 삭제 성공 ");
                    alert("게시글이 삭제되었습니다.");
                    const updatedPosts = posts.filter(post => post.id !== postDetail[0].id);
                    setPosts(updatedPosts);
                    navigate("/notice/page=1");
                })
                .catch(error => {
                    console.error("Error:", error);
                    console.log("공지글 삭제 실패");

                    alert("삭제에 실패했습니다.");
                });
        }
    }

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

    return (
        <div>
            <Header showSideCenter={true}/>
            <div className="community_container">
                <Backarrow subname={"NOTICE LIST"}/>
                {editing ? (
                    <NoticeEdit
                        post={postItem}
                        onUpdatePost={handlePostUpdate}
                        onCancel={handleCancelEdit}
                    />
                ) : (
                    <div className="community_detail">
                        {postItem && (
                            <div className="post_header">
                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                    <div className="post_title">
                                        {postItem.title}
                                    </div>
                                    {(isWriter || (isWriter && isAdmin)) && (
                                        <div className="button">
                                            <button style={{marginRight: "5px"}} onClick={handleEditClick}>수정</button>
                                            <button onClick={handlePostDelete}>삭제</button>
                                        </div>
                                    )}
                                    {(isAdmin && !isWriter) && (
                                        <div className="button">
                                            <button onClick={handlePostDelete}>삭제</button>
                                        </div>
                                    )}
                                </div>
                                <div className="post_info">
                                    <div className="left">
                                        <span className="community_nickname">
                                            <img
                                                src={postItem.profileImg || default_profile_img} // 기본 이미지 경로
                                                alt="프로필 이미지"
                                                className="profile_image" // 필요한 경우 CSS 클래스 추가
                                            />
                                            {postItem.writer}
                                        </span>
                                        <span className="post_created_date">{formatDatetime(postItem.createdAt)}</span>
                                        {postItem.createdAt !== postItem.updatedAt && (
                                            <>
                                                <span>&nbsp;&nbsp;&nbsp;</span>
                                                <span>( 수정: {formatDatetime(postItem.updatedAt)} )</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="right">
                                        <span>조회 <span>{postItem.hit}</span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        {postItem && (
                            <div className="post_content"
                                 dangerouslySetInnerHTML={{__html: postItem.content.replace(/\n/g, '<br>')}}/>
                        )}

                        <div className="btn">
                            <Link to={"/notice/page=1"}
                                  style={{
                                      textDecoration: "none",
                                      color: "inherit",
                                  }}
                            >
                                <button className="community_list_btn">글 목록보기</button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
export default NoticeDetail;