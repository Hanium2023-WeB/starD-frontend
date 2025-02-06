//뒤로가기 컴포넌트
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa6";
import React from "react";

const Backarrow=({subname})=>{
    const navigate = useNavigate();
    const handleSVGClick =()=>{
        navigate(-1);
    }
    return(
        <div className="backarrow" style={{cursor:"pointer"}}>
            <FaArrowLeft onClick={handleSVGClick} size="40" color="#8c8c8c"/>
            <p>{subname}</p>
        </div>
    )
};
export default React.memo(Backarrow);
