import React from "react";
import {Link} from "react-router-dom";
import Logo from "../../images/Logo.png";

const Footer = () => {
    return (
        <div>
            <footer>
                <div className="footer_info">
                    <div className="info_wrap">
                        <div className="info_content">
                            <ul className="info_ul">
                                <div className="item">
                                    <p className="project_name">STAR D</p>
                                    <li className="introduce_project">
                                        <Link to="/">
                                            <span>STAR D 소개</span>
                                        </Link>
                                    </li>
                                </div>
                                <div className="item">
                                    <p className="study_name">스터디</p>
                                    <li className="study_info">
                                        <Link to="/study/page=1">
                                            <span>스터디 시작하기</span>
                                        </Link>
                                    </li>
                                </div>
                                <div className="item">
                                    <p className="community">커뮤니티</p>
                                    <li className="community_info">
                                        <Link to="/community/page=1">
                                            <span>커뮤니티</span>
                                        </Link>
                                    </li>
                                </div>
                                <div className="item">
                                    <p className="customers_service">고객센터</p>
                                    <li className="service">
                                        <Link to="/notice/page=1">
                                            <span>공지사항</span>
                                        </Link>
                                        <Link to="/qna/page=1">
                                            <span>자주묻는 질문</span>
                                        </Link>
                                    </li>
                                </div>
                            </ul>
                        </div>
                        <hr style={{border: "0.5px solid #ccc"}}/>
                        <div className="subfooter_info">
                            <div className="info_second_wrap">
                                <div className="info_second_content">
                                    <div className="stard_info">
                                        <span>STAR D</span><img src={Logo} height={"50px"}/>
                                    </div>

                                    <ul>
                                        {/*<div className="item1">*/}
                                        {/*    <li><img src={Logo} height={"20px"}/></li>*/}
                                        {/*</div>*/}
                                        {/*<div className="item_first">*/}
                                        {/*    <li>STAR D</li>*/}
                                        {/*</div>*/}
                                        {/*|*/}
                                        <div className="item_first">
                                            <li>개인정보처리방침</li>
                                        </div>
                                        |
                                        <div className="item1">
                                            <li>이용약관</li>
                                        </div>
                                    </ul>
                                    <div className="info_etc">
                                        (주)동덕 We B | 대표자: Gwang Lee | 사업자 번호 : 000-0000-0000
                                        <br/> 개인정보보호책임자: WeB(위비) | 이메일: stard@gmail.com | 주소: 서울특별시 성북구 화랑로13길 60
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;