import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TopicPage.css'; // Importing custom styles

const TopicPage = () => {
  const { topic } = useParams();
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/topic/${topic}`, { withCredentials: true });
        setContent(response.data.description);
        console.log(response);
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContent();
  }, [topic]);

  const handleQuizClick = async () => {
    try {
      navigate(`/topic/${topic}/quiz`);
    } catch (error) {
      console.error('Error starting quiz:', error);
    }
  };

  return (
    <div className="topic-page">
      <div className="content-box">
        <h1 className="topic-title">{topic}</h1>
        <p>{content}</p>
        <button className="quiz-button" onClick={handleQuizClick}>Start Quiz</button>
      </div>
    </div>
  );
};

export default TopicPage;