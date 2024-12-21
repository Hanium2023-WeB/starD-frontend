import {Link} from "react-router-dom";
import "../../css/notice_css/Notice.css";

const NoticeListItem = ({posts, setPosts}) => {
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

    return (
        <tr className="post_list">
            <Link to={`/noticedetail/${posts.postId}`}
                  style={{
                      textDecoration: "none",
                      color: "inherit",
                  }}>
                <td className="community_title">{posts.title}</td>
            </Link>
            <td className="community_nickname">관리자</td>
            <td className="community_datetime">{formatDatetime(posts.createdAt)}</td>
            <td>{posts.hit}</td>
        </tr>
    )
}
export default NoticeListItem;