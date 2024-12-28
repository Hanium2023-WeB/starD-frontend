import "./App.css";
import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/userpage/Login";
import Logout from "./pages/userpage/Logout";
import Signup from "./pages/userpage/Signup";
import Mypage from "./pages/mypage/Mypage";
import Footer from "./components/repeat_etc/Footer";
import Editinfo from "./pages/mypage/Editinfo";
import MyParticipateStudy from "./pages/mypage/MyParticipateStudy";
import MyOpenStudy from "./pages/mypage/MyOpenStudy";
import StudyDetail from "./pages/studypage/StudyDetail";
import ToDoList from "./pages/mypage/ToDoList";
import Schedule from "./pages/mypage/Schedule.js";
import StudyApplyForm from "./pages/studypage/StudyApplyForm";
import Study from "./pages/studypage/Study";
import StudyInsert from "./pages/studypage/StudyInsert";
import StudyEdit from "./pages/studypage/StudyEdit";
import MyApplyStudy from "./pages/mypage/MyApplyStudy";
import InputSubSign from "./pages/userpage/InputSubSign";
import FindID from "./pages/userpage/FindID";
import SearchResult from "./pages/studypage/SearchResult";
import StudyApplyList from "./pages/studypage/StudyApplyList";
import TeamBlog from "./pages/studypage/TeamBlog";
import Community from "./pages/community/Community";
import Notice from "./pages/notice/Notice";
import PostDetail from "./pages/community/PostDetail";
import CommSearchResult from "./pages/community/CommSearchResult";
import Chat from "./components/chat/Chat";
import FindedID from "./pages/userpage/FindedID.js";
import TeamToDoList from "./pages/TeamToDo/TeamToDoList";
import TeamSchedule from "./pages/TeamSchedule/TeamSchedule";
import TeamCommunity from "./pages/TeamCommunity/TeamCommunity";
import TeamCommSearchResult from "./pages/TeamCommunity/TeamCommSearchResult";
import StudyPostDetail from "./pages/TeamCommunity/StudyPostDetail";
import TeamMember from "./pages/TeamMember/TeamMember";
import FindPW from "./pages/userpage/FindPW";
import NoticeDetail from "./pages/notice/NoticeDetail";
import NoticeSearchResult from "./pages/notice/NoticeSearchResult";
import MemberEvaluate from "./pages/mypage/MemberEvaluate";
import Qna from "./pages/qna/Qna";
import QnaDetail from "./pages/qna/QnaDetail";
import Admin from "./pages/admin/Admin";
import MyScore from "./pages/mypage/MyScore";
import Profile from "./pages/mypage/Profile";
import EditProfile from "./pages/mypage/EditProfile";
import MyScrapStudy from "./pages/mypage/MyScrapStudy";
import MyScrapCommunityPost from "./pages/mypage/MyScrapCommunityPost";
import MyWritePost from "./pages/mypage/MyWritePost";
import MyWriteComment from "./pages/mypage/MyWriteComment";
import AnotherUserProfile from "./pages/mypage/AnotherUserProfile";
import OtherProfile from "./pages/studypage/OtherProfile";
import  SetNewPw from "./pages/userpage/SetNewPw";
import SubscribeComponent from "./pages/notification/SubscribeComponent";
import  FAQManagement from "./pages/admin/FAQManagement";
import  MemberManagement from "./pages/admin/MemberManagement";
import NoticeManagement from "./pages/admin/NoticeManagement";
import ReportManagement from "./pages/admin/ReportManagement";
import ResetPwTokenVerification from "./pages/userpage/ResetPwTokenVerification";
import QnaInsert from "./pages/qna/QnaInsert";
import FaqInsert from "./pages/admin/FaqInsert";
import FaqDetail from "./pages/qna/FaqDetail";
import NoticeInsert from "./pages/notice/NoticeInsert";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route
                        path="/"
                        element={<Home />}
                    />
                    <Route
                        path="/login"
                        element={<Login/>}
                    />
                    <Route
                        path="/subinfo/signup"
                        element={<Signup />}
                    />
                    <Route
                        path="/logout"
                        element={<Logout/>}
                    />
                    <Route
                        path="/login/findeID"
                        element={<FindID/>}
                    />
                    <Route
                        path="/login/findedID"
                        element={<FindedID/>}
                    />
                    <Route
                        path="/login/findPW"
                        element={<FindPW/>}
                    />
                    {/*<Route*/}
                    {/*    path="/reset-password"*/}
                    {/*    element={*/}
                    {/*        <SetNewPw/>*/}
                    {/*    }*/}
                    {/*/>*/}
                    <Route
                        path="/mypage"
                        element={<Mypage/>}
                    />
                    <Route
                        path="/mypage/profile"
                        element={<Profile/>}
                    />
                    <Route
                        path="/mypage/profile/Editprofile"
                        element={<EditProfile/>}
                    />
                    <Route
                        path="/editinfo"
                        element={<Editinfo/>}
                    />
                    <Route
                        path="/myparticipatestudy"
                        element={
                            <MyParticipateStudy/>
                        }
                    />
                    <Route
                        path="/myapplystudy"
                        element={
                            <MyApplyStudy/>
                        }
                    />
                    <Route
                        path="/myopenstudy"
                        element={<MyOpenStudy/>}
                    />
                    <Route
                        path="/myscrapstudy"
                        element={<MyScrapStudy/>}
                    />
                    <Route
                        path="/studydetail/:id"
                        element={<StudyDetail/>}
                    />
                    <Route
                        path="/ToDoList"
                        element={<ToDoList/>}
                    />
                    <Route
                        path="/MyPage/Schedule"
                        element={<Schedule/>}
                    />
                    <Route
                        path="/studyapplyform/:id"
                        element={
                            <StudyApplyForm/>
                        }
                    />
                    <Route
                        path="/study/:page"
                        element={
                            <Study/>
                        }
                    />
                    <Route
                        path="/study/studyInsert"
                        element={
                            <StudyInsert/>
                        }
                    />
                    <Route
                        path="/:id/StudyDetail/StudyEdit"
                        element={
                            <StudyEdit/>
                        }
                    />
                    <Route
                        path="/subinfo"
                        element={
                        <InputSubSign/>
                        }
                        />
                    <Route
                        path="/search"
                        element={
                            <Study/>
                        }
                    />
                    <Route
                        path="/:id/teamblog"
                        element={
                            <TeamBlog/>
                        }
                    />
                    <Route path="/" exact component={Home} />
                    <Route path="/search" component={SearchResult} />
                    <Route
                        path={"/StudyApplyList/:id"}
                        element={
                             <StudyApplyList/>
                        }
                    />
                    <Route path={"/:id/teamblog/TeamToDoList"}
                           element={
                            <TeamToDoList/>
                           }
                    />
                    <Route path="/:id/teamblog/TeamSchedule"
                           element={<TeamSchedule/>} />

                    <Route path="/:studyId/teamblog/TeamCommunity"
                           element={<TeamCommunity/>} />

                    <Route path="/:id/teamblog/TeamMember"
                           element={<TeamMember/>} />

                    <Route
                        path="/:studyId/teamblog/TeamCommunity/studypostdetail/:postId"
                        element={
                            <StudyPostDetail/>
                        }
                    />

                    <Route
                        path="/:id/teamblog/TeamCommunity/search"
                        element={
                            <TeamCommSearchResult/>
                        }
                    />

                    <Route
                        path="/community/:page"
                        element={
                            <Community/>
                        }
                    />
                    <Route
                        path="/myScrapcommunitypost"
                        element={
                            <MyScrapCommunityPost/>
                        }
                    />
                    <Route
                        path="/notice/:page"
                        element={
                            <Notice/>
                        }
                    />
                    <Route
                        path="/qna/:page"
                        element={
                            <Qna/>
                        }
                    />



                    <Route
                        path="/postdetail/:id"
                        element={
                            <PostDetail/>
                        }
                    />
                    <Route
                        path="/noticedetail/:id"
                        element={
                            <NoticeDetail/>
                        }
                    />
                    <Route
                        path="/qnadetail/:id"
                        element={
                            <QnaDetail/>
                        }
                    />
                    <Route
                        path="/comm/search"
                        element={
                            <Community />
                        }
                    />
                    <Route
                        path="/notice/search"
                        element={
                            <NoticeSearchResult/>
                        }
                    />
                    <Route
                        path="/qna/search"
                        element={
                            <Qna/>
                        }
                    />
                    <Route path="/comm/search" component={CommSearchResult} />
                    <Route
                        path="/chat"
                        element={
                            <Chat/>
                        }
                    />
                    <Route
                        path="/:id/evaluate"
                        element={
                            <MemberEvaluate/>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <Admin/>
                        }
                    />
                    <Route
                        path="/MyPage/myscore"
                        element={
                            <MyScore/>
                        }
                    />
                    <Route
                        path="/MyPage/mypost/:page"
                        element={
                            <MyWritePost/>
                        }
                    />
                    <Route
                        path="/MyPage/mycomment/:page"
                        element={
                            <MyWriteComment/>
                        }
                    />
                    <Route
                        path="/:id/userprofile"
                        element={
                            <AnotherUserProfile/>
                        }
                    />

                    <Route
                        path="/:memberId/profile"
                        element={
                            <OtherProfile/>
                        }
                    />
                    <Route
                        path="/notification"
                        element={
                            <SubscribeComponent/>
                        }
                    />
                    {/*관리자 페이지*/}
                    <Route
                        path="/admin/MemberManagement/:page"
                        element={<MemberManagement/>}
                    />
                    <Route
                        path="/admin/ReportManagement/:page"
                        element={<ReportManagement/>}
                    />
                    <Route
                        path="/admin/FAQManagement/:page"
                        element={<FAQManagement/>}
                    />

                    <Route
                        path="/admin/NoticeManagement/:page"
                        element={<NoticeManagement/>}
                    />

                    <Route
                        path="/reset-password"
                        element={<ResetPwTokenVerification/>}
                    />

                    <Route
                        path="/update-password"
                        element={<ResetPwTokenVerification/>}
                    />
                    <Route
                        path="/insert-Qna"
                        element={<QnaInsert/>}
                    />
                    <Route
                        path="/admin/insert-Faq"
                        element={<FaqInsert/>}
                    />
                    <Route
                        path="/faqdetail/:id"
                        element={<QnaDetail/>}
                    />

                    <Route
                        path="/admin/insert-notice"
                        element={<NoticeInsert/>}
                    />
                </Routes>

                <Footer/>

            </div>
        </BrowserRouter>
    );
}

export default React.memo(App);
