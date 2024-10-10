import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Category from "../../components/repeat_etc/Category";
import Backarrow from "../../components/repeat_etc/Backarrow"
import Header from "../../components/repeat_etc/Header";
import default_profile_img from "../../images/default_profile_img.png";
import ImageComponent from "../../components/image/imageComponent";
import axios from "axios";

const EditProfile = () => {
    let accessToken = localStorage.getItem('accessToken');
    let isLoggedInUserId = localStorage.getItem('isLoggedInUserId');
    const [uploadImgUrl, setUploadImgUrl] = useState("");
    const [selfintro, setSelfIntro] = useState("");
    const [profile, setProfile] =useState(null);
    const [imgfile, setImgFile] = useState(null);
    const navigate = useNavigate();
    const [imageSrc, setImageSrc] = useState(null);

    //프로필 조회하기
    useEffect(() => {
        axios
            .get("/api/user/mypage/profile", {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then((res) => {
                console.log("프로필 가져오기 성공:", res.data);
                setProfile(res.data);
                console.log("이미지:",res.data.imgUrl );
                var str = res.data.imgUrl.substr(14);
                var str_result = str.substr(1);
                const fullImageUrl = `D:\\stard\\${str_result}`;
                console.log("fullImageUrl:", fullImageUrl);

                // TODO 2023-11-28 uploadImgUrl을 서버에 저장된 이미지 파일명으로 설정
                setUploadImgUrl(res.data.imgUrl);
            })
            .catch((error) => {
                console.error("프로필 가져오기 실패:", error);
            });
    }, []);

    //프로필 사진 업로드
    const onchangeImageUpload = (e) => {
        setUploadImgUrl("");
        setImgFile(null);
        console.log("사진", e.target.files);
        const file = e.target.files[0];
        if (file) {
            setImgFile(file);
            console.log("File details:", file);
             const imageUrl = URL.createObjectURL(file);
            setUploadImgUrl(imageUrl);
            setImageSrc(uploadImgUrl);
            const reader = new FileReader();
            reader.onload = () => {
                if(reader.readyState === 2){
                    setUploadImgUrl(reader.result)
                }
            }
            reader.readAsDataURL(e.target.files[0])

        } else {
            console.error("No file selected");
            alert("이미지를 선택해주세요");
            return;
        }
    }



    //프로필 사진 삭제
    const onchangeImageDelete = (e) => {
        setUploadImgUrl("");
        return;
    }
    const onchangeselfintro=(e)=>{
        setSelfIntro(e.target.value);
    }

    //프로필 수정
    const saveProfile=(e)=>{
        const formData = new FormData();
        formData.append("introduce", selfintro);
        formData.append("imgFile", imgfile);

        axios
            .put("/api/user/mypage/profile", formData, {
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
                navigate("/mypage/profile");
            })
            .catch((error) => {
                console.error("프로필 수정 실패:", error);
            });

    }

    return (
        <div>
            <Header showSideCenter={true}/>
            <div className="container">
                <Category/>
                <div className="main_container">
                    <p id={"entry-path"}> 홈 > 마이페이지 > 프로필 </p>
                    <Backarrow subname={"프로필 수정"}/>
                    <div className="sub_container">
                        <div className={"profile_content"}>
                            <ImageComponent getImgName = {uploadImgUrl} imgsrc={imageSrc} />
                            <input className="image-upload" type="file" accept="image/*"
                                   onChange={onchangeImageUpload}/>
                            <button className="image-delete" onClick={onchangeImageDelete}>삭제</button>
                        </div>
                        <div className={"One-line-self-introduction"}>
                            <p id={"self-intro-p"}>한줄 자기소개</p>
                            <input className="self-intro-input" placeholder={"15자이내 자기소개를 적어주세요"} onChange={onchangeselfintro}/>
                        </div>
                    </div>
                    <div className={"save_profile_content"}>
                        <button className={"save-profile"} onClick={saveProfile}>저장하기</button>
                    </div>
                </div>
            </div>
        </div>
    )
};
export default EditProfile;
