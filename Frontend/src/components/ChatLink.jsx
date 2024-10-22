import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import Logo from './Logo';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useLocation } from 'react-router-dom';

function ChatLink() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);
  const location = useLocation();
  const { summary } = location.state;


  // Ensure summary is a string before setting it in the chat history
  useEffect(() => {
    if (summary) {
      const summaryText = typeof summary === 'string' ? summary["answer"] : JSON.stringify(summary["answer"]);
      const initialMessage = { text: summaryText, type: 'summary' };
      setChatHistory([initialMessage]);
    }
  }, [summary]);

  const handleSubmit = async () => {
    if (message.trim() === "") return;

    const newMessage = { text: message, type: 'question' };
    setChatHistory([...chatHistory, newMessage]);

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/chat', { question: message });
      const botResponse = { text: response.data.answer, type: 'answer' };
      setChatHistory(prevChatHistory => [...prevChatHistory, botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <>
      <Logo />
      <div className='min-h-screen bg-black flex flex-col'>
        <div className="flex flex-row w-full py-2 relative bg-black justify-center border-b-2 border-white">
          <h1 className="text-2xl text-white font-bold">Know Bot</h1>
          <div id='right corner' className="absolute right-11 flex items-center space-x-4">
            <h1 className="text-2xl text-white font-bold">Jothiruban</h1>
          </div>
        </div>
        <div className='flex-grow w-full'>
          <div
            ref={chatContainerRef}
            className='h-[calc(100vh-168px)] w-full max-w-screen-lg mx-auto p-4 overflow-y-auto flex flex-col space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900'
          >
            {chatHistory.map((msg, index) => (
              <div key={index} className='flex items-start space-x-3'>
                {/* Conditional rendering of icons/logos */}
                {msg.type === 'question' ? (
                  <img src="/images/logo.svg" alt="Human" className="w-6 h-6 mt-1" />
                ) : (
                  <img src="/images/logo.svg" alt="AI" className="w-6 h-6 mt-1" />
                )}
                {msg.type==='question' ? (
                  <div className={`p-2 rounded-lg bg-white-800 text-white`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                ):(
                <div className={`p-2 rounded-lg bg-gray-800 text-white`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className='w-full fixed bottom-0 left-0 pb-2 bg-black'>
          <div className="flex items-center bg-gray-800 border-white border-2 max-w-screen-lg mx-auto p-1 rounded-full shadow-lg">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message KnowBot"
              className="flex-grow px-4 py-2 text-white bg-transparent outline-none placeholder-gray-400"
            />
            <button
              onClick={handleSubmit}
              className="p-2 bg-green-600 rounded-full text-white hover:bg-green-700 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatLink;
