"use client"

import React, { useState } from "react";
import { toast } from "react-toastify";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
  getData: () => {},
  postData: () => {},
  deleteData: () => {},
  userFullName: "",
});
const calcRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();
  const remainingDuration = adjExpirationTime - currentTime;
  return remainingDuration;
};
export const AuthContextProvider = (props) => {
  const baseUrl = process.env.REACT_APP_API_ENDPOINT;
  const [token, setToken] = useState(localStorage.getItem("token"));
  const userIsLoggedIn = !!token;

  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || {}
  );

  const loginHandler = (tkn, expirationTime, usrData) => {
    setToken(tkn);
    localStorage.setItem("token", tkn);
    setUserData(usrData);
    localStorage.setItem("userData", JSON.stringify(usrData));

    const remainingTime = calcRemainingTime(expirationTime);
    setTimeout(logoutHandler, remainingTime);
  };
  const logoutHandler = () => {
    if (token) {
      fetch(baseUrl + "/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      })
        .then((j) => j.json())
        .then((data) => {
          toast.info(data.message);
        })
        .catch((err) => toast.error(err.message));
    }

    setUserData({});
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
  };
  const tokenExpired = () => {
    const parsedToken = parseJwt(token);
    const d = new Date();
    let time = Math.floor(d.getTime()/1000);
    
    if(time > parsedToken.exp) {
      setToken();
    }
  }
  const getDataHandler = (url, contentType = "application/json") => {
    
    if (tokenExpired()) return false;
    
    if (contentType === "application/json") {
      return fetch(baseUrl + url, {
        method: "GET",
        headers: {
          "Content-Type": contentType,
          token: token,
        },
      }).then((j) => j.json());
    } else {
      return fetch(baseUrl + url, {
        method: "GET",
        headers: {
          "Content-Type": contentType,
          token: token,
        },
      });
    }
  };
  const postDataHandler = (url, params) => {
    if (tokenExpired()) return false;

    return fetch(baseUrl + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify(params),
    }).then((j) => j.json());
  };
  const deleteDataHandler = (url) => {
    if (tokenExpired()) return false;
    
    return fetch(baseUrl + url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    })
      .then((j) => j.json())
      .catch((err) => toast.error(err.message));
  };
  
  const contextValue = {
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    getData: getDataHandler,
    postData: postDataHandler,
    deleteData: deleteDataHandler,
    userFullName: userData.userFullName,
  };
  const parseJwt = () => {
    if (token == null) return {};
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
