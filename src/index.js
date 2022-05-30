import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import firebase from "./utils/firebase";
import { getAnalytics } from "firebase/analytics";
import { BrowserRouter } from "react-router-dom";

getAnalytics(firebase);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
