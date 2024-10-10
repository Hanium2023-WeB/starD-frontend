import React, {useState, useEffect, useRef} from 'react';
import {Client} from '@stomp/stompjs';
import chatting from "../../css/study_css/chatting.css";
import axios from 'axios';
/* 마지막 수정 : 민영
클래스형에서 함수형컴포넌트로 변경
채팅 UI 개선
* */

const Chat = (props) => {
    const [connected, setConnected] = useState(false);
    const [message, setMessage] = useState('');
    const [greetings, setGreetings] = useState([]);
    const [studyId, setStudyId] = useState(props.studyId);
    const [studyTitle, setStudyTitle] = useState(props.studyTitle);
    const progressStatus= useState(props.progressStatus);
    const [pendingEnter, setPendingEnter] = useState(false); //
    const LogNicname = localStorage.getItem("isLoggedInUserId");
    
    const stompClient = useRef(
        new Client({
            brokerURL: 'ws://localhost:8080/gs-guide-websocket',
        })
    );

    const messageEndRef = useRef(null);

    useEffect(() => {
        const connect = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {

                const headers = {
                    Authorization: `Bearer ${accessToken}`,
                };

                try {
                    await stompClient.current.activate({headers});
                    setConnected(true);
                    stompClient.current.onConnect = onConnect;
                    subscribeToChatRoom(studyId);
                    fetchChatHistory();
                } catch (error) {
                    console.error('Failed to connect:', error);
                }
            } else {
                console.error('Access token not found.');
            }
        };

        connect();

        return () => {
            sendExitMessage();
        };
    }, [studyId]);

    useEffect(() => {
        scrollChatToBottom();
    }, [greetings]);

    const scrollChatToBottom = () => {
        const chatBox = document.querySelector('.chattingbox');
        if (chatBox) {
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    };

    const subscribeToChatRoom = (studyId) => {
        if (stompClient.current.connected) {
            stompClient.current.subscribe(`/topic/greetings/${studyId}`, (greeting) => {
                showGreeting(JSON.parse(greeting.body));
            });
        }
    };


    const fetchChatHistory = async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            try {
                const response = await axios.get(`/api/chat/history/${studyId}`, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                setGreetings(response.data);

                if (stompClient.current.connected) {
                    sendEnterMessage();
                } else {
                    setPendingEnter(true);
                    console.error('STOMP connection not active. Cannot send enter message.');
                }
            } catch (error) {
                console.error('Error fetching chat history:', error);
            }
        }
    };
    const onConnect = (isActive) => {
        setConnected(isActive);
        if (isActive) {
            subscribeToChatRoom(studyId);
            fetchChatHistory();

            if (pendingEnter) {
                sendEnterMessage();
                setPendingEnter(false);
            }
        }
    };


    const onWebSocketError = (error) => {
        console.error('Error with websocket', error);
    };

    const onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
    };

    const sendExitMessage = () => {
        const accessToken = localStorage.getItem('accessToken');
        if (stompClient.current.connected && accessToken) {
            const headers = {
                Authorization: `${accessToken}`,
            };
            stompClient.current.publish({
                destination: `/app/exit/${studyId}`,
                body: JSON.stringify({type: 'GREETING', studyId: studyId}),
                headers: headers,
            });
        } else {
            console.error('Access token not found.');
        }
        disconnect();
    };

    const disconnect = () => {
        stompClient.current.deactivate();
        setConnected(false);
        console.log('Disconnected');
    };

    const sendEnterMessage = () => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            const headers = {
                Authorization: `${accessToken}`,
            };
            stompClient.current.publish({
                destination: `/app/enter/${studyId}`,
                body: JSON.stringify({type: 'GREETING', studyId: studyId}),
                headers: headers,
            });
        } else {
            console.error('Access token not found.');
        }
    };

    const sendMessage = () => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            const headers = {
                Authorization: `${accessToken}`,
            };
            if (message.length === 0) {
                if(progressStatus==="DISCONTINUE"){
                    alert('중단된 스터디는 채팅이 불가능합니다.');
                } else {
                    alert('메시지를 입력하세요.');
                }
            }else {
                stompClient.current.publish({
                    destination: `/app/chat/${studyId}`,
                    body: JSON.stringify({type: 'TALK', studyId: studyId, message: `${message}`}),
                    headers: headers,
                });
                scrollChatToBottom();
                setMessage('');
            }
        } else {
            console.error('Access token not found.');
        }
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const showGreeting = (message) => {
        setGreetings((prevGreetings) => [...prevGreetings, message]);
    };


    const formatDatetime = (datetime) => {
        const date = new Date(datetime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    return (
        <div className={"chat_wrap"}>
            <div className={"studyTitle"}>
                <h2>{studyTitle}</h2><br/><br/>
            </div>
            <div className={"chattingbox"}>
                <table className={"chatting"}>
                    <thead id={"message-thead"}>
                    <tr>
                        <th>Messages</th>
                    </tr>
                    </thead>
                    <tbody id={"message"}>
                    {greetings.map((greeting, index) => (
                        <tr key={index}>

                            {greeting.type === 'GREETING' ? (
                                <td className={"message-detail"} id={"greet"}>
                                    <span>{greeting.message}</span>
                                </td>
                            ) : (
                                greeting.member.nickname === LogNicname ? (
                                    <td className={"message-detail"} id={"my-chats"}>
                                                <span>
                                             {greeting.member ? greeting.member.nickname : 'Unknown'}: {greeting.message}
                                                    <br/><p id={"entry-time"}>[{formatDatetime(greeting.createdAt)}]</p>
                                                        </span>
                                    </td>
                                ) : (
                                    <td className={"message-detail"} id={"other-chats"}>
                                                <span>
                                            {greeting.member ? greeting.member.nickname : 'Unknown'}: {greeting.message} [
                                                    <br/><p id={"entry-time"}>   {formatDatetime(greeting.createdAt)}]</p>
                                                       </span>
                                    </td>
                                )
                            )}

                        </tr>
                    ))}
                    <tr>
                        <td ref={messageEndRef}></td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div className={"input_chat"}>
                <label>채팅 보내기</label>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="내용을 입력하세요"
                    disabled={progressStatus === 'DISCONTINUE'}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;