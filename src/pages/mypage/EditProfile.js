import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Category from "../../components/repeat_etc/Category";
import Backarrow from "../../components/repeat_etc/Backarrow"
import Header from "../../components/repeat_etc/Header";
import ImageComponent from "../../components/image/imageComponent";
import axios from "axios";
import toast from "react-hot-toast";

const EditProfile = () => {
    let accessToken = localStorage.getItem('accessToken');
    const [uploadImgUrl, setUploadImgUrl] = useState("");
    const [selfintro, setSelfIntro] = useState("");
    const [profile, setProfile] = useState(null);
    const [imgfile, setImgFile] = useState(null);
    const navigate = useNavigate();
    const [imageSrc, setImageSrc] = useState(null);

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
                setUploadImgUrl(res.data.imageUrl);
                setSelfIntro(res.data.introduce);
            })
            .catch((error) => {
                console.error("프로필 가져오기 실패:", error);
            });
    }, []);

    //프로필 사진 업로드
    const onchangeImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImgFile(file);
            const imageUrl = URL.createObjectURL(file);
            setUploadImgUrl(imageUrl);
            setImageSrc(imageUrl);
        } else {
            console.error("No file selected");
            alert("이미지를 선택해주세요");
            return;
        }
    }

    useEffect(() => {
        console.log("Updated uploadImgUrl:", uploadImgUrl);
    }, [uploadImgUrl]);

    //프로필 사진 삭제
    const onchangeImageDelete = (e) => {
        axios
            .delete("/api/members/profiles/images", {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            })
            .then((res) => {
                console.log("프로필 이미지 삭제 성공:", res.data);
                alert("프로필 이미지 삭제 완료");
                setUploadImgUrl("");
            })
            .catch((error) => {
                console.error("프로필 이미지 삭제 실패:", error);
            });
    }
    const onchangeSelfIntro = (e) => {
        setSelfIntro(e.target.value);
    }

    //프로필 수정
    const saveProfileImage = (e) => {
        const formData = new FormData();

        if (imgfile) {
            formData.append("image", imgfile);
        }

        formData.append("introduce", JSON.stringify({ introduce: selfintro }));

        axios
            .put("/api/members/profiles", formData, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => {
                console.log("프로필 수정 성공:", res.data);
                setProfile(res.data);
                alert("프로필 수정 완료");
            })
            .catch((error) => {
                console.error("프로필 수정 실패:", error.response.data || error);
                toast.error("프로필 이미지 수정에 실패했습니다.");
            });
    }

    return (
        <div>
            <Header showSideCenter={true}/>
            <div className="container">
                <Category/>
                <div className="main_container">
                    <p id={"entry-path"}>마이페이지 > 프로필</p>
                    <Backarrow subname={"프로필 수정"}/>
                    <div className="sub_container">
                        <div className={"profile_content"}>
                            <ImageComponent imageUrl={uploadImgUrl}/>
                            <input className="image-upload" type="file" accept="image/*"
                                   onChange={onchangeImageUpload}/>
                            <button className="image-delete" onClick={onchangeImageDelete}>삭제</button>
                        </div>
                        <div className={"One-line-self-introduction"}>
                            <p id={"self-intro-p"}>한 줄 자기소개</p>
                            <input className="self-intro-input" value={selfintro}
                                   placeholder={"15자이내 자기소개를 적어주세요"}
                                   onChange={onchangeSelfIntro}/>
                        </div>
                    </div>
                    <div className={"save_profile_content"}>
                        <button className={"save-profile"} onClick={saveProfileImage}>저장하기</button>
                    </div>
                </div>
            </div>
        </div>
    )
};
export default EditProfile;
