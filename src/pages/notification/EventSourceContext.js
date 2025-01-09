import React, {createContext, useContext, useRef, useState} from 'react';

const EventSourceContext = createContext();

export const EventSourceProvider = ({children}) => {
  const eventSourceRef = useRef(null);
  const [accessToken, setAccessToken] = useState(
      localStorage.getItem('accessToken'));

  const closeEventSource = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      console.log("EventSource closed");
    }
  };

  return (
      <EventSourceContext.Provider value={{
        eventSourceRef,
        accessToken,
        setAccessToken,
        closeEventSource
      }}>
        {children}
      </EventSourceContext.Provider>
  );
};

export const useEventSource = () => useContext(EventSourceContext);
