import  { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './QuizPage.css';


const Quiz = ({ quizData }) => {
  return (
    <div className="quiz-container">
      {Object.entries(quizData).map(([topic, data], topicIndex) => (
        <div className="quiz-section" key={topicIndex}>
          <h2 className="quiz-title">{topic}</h2>
          {data.questions.map((questionData, index) => (
            <Question key={index} index={index} questionData={questionData} />
          ))}
        </div>
      ))}
    </div>
  );
};

const Question = ({ index, questionData }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [status, setStatus] = useState('');

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const checkAnswer = () => {
    if (selectedOption === questionData.answer) {
      setStatus('Correct Answer');
    } else {
      setStatus('Wrong Answer');
    }
  };

  return (
    <fieldset className="question-section">
      <div className="question-text">
        {index + 1}. {questionData.question}
      </div>
      <div className="options">
        {questionData.options.map((option, i) => (
          <div key={i}>
            <input
              type="radio"
              className={`option`}
              name={`option${index}`}
              value={option}
              onChange={handleOptionChange}
            />
            <label>{option}</label>
          </div>
        ))}
        <br />
        <button type="button" onClick={checkAnswer}>
          Submit
        </button>
        <p className={`status ${status === 'Correct Answer' ? 'correct' : 'wrong'}`}>
          {status}
        </p>
      </div>
    </fieldset>
  );
};


function QuizPage() {
  const { title } = useParams();
  const [quizData, setQuizData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/topic/${title}/quiz`, {
          withCredentials: true
        });
        console.log(response.data);
        setQuizData(response.data);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      }
    };
  
    if (title) {
      fetchData();
    }
  }, [title]);

  return (
    <div className="App">
      {Object.keys(quizData).length > 0 && <Quiz quizData={quizData} />}
    </div>
  );
}

export default QuizPage;