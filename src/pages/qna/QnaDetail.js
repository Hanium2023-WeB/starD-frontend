import Header from "../../components/repeat_etc/Header";
import Backarrow from "../../components/repeat_etc/Backarrow";
import {Link, useParams, useNavigate, useLocation} from "react-router-dom";
import React, {useState, useEffect} from "react";
import axios from "axios";
import QnaEdit from "../../components/qna/QnaEdit";
import Comment from "../../components/comment/Comment";
import default_profile_img from "../../images/default_profile_img.png";
import axiosInstance from "../../api/axiosInstance";
import ImageComponent from "../../components/image/imageComponent";

const QnaDetail = () => {
    const navigate = useNavigate();

    const {id} = useParams();
    const location = useLocation();
    const {postType} = location.state || {};

    const [postItem, setPostItem] = useState(null);

    const [posts, setPosts] = useState([]);
    const [editing, setEditing] = useState(false);
    const [postDetail, setPostDetail] = useState([]);

    let accessToken = localStorage.getItem('accessToken');
    let isLoggedInUserId = localStorage.getItem('isLoggedInUserId');
    const [url, setUrl] = useState(null);
    const [initiallyUrlStates, setInitiallyUrlStates] = useState(false);

    const [isWriter, setIsWriter] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (postType === "FAQ") {
            setUrl(`/api/faqs/${id}`);
        } else if (postType === "QNA") {
            setUrl(`/api/qnas/${id}`);
        }

        setInitiallyUrlStates(true);
    }, [id]);

    useEffect(() => {
        if (accessToken) {
            axiosInstance
                .get("/members/auth")
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
        }
    }, [accessToken]);

    useEffect(() => {
        if (initiallyUrlStates) {
            axios.get(url, {
                withCredentials: true,
                headers: accessToken ? {'Authorization': `Bearer ${accessToken}`} : {},
            })
                .then((res) => {
                    setPostItem(res.data);
                    if (res.data.isAuthor) { // 자신의 글인지
                        setIsWriter(true);
                    }
                })
                .catch((error) => {
                    console.error("qna 세부 데이터 가져오기 실패:", error);
                });
        }
    }, [id, accessToken, isLoggedInUserId, initiallyUrlStates]);

    const handleEditClick = () => {
        setEditing(true);
    }

    const handleCancelEdit = () => {
        setEditing(false);
    }

    const handlePostUpdate = (updatedPost) => {
        console.log("수정 예정:", updatedPost.postId, updatedPost.title,
            updatedPost.content, updatedPost.postType);

        // Authorization 헤더 구성
        const config = {
            headers: {}
        };
        if (accessToken && isLoggedInUserId) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        // 수정 요청 보내기
        axios
            .put(
                url, // API URL
                { // 전달할 데이터
                    title: updatedPost.title,
                    content: updatedPost.content,
                },
                config // 헤더 설정
            )
            .then(response => {
                console.log("qna 수정 성공:", response.data);
                alert("게시글이 수정되었습니다.");
                setPostItem(response.data)
                setEditing(false); // 수정 모드 비활성화
            })
            .catch(error => {
                console.error("qna 수정 실패:", error.response || error.message);
                alert("수정에 실패했습니다.");
            });
    };

    const handlePostDelete = () => {
        const confirmDelete = window.confirm("정말로 게시글을 삭제하시겠습니까?");
        if (confirmDelete) {
            axios.delete(url, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    console.log("qna 삭제 성공 ");
                    alert("게시글이 삭제되었습니다.");
                    const updatedPosts = posts.filter(
                        post => post.postId !== postDetail[0].postId);
                    setPosts(updatedPosts);
                    navigate("/qna/page=1");
                })
                .catch(error => {
                    console.error("Error:", error);
                    console.log("qna 삭제 실패");

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
                <Backarrow subname={"QNA"} />
                {editing ? (
                    <QnaEdit
                        post={postItem}
                        onUpdatePost={handlePostUpdate}
                        onCancel={handleCancelEdit}
                    />
                ) : (
                    <div className="community_detail">
                        {postItem && (
                            <div className="post_header">
                                <div className="post_category">
                                    <span>카테고리 > </span>
                                    <span>{postItem.postType}</span>
                                </div>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between"
                                }}>
                                    <div className="post_title">
                                        {postItem.title}
                                    </div>
                                    {(isWriter || (isWriter && isAdmin)) && (
                                        <div className="button">
                                            <button style={{marginRight: "5px"}}
                                                    onClick={handleEditClick}>수정
                                            </button>
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
                                        {postItem.type === "FAQ" ? (
                                            <td className="community_nickname">
                                                <ImageComponent
                                                    imageUrl={null}
                                                    imageCss={"profile_image"} // 필요한 경우 CSS 클래스 추가
                                                />관리자</td>
                                        ) : (
                                            <td className="community_nickname">
                                                <div className="profile_image">
                                                <ImageComponent
                                                    imageUrl={postItem.profileImg}
                                                    imageCss={"profile_image"}
                                                />
                                                </div>
                                                {postItem.writer}
                                            </td>
                                        )}
                                        <span className="post_created_date">{formatDatetime(
                                            postItem.createdAt)}</span>
                                        {postItem.createdAt !== postItem.updatedAt && (
                                            <>
                                                <span>&nbsp;&nbsp;&nbsp;</span>
                                                <span>( 수정: {formatDatetime(
                                                    postItem.updatedAt)} )</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="right">
                          <span
                              className="hit_count">조회 <span>{postItem.hit}</span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        {postItem && (
                            <div className="post_content" dangerouslySetInnerHTML={{
                                __html: postItem.content.replace(/\n/g, '<br>')
                            }}/>
                        )}

                        <div className="btn">
                            <Link to={"/qna/page=1"}
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
            {postItem && postItem.postType === "QNA" && (
                <div className="comment_container">
                    <Comment type="qna"/>
                </div>
            )}
        </div>
    )
}
export default QnaDetail;