import axios from "axios";

export const toggleScrapStatus = async (study, accessToken, isLoggedInUserId, onSuccess, onError) => {
    if (!(accessToken && isLoggedInUserId)) {
        alert("로그인 해주세요");
        return;
    }

    const targetId = study.studyPostId ? study.studyPostId : study.studyId;
    const tableType = study.studyPostId ? "studyPost" : "study";

    try {
        if (study.existsScrap) {
            const response = await axios.delete(`/api/stars-and-scraps/${targetId}`, {
                params: {
                    targetId: targetId,
                    tableType: tableType
                },
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            console.log("스크랩 취소 성공:", response.data);
            onSuccess(false); // 상태를 false로 설정
        } else {
            const response = await axios.post(`/api/stars-and-scraps/${targetId}`, null, {
                params: {
                    targetId: targetId,
                    tableType: tableType
                },
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            console.log("스크랩 성공:", response.data);
            onSuccess(true); // 상태를 true로 설정
        }
    } catch (error) {
        console.error("스크랩 처리 실패:", error);
        onError(error);
    }
};