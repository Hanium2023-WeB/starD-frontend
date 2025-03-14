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
    const progressStatus = useState(props.progressStatus);
    const [pendingEnter, setPendingEnter] = useState(false);
    const [chatRoomId, setChatRoomId] = useState(null);
    const [userNickname, setUserNickname] = useState(null);
    const memberNickname = localStorage.getItem('memberNickname');


    useEffect(() => {
        // props.studyId가 업데이트될 때마다 studyId를 설정
        setStudyId(props.studyId);
        // props.studyTitle이 업데이트될 때마다 studyTitle을 설정
        setStudyTitle(props.studyTitle);
    }, [props.studyId, props.studyTitle]); // props가 변경될 때 실행

    const stompClient = useRef(
        new Client({
            brokerURL: process.env.REACT_APP_CHAT_API_KEY,
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
                const parsedGreeting = JSON.parse(greeting.body);
                console.log("fromServer: ", parsedGreeting);

                if (userNickname == null) {
                    setUserNickname(parsedGreeting.nickname);
                }

                showGreeting(parsedGreeting);
            });
        }
    };


    const fetchChatHistory = async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            try {
                const response = await axios.get(`/api/chats/history/${studyId}`, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                // 로컬 스토리지에 'authorNickname'이 없으면 한 번만 저장
                if (!memberNickname) {
                    const author = response.data.chatMessages.find(msg => msg.isAuthor === true)?.nickname;
                    if (author) {
                        localStorage.setItem('memberNickname', author);
                    }
                }

                setGreetings(response.data.chatMessages);
                setChatRoomId(response.data.chatRoomId);
                console.log(response.data);

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

            if (message.trim().length === 0) {
                if (progressStatus === "CANCELED") {
                    alert('중단된 스터디는 채팅이 불가능합니다.');
                } else {
                    alert('메시지를 입력하세요.');
                }
                return;
            } else {
                stompClient.current.publish({
                    destination: `/app/chat/${studyId}/${chatRoomId}`,
                    body: `${message}`,
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
                <p>{studyTitle}</p>
            </div>
            <div className={"chattingbox"}>
                <div className={"message-head"}>
                    Messages
                </div>
                <div className={"chatting"}>
                    <div id={"message"}>
                        {greetings.map((greeting, index) => {
                            const isGreeting = greeting.messageType === "GREETING";
                            const isMyChat = greeting.nickname === memberNickname;

                            return (
                                <div
                                    key={index}
                                    className={`message-detail ${isGreeting ? "greet" : isMyChat ? "my-chats" : "other-chats"}`}>
                                    <span>
                                        {!isGreeting && `${greeting.nickname}: `}
                                        {greeting.message}
                                        {!isGreeting && (
                                            <>
                                                <br/>
                                                <p className="entry-time">[{formatDatetime(greeting.createdAt)}]</p>
                                            </>
                                        )}
                                    </span>
                                </div>
                            );
                        })}
                        <div>
                            <div ref={messageEndRef}></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"input_chat"}>
                <label>채팅 보내기</label>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="내용을 입력하세요"
                    disabled={progressStatus === 'CANCELED'}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
        // <div className="chat_wrap">
        //     <div className="studyTitle">
        //         <p>{studyTitle}</p>
        //     </div>
        //     <div className="chattingbox">
        //         <div className="message-head">Messages</div>
        //         <div className="messages">
        //             {greetings.map((greeting, index) => (
        //                 <div
        //                     key={index}
        //                     className={`message-detail ${greeting.messageType === 'GREETING' ? "greet" :
        //                         greeting.nickname === memberNickname ? "my-chats" : "other-chats"}`}
        //                 >
        //             <span>
        //                 {greeting.messageType !== 'GREETING' && `${greeting.nickname}: `}
        //                 {greeting.message}
        //                 {greeting.messageType !== "GREETING" && (
        //                     <p className="entry-time">[{formatDatetime(greeting.createdAt)}]</p>
        //                 )}
        //             </span>
        //                 </div>
        //             ))}
        //             <div ref={messageEndRef}></div>
        //         </div>
        //     </div>
        //     <div className="input_chat">
        //         <label>채팅 보내기</label>
        //         <input
        //             type="text"
        //             value={message}
        //             onChange={(e) => setMessage(e.target.value)}
        //             onKeyDown={onKeyDown}
        //             placeholder="내용을 입력하세요"
        //             disabled={progressStatus === "CANCELED"}
        //         />
        //         <button onClick={sendMessage}>Send</button>
        //     </div>
        // </div>
    )
        ;
};

export default Chat;