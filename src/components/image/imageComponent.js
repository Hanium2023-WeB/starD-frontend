import React, { useState, useEffect } from 'react';
import axios from "axios";
import default_profile_img from "../../images/default_profile_img.png";

// ImageComponent: 특정 이미지 파일명을 받아와 프로필 사진을 렌더링하는 재사용 가능한 컴포넌트
const ImageComponent = ({ imgName }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        if (!imgName) return; // imgName이 없으면 기본 이미지 사용

        const fetchImage = async () => {
            try {
                const response = await axios.get(`/api/user/mypage/profile/image/${imgName}`, {
                    withCredentials: true,
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                    responseType: 'arraybuffer',
                });
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                setImageSrc(URL.createObjectURL(blob));
            } catch (error) {
                console.error('이미지 불러오기 실패: ', error);
            }
        };

        fetchImage();
    }, [imgName, accessToken]);

    return (
        <div className="profile_content">
            <img
                className="profile-img"
                src={imageSrc || default_profile_img}
                alt="프로필 이미지"
            />
        </div>
    );
};

export default ImageComponent;
