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
                <Route path="/login/findPW"
                       element={<FindPW/>}/> {/* Find password page */}
                <Route path="/reset-password" element={
                  <ResetPwTokenVerification/>}/> {/* Reset password verification */}
                <Route path="/update-password" element={
                  <ResetPwTokenVerification/>}/> {/* Update password page */}
                <Route path="/reset-password/sent" element={
                  <ResetPasswordEmailSent/>}/> {/* Update password page */}

                {/* Mypage Routes */}
                <Route path="/mypage"
                       element={<Mypage/>}/> {/* User's personal page */}
                <Route path="/mypage/profile"
                       element={<Profile/>}/> {/* User profile page */}
                <Route path="/mypage/profile/edit"
                       element={<EditProfile/>}/> {/* Edit user profile */}
                <Route path="/mypage/editinfo"
                       element={<Editinfo/>}/> {/* Edit user information */}
                <Route path="/mypage/participate-study" element={
                  <MyParticipateStudy/>}/> {/* Participated studies */}
                <Route path="/mypage/open-study"
                       element={<MyOpenStudy/>}/> {/* User's open studies */}
                <Route path="/mypage/apply-study"
                       element={<MyApplyStudy/>}/> {/* Applied studies */}
                <Route path="/mypage/scrap-study"
                       element={<MyScrapStudy/>}/> {/* Scrapped studies */}
                <Route path="/mypage/scrap-community" element={
                  <MyScrapCommunityPost/>}/> {/* Scrapped community posts */}
                <Route path="/mypage/write-post/:page"
                       element={<MyWritePost/>}/> {/* Posts written by user */}
                <Route path="/mypage/write-comment/:page" element={
                  <MyWriteComment/>}/> {/* Comments written by user */}
                <Route path="/mypage/score"
                       element={<MyScore/>}/> {/* User score page */}
                <Route path="/mypage/todo-list"
                       element={<ToDoList/>}/> {/* User's to-do list */}
                <Route path="/mypage/schedule"
                       element={<Schedule/>}/> {/* User's schedule */}
                <Route path="/mypage/evaluate"
                       element={
                         <MemberEvaluate/>}/> {/* Member evaluation page */}
                <Route path="/mypage/user-profile/:id" element={
                  <AnotherUserProfile/>}/> {/* View another user's profile */}

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

