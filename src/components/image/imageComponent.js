import React from 'react';
import default_profile_img from "../../images/default_profile_img.png";

// ImageComponent: 특정 이미지 파일명을 받아와 프로필 사진을 렌더링하는 재사용 가능한 컴포넌트
const ImageComponent = ({imgName, imageUrl, imageCss}) => {

    const apiKey = process.env.REACT_APP_API_KEY || '';
    const fullImageUrl = imageUrl ? `${apiKey}${imageUrl}` : default_profile_img;

    return (
        <div className="profile_content">
            <img
                className={imageCss || "profile-img"}
                src={fullImageUrl}
                alt="프로필 이미지"
            />
        </div>
    );
};

export default ImageComponent;
