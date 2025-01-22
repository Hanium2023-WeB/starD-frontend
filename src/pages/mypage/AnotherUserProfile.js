import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import Category from "../../components/repeat_etc/Category";
import Backarrow from "../../components/repeat_etc/Backarrow"
import Header from "../../components/repeat_etc/Header";
import ImageComponent from "../../components/image/imageComponent";
import Slide from "../../components/study/Slide";


const AnotherUserProfile = () => {
    let accessToken = localStorage.getItem('accessToken');
    let isLoggedInUserId = localStorage.getItem('isLoggedInUserId');
    const {id} = useParams();
    const [uploadImgUrl, setUploadImgUrl] = useState(null);

    const [profile, setProfile] = useState(null);

    const [writePosts, setWritePosts] = useState([]);
    console.log("writePosts:", writePosts);

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

    //프로필 조회하기
    useEffect(() => {
        axios
            .get(`/api/user/mypage/profile/${id}`, {
                withCredentials: true,
            })
            .then((res) => {
                console.error("프로필 가져오기 성공:", res.data);
                setProfile(res.data);
                setUploadImgUrl(res.data.imgUrl);
            })
            .catch((error) => {
                console.error("프로필 가져오기 실패:", error);
            });
    }, []);


    //다른 사용자 커뮤니티 게시글 조회
    useEffect(() => {
        axios
            .get(`/api/user/mypage/profile/${id}/community`, {
                withCredentials: true,
            })
            .then((res) => {
                console.error("커뮤니티 게시글 가져오기 성공:", res.data);
                setWritePosts(res.data);
            })
            .catch((error) => {
                console.error("커뮤니티 게시글 가져오기 실패:", error);
            });
    }, []);

    const writepost = () => {
        if (!writePosts || writePosts.length === 0 || writePosts.content.length === 0) {
            // writePosts가 비어 있거나 null이거나 content 배열이 비어 있는 경우
            return <p className="no_scrap">작성한 게시글이 없습니다.</p>;
        } else {
            // writePosts 배열에 데이터가 있는 경우
            return (
                <table className="post_table">
                    <thead>
                    <tr>
                        <th>카테고리</th>
                        <th>제목</th>
                        <th>날짜</th>
                        <th>조회수</th>
                    </tr>
                    </thead>
                    <tbody>
                    {writePosts.content.map((post) => (
                        <tr className="post_list" key={post.id}>
                            <td className="community_category">{post.category}</td>
                            <td className="community_title">
                                <Link
                                    to={`/postdetail/${post.id}`}
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}
                                >
                                    {post.title}
                                </Link>
                            </td>
                            <td className="community_datetime">{formatDatetime(post.createdAt)}</td>
                            <td>{post.viewCount}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            );
        }
    };


    return (
        <div>
            <Header showSideCenter={true}/>
            <div className="container">
                <Category/>
                <div className="main_container">
                    <p id={"entry-path"}> 홈 > 다른 사용자 프로필 </p>
                    <Backarrow subname={"프로필"}/>
                    <div className="sub_container other_profile">
                        <ImageComponent imageUrl={uploadImgUrl} imageSrc={""}/>
                        <div className="profile_right_content">
                            <p><span className="color">닉네임:</span> {profile?.nickname}</p>
                            <p><span className="color">자기소개:</span> {profile?.introduce === null ? (
                                <span>자기소개란이 비었어요!</span>
                            ) : (
                                <span>{profile?.introduce}</span>
                            )}</p>
                            <p style={{marginBottom: "0"}}>{profile?.nickname}님의 개인신뢰도는 <span
                                className="color">{profile?.credibility}</span>입니다.</p>
                        </div>
                    </div>
                    <div className="another_open_study">
                        <p><span className="color">{profile?.nickname}</span>님이 개설한 스터디</p>
                        <Slide userId={id} type="openStudy"/>
                    </div>
                    <div className="another_write_post">
                        <p><span className="color">{profile?.nickname}</span>님이 작성한 게시글</p>
                        {writepost()}
                    </div>
                </div>
            </div>
        </div>
    )
};
export default AnotherUserProfile;