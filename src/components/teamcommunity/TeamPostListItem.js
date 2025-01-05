import {Link} from "react-router-dom";
import attachments from "../../images/attachments.png";

const TeamPostListItem = ({studyId, posts, setPosts}) => {
    console.log(studyId);
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
            <Link to={`/teamblog/${studyId}/community/post/${posts.studyPostId}`}
                  style={{
                      textDecoration: "none",
                      color: "inherit",
                  }}>
                <td className="community_title">
                    {posts.title}
                    {posts.totalFiles > 0 && (<img src={attachments} style={{ paddingLeft: "10px", width: "15px" }}/>)}
                </td>
            </Link>
            <td className="community_nickname">{posts.writer}</td>
            <td className="community_datetime">{formatDatetime(posts.createdAt)}</td>
            <td>{posts.hit}</td>
            <td>{posts.scrapCount}</td>
        </tr>
    )
}
export default TeamPostListItem;