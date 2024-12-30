import {Link, Route, Router, useParams, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import searchicon from "../../images/search.png";
import axios from "axios";

const NoticeSearchBar = () => {

	const [search, setSearch] = useState("");
	const navigate = useNavigate();

	const handleKeyDown = (e) => {
		if (e.keyCode === 13) {
			setSearch(e.target.value);
			searchItem(e.target.value);
		}
	};
	const onChange=(e)=>{
		console.log("Search", e.target.value);
		setSearch(e.target.value)
	}

	const searchItem = (item)=>{
		setSearch(item);
		const queryParams = `?q=${encodeURIComponent(item)}`;
		navigate(`/notice/search${queryParams}`);
	}

	return (
		<div className="Home_wrap">
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

export default NoticeSearchBar;
