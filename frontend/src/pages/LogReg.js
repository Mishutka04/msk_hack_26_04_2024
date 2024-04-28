import React from "react";

export default function LoginRegistration({
    email,
    username,
    password,
    update_form_btn,
    submitRegistration,
    submitLogin,
    registrationToggle,
    setEmail,
    setPassword,
    setUsername,
  }) {
    return (
        <div className="page-wrapper">
          <div className="main-container">
            <div className="content-wrapper">
            <div className="title-wrapper">
            <button
            id="logreg_toggle"
            onClick={update_form_btn}
            className="is-it-even_a"
            >Войти
            </button>
            </div>
              {registrationToggle ? (
                <div className="auth-container">
                  <form onSubmit={(e) => submitRegistration(e)}>
                    <div className="input-wrapper">
                      <label htmlFor="email" className="input-label">
                        Адрес электронной почты
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="email-input"
                      />
                    </div>
                    <div className="input-wrapper">
                      <label htmlFor="username" className="input-label">
                        Имя пользователя
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="email-input"
                      />
                    </div>
                    <div className="input-wrapper">
                      <label htmlFor="password" className="input-label">
                        Пароль
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="email-input"
                      />
                    </div>
                    <button type="submit" className="continue-btn">
                      Зарегистрироваться
                    </button>
                  </form>
                </div>
              ) : (
                <div className="auth-container">
                  <form onSubmit={(e) => submitLogin(e)}>
                    <div className="input-wrapper">
                      <label htmlFor="username" className="input-label">
                        Имя пользователя
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="email-input"
                      />
                    </div>
                    <div className="input-wrapper">
                      <label htmlFor="password" className="input-label">
                        Пароль
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="email-input"
                      />
                    </div>
                    <button type="submit" className="continue-btn">
                      Войти
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      );
  }