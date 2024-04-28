import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../ChatApp.css';
import '../assets/bootstrap/css/bootstrap.min.css'
import '../assets/fonts/fontawesome-all.min.css'
import '../assets/css/Login-Form-Basic-icons.css'
import { useNavigate } from 'react-router-dom';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000/"
});


const ChatApp = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [currentUser, setCurrentUser] = useState();
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [newMessageSent, setNewMessageSent] = useState(false);
  const [totalMessages, setTotalMessages] = useState(0);
  // const [questions, setQuestions] = funcQuestion([]);

  let mapCounter = 0;
  let raz = 1;
  let dva = 2; 
  let systemMessageCounter = 0;
  let questionString = '';
  let systemMessage = '';
  let systemName = 'Бот Андрей';
  let queryQuestion = [];

  const navigate = useNavigate();

  const handleDataVisualizationClick = () => {
    navigate('/visualization');
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log(currentQuestionIndex);
        const questionResponse = await client.get(`/feedback/question/1/${currentQuestionIndex}`);
        console.log(questionResponse.data);
  
        // Check if the response has any data
        if (questionResponse.data.length > 0) {
          // Update the questions state
          setQuestions((prevQuestions) => [
            ...prevQuestions,
            {
              id: questionResponse.data[0].id,
              question: questionResponse.data[0].question,
              type: 'question',
            },
          ]);
        } else {
          console.error('No questions found in the response');
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
  
    fetchQuestions();
  }, [client, currentQuestionIndex, setQuestions]);
  
  useEffect(() => {
    if (newMessageSent) {
      const fetchMessages = async () => {
        try {
          const messageResponse = await client.get('/feedback/answer/1');
          setTotalMessages(messageResponse.data.length);
  
          // Check if there are any new messages
          const newMessages = messageResponse.data.filter((msg) => !messages.some((m) => m.id === msg.id)).map((msg) => ({
            id: msg.id,
            user: msg.user,
            answer: msg.answer,
            type: 'message',
          }));
  
          // Update the messages state only if there are new messages
          if (newMessages.length > 0) {
            setMessages((prevMessages) => [...prevMessages, ...newMessages]);
          }
          setNewMessageSent(false);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      fetchMessages();
    }
  }, [client, messages, newMessageSent, setMessages]);
  
  const handleSendMessage = async () => {
    if (message.trim() !== '') {
      await client.post('/feedback/answer/', { "answer": message, "informative": false, "positive": false, "question": 1, "objects_class": 0, "user": 1 });
      setMessage('');
      setNewMessageSent(true);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };


  const handleKeyPress = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      handleSendMessage();
    }
  };

  return (
    <div
      className="d-inline-flex flex-column justify-content-center align-items-center"
      style={{
        width: '100%',
        height: '100%',
        background: '#212529',
      }}
    >
      <div
        className="d-flex flex-row justify-content-start align-content-center flex-wrap"
        style={{
          width: '100%',
          height: '8%',
          marginLeft: '0px',
          position: 'fixed',
          background: '#212529',
          top: '0',
          left: '0',
          zIndex: '1000',
          borderBottom: '1px solid',
          borderColor: 'rgba(125,125,125,0.5)',
        }}
      >
        <button
          className="btn btn-primary d-flex justify-content-center align-items-center align-content-center align-self-center"
          type="button"
          onClick={handleDataVisualizationClick}
          style={{
            height: '50px',
            background: 'rgb(252,224,79)',
            color: 'rgb(0,0,0)',
            width: '50px',
            marginLeft: '100px',
            paddingLeft: '8px',
            paddingTop: '8px',
            paddingBottom: '8px',
            paddingRight: '8px',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            style={{
              fontSize: '50px',
              background: 'rgb(252,224,79)',
              borderRadius: '10px',
              marginLeft: '0px',
              marginTop: '0px',
              width: '45px',
              border: '1px none var(--bs-secondary)',
              padding: '5',
              height: '45px',
            }}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16 9C16 11.2091 14.2091 13 12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9ZM14 9C14 10.1046 13.1046 11 12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9Z"
              fill="currentColor"
            ></path>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 14.0902 3.71255 16.014 4.90798 17.5417C6.55245 15.3889 9.14627 14 12.0645 14C14.9448 14 17.5092 15.3531 19.1565 17.4583C20.313 15.9443 21 14.0524 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12ZM12 21C9.84977 21 7.87565 20.2459 6.32767 18.9878C7.59352 17.1812 9.69106 16 12.0645 16C14.4084 16 16.4833 17.1521 17.7538 18.9209C16.1939 20.2191 14.1881 21 12 21Z"
              fill="currentColor"
            ></path>
          </svg>
        </button>
      </div>
      <main
        className="d-flex flex-column justify-content-end"
        style={{
          height: '85%',
          width: '55%',
        }}
      >
        {[...messages, ...questions]
          .sort((a, b) => a.id - b.id)
          .slice(0, totalMessages)
          .map((item, index) => (
            <div
              className={`d-flex flex-row justify-content-${
                item.type === 'message' ? 'start' : 'end'
              }`}
              style={{
                height: 'fit-content',
                marginBottom: '50px',
              }}
              key={index}
            >
              {item.type === 'message' ? (
                <div
                  style={{
                    height: '100%',
                    width: 'fit-content',
                  }}
                >
                  <div
                    style={{
                      borderRadius: '6px',
                      marginLeft: '0',
                      padding: '5px',
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{
                        fontSize: '50px',
                        background: 'rgb(252,224,79)',
                        borderRadius: '10px',
                        marginLeft: '0px',
                        marginRight: '10px',
                        marginTop: '0px',
                        width: '50px',
                        border: '1px none var(--bs-secondary)',
                        padding: '5',
                        height: '50px',
                      }}
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M16 9C16 11.2091 14.2091 13 12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9ZM14 9C14 10.1046 13.1046 11 12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9Z"
                        fill="currentColor"
                      ></path>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 14.0902 3.71255 16.014 4.90798 17.5417C6.55245 15.3889 9.14627 14 12.0645 14C14.9448 14 17.5092 15.3531 19.1565 17.4583C20.313 15.9443 21 14.0524 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12ZM12 21C9.84977 21 7.87565 20.2459 6.32767 18.9878C7.59352 17.1812 9.69106 16 12.0645 16C14.4084 16 16.4833 17.1521 17.7538 18.9209C16.1939 20.2191 14.1881 21 12 21Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                </div>
              ) : (
                <>
                <div
                  style={{
                    height: '100%',
                    width: 'fit-content',
                  }}
                ><div
                style={{
                  borderRadius: '6px',
                  marginLeft: '0',
                  padding: '5px',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{
                    fontSize: '50px',
                    background: 'rgb(252,224,79)',
                    borderRadius: '10px',
                    marginLeft: '0px',
                    marginRight: '10px',
                    marginTop: '0px',
                    width: '50px',
                    border: '1px none var(--bs-secondary)',
                    padding: '5',
                    height: '50px',
                  }}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16 9C16 11.2091 14.2091 13 12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9ZM14 9C14 10.1046 13.1046 11 12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9Z"
                    fill="currentColor"
                  ></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 14.0902 3.71255 16.014 4.90798 17.5417C6.55245 15.3889 9.14627 14 12.0645 14C14.9448 14 17.5092 15.3531 19.1565 17.4583C20.313 15.9443 21 14.0524 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12ZM12 21C9.84977 21 7.87565 20.2459 6.32767 18.9878C7.59352 17.1812 9.69106 16 12.0645 16C14.4084 16 16.4833 17.1521 17.7538 18.9209C16.1939 20.2191 14.1881 21 12 21Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              </div>
              </>)}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  color: 'white',
                }}
              >
                {item.type === 'message' ? (
                  <>
                    <div
                      style={{
                        width: '100%',
                        height: '50px',
                      }}
                      key={item.id}
                    >{item.user}</div>
                    <div
                      style={{
                        height: 'fit-content',
                        width: '80%',
                        wordWrap: 'break-word',
                      }}
                      key={`${item.id}-${index}-answer`}
                    ><p style={{ overflowWrap: 'break-word' }}>{item.answer}</p></div>
                  </>
                ) : (
                <>
                <div
                    style={{
                      width: '100%',
                      height: '50px',
                    }}
                  >{item.id}</div>
                  <div
                    style={{
                      height: 'fit-content',
                      width: '100%',
                    }}
                  ><p style={{ overflowWrap: 'break-word' }}>{item.question}</p>
                  </div>
                </>
                )}
              </div>
            </div>
          ))}
      </main>
      <div
        className="d-inline-flex flex-row justify-content-center"
        style={{
          height: '7%',
          paddingBottom: '0px',
          width: '100%',
          marginBottom: '0px',
          position: 'fixed',
          bottom: '0',
          left: '0',
          zIndex: '1000',
          background: '#212529',
          borderTop: '1px solid',
          borderColor: 'rgba(125,125,125,0.5)',
        }}
      >
        <div
          className="d-inline-flex flex-row justify-content-center"
          style={{
            width: '60%',
          }}
        >
          <textarea
            className="form-control-lg d-inline-flex align-self-center"
            style={{
              width: '80%',
              background: 'var(--bs-body-color)',
              borderStyle: 'solid',
              borderColor: 'rgb(125,125,125)',
              color: 'rgb(255,255,255)',
              alignItems: 'center',
              overflow: 'auto',
              marginBottom: '0px',
              fontSize: '15px',
              height: '52px',
              padding: '13px 16px',
              overflow: 'hidden',
              resize: 'none',
            }}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Введите сообщение"
            roclient="1"
          ></textarea>
          <button
            className="btn btn-primary d-flex justify-content-center align-items-center align-content-center align-self-center"
            type="button"
            style={{
              height: '50px',
              background: 'rgb(252,224,79)',
              color: 'rgb(0,0,0)',
              width: '50px',
              marginLeft: '15px',
              paddingLeft: '8px',
              paddingTop: '8px',
              paddingBottom: '8px',
              paddingRight: '8px',
            }}
            onClick={handleSendMessage}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              fill="none"
              style={{
                fontSize: '50px',
                background: 'rgba(255,255,255,0)',
                borderRadius: '10px',
                marginLeft: '0px',
                marginTop: '0px',
                width: '50px',
                border: '1px none var(--bs-secondary)',
              }}
            >
              <path
                d="M7.41421 5L6 6.41421L11.6569 12.0711L6 17.7279L7.41421 19.1421L14.4853 12.0711L7.41421 5Z"
                fill="currentColor"
              ></path>
              <path
                d="M16.3432 19V5H18.3432V19H16.3432Z"
                fill="currentColor"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

}

export default ChatApp;