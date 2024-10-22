import React from 'react';
import Desktop from './pages/Desktop';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Logo from './components/Logo';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { AuthProvider } from './components/AuthContext';
import Bot from './components/Bot';
import DocumentPage from './components/DocumentPage';
import Upload from './components/Upload';
import ChatPDF from './components/ChatPDF';
import TopicPage from './components/TopicPage';
import FeedPage from './components/FeedPage';
import QuizPage  from './components/Quizpage';
import ChatLink from './components/ChatLink';
import ChatImg from './components/ChatImg'


const App = () => {
  return (
    <div>
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Desktop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<SignUp />} />
          <Route path="/bot" element={<Bot/>} />
          <Route path="/document" element={<DocumentPage/>} />
          <Route path="/upload" element={<Upload/>} />
          <Route path="/chat-pdf" element={<ChatPDF/>} />
          <Route path="/topic/:topic" element={<TopicPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/chatLink" element={<ChatLink />} />
          <Route path="/topic/:title/quiz" element={<QuizPage />} />
          <Route path="/chat-img" element={<ChatImg />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </div>
  );
};

export default App;


