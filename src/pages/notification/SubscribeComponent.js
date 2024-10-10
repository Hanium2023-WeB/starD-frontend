import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "../../components/repeat_etc/Header";
const SubscribeComponent = () => {
    const [lastEventId, setLastEventId] = useState("");
    const [notifications, setNotifications] = useState([]);
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        const eventSource = new EventSource(`/api/notifications/subscribe?token=${accessToken}`, { withCredentials: true });

        eventSource.onopen = () => {
            console.log("SSE 연결이 열렸습니다.");
        };

        eventSource.onerror = (error) => {
            console.error("SSE 연결 중 오류가 발생했습니다.", error);
        };

        eventSource.addEventListener("message", (event) => {
            const eventData = JSON.parse(event.data);
            console.log("수신한 이벤트 데이터:", eventData);
            setLastEventId(event.lastEventId);
            // 서버로부터 수신한 데이터를 상태에 저장하거나 처리합니다.
            setNotifications([...notifications, eventData]);
        });

        return () => {
            eventSource.close();
            console.log("SSE 연결이 닫혔습니다.");
        };
    }, [lastEventId]); // lastEventId가 변경될 때마다 SSE를 다시 구독합니다.

    const sendData = async () => {
        try {
            await axios.post(`/api/notifications/send-data?token=${accessToken}`, null, { withCredentials: true });
            console.log("데이터 전송 성공");
        } catch (error) {
            console.error("데이터 전송 실패:", error);
        }
    };

    return (
        <div>
            <Header showSideCenter={true}/>
        <div>
            <h2>알림 목록</h2>
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index}>{notification}</li>
                ))}
            </ul>
            <button onClick={() => sendData()}>데이터 전송</button>
        </div>
        </div>
    );
};

export default SubscribeComponent;
