//뒤로가기 컴포넌트
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Arrow } from "../../images/Arrow.svg";
import React from "react";

const Backarrow=({subname})=>{
    const navigate = useNavigate();
    const handleSVGClick =()=>{
        navigate(-1);
    }
    return(
        <div className="backarrow" style={{cursor:"pointer"}}>
            <svg
                onClick={handleSVGClick}
                xmlns="../images/Arrow.svg"
                width="100"
                height="40"
            ><Arrow/>
            </svg>
            <p>{subname}</p>
        </div>
    )
};
export default React.memo(Backarrow);
