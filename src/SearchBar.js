import {Link, Route, Router, useParams, useNavigate} from "react-router-dom";
import React, {useEffect, useState,useCallback} from "react";
import searchicon from "./images/search.png";
import "./css/study_css/SearchBar.css";
import axios from "axios";


const SearchBar = ({isHome, handleClickRecrutingBtn, isOnlyRecruting, onFilterChange}) => {

	const [search, setSearch] = useState("");
	const [selectOption, setSelectOption] = useState("");
	const navigate = useNavigate();

	const activityType = [
		{ value: "ALL", name: "전체"},
		{ value: "ONLINE_OFFLINE", name: "온/오프라인" },
		{ value: "ONLINE", name: "온라인" },
		{ value: "OFFLINE", name: "오프라인" },
	];

	const handleKeyDown = (e) => {
		if (e.keyCode === 13) {
			console.log("엔터 키를 눌렀습니다.");
			setSearch(e.target.value);
			searchItem(e.target.value);
		}
	};
	const onChange=(e)=>{
		setSearch(e.target.value);
	}

	const onHandleselect=(e)=>{
		onFilterChange(e.target.value);
		console.log(`value = ${e.target.value}`)
	};

	const searchItem = (item)=>{
		console.log("타깃",item)
		setSearch(item);
		const selectedType = activityType.find((type) => type.value === selectOption);
		if (selectedType) {
			const queryParams = `?q=${encodeURIComponent(item)}&select=${encodeURIComponent(selectedType.name)}`;
			console.log(queryParams);
			navigate(`/search${queryParams}`);
		}
	}

	return (
		<div className="Home_wrap study_search">
			<div className="searchselect">
				<select onChange={onHandleselect} value={activityType.find(type => type.name === selectOption)?.value}>
					{activityType.map((type, idx) =>
						<option key={idx} value={type.value}>{type.name}</option>
					)}
				</select>
				{isHome == false && (
					<div className="onlyrecruting" onClick={handleClickRecrutingBtn}
						 style={{
							 backgroundColor: isOnlyRecruting ? "#BBDF9F" : "",
						 }}>
						모집중인 스터디 보기
					</div>
				)}
			</div>
			<div className="searchbar">
				<div className="searchinput">
					<input className="input_padding"
						type="text"
						value={search}
						onChange={onChange}
						onKeyDown={handleKeyDown}
						placeholder={"원하는 스터디를 검색해보세요"}
					/>
					<img src ={searchicon} width="20px"/>
				</div>
			</div>
		</div>
	);
};

export default React.memo(SearchBar);
