import Header from "../../components/repeat_etc/Header";
import Backarrow from "../../components/repeat_etc/Backarrow";
import {Link, useParams, useNavigate} from "react-router-dom";
import Comment from "../../components/comment/Comment";
import React, {useState, useEffect, useCallback} from "react";
import LikeButton from "../../components/repeat_etc/LikeButton";
import ScrapButton from "../../components/repeat_etc/ScrapButton";
import axios from "axios";
import PostEdit from "../../components/community/PostEdit";
import Report from "../../components/report/Report";
import ImageComponent from "../../components/image/imageComponent";
import default_profile_img from "../../images/default_profile_img.png";
import {toggleLikeStatus} from "../../util/likeHandler";
import toast from "react-hot-toast";

const PostDetail = () => {
    const navigate = useNavigate();

    const {id} = useParams();
    console.log("postId : ", id);

    const [postItem, setPostItem] = useState(null);
    const [posts, setPosts] = useState([]);
    const [editing, setEditing] = useState(false);
    const [postDetail, setPostDetail] = useState([]);

    const accessToken = localStorage.getItem('accessToken');
    const isLoggedInUserId = localStorage.getItem('isLoggedInUserId');

    const [isWriter, setIsWriter] = useState(false);

    useEffect(() => {
        const fetchCommunityData = async () => {
            try {
                const headers = {};
                if (accessToken && isLoggedInUserId) {
                    headers['Authorization'] = `Bearer ${accessToken}`;
                }

                const response = await axios.get(`/api/communities/${id}`, {
                    withCredentials: true,
                    headers,
                });

                console.log(response.data);
                setPostItem(response.data);
                if (response.data.isAuthor) { // 자신의 글인지
                    setIsWriter(true);
                }
            } catch (error) {
                console.error("커뮤니티 게시글 세부 데이터 가져오기 실패:", error);
            }
        };

        fetchCommunityData();
    }, [id, accessToken, isLoggedInUserId]);


    const toggleLike = useCallback(() => {
        if (!postItem) {
            console.warn("postItem이 아직 초기화되지 않았습니다.");
            return;
        }
        console.log(postItem);
        toggleLikeStatus(
            postItem,
            accessToken,
            isLoggedInUserId,
            (existsStar) => {
                setPostItem((prevPost) => ({
                    ...prevPost,
                    existsStar,
                }));
            },
            (error) => {
                console.error("좋아요 상태 변경 실패:", error.response.data);
            }
        );
    }, [postItem, accessToken, isLoggedInUserId]);

    const handleEditClick = () => {
        setEditing(true);
    }

    const handleCancelEdit = () => {
        setEditing(false);
    }

    const handlePostUpdate = (updatedPost) => {
        console.log("수정 예정 : " + updatedPost.postId + ", " + updatedPost.title + ", " + updatedPost.content
            + ", " + updatedPost.category);

        axios.put(`/api/communities/${id}`, {
                title: updatedPost.title,
                content: updatedPost.content,
                category: updatedPost.category
            }, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then(response => {
                console.log("커뮤니티 게시글 수정 성공");
                alert("게시글이 수정되었습니다.");

                setPostItem(response.data);
                setEditing(false);
                // navigate(`/postdetail/${updatedPost.postId}`);
            })
            .catch(error => {
                console.error("Error:", error);
                console.log("커뮤니티 게시글 수정 실패");
                alert("수정에 실패했습니다.");
            });
    }

    const handlePostDelete = () => {
        const confirmDelete = window.confirm("정말로 게시글을 삭제하시겠습니까?");
        if (confirmDelete) {
            axios.delete(`/api/communities/${id}`, {
                // params: { id: id },
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    console.log("커뮤니티 게시글 삭제 성공 ");
                    alert("게시글이 삭제되었습니다.");

                    const updatedPosts = posts.filter(post => post.postId !== postDetail[0].postId);
                    setPosts(updatedPosts);
                    navigate("/community/page=1");
                })
                .catch(error => {
                    console.error("Error:", error);
                    console.log("커뮤니티 게시글 삭제 실패");

                    alert("삭제에 실패했습니다.");
                });
        }
    }

    const [showReportModal, setShowReportModal] = useState(false);
    const [reportPostId, setReportPostId] = useState(null);

    const handleOpenReportModal = (postId, e) => {
        if (accessToken && isLoggedInUserId) {
            e.preventDefault();
            setReportPostId(postId);
            setShowReportModal(true);
        } else {
            return toast.error("로그인 후 이용 가능합니다.");
        }
    };

    const handleCloseReportModal = () => {
        setReportPostId(null);
        setShowReportModal(false);
    };

    const handleReportSubmit = (reportReason) => {
        console.log("신고 사유:", reportReason);
    };

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
                <Backarrow subname={"COMMUNITY LIST"}/>
                {editing ? (
                    <PostEdit
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
                                    <span>{postItem.category}</span>
                                </div>
                                <div style={{display:"flex", justifyContent:"space-between"}}>
                                    <div className="post_title">
                                        {postItem.title}
                                    </div>
                                    {isWriter && (
                                        <div className="button">
                                            <button style={{marginRight:"5px"}} onClick={handleEditClick}>수정</button>
                                            <button onClick={handlePostDelete}>삭제</button>
                                        </div>
                                    )}
                                </div>
                                <div className="post_info">
                                    <div className="left">
                                        <span className="writer_profile">
                                            <ImageComponent getImgName = {postItem.profileImg ? postItem.profileImg : default_profile_img} imageSrc={""} />
                                            <Link
                                                to={`/${postItem.postId}/userprofile`}
                                                style={{
                                                    textDecoration: "none",
                                                    color: "inherit",
                                                }}
                                            >
                                                <span className="post_nickname">{postItem.writer}</span>
                                            </Link>
                                        </span>
                                        <span className="post_created_date">{formatDatetime(postItem.createdAt)}</span>
                                        {postItem.createdAt !== postItem.updatedAt && (
                                          <>
                                            <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                            <span>( 수정: {formatDatetime(postItem.updatedAt)} )</span>
                                          </>
                                        )}
                                        {!isWriter && (
                                            <>
                                                <span>&nbsp;&nbsp; | &nbsp;&nbsp;</span>
                                                <span className="report_btn" onClick={(e) => handleOpenReportModal(postItem.postId, e)}>신고</span>
                                            </>
                                        )}
                                        <Report
                                            show={showReportModal}
                                            handleClose={handleCloseReportModal}
                                            onReportSubmit={handleReportSubmit}
                                            targetId={reportPostId}
                                            targetType={"comm"}
                                        />
                                    </div>
                                    <div className="right">
                                        <span className="like_btn">
                                            <LikeButton like={postItem.existsStar} onClick={() => toggleLike()} /></span>
                                        <span>조회 <span>{postItem.hit}</span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        {postItem && (
                            <div className="post_content" dangerouslySetInnerHTML={{ __html: postItem.content.replace(/\n/g, '<br>') }} />
                        )}

                        <div className="btn">
                            <Link to={"/community/page=1"}
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
            {!editing && (
                <div className="comment_container">
                    <Comment type="comm" />
                </div>
            )}
        </div>
    )
}
export default PostDetail;