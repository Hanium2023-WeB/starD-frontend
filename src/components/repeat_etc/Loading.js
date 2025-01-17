import React, {useState} from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import "../../css/Loading.css";

const Loading = ({loading}) => {
    return(
        <div className="spinner_wrapper">
            <ClipLoader
                color="#99A98F"
                loading={loading}
                size={50}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
            <div className="spinner_text">
                <h> 로딩중입니다. </h>
            </div>
        </div>
    )
}
export default Loading;