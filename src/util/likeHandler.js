import axios from "axios";

export const toggleLikeStatus = async (post, accessToken, isLoggedInUserId, onSuccess, onError) => {
    if (!(accessToken && isLoggedInUserId)) {
        alert("로그인 해주세요");
        return;
    }

    const postId = post.postId || post.studyPostId;
    const tableType = post.studyPostId ? "studyPost" : "post";

    try {
        if (post.existsStar) {
            const response = await axios.delete(`/api/stars-and-scraps/${postId}`, {
                params: {
                    targetId: postId,
                    tableType: tableType,
                },
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            console.log("좋아요 취소 성공:", response.data);
            onSuccess(false); // 상태를 false로 설정
        } else {
            const response = await axios.post(`/api/stars-and-scraps/${postId}`, null, {
                params: {
                    targetId: postId,
                    tableType: tableType,
                },
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            console.log("좋아요 성공:", response.data);
            onSuccess(true); // 상태를 true로 설정
        }
    } catch (error) {
        console.error("좋아요 처리 실패:", error.response.data);
        onError(error);
    }
};