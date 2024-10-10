import React, {useEffect, useState} from "react";
import edit from "../../css/mypage_css/edit.css";
import axios from "axios";
const EditInterest=({mem})=>{
    const tagoptions = [
        { value: "웹 개발", name: "웹 개발" },
        { value: "앱 개발", name: "앱 개발" },
        { value: "머신러닝", name: "머신러닝" },
        { value: "데이터 분석", name: "데이터 분석" },
        { value: "게임 개발", name: "게임 개발" },
        { value: "블록체인", name: "블록체인" },
        { value: "네트워크 보안", name: "네트워크 보안" },
        { value: "클라우드 컴퓨팅", name: "클라우드 컴퓨팅" },
        { value: "인공지능", name: "인공지능" },
        { value: "사이버 보안", name: "사이버 보안" },
        { value: "소프트웨어 테스트", name: "소프트웨어 테스트" },
        { value: "로봇공학", name: "로봇공학" },
        { value: "사물인터넷 (IoT)", name: "사물인터넷 (IoT)" },
        { value: "데이터베이스 관리", name: "데이터베이스 관리" },
        { value: "UI/UX 디자인", name: "UI/UX 디자인" },
        { value: "프로젝트 관리", name: "프로젝트 관리" },
        { value: "빅데이터", name: "빅데이터" },
        { value: "컴퓨터 그래픽스", name: "컴퓨터 그래픽스" },
        { value: "자동화", name: "자동화" },
        { value: "블로그 운영", name: "블로그 운영" },
    ];

    const [tags, setTags] = useState(()=>{
            const storedTags=localStorage.getItem('tags');
            return storedTags ? storedTags.split(",") : [];
        });

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
                        ? "lightpink"
                        : tags.length === 3
                            ? "#dbdbdb"
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

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');

        axios.get("/api/user/mypage/update/interests", {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => {
                const serverInterests = response.data;
                if (serverInterests) {
                    console.log("관심분야 : " + serverInterests.map(interest => interest.field));
                    const fieldValues = serverInterests.map(interest => interest.field);
                    setTags(fieldValues);
                }
            })
            .catch(error => {
                if (axios.isAxiosError(error)) {
                    console.error("AxiosError:", error.message);
                } else {
                    console.error("데이터 가져오기 중 오류 발생:", error);
                }
            })
    }, []);

const handleSaveTag = async () => {
    const interests = tags.join(",");

    const accessToken = localStorage.getItem('accessToken');

    axios.post("/api/user/mypage/update/interest", null, {
        params: { interestList: interests },
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
  <div>
      <div id="title">
        관심분야<span id="sub_title">(최대 3개까지 선택 가능)</span>
      </div>
      <Tagoption editoptions={tagoptions} value="" />

      <button id="save" onClick={handleSaveTag}>저장하기</button>
  </div>
);

}
export default EditInterest;