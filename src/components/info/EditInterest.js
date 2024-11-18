import React, {useEffect, useState} from "react";
import edit from "../../css/mypage_css/edit.css";
import axios from "axios";
const EditInterest=({interests})=>{
    const tagoptions = [
        {value: "개발/IT", name: "개발/IT"},
        {value: "취업/자격증", name: "취업/자격증"},
        {value: "디자인", name: "디자인"},
        {value: "언어", name: "언어"},
        {value: "자기계발", name: "자기계발"},
        {value: "취미", name: "취미"},
        {value: "기타", name: "기타"},
    ];

    const [tags, setTags] = useState([]);

    useEffect(() => {
        if (interests && interests.length > 0) {
            setTags(interests);
        }
    }, [interests]);

    const Tagoption = (props) => {
        const handletagChange = (value) => {
            if (tags.includes(value)) {
                setTags(tags.filter((tag) => tag !== value));
            } else {
                if (tags.length < 3) {
                    setTags([...tags, value]);
                }
                else{
                    alert("관심분야는 최대 3개까지 입니다.");
                }
            }
        };

        console.log(tags)

        return (
          <div className="tags">
            {props.editoptions.map((editoption) => (
              <button
                id="tag"
                name="TAG"
                onClick={() => handletagChange(editoption.value)}
                value={editoption.value}
                style={{
                    backgroundColor: tags.includes(editoption.value)
                        ? "#fff89c"
                        : tags.length === 3
                            ? "#efefef"
                            : "white",
                }}
                value={editoption.value}
              >
                {editoption.value}
              </button>
            ))}
          </div>
        );
      };

const handleSaveTag = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const memberId = localStorage.getItem('newMemberId');
    axios.post("/api/members/edit/interests", {
        interests: tags,
        memberId:memberId,
    }, {
        withCredentials: true,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
        .then(response => {
            if (response.status === 200) {
                console.log("관심분야 변경 성공");
                alert("관심분야가 변경되었습니다.");
            } else {
                console.error("관심분야 변경 실패");
                alert("관심분야 변경에 실패하였습니다.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("관심분야 변경에 실패하였습니다.");
        });
};


return(
  <>
      <div id="title">
        관심분야<span id="sub_title">(최대 3개까지 선택 가능)</span>
      </div>
      <Tagoption editoptions={tagoptions} value="" />

      <button id="save" onClick={handleSaveTag}>저장하기</button>
  </>
);

}
export default EditInterest;