import Header from "../../components/repeat_etc/Header";
import Backarrow from "../../components/repeat_etc/Backarrow";
import Category from "../../components/repeat_etc/Category.js";
import {Link, useParams, useNavigate, useLocation} from "react-router-dom";
import Comment from "../../components/comment/Comment";
import React, {useState, useEffect} from "react";
import LikeButton from "../../components/repeat_etc/LikeButton";
import axios from "axios";
import PostEdit from "../../components/teamcommunity/TeamPostEdit";
import Report from "../../components/report/Report";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

const StudyPostDetail = ( ) => {
    const navigate = useNavigate();

    const {id, postid} = useParams();
    console.log("studyId: ", id);
    console.log("postId : ", postid);

    const [postItem, setPostItem] = useState(null);

    const [likeStates, setLikeStates] = useState(false);
    const [initiallyLikeStates, setInitiallyLikeStates] = useState(false);

    const [posts, setPosts] = useState([]);
    const [editing, setEditing] = useState(false);
    const [postDetail, setPostDetail] = useState([]);

    const accessToken = localStorage.getItem('accessToken');
    const isLoggedInUserId = localStorage.getItem('isLoggedInUserId');

    const [isWriter, setIsWriter] = useState(false);

    useEffect(() => {
        axios.get(`/api/star/studypost/${postid}`, {
            params: { postid: postid },
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => {
                setLikeStates(response.data);
                setInitiallyLikeStates(true);
            })
            .catch(error => {
                console.log("공감 불러오기 실패", error);
                setInitiallyLikeStates(false);
            });
    }, [postid]);

    useEffect(() => {
        if (initiallyLikeStates) {
            axios.get(`/api/study/post/${postid}`, {
                params: { postid: postid },
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }).then((res) => {
                    setPostItem(res.data);
                    if (res.data.member.id === isLoggedInUserId) { // 자신의 글인지
                        setIsWriter(true);
                    }
                })
                .catch((error) => {
                    console.error("팀 커뮤니티 게시글 세부 데이터 가져오기 실패:", error);
                });
        }
    }, [postid, accessToken, isLoggedInUserId, initiallyLikeStates]);

    const toggleLike = () => {
        if (likeStates) { // true -> 활성화되어 있는 상태 -> 취소해야 함
            axios.delete(`/api/star/studypost/${postid}`, {
                params: { postid: postid },
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    console.log("공감 취소 성공 " + response.data);
                })
                .catch(error => {
                    console.error("Error:", error);
                    console.log("공감 취소 실패");
                });

            setLikeStates(false);
        } else {
            axios.post(`/api/star/studypost/${postid}`, null, {
                params: { postid: postid },
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    console.log("공감 성공");
                })
                .catch(error => {
                    console.error("Error:", error);
                    console.log("공감 실패");
                });

            setLikeStates(true);
        }
    };

    const handleEditClick = () => {
        setEditing(true);
    }

    const handleCancelEdit = () => {
        setEditing(false);
    }

    const handlePostUpdate = (updatedPost) => {
        setEditing(false);

        console.log("수정 예정 : " + updatedPost.id + ", " + updatedPost.title + ", " + updatedPost.content);

        const postData = new FormData();
        postData.append('title', updatedPost.title);
        postData.append('content', updatedPost.content);
        if (updatedPost.fileChanged === true) {
            postData.append('file', updatedPost.file);
            postData.append('fileUpdateStatus', true);
        } else {
            postData.append('fileUpdateStatus', false);
        }

        axios.post(`/api/study/post/${postid}`, postData, {
            params: { postid: updatedPost.id },
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => {
                console.log("팀블로그 커뮤니티 게시글 수정 성공");
                alert("게시글이 수정되었습니다.");

                setPostDetail(response.data);
                const updatedPosts = posts.map(post =>
                    post.id === updatedPost.id ? updatedPost : post
                );
                setPosts(updatedPosts);
                setPostItem(response.data);
            })
            .catch(error => {
                console.error("Error:", error);
                console.log("팀블로그 커뮤니티 게시글 수정 실패");
                alert("수정에 실패했습니다.");
            });
    }

    const handlePostDelete = () => {
        const confirmDelete = window.confirm("정말로 게시글을 삭제하시겠습니까?");
        if (confirmDelete) {

            axios.delete(`/api/study/post/${postid}`, {
                params: { postId: postid },
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    console.log("팀 커뮤니티 게시글 삭제 성공 ");
                    alert("게시글이 삭제되었습니다.");

                    const updatedPosts = posts.filter(post => post.id !== postDetail[0].id);
                    setPosts(updatedPosts);
                    navigate(`/${id}/teamblog/TeamCommunity`, {
                        state: {
                            studyId: id,
                        }
                    })
                })
                .catch(error => {
                    console.error("Error:", error);
                    console.log("팀 커뮤니티 게시글 삭제 실패");

                    alert("삭제에 실패했습니다.");
                });
        }
    }

    const [showReportModal, setShowReportModal] = useState(false);
    const [reportPostId, setReportPostId] = useState(null);

    const handleOpenReportModal = (postId) => {
        setReportPostId(postId);
        setShowReportModal(true);
    };

    const handleCloseReportModal = () => {
        setReportPostId(null);
        setShowReportModal(false);
    };

    const handleReportSubmit = (reportReason) => {
        console.log("신고 사유:", reportReason);
    };


    const showTeamCommunity = () => {
        console.log("id : " + id);
        navigate(`/${id}/teamblog/TeamCommunity`, {
            state: {
                studyId: id,
            }
        })
        // 이동을 안 함.
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

    const handleDownloadClick = () => {
        axios.get(`/api/study/post/download/${postid}`, {
            params: { postId: postid },
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            responseType: 'blob'
        })
            .then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const a = document.createElement('a');
                a.href = url;
                a.download = postItem.fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('파일 다운로드 중 오류 발생 :', error);
            });
    };

    return (
        <div>
            <Header showSideCenter={true}/>
            <div className="container">
                <Category/>
                <div className="main_schedule_container">
                    <p id={"entry-path"}> 스터디 참여내역 > 팀블로그 > 팀 커뮤니티</p>
                    <Backarrow subname={"TEAM COMMUNITY LIST"}/>
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
                                            <span className="post_nickname">{postItem.member.nickname}</span>
                                            <span className="post_created_date">{formatDatetime(postItem.createdAt)}</span>
                                            {postItem.createdAt !== postItem.updatedAt && (
                                              <>
                                                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                                <span>( 수정: {formatDatetime(postItem.updatedAt)} )</span>
                                              </>
                                            )}
                                            {isLoggedInUserId !== postItem.member.id && (
                                                <>
                                                    <span>&nbsp;&nbsp; | &nbsp;&nbsp;</span>
                                                    <span className="report_btn" onClick={() => handleOpenReportModal(postItem.id)}>신고</span>
                                                </>
                                            )}
                                            <Report
                                                show={showReportModal}
                                                handleClose={handleCloseReportModal}
                                                onReportSubmit={handleReportSubmit}
                                                targetId={reportPostId}
                                                targetType={"studypost"}
                                            />
                                        </div>
                                        <div className="right">
                                            <span className="like_btn"><LikeButton like={likeStates}
                                                                                   onClick={() => toggleLike()} /></span>
                                            <span>조회 <span>{postItem.viewCount}</span></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postItem && (
                                <div>
                                    <div className="post_content" dangerouslySetInnerHTML={{ __html: postItem.content.replace(/\n/g, '<br>') }} />
                                    {postItem.fileName && (
                                        <div className="download_box">
                                            {postItem.fileName}
                                            <FontAwesomeIcon icon={faArrowDown} onClick={handleDownloadClick} className="download_btn"/>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="btn">
                                <Link
                                    to={`/${id}/teamblog/TeamCommunity`}
                                    // onClick={showTeamCommunity}
                                    state={{studyId: id}}
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

                    {!editing && (
                        <div className="comment_container" style={{width:"90%"}}>
                            <Comment type="studypost" />
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
export default StudyPostDetail;