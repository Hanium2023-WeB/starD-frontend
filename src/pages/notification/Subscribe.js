import React, {useEffect, useRef, useState} from 'react';
import {EventSourcePolyfill} from "event-source-polyfill";
import toast, {Toaster} from 'react-hot-toast';
import {useEventSource} from "./EventSourceContext";

const Subscribe = () => {
  const [lastEventId, setLastEventId] = useState("");
  const [notifications, setNotifications] = useState([]);
  const es = EventSourcePolyfill || EventSource;
  const {eventSourceRef, accessToken} = useEventSource();

  useEffect(() => {
    const storedLastEventId = localStorage.getItem("lastEventId");
    if (storedLastEventId) {
      setLastEventId(storedLastEventId); // 새로고침 후 복구
    }
  }, []);

  useEffect(() => {
    if (lastEventId) {
      localStorage.setItem("lastEventId", lastEventId); // lastEventId를 지속적으로 저장
    }
  }, [lastEventId]);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const connect = () => {
      // 이전 eventSource가 있다면 종료
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        console.log("EventSource closed");
      }

      const headers = {
        'Authorization': `Bearer ${accessToken}`,
      };

      // `Last-Event-ID`를 헤더로 전달
      if (lastEventId) {
        headers['Last-Event-ID'] = lastEventId;
      }

      const eventSource = new es(
          "/api/notifications/subscribe", {
            withCredentials: true,
            headers
          });

      eventSourceRef.current = eventSource; // useRef로 eventSource 관리

      eventSource.onopen = () => {
        console.log("EventSource open");
        // toast.success("새로운 알림이 도착했습니다!", {duration: 5000});
      };

      eventSource.onerror = (error) => {
        // TODO 토큰 만료 시 재로그인하거나 토큰 갱신하도록 수정
        console.error("SSE 연결 오류 발생", error);

        // 연결 오류가 발생했을 때 브라우저가 자동 재연결
        if (eventSource.readyState === EventSource.CLOSED) {
          console.log("EventSource closed. Waiting for automatic reconnect...");
          // setTimeout(() => connect(), 10000);
        }
      };

      eventSource.addEventListener("message", (event) => {
        const eventData = JSON.parse(event.data);

        if (eventData?.lastEventId) {
          console.log("eventData.lastEventId: " + eventData.lastEventId);
          setLastEventId(eventData.lastEventId);
          localStorage.setItem("lastEventId", eventData.lastEventId);
        }

        if (!eventData.title.startsWith("EventStream Created.")) {
          toast((t) => (
              <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: "8px",
                    // fontWeight: "bold",
                    fontSize: "15px"
                  }}
              >
            <span>
              {eventData.title} : <b>{eventData.body}</b>
            </span>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    style={{
                      fontSize: "15px",
                      marginLeft: "10px",
                      backgroundColor: "#BBDF9F",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "5px",
                      padding: "2px 8px",
                      border: "none",
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#A7D487")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#BBDF9F")}
                >
                  close
                </button>
              </div>
          ), {
            position: "top-right",
          });
        }
        setNotifications((notifications) => [...notifications, eventData]);
      });

      return () => {
        eventSource.close();
      };
    };
    connect();
  }, []);
  return null;
};

export default Subscribe;