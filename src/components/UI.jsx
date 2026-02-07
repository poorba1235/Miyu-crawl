import { Cpu, Home, Menu, Mic, Send, Settings, Sparkles, Users, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";

const USER_ID = "User";

export const UI = ({ hidden, ...props }) => {
  const input = useRef();
  const { chat, loading, message, error, onMessagePlayed, displayMessages } = useChat();
  const [isRecording, setIsRecording] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const sendMessage = async (text) => {
    if (!loading && text.trim()) {
      await chat(text);
      input.current.value = "";
    }
  };

  const handleVoiceMessage = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support voice recognition.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsRecording(true);
      console.log("Voice recording started...");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      input.current.value = transcript;
      sendMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      setIsRecording(false);
      console.log("Voice recording stopped.");
    };

    recognition.start();
  };

  useEffect(() => {
    if (message) {
      // If there is no audio, we must advance the queue manually so subsequent messages can play
      if (!message.audio) {
        onMessagePlayed();
      }
    }
  }, [message]);

  if (hidden) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-10 flex flex-col justify-between p-6"
      style={{ pointerEvents: "none" }}
    >
      <div>
        <nav
          className="flex flex-row md:flex-row gap-4 px-5 py-3 items-center justify-between md:items-start pointer-events-auto rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-gray-900/10 to-cyan-900/10 shadow-2xl"
          style={{ pointerEvents: "auto" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
              <a
                href="Home"
                className="text-cyan-300 font-bold text-xl hover:text-cyan-100 transition-all duration-300 hover:drop-shadow-glow"
                style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: "0.1em" }}
              >
                MIYU.AI
              </a>
            </div>

            <div className="hidden md:flex items-center gap-1 ml-6">
              {[
                { icon: Home, label: "Dashboard", active: true },
                { icon: Users, label: "Community" },
                { icon: Cpu, label: "Models" },
                { icon: Zap, label: "Features" },
                { icon: Settings, label: "Settings" }
              ].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex items-center gap-2 text-cyan-200/80 hover:text-cyan-100 px-4 py-2 rounded-xl hover:bg-cyan-500/10 transition-all duration-300 border border-transparent hover:border-cyan-500/30 group"
                >
                  <item.icon size={16} className="group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                    {item.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2 text-cyan-200/80">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  Online: 2.4k
                </span>
              </div>
              <div className="flex items-center gap-2 text-cyan-200/80">
                <Sparkles size={14} className="text-yellow-400" />
                <span className="text-sm font-medium" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  Active: 892
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="#"
                className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:text-cyan-100 transition-all duration-300 text-sm font-medium"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}
              >
                TWITTER
              </a>
              <a
                href="#"
                className="px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:text-purple-100 transition-all duration-300 text-sm font-medium"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}
              >
                GITHUB
              </a>
            </div>

            <div className="md:hidden relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
              >
                <Menu size={20} />
              </button>

              <div
                className={`absolute ${isMenuOpen ? "flex opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"} 
                  flex-col bg-gray-900/10 border border-cyan-500/20 p-4 rounded-2xl right-0 top-full w-64 
                  transition-all duration-300 shadow-2xl z-20`}
              >
                {["Dashboard", "Community", "Models", "Features", "Settings"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-cyan-200 hover:text-cyan-100 p-3 rounded-lg hover:bg-cyan-500/10 transition-all duration-200 text-center font-medium"
                    style={{ fontFamily: "'Rajdhani', sans-serif" }}
                  >
                    {item}
                  </a>
                ))}
                <div className="border-t border-cyan-500/20 pt-3 mt-2">
                  <a
                    href="#"
                    className="text-cyan-200 hover:text-cyan-100 p-3 rounded-lg hover:bg-cyan-500/10 transition-all duration-200 text-center font-medium block"
                    style={{ fontFamily: "'Rajdhani', sans-serif" }}
                  >
                    TWITTER
                  </a>
                  <a
                    href="#"
                    className="text-purple-200 hover:text-purple-100 p-3 rounded-lg hover:bg-purple-500/10 transition-all duration-200 text-center font-medium block"
                    style={{ fontFamily: "'Rajdhani', sans-serif" }}
                  >
                    GITHUB
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', marginTop: '25px', marginRight: "20px" }}>
          <div className="flex items-center gap-3 py-2 px-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-cyan-300 font-bold text-sm tracking-wider">LIVE CHAT</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
            <div className="w-px h-4 bg-cyan-500/40"></div>
            <span className="text-cyan-200/80 text-xs font-medium">Users Online: 2,427</span>
          </div>
        </div>
      </div>

      <div
        className="w-full md:w-[480px] h-[55vh] md:h-[75vh] flex flex-col bg-gradient-to-br from-gray-900/10 to-cyan-900/10 p-5 rounded-3xl shadow-2xl border border-cyan-500/20 pointer-events-auto fixed bottom-0 left-0 md:relative md:bottom-auto md:left-auto mobile-chat"
        style={{ pointerEvents: "auto" }}
      >
        <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-cyan-300 font-bold text-lg tracking-wide" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              NEURAL_CHAT
            </span>
          </div>
          <div className="flex items-center gap-2 text-cyan-200/70 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span style={{ fontFamily: "'Rajdhani', sans-serif" }}>SYSTEM ACTIVE</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-black/10 border border-cyan-500/10 shadow-inner mt-3">
          {error && (
            <div className="text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl mb-3 text-sm">
              {error}
            </div>
          )}
          {displayMessages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 p-4 rounded-2xl border transition-all duration-300 ${msg.user?.id === USER_ID
                ? "bg-cyan-500/10 border-cyan-500/30 ml-8"
                : "bg-purple-500/10 border-purple-500/30 mr-8"
                }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-2 h-2 rounded-full ${msg.user?.id === USER_ID ? "bg-cyan-400" : "bg-purple-400"
                  }`}></div>
                <strong className={`text-sm font-bold ${msg.user?.id === USER_ID ? "text-cyan-300" : "text-purple-300"
                  }`}>
                  {msg.user?.name || msg.user?.id}
                </strong>
                {msg.user?.id === USER_ID && (
                  <div className="flex items-center gap-1 bg-cyan-500/20 px-2 py-1 rounded-full">
                    <span className="text-xs text-cyan-300 font-medium">LIVE</span>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
              <div className="text-cyan-100 text-sm leading-relaxed">{msg.text}</div>
              <div className={`text-xs mt-2 ${msg.user?.id === USER_ID ? "text-cyan-400/60" : "text-purple-400/60"
                }`}>
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-300"></div>
              </div>
              <span className="text-cyan-300 text-sm font-medium" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                MIYU PROCESSING
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mt-4">
          <input
            className="w-full placeholder:text-cyan-200/40 placeholder:italic p-4 rounded-2xl bg-black/10 border border-cyan-500/20 text-cyan-100 focus:border-cyan-400/50 focus:outline-none transition-all duration-300 shadow-inner"
            placeholder="Transmit neural message..."
            ref={input}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage(input.current.value);
              }
            }}
          />
          <button
            onClick={handleVoiceMessage}
            className={`p-4 rounded-2xl shadow-lg border transition-all duration-300 ${isRecording
              ? "bg-red-500/20 border-red-400/50 text-red-300 animate-pulse shadow-red-500/25"
              : "bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 hover:shadow-cyan-500/25"
              } ${loading ? "cursor-not-allowed opacity-30" : ""}`}
          >
            <Mic size={20} />
          </button>
          <button
            disabled={loading}
            onClick={() => sendMessage(input.current.value)}
            className={`p-4 rounded-2xl shadow-lg border border-cyan-500/30 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 text-cyan-300 hover:text-cyan-100 transition-all duration-300 ${loading ? "cursor-not-allowed opacity-30" : "hover:shadow-cyan-500/25"
              }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>


    </div>
  );
};