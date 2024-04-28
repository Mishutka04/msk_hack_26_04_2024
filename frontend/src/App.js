import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ChatApp from './components/ChatApp';
import AuthLogic from './components/AuthLogic';
import LoginRegistration from './pages/LogReg';
import StartPage from './pages/StartPage';
import './assets/bootstrap/css/bootstrap.min.css';
import './assets/fonts/fontawesome-all.min.css';
import './assets/css/Login-Form-Basic-icons.css';
import DataVisualization from './DataVisualization';

const App = () => {
  const {
    email,
    registrationToggle,
    username,
    password,
    update_form_btn,
    submitRegistration,
    submitLogin,
    setEmail,
    setPassword,
    setUsername,
    currentUser,
    submitLogout,
  } = AuthLogic();

  return (
    <Router>
      <Routes>
        {/* <Route
          path="/"
          element={
            currentUser ? (
              <StartPage currentUser={currentUser} submitLogout={submitLogout} />
            ) : (
              <LoginRegistration
                email={email}
                registrationToggle={registrationToggle}
                username={username}
                password={password}
                update_form_btn={update_form_btn}
                submitRegistration={submitRegistration}
                submitLogin={submitLogin}
                setEmail={setEmail}
                setPassword={setPassword}
                setUsername={setUsername}
              />
            )
          }
        /> */}
        <Route path="/visualization" element={<DataVisualization />} />
          <Route path="/chat" element={currentUser ? <ChatApp currentUser={currentUser} /> : null} />
      </Routes>
    </Router>
  );
};

export default App;