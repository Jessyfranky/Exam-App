import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from "./App.js";
import { GoogleOAuthProvider } from "@react-oauth/google";



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="CLIENT1">
    <App />
  </GoogleOAuthProvider>,
);
