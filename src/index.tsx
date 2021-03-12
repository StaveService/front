import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import axios from "axios"
import "./index.css"

switch (process.env.NODE_ENV) {
  case "development":
    axios.defaults.baseURL = "http://localhost:3000"
    break
  case "production":
    axios.defaults.baseURL = ""
    break
  default:
    axios.defaults.baseURL = "http://localhost:3000"
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
