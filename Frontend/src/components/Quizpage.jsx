import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './QuizPage.css';

const Quiz = ({ quizData, onQuizSubmit }) => {
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleOptionChange = (topic, questionIndex, selectedOption) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [topic]: {
        ...prevAnswers[topic],
        [questionIndex]: selectedOption,
      },
    }));
  };

  const calculateResults = () => {
    let totalQuestions = 0;
    let correctAnswers = 0;

    Object.entries(quizData).forEach(([topic, data]) => {
      data.questions.forEach((question, index) => {
        totalQuestions += 1;
        if (userAnswers[topic] && userAnswers[topic][index] === question.answer) {
          correctAnswers += 1;
        }
      });
    });

    const accuracy = (correctAnswers / totalQuestions) * 100;
    return { totalQuestions, correctAnswers, accuracy };
  };

  const handleSubmit = () => {
    const results = calculateResults();
    setShowResults(true);
    onQuizSubmit(results);
  };

  return (
    <div className="quiz-container">
      {Object.entries(quizData).map(([topic, data], topicIndex) => (
        <div className="quiz-section" key={topicIndex}>
          <h2 className="quiz-title">{topic}</h2>
          {data.questions.map((questionData, index) => (
            <Question
              key={index}
              index={index}
              questionData={questionData}
              topic={topic}
              handleOptionChange={handleOptionChange}
            />
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
      {showResults && (
        <div className="results">
          <h2>Results</h2>
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Questions</td>
                <td>{calculateResults().totalQuestions}</td>
              </tr>
              <tr>
                <td>Correct Answers</td>
                <td>{calculateResults().correctAnswers}</td>
              </tr>
              <tr>
                <td>Accuracy</td>
                <td>{calculateResults().accuracy.toFixed(2)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const Question = ({ index, questionData, topic, handleOptionChange }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    handleOptionChange(topic, index, value);
  };

  return (
    <fieldset className="question-section">
      <div className="question-text">
        {index + 1}. {questionData.question}
      </div>
      <div className="options">
        {questionData.options.map((option, i) => (
          <label key={i} className="option-label">
            <input
              type="radio"
              className="option"
              name={`option${index}`}
              value={option}
              onChange={handleChange}
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
};

function QuizPage() {
  const { title } = useParams();
  const [quizData, setQuizData] = useState({});
  const [results, setResults] = useState(null);

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

  const handleQuizSubmit = (results) => {
    setResults(results);
  };

  return (
    <div className="App">
      {Object.keys(quizData).length > 0 && <Quiz quizData={quizData} onQuizSubmit={handleQuizSubmit} />}
      
    </div>
  );
}

export default QuizPage;