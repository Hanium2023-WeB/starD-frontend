import React, {useState, useEffect, useCallback, useRef} from "react";
import {useParams, Link, useNavigate} from "react-router-dom";
import Header from "../../components/repeat_etc/Header";
import "../../css/study_css/StudyDetail.css";
import "../../css/comment_css/Comment.css";
import StudyInfo from "../../components/study/StudyInfo";
import Backarrow from "../../components/repeat_etc/Backarrow";
import Comment from "../../components/comment/Comment";
import {useLocation} from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const StudyDetail = () => {

  const location = useLocation();
  let studyId = location.state;

  const [studyItem, setStudyItem] = useState();
  const navigate = useNavigate();
  const {id} = useParams();

  const [studies, setStudies] = useState([]);
  const [studyDetail, setStudyDetail] = useState([]);
  const [isApply, setIsApply] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const isLoggedInUserId = localStorage.getItem('isLoggedInUserId');
  const [applyReason, setApplyReason] = useState([]);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (studyId === null) {
      studyId = id;
    }

    const headers = accessToken && isLoggedInUserId ? {
      'Authorization': `Bearer ${accessToken}`,
    } : {};

    axios.get(`/api/studies/${id}`, {
      withCredentials: true,
      headers: headers,
    }).then((res) => {
      setStudyItem(res.data);

      if (res.data.isAuthor) {
        setIsRecruiter(true);
      }

      if (res.data.recruitmentType === "RECRUITING") {
        setIsCompleted(false);
      } else {
        setIsCompleted(true);
      }
    })
    .catch((error) => {
      console.error("스터디 세부 데이터 가져오기 실패:", error);
    });

    if (accessToken !== null && !isRecruiter) {
      axios.get(`/api/studies/${id}/application`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }).then((res) => {
        if (typeof (res.data) !== "string") {
          setIsApply(true);
          setApplyReason(res.data.introduce);
        }
      })
      .catch((error) => {
        console.error("스터디 지원 여부 데이터 가져오기 실패:", error);
      });
    }

  }, [id]);

  const handleStudyDelete = useCallback(() => {
    const confirmDelete = window.confirm("정말로 스터디를 삭제하시겠습니까?");
    if (confirmDelete) {
      axios.delete(`/api/studies/${id}`,
          {
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${accessToken}`
            },
          })
      .then((res) => {
        console.log("API Response:", res.data);
        console.log("삭제성공");
        setStudies(res.data);
        alert("스터디 모집글이 삭제되었습니다.");
      }).catch((error) => {
        console.log(error);
      })
    }
  }, [id]);

  const handleApply = () => {
    if (!accessToken) {
      return toast.error("로그인 후 이용 가능합니다.");
    }

    navigate(`/study/apply/${studyItem.studyId}`);

  };

  return (
      <div>
        <Header showSideCenter={true}/>
        <div className="study_detail_container">
          <div className="arrow_left">
            <Backarrow subname={studyItem?.title}/>
          </div>
          <div className="study_detail">
            {studyItem && (
                <div key={studyItem.id}>
                  <StudyInfo
                      study={studyItem}
                      isRecruiter={isRecruiter}
                      setStudies={setStudies}
                  />
                  <div className="study_intro">
                    <div style={{fontWeight: "bold"}}>스터디 소개</div>
                    {studyItem && (
                        <div
                            dangerouslySetInnerHTML={{
                              __html: studyItem.content.replace(/\n/g, "<br>"),
                            }}
                        />
                    )}
                  </div>
                  {isApply === true && applyReason && (
                      <div className="study_apply_reason">
                        <div>나의 지원동기 및 각오</div>
                        <div>{applyReason}</div>
                      </div>
                  )}
                  {isApply === false && isRecruiter === false && isCompleted
                      === false && (
                          <div className="btn">
                            {/*<Link*/}
                            {/*    to={`/study/apply/${studyItem.studyId}`}*/}
                            {/*    style={{*/}
                            {/*      textDecoration: "none",*/}
                            {/*      color: "inherit",*/}
                            {/*    }}*/}
                            {/*>*/}
                            <button onClick={handleApply}
                                    className="apply_btn">참여하기
                            </button>
                            {/*</Link>*/}
                          </div>
                      )}
                  {isApply === false && isRecruiter === true && (
                      <div className="btn">
                        <Link
                            to={`/study/apply-list/${studyItem.studyId}`}
                            state={{capacity: studyItem.capacity}}
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                            }}
                        >
                          <button className="apply_btn">신청자 조회</button>
                        </Link>
                      </div>
                  )}
                </div>
            )}
          </div>
        </div>

        <div className="comment_container">
          <Comment type="study"/>
        </div>
      </div>
  );
};

export default StudyDetail;