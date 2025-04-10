import Header from "../../components/repeat_etc/Header";
import Backarrow from "../../components/repeat_etc/Backarrow";
import Category from "../../components/repeat_etc/Category.js";
import {Link, useParams, useNavigate, useLocation} from "react-router-dom";
import Comment from "../../components/comment/Comment";
import React, {useState, useEffect, useCallback} from "react";
import LikeButton from "../../components/repeat_etc/LikeButton";
import axios from "axios";
import PostEdit from "../../components/teamcommunity/TeamPostEdit";
import Report from "../../components/report/Report";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { toggleScrapStatus } from "../../util/scrapHandler";
import ScrapButton from "../../components/repeat_etc/ScrapButton";
import TeamBlogGnb from "../../components/repeat_etc/TeamBlogGnb";
import {useTeamBlogContext} from "../../components/datacontext/TeamBlogContext";
import ImageComponent from "../../components/image/imageComponent";

const StudyPostDetail = ( ) => {
    const navigate = useNavigate();

    const {id, postId} = useParams();
    const studyId = id;
    console.log("studyId: ", studyId);
    console.log("postId : ", postId);

    const [postItem, setPostItem] = useState(null);
    const { member, studyItem, progressType, todos, schedules, loading, error } = useTeamBlogContext();

    const [posts, setPosts] = useState([]);
    const [editing, setEditing] = useState(false);
    const [postDetail, setPostDetail] = useState([]);

    const accessToken = localStorage.getItem('accessToken');
    const isLoggedInUserId = localStorage.getItem('isLoggedInUserId');

    const [isWriter, setIsWriter] = useState(false);

    useEffect(() => {
        axios.get(`/api/studies/${studyId}/study-posts/${postId}`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log(res.data);
                setPostItem(res.data);
                setIsWriter(res.data.isAuthor);
            })
            .catch((error) => {
                console.error("팀 커뮤니티 게시글 세부 데이터 가져오기 실패:", error);
            });
    }, [postId, accessToken, isLoggedInUserId]);

    const toggleScrap = useCallback(() => {
        if (!postItem) {
            console.warn("postItem이 아직 초기화되지 않았습니다.");
            return;
        }
        console.log(postItem);
        toggleScrapStatus(
            postItem,
            accessToken,
            isLoggedInUserId,
            (existsScrap) => {
                setPostItem((prevPost) => ({
                    ...prevPost,
                    existsScrap,
                }));
            },
            (error) => {
                console.error("스크랩 상태 변경 실패:", error.response.data);
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
        setEditing(false);

        console.log("수정 예정 : " + updatedPost.id + ", " + updatedPost.title + ", " + updatedPost.content);

        const postData = new FormData();

        if (updatedPost.fileChanged === true) {
            postData.append('file', updatedPost.file);
            postData.append('fileUpdateStatus', true);
        } else {
            postData.append('fileUpdateStatus', false);
        }

        postData.append("requestDto", JSON.stringify({
            title: updatedPost.title,
            content: updatedPost.content,
        }))

        axios.put(`/api/studies/${studyId}/study-posts/${postId}`, postData, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => {
                console.log("팀블로그 커뮤니티 게시글 수정 성공");

                setPostDetail(response.data);
                const updatedPosts = posts.map(post =>
                    post.studyPostId === updatedPost.studyPostId ? updatedPost : post
                );
                setPosts(updatedPosts);
                setPostItem(response.data);

                alert("게시글이 수정되었습니다.");
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
            axios.delete(`/api/studies/${studyId}/study-posts/${postId}`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    console.log("팀 커뮤니티 게시글 삭제 성공 ");
                    alert("게시글이 삭제되었습니다.");

                    const updatedPosts = posts.filter(post => post.studyPostId !== postDetail[0].studyPostId);
                    setPosts(updatedPosts);
                    navigate(`/${studyId}/teamblog/TeamCommunity`, {
                        state: {
                            studyId: studyId,
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
        console.log("id : " + studyId);
        navigate(`/${studyId}/teamblog/TeamCommunity`, {
            state: {
                studyId: studyId,
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

    const handleDownloadClick = (studyPostFileId, fileName, fileUrl) => {
        axios.get(`/api/studies/${studyId}/study-posts/download/${studyPostFileId}`, {
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
                a.download = fileName;  // 파일 이름을 지정
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                console.log(res.data);
            })
            .catch(error => {
                console.error('파일 다운로드 중 오류 발생 :', error);
            });
    };

    return (
        <div>
            <Header showSideCenter={true}/>
            <div className="container">
                <TeamBlogGnb studyIdAsNumber={studyId} Member={member} selectStudy={studyItem} progressStatus={progressType}/>
                <div className="main_schedule_container">
                    <p id={"entry-path"}> 스터디 팀 블로그 > 팀 블로그 > 팀 커뮤니티</p>
                    <Backarrow subname={"팀 커뮤니티 리스트"}/>
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
                                            <span className="writer_profile">
                                                <ImageComponent imageUrl = {postItem.profileImg} imageSrc={""} />
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
                                            {/*{isLoggedInUserId !== postItem.member.id && (*/}
                                                <>
                                                    <span>&nbsp;&nbsp; | &nbsp;&nbsp;</span>
                                                    <span className="report_btn" onClick={() => handleOpenReportModal(postItem.studyPostId)}>신고</span>
                                                </>
                                            {/*)}*/}
                                            <Report
                                                show={showReportModal}
                                                handleClose={handleCloseReportModal}
                                                onReportSubmit={handleReportSubmit}
                                                targetId={reportPostId}
                                                targetType={"studypost"}
                                            />
                                        </div>
                                        <div className="right">
                                            <span className="like_btn">
                                                <ScrapButton scrap={postItem.existsScrap} onClick={() => toggleScrap()} /></span>
                                            <span>조회 <span>{postItem.hit}</span></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {postItem && (
                                <div>
                                    <div className="post_content" dangerouslySetInnerHTML={{ __html: postItem.content.replace(/\n/g, '<br>') }} />
                                    {postItem.fileUrl && postItem.fileUrl.map((file, index) => (
                                        <div className="download_box" key={index}>
                                            <p>{file.fileName}</p>
                                            <FontAwesomeIcon icon={faArrowDown} onClick={() => handleDownloadClick(file.studyPostFileId, file.fileName, file.fileUrl)} className="download_btn" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="btn">
                                <Link
                                    to={`/${studyId}/teamblog/TeamCommunity`}
                                    // onClick={showTeamCommunity}
                                    state={{studyId: studyId}}
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