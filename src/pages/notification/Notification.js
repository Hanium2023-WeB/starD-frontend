import React, {useEffect, useState} from "react";
import Backarrow from "../../components/repeat_etc/Backarrow";
import Header from "../../components/repeat_etc/Header";
import Category from "../../components/repeat_etc/Category";
import axios from "axios";
import { FaReply } from "react-icons/fa";
import { MdOutlineSchedule } from "react-icons/md";
import { VscPassFilled } from "react-icons/vsc";
import "../../css/notification_css/Notification.css";
import {useNavigate} from "react-router-dom";

const Notification = () => {
    const accessToken = localStorage.getItem('accessToken');
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/api/notifications`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("알림 get 성공 : ", res.data);
                setNotifications(res.data.infos);
            })
            .catch((error) => {
                console.error("알림 get 실패:", error);
            });
    }, []);

    const renderIcon = (type) => {
        switch (type) {
            case "REPLY":
                return <FaReply />;
            case "MATCHING":
                return <VscPassFilled />;
            case "MEETING":
                return <MdOutlineSchedule />;
            default:
                return null;
        }
    };

    const readNotification = (notificationId) => {
        axios.put(`/api/notifications/${notificationId}`, null, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                console.log("알림 get 성공 : ", res.data);
                setNotifications(res.data.infos);
            })
            .catch((error) => {
                console.error("알림 get 실패:", error);
            });
    }

    const handleNotificationClick = (type, targetId, notificationId) => {
        // 알림 읽음 처리
        readNotification(notificationId);

        // type에 따라 페이지 이동
        if (type === "REPLY") {
            navigate(`/study/detail/${targetId}`);
        } else if (type === "MATCHING") {
            navigate(`/teamblog/${targetId}`);
        } else {
            console.warn("알 수 없는 알림 유형:", type);
        }
    };

    return (
        <div className="notification_container">
            <h2 className="noti">알림</h2>
            <div className="notification_wrapper">
                {notifications.map((notification) => (
                    <div
                        key={notification.notificationId}
                        className={`notification_component ${notification.read ? 'read' : ''}`}
                        onClick={() => handleNotificationClick(notification.type, notification.targetId, notification.notificationId)}
                    >
                        <div className="header">
                            <div className="sub_header">
                                <div className="type">{renderIcon(notification.type)}</div>
                                <div className="title">{notification.title}</div>
                            </div>
                            <div>{notification.read === true ? "읽음" : "읽지 않음"}</div>
                        </div>
                        <div className="content">{notification.body}</div>
                    </div>
                ))}
            </div>

        </div>
    )
}
export default Notification;