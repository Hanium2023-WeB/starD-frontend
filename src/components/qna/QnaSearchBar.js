import {Link, Route, Router, useParams, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import searchicon from "../../images/search.png";
import axios from "axios";


const QnaSearchBar = ({setIsSearchMode}) => {

	const [search, setSearch] = useState("");
	const [categoryOption, setCategoryOption] = useState("전체");
	const navigate = useNavigate();

	const tagoptions = [
		{ value: "전체", name: "전체" },
		{ value: "FAQ", name: "FAQ" },
		{ value: "QNA", name: "QNA" },
	];
	const handleKeyDown = (e) => {
		if (e.keyCode === 13) {
			setSearch(e.target.value);
			searchItem(e.target.value);
		}
	};

	const onHandleCategory = (e) => {
		const selectedCategory = e.target.value;
		setCategoryOption(selectedCategory);
	}

	const onChange=(e)=>{
		console.log("Search", e.target.value);
		setSearch(e.target.value)
	}

	const searchItem = (item)=>{
		setSearch(item);
		setIsSearchMode(true); // 강제 설정
		const queryParams = `?q=${encodeURIComponent(item)}&category=${encodeURIComponent(categoryOption)}`;
		navigate(`/qna/search${queryParams}`, { replace: true }); // replace를 추가해 페이지 히스토리 문제 방지
	}

	return (
		<div className="Home_wrap">
			<div className="select_search">
			    <select id="sub" value={categoryOption} onChange={onHandleCategory}>
                    {tagoptions.map((category, idx) =>
                        <option value={category.value}>{category.name}</option>
                    )}
			    </select>
			</div>

			<div className="searchbar">
				<div className="searchinput">
					<input className="input_padding"
						type="text"
						value={search}
						onChange={onChange}
						onKeyDown={handleKeyDown}
						placeholder={"검색어를 입력하세요."}
					/>
					<img src ={searchicon} width="20px"/>
				</div>
			</div>
		</div>
	);
};

export default QnaSearchBar;
