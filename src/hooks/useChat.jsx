import { ElevenLabsClient } from "elevenlabs";
import { createContext, useContext, useEffect, useState } from "react";

const backendUrl = "https://miyu-clawbot-backend-x626.vercel.app";

const elevenLabsApiKey = '16a6522513845dac5246b8f5e9edf8ff92ea01a45588569a8119cb0abc1af532';
const voiceId = "21m00Tcm4TlvDq8ikWAM";

const client = new ElevenLabsClient({
  apiKey: elevenLabsApiKey,
  dangerouslyAllowBrowser: true,
});

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [displayMessages, setDisplayMessages] = useState([]); // Store full chat history for UI
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const [error, setError] = useState(null);

  const textToSpeech = async (text) => {
    try {
      const audioStream = await client.textToSpeech.convert(voiceId, {
        model_id: "eleven_multilingual_v2",
        text,
      });

      const chunks = [];
      for await (const chunk of audioStream) {
        chunks.push(chunk);
      }

      const blob = new Blob(chunks, { type: 'audio/mpeg' });
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

    } catch (error) {
      console.error("TTS Error:", error);
      throw error;
    }
  };

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

      // Convert text response to voice
      let audioBase64 = resp.audio;
      if (!audioBase64 && resp.response) {
        try {
          audioBase64 = await textToSpeech(resp.response);
        } catch (ttsError) {
          console.error("Failed to generate TTS:", ttsError);
        }
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Math.random().toString(36).substring(7),
          text: resp.response,
          animation: "Action",
          facialExpression: "default",
          lipsync: resp.lipsync,
          audio: audioBase64,
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