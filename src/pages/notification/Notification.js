import React, {useEffect, useState} from "react";
import Backarrow from "../../components/repeat_etc/Backarrow";
import Header from "../../components/repeat_etc/Header";
import Category from "../../components/repeat_etc/Category";
import axios from "axios";
import { FaReply } from "react-icons/fa";
import "../../css/notification_css/Notification.css";

const Notification = () => {
    const accessToken = localStorage.getItem('accessToken');
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        axios.get(`/api/notifications`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("알림 get 성공 : ", res.data);
                setNotifications(res.data);
            })
            .catch((error) => {
                console.error("알림 get 실패:", error);
            });
    }, []);

    const mynotifications = () => {
        return (
            <>
                {/*{(notifications.length === 0) && <div className="no_study"><p>알림이 없습니다.</p></div>}*/}
                {/*{(notifications.length !== 0) &&*/}
                    <table className="notification_table">
                        <thead>
                        <tr>
                            <th>타입</th>
                            <th>제목</th>
                            <th>내용</th>
                            <th>읽음 여부</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/*{notifications.map((notification) => (*/}
                            <tr className="notification_list">
                                <td><FaReply /></td>
                                <td>알림 제목</td>
                                <td>이것은 알림의 내용입니다. 이것은 알림의 내용입니다.</td>
                                <td>읽음</td>
                            </tr>
                            {/*))}*/}
                        </tbody>
                    </table>
                {/*}*/}
            </>
        )
    }
    return (
        <div>
            <Header showSideCenter={true} />
            <div className={"container"}>
                <Category/>
                <div className="main_container">
                    <p id={"entry-path"}> 마이페이지 > 알림 </p>
                    <Backarrow subname={"알림"}/>
                    <div>
                        {mynotifications()}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Notification;