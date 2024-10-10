import React, {useLocation, useState, useEffect} from "react";
import { useParams } from 'react-router-dom'
import Header from "../../components/repeat_etc/Header";
import Backarrow from "../../components/repeat_etc/Backarrow";
import Paging from "../../components/repeat_etc/Paging";
import axios from "axios";
const OtherProfile=()=>{
    const {memberId} = useParams();
    const [memberProfile, setMemberProfile] = useState(null);
    let accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        axios.get(`/api/user/mypage/profile/${memberId}`, {
            withCredentials: true,
        })
            .then((response) => {
                setMemberProfile(response.data);
                console.log(response);
            })
            .catch((error) => {
                console.error("Error fetching member profile:", error);
            });
    }, []);
    //다른 사용자 프로필 조회
    //다른 사용자 프로필 스터디 모집 게시글 조회
    //다른 사용자의 커뮤니티 게시글 조회

    return (
        <div className={"main_wrap"} id={"study"}>
            <Header showSideCenter={true}/>
    <div className="study_detail_container" style={{width: "70%"}}>
        <div className="arrow_left">
            <p id={"entry-path"}> 홈 > 스터디 리스트 </p>
            <Backarrow subname={`${memberId}님의 프로필`}/>
        </div>
        <div className="study">

        </div>
    </div>
</div>
);
};
export default OtherProfile;