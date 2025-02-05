import Header from "../../components/repeat_etc/Header";
import Category from "../../components/repeat_etc/Category";
import Backarrow from "../../components/repeat_etc/Backarrow";
import React from "react";

const MyEvaluation = () => {
    return (
        <div>
            <Header showSideCenter={true}/>
            <div className="container">
                <Category/>
                <div className="main_container">
                    <p id={"entry-path"}> 마이페이지 > 평가된 내역 </p>
                    <Backarrow subname={"내가 작성한 게시글"}/>
                    <div>
                        <div className="community">
                            <div className={"community-content"}>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MyEvaluation;