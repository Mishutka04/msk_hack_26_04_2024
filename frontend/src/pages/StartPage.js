import React from "react";

export default function  StartPage({ currentUser, submitLogout }) {
    if (currentUser) {
        return (
          <div className="page-wrapper">
            <div className="main-container">
              <div className="content-wrapper">
                <div className="center">
                  <h2 className="title">Вы успешно вошли в аккаунт!</h2>
                  <form onSubmit={(e) => submitLogout(e)}>
                        <button type="submit" className="continue-btn">
                          Выйти
                        </button>
                      </form>
                </div>
              </div>
            </div>
          </div>
        );
      }
  }