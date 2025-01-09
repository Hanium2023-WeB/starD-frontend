import React, {useEffect, useState} from "react";
import axiosInstance from "../../api/axiosInstance";
import {Link, useNavigate} from "react-router-dom";
import LOGO from "../../images/Logo.png";
import MemoizedLink from "../../MemoizedLink";

const Header = ({showSideCenter}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const isLoggedInUserId = localStorage.getItem("isLoggedInUserId");

    console.log("accessToken:", accessToken); // 값 확인
    console.log("isLoggedInUserId:", isLoggedInUserId); // 값 확인

    const currentPath = window.location.pathname; // 현재 경로

    const publicPaths = [
      "/",
      "/subinfo/signup",
      "/subinfo",
      "/login/findPW",
      "/login",
      "/reset-password",
      "/reset-password/sent"
    ];

    const dynamicPublicPaths = [
      /^\/study\/page=\d+$/,
      /^\/study\/detail\/\d+$/,
      /^\/community\/page=\d+$/,
      /^\/community\/post\/\d+$/,
      /^\/community\/search(\?.*)?$/,
      /^\/notice\/page=\d+$/,
      /^\/notice\/detail\/\d+$/,
      /^\/qna\/page=\d+$/,
      /^\/qna\/detail\/\d+$/,
      /^\/qna\/search(\?.*)?$/,
      /^\/faq\/detail\/\d+$/,
      /^\/login$/
    ];

    const isPublicPath = () => {
      const currentPath = window.location.pathname;
      const accessToken = localStorage.getItem("accessToken");
      const isLoggedInUserId = localStorage.getItem("isLoggedInUserId");

      console.log("accessToken:", accessToken);
      console.log("isLoggedInUserId:", isLoggedInUserId);

      // 로그인 상태를 먼저 확인
      if (!accessToken || !isLoggedInUserId) {
        console.log("Not logged in. Checking if path is public...");

        // 공개 경로가 맞는지 확인
        if (publicPaths.includes(currentPath)) {
          console.log(`Path ${currentPath} is in publicPaths.`);
          return true;
        }

        // 동적 경로 매칭 확인
        const matchesDynamicPath = dynamicPublicPaths.some(
            (regex) => regex.test(currentPath));
        if (matchesDynamicPath) {
          console.log(`Path ${currentPath} matches a dynamic public path.`);
          return true;
        } else {
          console.log(
              `Path ${currentPath} does not match any dynamic public path.`);
          return false;  // 로그인하지 않은 경우 비공개 경로로 리디렉션
        }
      } else {
        console.log("User is logged in, allowing access.");
        return true; // 로그인된 경우 모든 경로에 접근 허용
      }
    };

    const checkTokenValidity = async () => {
      try {
        const res = await axiosInstance.post("/members/auth/reissue");
        if (res.data.refreshTokenExpirationTime !== 0) {
          setIsLoggedIn(true);
        } else {
          console.log("토큰 만료");
          handleLogout();
        }
      } catch (error) {
        console.error("토큰 확인 중 오류 발생:", error);
        handleLogout();
      }
    };

    const fetchUserAuthority = async () => {
      try {
        const res = await axiosInstance.get("/members/auth");
        const auth = res.data;
        setIsAdmin(auth === "ADMIN");
      } catch (error) {
        console.error("권한 조회 실패:", error);
        setIsAdmin(false);
      }
    };

    const handleLogout = () => {
      // 현재 경로가 로그인 페이지가 아니면 alert 표시
      if (currentPath !== "/login") {
        alert("로그인이 필요합니다."); // 로그인 필요 알림
      }
      localStorage.removeItem("accessToken");
      localStorage.removeItem("isLoggedInUserId");
      setIsLoggedIn(false);
      navigate("/login");
    };

    if (!accessToken || !isLoggedInUserId) {
      console.log("Not logged in. Checking if path is public...");
      if (!isPublicPath()) {
        console.log("Path is not public, triggering logout");
        handleLogout(); // 비공개 경로 접근 시 로그인 요구
      }
      return;
    } else {
      checkTokenValidity();
      fetchUserAuthority();
    }
  }, [navigate]);

  const renderSideLeft = () => (
      <div className="headerbar" title={"홈으로 가기"}>
        <nav>
          <ul>
            <li>
              <MemoizedLink
                  to={"/"}
                  children={
                    <div className={"Header_logo"}>
                      STAR D
                      <div className={"Header_logo_img"}>
                        <img src={LOGO} width={"60px"}/>
                      </div>
                    </div>
                  }
                  style={{textDecoration: "none", color: "inherit"}}
              />
            </li>
          </ul>
        </nav>
      </div>
  );

  const renderSideCenter = () => (
      <div className="sidebar">
        <nav>
          <ul>
            <MemoizedLink
                to={{pathname: `/study/page=${page}`}}
                children={<li>스터디</li>}
                style={{textDecoration: "none", color: "inherit"}}
            />
            <MemoizedLink
                to={{pathname: `/community/page=${page}`}}
                children={<li>커뮤니티</li>}
                style={{textDecoration: "none", color: "inherit"}}
            />
            <MemoizedLink
                to={{pathname: `/notice/page=${page}`}}
                children={<li>공지사항</li>}
                style={{textDecoration: "none", color: "inherit"}}
            />
            <MemoizedLink
                to={{pathname: `/qna/page=${page}`}}
                children={<li>QNA</li>}
                style={{textDecoration: "none", color: "inherit"}}
            />
            {isAdmin && (
                <MemoizedLink
                    to={`/admin/MemberManagement/page=${page}`}
                    children={<li>관리자 페이지</li>}
                    style={{textDecoration: "none", color: "inherit"}}
                />
            )}
          </ul>
        </nav>
      </div>
  );

  const renderSideRight = () => (
      <div className="headerbar">
        <nav>
          <ul>
            {isLoggedIn ? (
                <>
                  <li>
                    <MemoizedLink
                        to={"/mypage"}
                        children={"마이페이지"}
                        style={{textDecoration: "none", color: "inherit"}}
                    />
                  </li>
                  <li>
                    <MemoizedLink
                        to={"/logout"}
                        children={"로그아웃"}
                        style={{textDecoration: "none", color: "inherit"}}
                    />
                  </li>
                </>
            ) : (
                <>
                  <li>
                    <MemoizedLink
                        to={"/login"}
                        children={"로그인"}
                        style={{textDecoration: "none", color: "inherit"}}
                    />
                  </li>
                  <li>
                    <MemoizedLink
                        to={"/subinfo/signup"}
                        children={"회원가입"}
                        style={{textDecoration: "none", color: "inherit"}}
                    />
                  </li>
                </>
            )}
          </ul>
        </nav>
      </div>
  );

  return (
      <div>
        <div className={"header_wrap"}>
          <header>
            <div className="head_left">{renderSideLeft()}</div>
            {showSideCenter ? (
                <div className="head_text">{renderSideCenter()}</div>
            ) : (
                <div className="head_text">{""}</div>
            )}
            <div className="head_right">{renderSideRight()}</div>
          </header>
        </div>
      </div>
  );
};

export default React.memo(Header);