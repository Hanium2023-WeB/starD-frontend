import React, { useState, useEffect } from 'react';
import axios from "axios";
import default_profile_img from "../../images/default_profile_img.png";

// ImageComponent: 특정 이미지 파일명을 받아와 프로필 사진을 렌더링하는 재사용 가능한 컴포넌트
const ImageComponent = ({ imgName, imageUrl }) => {

    return (
        <div className="profile_content">
            <img
                className="profile-img"
                src={imageUrl || default_profile_img}
                alt="프로필 이미지"
            />
        </div>
    );
};

export default ImageComponent;
