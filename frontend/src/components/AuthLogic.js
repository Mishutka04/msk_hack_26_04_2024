import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000/"
});

function AuthLogic() {
  const [currentUser, setCurrentUser] = useState(null);
  const [registrationToggle, setRegistrationToggle] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Check if the user's information is stored in local storage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      // If not, fetch the user's information from the server
      client.get("/auth/user")
        .then(function(res) {
          setCurrentUser(res.data);
          // Store the user's information in local storage
          localStorage.setItem('currentUser', JSON.stringify(res.data));
        })
        .catch(function(error) {
          setCurrentUser(null);
        });
    }
  }, []);

  function update_form_btn() {
    if (registrationToggle) {
      document.getElementById("logreg_toggle").innerHTML = "Войти";
      setRegistrationToggle(false);
    } else {
      document.getElementById("logreg_toggle").innerHTML = "Зарегистрироваться";
      setRegistrationToggle(true);
    }
  }

  function submitRegistration(e) {
    e.preventDefault();
    client.post(
      "/auth/register",
      {
        email: email,
        username: username,
        password: password
      }
    ).then(function(res) {
      client.post(
        "/auth/login",
        {
          username: username,
          password: password
        }
      ).then(function(res) {
        setCurrentUser(res.data);
        localStorage.setItem('currentUser', JSON.stringify(res.data));
      });
    });
  }

  function submitLogin(e) {
    e.preventDefault();
    client.post(
      "/auth/login",
      {
        username: username,
        password: password
      }
    ).then(function(res) {
      setCurrentUser(res.data);
      localStorage.setItem('currentUser', JSON.stringify(res.data));
    });
  }

  function submitLogout(e) {
    e.preventDefault();
    client.post(
      "/auth/logout",
      { withCredentials: true }
    ).then(function(res) {
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
    });
  }

  return {
    currentUser,
    registrationToggle,
    email,
    username,
    password,
    update_form_btn,
    submitRegistration,
    submitLogin,
    submitLogout,
    setEmail,
    setUsername,
    setPassword
  };
}

export default AuthLogic;