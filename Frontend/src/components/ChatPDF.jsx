import { useState, useEffect, useRef, useCallback, memo } from 'react';
import SplitPane from 'react-split-pane';
import { useAuth } from './AuthContext';
import Logo from './Logo';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { openDB } from 'idb';

const initDB = async () => {
  return openDB('pdfDatabase', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('pdfStore')) {
        db.createObjectStore('pdfStore', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

const getLastUploadedPDF = async () => {
  const db = await initDB();
  const transaction = db.transaction('pdfStore', 'readonly');
  const store = transaction.objectStore('pdfStore');
  const allFiles = await store.getAll();
  await transaction.done;
  if (allFiles.length) {
    const file = allFiles[allFiles.length - 1].file;
    return new Blob([file], { type: 'application/pdf' });
  }
  return null;
};

const PDFViewer = memo(({ pdfFile }) => {
  return (
    <div className='flex-grow'>
      {pdfFile && (
        <embed src={URL.createObjectURL(pdfFile)} width="100%" height="800px" type="application/pdf" />
      )}
    </div>
  );
});

function ChatPDF() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showread, setShowRead] = useState(true);
  const [lastUploadedPDF, setLastUploadedPDF] = useState(null);
  const ref = useRef(null);
  const chatContainerRef = useRef(null);

  const fetchLastUploadedPDF = useCallback(async () => {
    const file = await getLastUploadedPDF();
    setLastUploadedPDF(file);
  }, []);

  const handleSubmit = async () => {
    if (message.trim() === "") return;
    const newMessage = { text: message, type: 'question' };
    setChatHistory([...chatHistory, newMessage]);
    try {
      const response = await axios.post('http://localhost:5000/api/ask', { question: message });
      const botResponse = { text: response.data.answer, type: 'answer' };
      console.log(botResponse);
      setChatHistory(prevChatHistory => [...prevChatHistory, botResponse]);
    } catch (error) {
      console.error('Error getting the answer:', error);
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
    if (ref.current) {
      setShowRead(ref.current.scrollHeight > ref.current.clientHeight);
    }
  }, [chatHistory]);

  useEffect(() => {
    fetchLastUploadedPDF();
  }, [fetchLastUploadedPDF]);

  return (
    <>
      <style>
        {`
          .split-pane {
            position: relative;
          }
          .split-pane .Resizer {
            background: #555; /* Color of the resizer */
            width: 10px; /* Width of the resizer */
            cursor: col-resizer; /* Cursor style */
            z-index: 10;
          }
          .split-pane .Resizer:hover {
            background: grey; /* Change color on hover */
          }
          .no-scrollbar {
            overflow-y: hidden; /* Hides the vertical scrollbar */
            overflow-x: auto; /* Shows the horizontal scrollbar if needed */
          }
        `}
      </style>
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
            <SplitPane split="vertical" minSize={50} defaultSize="50%" className="split-pane">
              <div className='flex flex-grow items-start space-x-3'>
                <div className='p-2 rounded-lg bg-gray-800 text-white flex-grow '>
                  <PDFViewer pdfFile={lastUploadedPDF} width="100%" height="100%"/>
                </div>
              </div>
              <div className='h-[calc(100vh-168px)] w-full max-w-screen-lg mx-auto p-4 overflow-y-auto flex flex-col space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900'>
                {chatHistory.map((msg, index) => (
                  <div key={index} className='flex items-start space-x-3'>
                    {msg.type === 'question' ? (
                      <img src="/images/human.jpg" alt="Human" className="w-6 h-6 mt-1" />
                    ) : (
                      <img src="/images/logo.svg" alt="AI" className="w-6 h-6 mt-1" />
                    )}
                    {msg.type === 'question' ? (
                      <div className={`p-2 rounded-lg bg-white text-black`}>
                        <ReactMarkdown>
                          {typeof msg.text === 'string' ? msg.text : JSON.stringify(msg.text)}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className={`p-2 rounded-lg bg-gray-800 text-white`}>
                        <ReactMarkdown ref={ref}>
                          {isOpen ? (typeof msg.text === 'string' ? msg.text : JSON.stringify(msg.text)) : (typeof msg.text === 'string' ? msg.text.slice(0, 200) + '...' : JSON.stringify(msg.text).slice(0, 200) + '...')}
                        </ReactMarkdown>
                        {showread && (
                          <button onClick={() => setIsOpen(!isOpen)} className="text-blue-500">
                            Read {isOpen ? 'Less' : 'More'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </SplitPane>
          </div>
        </div>
        <div className='w-full fixed bottom-0 left-0 pb-2 bg-black' style={{ zIndex: 100 }}>
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

export default ChatPDF;
