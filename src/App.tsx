import React from 'react';
import axios from "axios"

switch (process.env.NODE_ENV) {
  case 'development':
    axios.defaults.baseURL = 'http://localhost:3000/api';
    break;
  case 'production':
    axios.defaults.baseURL = 'https://reword-web.herokuapp.com/api';
    break;
  default:
    axios.defaults.baseURL = 'http://localhost:3000/api';
}

function App() {
  return (
    <div className="App">
    </div>
  );
}

export default App;
