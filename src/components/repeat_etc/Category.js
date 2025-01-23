import { Link } from "react-router-dom";
import App from "../../App.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../../css/mypage_css/Mypage.css";
const category = () => {
	return (
		<div className="category">
			<div className="c_01">
				<div id={"c_title"}>
				<Link
					to={"/mypage"}
					style={{
						textDecoration: "none",
						color: "inherit",
					}}
				>
				HOME
				</Link>
				</div>
				<div className="sub_c">
					<nav>
						<ul>
							<Link
								to={"/mypage/profile"}
								style={{
									textDecoration: "none",
									color: "inherit",
								}}
							>
								<li>프로필</li>
							</Link>
							<Link
								to={"/mypage/editinfo"}
								style={{
									textDecoration: "none",
									color: "inherit",
								}}
							>
								<li>개인정보 수정</li>
							</Link>
						</ul>
					</nav>
				</div>
			</div>
			<div className="c_02">
				<div id={"c_title"}>
				<Link
					to={"/study"}
					style={{
						textDecoration: "none",
						color: "inherit",
					}}
				>
				STUDY
				</Link>
				</div>
				<div className="sub_c">
					<nav>
						<ul>
							<Link
								to={"/mypage/participate-study"}
								style={{
									textDecoration: "none",
									color: "inherit",
								}}
							>
								<li>스터디 참여 내역</li>
							</Link>
							<Link
								to={"/mypage/open-study"}
								style={{
									textDecoration: "none",
									color: "inherit",
								}}
							>
								<li>스터디 개설 내역</li>
							</Link>
							<Link
								to={"/mypage/apply-study"}
								style={{
									textDecoration: "none",
									color: "inherit",
								}}
							>
								<li>스터디 신청 내역</li>
							</Link>
						</ul>
					</nav>
				</div>
			</div>
			<div className="c_03">
				<div id={"c_title"}>
				<Link
					to={"/mypage"}
					style={{
						textDecoration: "none",
						color: "inherit",
					}}
				>
				MY
				</Link>
				</div>
				<div className="sub_c">
					<nav>
						<ul>
							<Link
								to={"/mypage/write-post/page=1"}
								style={{
									textDecoration: "none",
									color: "inherit",
								}}
							>
								<li>내가 작성한 게시글</li>
							</Link>
							<Link
								to={"/mypage/write-comment/page=1"}
								style={{
									textDecoration: "none",
									color: "inherit",
								}}
							>
								<li>내가 작성한 댓글</li>
							</Link>
						</ul>
					</nav>
				</div>
			</div>
			<div className="c_04">
				<div id={"c_title"}>
				SCRAP
				</div>
				<div className="sub_c">
					<nav>

						<ul>
							<Link
								to={"/mypage/scrap-study"}
								style={{
									textDecoration: "none",
									color: "inherit",
								}}
							>
								<li>스크랩한 스터디</li>
							</Link>
							<Link
								to={"/mypage/scrap-community"}
								style={{
									textDecoration: "none",
									color: "inherit",
								}}
							>
							<li>좋아요한 게시글</li>
							</Link>
						</ul>
					</nav>
				</div>
			</div>
		</div>

	);
};

export default category;
