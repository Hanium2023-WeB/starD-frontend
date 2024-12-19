import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import LOGO from "../../images/Logo.png"
import MemoizedLink from "../../MemoizedLink";

const Header = ({showSideCenter}) => {
    let [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    let accessToken = localStorage.getItem('accessToken');
    let isLoggedInUserId = localStorage.getItem('isLoggedInUserId');
    const [page, setPage] = useState(1);
    const [isAdmin, setIsAdmin] = useState(false);

    const Side = () => {
        useEffect(() => {

            const logout = (member) => {
                axios.post("/api/members/auth/sign-out", {}, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                    .then(() => {
                        // console.log("로그아웃 성공");
                        // localStorage.removeItem('accessToken');
                        // localStorage.removeItem('isLoggedInUserId');
                        // setIsLoggedIn(false);
                        // alert("30분이 지나 자동 로그아웃");
                        // navigate("/");
                    })
                    .catch(error => {
                        alert("30분이 지나 자동 로그아웃");
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('isLoggedInUserId');
                        setIsLoggedIn(false);
                        navigate("/");
                    });
            };


            if (accessToken != null && isLoggedInUserId != null) {
                axios.post("/api/members/auth/reissue", {    // accessToken 만료 여부 확인 function
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                    .then((res) => {
                        console.log("accessToken 확인 여부 결과 값 : " + res.data);

                        if (res.data.refreshTokenExpirationTime !== 0)
                            setIsLoggedIn(true);
                        else {
                            console.log("토큰 만료")
                            logout(isLoggedInUserId);
                            setIsLoggedIn(false);
                        }
                    })
                    .catch(error => {
                        console.log(error.response.data);
                    });
            } else {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('isLoggedInUserId');
                setIsLoggedIn(false);
            }
        }, []);

        // TODO 권한 조회
        useEffect(() => {
            if (accessToken != null && isLoggedInUserId != null) {
                axios
                    .get("/api/user/auth/authority", {
                        withCredentials: true,
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    })
                    .then((res) => {
                        const auth = res.data;
                        console.log("*auth :", auth);

                        if (auth === "ROLE_USER") {
                            setIsAdmin(false);
                        } else if (auth === "ROLE_ADMIN") {
                            setIsAdmin(true);
                        }
                    })
                    .catch((error) => {
                        console.error("권한 조회 실패:", error);
                        setIsAdmin(false);
                    });
            }
        }, [accessToken]);

        return (
            <div className="headerbar">
                <nav>
                    <ul>
                        {isLoggedIn ? (
                            <React.Fragment>
                                <li>
                                    <MemoizedLink
                                        to={"/mypage"}
                                        children={"마이페이지"}
                                        style={{textDecoration: "none", color: "inherit"}}
                                    >
                                    </MemoizedLink>
                                </li>
                                <li>
                                    <MemoizedLink
                                        to={"/logout"}
                                        style={{textDecoration: "none", color: "inherit"}}>
                                        로그아웃
                                    </MemoizedLink>
                                </li>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <li>
                                    <MemoizedLink
                                        to={"/login"}
                                        children={"로그인"}
                                        style={{textDecoration: "none", color: "inherit"}}
                                    >
                                    </MemoizedLink>
                                </li>
                                <li>
                                    <MemoizedLink
                                        to={"/subinfo/signup"}
                                        children={"회원가입"}
                                        style={{textDecoration: "none", color: "inherit"}}
                                    >
                                    </MemoizedLink>
                                </li>
                            </React.Fragment>
                        )}
                    </ul>
                </nav>
            </div>
        );
    };

    const sideleft = () => {
        return (
            <div className="headerbar" title={"홈으로 가기"}>
                <nav>
                    <ul>
                        <li>
                            <MemoizedLink
                                to={"/"}
                                children={(<div className={"Header_logo"}>
                                    STAR D
                                    <div className={"Header_logo_img"}>
                                        <img src={LOGO} width={"60px"}/></div>
                                </div>)}
                                style={{textDecoration: "none", color: "inherit"}}
                            >
                            </MemoizedLink>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    };
    const sidecenter = () => {
        return (
            <div className="sidebar">
                <nav>
                    <ul>
                        <MemoizedLink to={{
                            pathname: `/study/page=${page}`,
                            state: {
                                page: page,
                            }
                        }}
                                      children={(<li>스터디</li>)}
                                      style={{textDecoration: "none", color: "inherit"}}>
                        </MemoizedLink>
                        <MemoizedLink to={{
                            pathname: `/community/page=${page}`,
                            state: {
                                page: page,
                            }
                        }}
                            children={(<li>커뮤니티</li>)}
                            style={{textDecoration: "none", color: "inherit"}}
                        >
                        </MemoizedLink>
                        <MemoizedLink to={{
                            pathname: `/notice/page=${page}`,
                            state: {
                                page: page,
                            }
                        }}
                            children={(<li>공지사항</li>)}
                            style={{textDecoration: "none", color: "inherit"}}
                        >
                        </MemoizedLink>
                        <MemoizedLink to={{
                            pathname: `/qna/page=${page}`,
                            state: {
                                page: page,
                            }
                        }}
                            children={(<li>QNA</li>)}
                            style={{textDecoration: "none", color: "inherit"}}
                        >

                        </MemoizedLink>
                        <MemoizedLink
                            to={"/admin/MemberManagement"}
                            children={(<li>관리자 페이지</li>)}
                            style={{
                                textDecoration: "none",
                                color: "inherit",
                                display: isAdmin ? "block" : "none"
                            }}
                        >

                        </MemoizedLink>
                    </ul>
                </nav>
            </div>
        );
    };

    return (
        <div>
            <div className={"header_wrap"}>
                <header>
                    <div className="head_left">{sideleft()}</div>
                    {showSideCenter ? <div className="head_text">{sidecenter()}</div> :
                        <div className="head_text">{""}</div>
                    }
                    <div className="head_right">{Side()}</div>
                </header>
            </div>
        </div>
    );
};
export default React.memo(Header);
