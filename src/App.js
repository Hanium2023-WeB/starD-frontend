import "./App.css";
import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/userpage/Login";
import Logout from "./pages/userpage/Logout";
import Signup from "./pages/userpage/Signup";
import MyPage from "./pages/mypage/MyPage";
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
import StudyApplyList from "./pages/studypage/StudyApplyList";
import TeamBlog from "./pages/studypage/TeamBlog";
import Community from "./pages/community/Community";
import Notice from "./pages/notice/Notice";
import PostDetail from "./pages/community/PostDetail";
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
import FAQManagement from "./pages/admin/FAQManagement";
import MemberManagement from "./pages/admin/MemberManagement";
import NoticeManagement from "./pages/admin/NoticeManagement";
import ReportManagement from "./pages/admin/ReportManagement";
import ResetPwTokenVerification
  from "./pages/userpage/ResetPwTokenVerification";
import QnaInsert from "./pages/qna/QnaInsert";
import FaqInsert from "./pages/admin/FaqInsert";
import ResetPasswordEmailSent from "./pages/userpage/ResetPwEmailSent";
import {TeamBlogProvider} from "./components/datacontext/TeamBlogContext";
import {Toaster} from "react-hot-toast";
import {EventSourceProvider} from "./pages/notification/EventSourceContext";
import Subscribe from "./pages/notification/Subscribe";
import NoticeInsert from "./pages/notice/NoticeInsert";
import {MyPageProvider} from "./components/datacontext/MyPageContext";
import Notification from "./pages/notification/Notification";

function App() {
  return (
      <EventSourceProvider>
        <BrowserRouter>
          <div className="App">
            <Subscribe/>
              <Toaster/>
              <Routes>
                {/* Main and Authentication Routes */}
                <Route path="/" element={<Home/>}/> {/* Main page */}
                <Route path="/login" element={<Login/>}/> {/* Login page */}
                <Route path="/logout" element={<Logout/>}/> {/* Logout page */}
                <Route path="/subinfo/signup"
                       element={<Signup/>}/> {/* User signup page */}
                <Route path="/subinfo"
                       element={<InputSubSign/>}/> {/* User signup page */}
                <Route path="/login/findeID"
                       element={<FindID/>}/> {/* Find ID page */}
                <Route path="/login/findedID"
                       element={<FindedID/>}/> {/* Found ID page */}
                <Route path="/find-password"
                       element={<FindPW/>}/> {/* Find password page */}
                <Route path="/reset-password" element={
                  <ResetPwTokenVerification/>}/> {/* Reset password verification */}
                <Route path="/update-password" element={
                  <ResetPwTokenVerification/>}/> {/* Update password page */}
                <Route path="/reset-password/sent" element={
                  <ResetPasswordEmailSent/>}/> {/* Update password page */}

                {/* MyPage Routes */}
                <Route path="/mypage/*" element={
                  <MyPageProvider>
                    <Routes>
                      <Route index element={<MyPage />} /> {/* Default MyPage */}
                      <Route path="profile" element={<Profile />} /> {/* Profile page */}
                      <Route path="profile/edit" element={<EditProfile />} /> {/* Edit profile */}
                      <Route path="editinfo" element={<Editinfo />} /> {/* Edit info */}
                      <Route path="participate-study/:page" element={<MyParticipateStudy />} /> {/* My participations */}
                      <Route path="open-study/:page" element={<MyOpenStudy />} /> {/* My open studies */}
                      <Route path="apply-study/:page" element={<MyApplyStudy />} /> {/* My applied studies */}
                      <Route path="scrap-study/:page" element={<MyScrapStudy />} /> {/* My scrap studies */}
                      <Route path="scrap-community/:page" element={<MyScrapCommunityPost />} /> {/* My scrap community posts */}
                      <Route path="write-post/:page" element={<MyWritePost />} /> {/* My written posts */}
                      <Route path="write-comment/:page" element={<MyWriteComment />} /> {/* My written comments */}
                      <Route path="score" element={<MyScore />} /> {/* My score */}
                      <Route path="todo-list" element={<ToDoList />} /> {/* My todo list */}
                      <Route path="schedule" element={<Schedule />} /> {/* My schedule */}
                      <Route path="user-profile/:userId" element={<AnotherUserProfile />} /> {/* Another user's profile */}
                    </Routes>
                  </MyPageProvider>
                } />

                {/* Study Routes */}
                <Route path="/study/:page"
                       element={<Study/>}/> {/* Study list page */}
                <Route path="/study/detail/:id"
                       element={<StudyDetail/>}/> {/* Study detail page */}
                <Route path="/study/insert"
                       element={<StudyInsert/>}/> {/* Insert new study */}
                <Route path="/study/edit/:id"
                       element={<StudyEdit/>}/> {/* Edit study */}
                <Route path="/study/apply/:id"
                       element={
                         <StudyApplyForm/>}/> {/* Study application form */}
                <Route path="/study/apply-list/:id" element={
                  <StudyApplyList/>}/> {/* List of study applications */}
                <Route path="/study/search"
                       element={<Study/>}/> {/* Study search results */}

                {/* TeamBlog Nested Routes */}
                <Route path="/teamblog/:id/*" element={
                  <TeamBlogProvider>
                    <Routes>
                      <Route index
                             element={
                               <TeamBlog/>}/> {/* Default Team Blog page */}
                      <Route path="todo-list"
                             element={<TeamToDoList/>}/> {/* Team to-do list */}
                      <Route path="schedule"
                             element={<TeamSchedule/>}/> {/* Team schedule */}
                      <Route path="community" element={
                        <TeamCommunity/>}/> {/* Team community page */}
                      <Route path="community/search" element={
                        <TeamCommSearchResult/>}/> {/* Community search results */}
                      <Route path="community/post/:postId" element={
                        <StudyPostDetail/>}/> {/* Team blog post detail */}
                      <Route path="member"
                             element={<TeamMember/>}/> {/* Team members */}
                      <Route path="evaluate" element={<MemberEvaluate />} /> {/* Member evaluation */}
                    </Routes>
                  </TeamBlogProvider>
                }/>

                {/* Community and Notice Routes */}
                <Route path="/community/:page"
                       element={<Community/>}/> {/* Community main page */}
                <Route path="/community/post/:id"
                       element={<PostDetail/>}/> {/* Community post detail */}
                <Route path="/community/search"
                       element={<Community/>}/> {/* Community search results */}
                <Route path="/notice/:page"
                       element={<Notice/>}/> {/* Notice main page */}
                <Route path="/notice/detail/:id"
                       element={<NoticeDetail/>}/> {/* Notice detail page */}
                <Route path="/notice/search" element={
                  <NoticeSearchResult/>}/> {/* Notice search results */}

                {/* QnA Routes */}
                <Route path="/qna/:page"
                       element={<Qna/>}/> {/* QnA main page */}
                <Route path="/qna/search"
                       element={<Qna/>}/> {/* QnA main page */}
                <Route path="/qna/detail/:id"
                       element={<QnaDetail/>}/> {/* QnA detail page */}
                <Route path="/qna/insert"
                       element={<QnaInsert/>}/> {/* Insert new QnA */}

                <Route path="/faq/detail/:id"
                       element={<QnaDetail/>}/> {/* FaQ detail page */}

                {/* Admin Routes */}
                <Route path="/admin"
                       element={<Admin/>}/> {/* Admin main page */}
                <Route path="/admin/faq-management/:page"
                       element={<FAQManagement/>}/> {/* FAQ management */}
                <Route path="/admin/member-management/:page"
                       element={<MemberManagement/>}/> {/* Member management */}
                <Route path="/admin/notice-management/:page"
                       element={<NoticeManagement/>}/> {/* Notice management */}
                <Route path="/admin/report-management/:page"
                       element={<ReportManagement/>}/> {/* Report management */}
                <Route path="/admin/faq-insert"
                       element={<FaqInsert/>}/> {/* Insert new FAQ */}
                <Route path="/admin/notice/insert"
                       element={<NoticeInsert/>}/> {/* Insert new Notice */}

                {/* Miscellaneous Routes */}
                <Route path="/chat" element={<Chat/>}/> {/* Chat page */}
                {/*<Route path="/subscribe" element={*/}
                {/*  <SubscribeComponent/>}/> /!* Notification subscription page *!/*/}


              </Routes>
              <Footer/> {/* Footer displayed on all pages */}

          </div>

        </BrowserRouter>

      </EventSourceProvider>

  );

}

export default React.memo(App); // Memoized component to prevent unnecessary re-renders

