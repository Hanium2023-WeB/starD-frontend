import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Category from "../../components/repeat_etc/Category";
import Backarrow from "../../components/repeat_etc/Backarrow"
import Header from "../../components/repeat_etc/Header";
import ImageComponent from "../../components/image/imageComponent";


const Profile = () => {
    let accessToken = localStorage.getItem('accessToken');
    const [uploadImgUrl, setUploadImgUrl] = useState(null);
    const [profile, setProfile] =useState(null);

    //프로필 조회하기
    useEffect(() => {
        axios
            .get("/api/members/profiles", {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then((res) => {
                setProfile(res.data);
                setUploadImgUrl(res.data.imageUrl);
            })
            .catch((error) => {
                console.error("프로필 가져오기 실패:", error);
            });
    }, []);

    return (
        <div>
            <Header showSideCenter={true}/>
            <div className="container">
                <Category/>
                <div className="main_container">
                    <p id={"entry-path"}> 홈 > 마이페이지 > 프로필 </p>
                    <Backarrow subname={"프로필"}/>
                    <div className="sub_container">
                        <ImageComponent imageUrl={uploadImgUrl} />
                        <div className={"One-line-self-introduction"}>
                            <p id={"self-intro-p"}>한줄 자기소개</p>
                            <div>
                                {profile?.introduce === null ? (
                                    <>
                                        <p>자기소개란이 비었어요! 한줄소개를 해주세요!</p>
                                    </>
                                ) : (
                                    <p>{profile?.introduce}</p>
                                )}
                            </div>

                        </div>
                    </div>
                    <div className={"save_profile_content"}>
                        <Link
                            to={"/mypage/profile/edit"}
                            style={{
                                textDecoration: "none",
                                color: "inherit",
                            }}
                        > <button className={"save-profile"}>수정하기</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
};
export default Profile;