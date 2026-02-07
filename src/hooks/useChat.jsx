import { createContext, useContext, useEffect, useState } from "react";

const backendUrl = "http://localhost:3001";


console.log("Backend URL:", backendUrl);

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [displayMessages, setDisplayMessages] = useState([]); // Store full chat history for UI
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const [error, setError] = useState(null);

  const chat = async (message) => {
    setLoading(true);
    const userMessage = {
      id: Math.random().toString(36).substring(7),
      text: message,
      user: { id: "User", name: "User" },
    };
    setDisplayMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch(`${backendUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {

        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const resp = await response.json();
      console.log("Response from backend:", resp);


      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Math.random().toString(36).substring(7),
          text: resp.response,
          animation: "Action",
          facialExpression: "default",
          lipsync: resp.lipsync,
          audio: resp.audio,
        },
      ]);

      setDisplayMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          text: resp.response,
          user: { id: "AI", name: "Miyu Ai" },
        },
      ]);


    } catch (error) {
      console.error("Chat API Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onMessagePlayed = () => {
    setMessages((prevMessages) => prevMessages.slice(1));
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        chat,
        message,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
        error,
        displayMessages, // Expose chat history to UI
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};