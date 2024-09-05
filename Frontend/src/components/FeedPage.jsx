import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './FeedPage.css';

const FeedPage = () => {
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState('');
  const [newLevel, setNewLevel] = useState('');
  const [username, setUsername] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.name) {
      localStorage.setItem('username', user.name);
    }

    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/feed', {
          withCredentials: true
        });
        console.log('Response from /feed:', response.data);
        setTopics(response.data.topics || []);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    fetchData();
  }, [user]);

  const handleTopicClick = (topic) => {
    navigate(`/topic/${topic}`);
  };

  const handleAddTopic = async () => {
    try {
      const levelToSubmit = newLevel.trim() === '' ? 'Basics' : newLevel;
      const response = await axios.post('http://localhost:5000/feed', {
        topic: newTopic,
        level: levelToSubmit
      }, {
        withCredentials: true
      });
      console.log('Response from POST /feed:', response.data);
      setTopics([...topics, response.data]);
      setNewTopic('');
      setNewLevel('');
      window.location.reload();
    } catch (error) {
      console.error('Error adding topic:', error);
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="feed-page">
      <header>
        <button className="home-button" onClick={handleHomeClick}>Home</button>
        <button className="welcome-button">Welcome {username}</button>
      </header>
      <h2 style={{ textAlign: 'center', fontSize: '50px' }}>Your Feeds</h2>
      <div className="feeds">
        {topics.length > 0 ? (
          topics.map((topic, index) => (
            <div key={index} className="feed-box" onClick={() => handleTopicClick(topic.topic)}>
              <div>{topic.topic}</div>
              <div>{topic.description}</div>
            </div>
          ))
        ) : (
          <div>No topics available</div>
        )}
      </div>
      <div className="add-topic">
        <input
          type="text"
          placeholder="Feed Title"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
        />
        <input
          type="text"
          placeholder="Level"
          value={newLevel}
          onChange={(e) => setNewLevel(e.target.value)}
        />
        <button onClick={handleAddTopic}>+</button>
      </div>
    </div>
  );
};

export default FeedPage;