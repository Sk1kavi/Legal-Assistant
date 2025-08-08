import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = { sender: 'user', text: input };
  setMessages((prev) => [...prev, userMessage]);
  setInput('');

  try {
    const res = await fetch('https://legal-assistant-et41.onrender.com/api/legal-query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        state: 'Tamil Nadu', // change this dynamically later
        question: input
      })
    });

    const data = await res.json();
    const botMessage = { sender: 'bot', text: data.answer || 'No reply received.' };
    setMessages((prev) => [...prev, botMessage]);
  } catch (err) {
    setMessages((prev) => [...prev, { sender: 'bot', text: 'Error contacting server.' }]);
  }
};


  const handleSpeak = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
  };
  const handleDashboardClick = () => {
    const role = localStorage.getItem("role");
    if (role === "lawyer") {
      navigate("/lawyer-dashboard");
    } else {
      navigate("/user-dashboard");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 space-y-4">
    <div className="w-full max-w-md rounded-2xl shadow-2xl bg-white border border-gray-200 flex flex-col relative">
      <div className="flex items-center justify-center gap-2 py-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl">
        <span className="text-3xl">🤖</span>
        <h1 className="text-2xl font-bold text-white tracking-wide">Legal Chatbot</h1>
      </div>

      <div className="flex-1 h-96 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl shadow
                ${msg.sender === 'user'
                  ? 'bg-gradient-to-br from-blue-500 to-blue-400 text-white rounded-br-none'
                  : 'bg-gradient-to-br from-gray-200 to-gray-100 text-gray-800 rounded-bl-none'
                }`}
            >
              <span className="block text-xs mb-1 font-semibold opacity-70">
                {msg.sender === 'user' ? 'You' : 'Bot'}
              </span>
              <span className="break-words">{msg.text}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 p-4 bg-white rounded-b-2xl border-t border-gray-100">
        <input
          type="text"
          placeholder="Ask a legal question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
        >
          Send
        </button>
        <button
          onClick={handleSpeak}
          className="px-3 py-2 bg-purple-600 text-white rounded-full shadow hover:bg-purple-700 transition text-lg"
          title="Speak"
        >
          🎤
        </button>
      </div>
    </div>

    {/* ✅ Aligned Below the Card */}
    <button
      onClick={handleDashboardClick}
      className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 shadow"
    >
      Go to Complaint Dashboard
    </button>
  </div>
);

};

export default ChatBot; 