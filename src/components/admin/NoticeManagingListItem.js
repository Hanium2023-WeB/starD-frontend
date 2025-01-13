import {Link, useNavigate} from "react-router-dom";
import "../../css/notice_css/Notice.css";
import React from "react";
import axios from "axios";
let accessToken = localStorage.getItem('accessToken');

const NoticeManagingListItem = ({posts, setPosts}) => {
    const navigate = useNavigate();
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

            axios.delete(`/api/notices/${id}`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    console.log("공지글 삭제 성공 ");
                    alert("게시글이 삭제되었습니다.");
                    window.location.href = `/admin/notice-management/page=${1}`;
                })
                .catch(error => {
                    console.error("Error:", error);
                    console.log("공지글 삭제 실패");

                    alert("삭제에 실패했습니다.");
                });
        }
    }

    return (
        <tr className="post_list">
            <td>
                <Link to={`/notice/detail/${posts.postId}`}
                      style={{
                          textDecoration: "none",
                          color: "inherit",
                      }}>
                    <span className="community_title">{posts.title}</span>
                </Link>
            </td>
            <td className="community_nickname">관리자</td>
            <td className="community_datetime">{formatDatetime(posts.createdAt)}</td>
            <td>{posts.hit}</td>
            <td>
                <button className="withdraw_btn" onClick={() => handlePostDelete(posts.postId)}> 삭제 </button>
            </td>
        </tr>
    )
}
export default NoticeManagingListItem;