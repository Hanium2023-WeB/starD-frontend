import {Link, useNavigate} from "react-router-dom";
import React from "react";
import "../../css/notice_css/Notice.css";
import axios from "axios";

let accessToken = localStorage.getItem('accessToken');
const FaqManagingListItem = ({posts, setPosts}) => {
    const formatDatetime = (datetime) => {
        const date = new Date(datetime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const formattedDatetime = `${year}-${month}-${day} ${hours}:${minutes}`;
        return formattedDatetime;
    };

    const handlePostDelete = (id) => {
        const confirmDelete = window.confirm("정말로 게시글을 삭제하시겠습니까?");
        if (confirmDelete) {

            axios.delete(`http://localhost:8080/faq/${id}`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    console.log("Faq 삭제 성공 ");
                    alert("게시글이 삭제되었습니다.");
                    window.location.href = `/admin/FaqManagement/page=${1}`;
                })
                .catch(error => {
                    console.error("Error:", error);
                    console.log("Faq 삭제 실패");

                    alert("삭제에 실패했습니다.");
                });
        }
    }

    return (
        <tr className={`post_list ${posts.type === "FAQ" ? "faq_row" : ""}`}>
            <td className="community_category">{posts.type}</td>
            , <Link to={`/faqdetail/${posts.id}`}
                    style={{
                        textDecoration: "none",
                        color: "inherit",
                    }}>
            <td className="community_title">{posts.title}</td>
        </Link>
            <td className="community_nickname">관리자</td>
            <td className="community_datetime">{formatDatetime(posts.createdAt)}</td>
            <td>{posts.viewCount}</td>
            <td>{posts.starCount}</td>
            <td>
                <button className="withdraw_btn" onClick={() => handlePostDelete(posts.id)}> 삭제</button>
            </td>
        </tr>
    )
}
export default FaqManagingListItem;