import React, { useState, useEffect } from 'react';
import axios from "axios";
import default_profile_img from "../../images/default_profile_img.png";
const ImageComponent = (getImgName, imgsrc) => {

    let accessToken = localStorage.getItem('accessToken');
    const [imageSrc, setImageSrc] = useState(null);
    const imgName = getImgName;

    useEffect(() => {
        const imageUrl = imageSrc || `/api/user/mypage/profile/image/${imgName.getImgName}`;
        axios
            .get(imageUrl, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                responseType: 'arraybuffer',    // 매우 중요! 바이너리 데이터를 안전하게 처리
            })
            .then(response => {
                // 이미지 -> Blob 변환
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const objectURL = URL.createObjectURL(blob);
                setImageSrc(objectURL);
            })
            .catch(error => {
                console.error('이미지 불러오기 실패: ', error);
            });
    }, [imgName, imgsrc, accessToken]);

    return (
        <div className={"profile_content"}>
            {imageSrc ? (
                <img className="profile-img" src={imageSrc} alt="프로필 불러오기 실패"/>
            ) : (
                <img className="profile-img" src={default_profile_img} alt="기본 프로필" />
            )}
        </div>
    );
};

export default ImageComponent;