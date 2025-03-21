import React, {useState, useRef, useCallback, useEffect} from "react";
import Category from "../../components/repeat_etc/Category.js";
import Backarrow from "../../components/repeat_etc/Backarrow.js";
import Header from "../../components/repeat_etc/Header";

import PostInsert from "../../components/teamcommunity/TeamPostInsert";
import PostListItem from "../../components/teamcommunity/TeamPostListItem";
import SearchBar from "../../components/teamcommunity/TeamCommSearchBar";

import {useLocation} from "react-router-dom";
import axios from "axios";
import TeamBlogGnb from "../../components/repeat_etc/TeamBlogGnb";
import {useTeamBlogContext} from "../../components/datacontext/TeamBlogContext";
import Loading from "../../components/repeat_etc/Loading";

const TeamCommunity = () => {
    const [posts, setPosts] = useState([]);
    const [showPostInsert, setShowPostInsert] = useState(false);
    const accessToken = localStorage.getItem('accessToken');
    const isLoggedInUserId = localStorage.getItem('isLoggedInUserId');

    const location = useLocation();
    const {studyId, Member, selecteStudy, progressStatus} = location.state || {};
    const [loading, setLoading] = useState(false);

    console.log(progressStatus);
    console.log(studyId);

    const handleMoveToPostInsert = (e) => {
        if(progressStatus ==="DISCONTINUE"){
            alert("중단된 스터디는 커뮤니티 글 쓰기가 불가능합니다.");
        }
        else{
            setShowPostInsert(!showPostInsert);
        }

    };

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/studies/${studyId}/study-posts`, {
            params: { studyId: studyId },
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        })
            .then((res) => {
                console.log(res.data.items);
                setPosts(res.data.items);
            })
            .catch((error) => {
                console.error("데이터 가져오기 실패:", error);
            })
            .finally(() => {
                setLoading(false); // 로딩 종료
            });
    }, []);

    return (
        <div>
            <Header showSideCenter={true}/>
            <div className="container">
                <TeamBlogGnb studyIdAsNumber={studyId} Member={Member} selectStudy={selecteStudy} progressStatus={progressStatus}/>
                <div className="main_schedule_container"> {/* className 수정 필요 */}
                    <p id={"entry-path"}> 스터디 팀 블로그 > 팀 블로그 > 팀 커뮤니티</p>
                    <Backarrow subname={"팀 커뮤니티 리스트"}/>
                    {showPostInsert && (
                        <PostInsert studyId={studyId}/>
                    )}
                    {!showPostInsert && (
                        <div>
                            <div className="community_header">
                                <SearchBar studyId={studyId} />
                                <button onClick={handleMoveToPostInsert} className="new_post_btn">
                                    새 글 작성
                                </button>
                            </div>
                            {loading ? <Loading/> : (
                                <div className="community" style={{marginRight:"130px"}}>
                                    <div className={"community-content"}>
                                        <table className="post_table">
                                            <thead>
                                            <tr>
                                                <th style={{width:"40%"}}>제목</th>
                                                <th>닉네임</th>
                                                <th>날짜</th>
                                                <th>조회수</th>
                                                <th>스크랩수</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {posts.map((post) => (
                                                <PostListItem studyId={studyId}
                                                              setPosts={setPosts}
                                                              posts={post}/>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default TeamCommunity;
