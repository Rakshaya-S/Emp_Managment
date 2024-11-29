import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login.js";
import Welcome from "./pages/Welcome.js";
import CreateUser from "./pages/CreateUser.js";

function App() {
  const [isLoggedIn, setLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setLogin(true); // Set login state if token exists
    }
  }, []);

  function handleLogin(response) {
    console.log(response); 
    if (response && response.data && response.data.token) {
      localStorage.setItem("authToken", response.data.token); // Store token
      setLogin(true); // Update state to reflect successful login
  } else {
      console.error("Invalid login response:", response);
      alert("Login failed. Please try again."); // Notify the user
  }
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login isLogin={handleLogin} />} />
        <Route
          path="/welcome"
          element={isLoggedIn ? <Welcome isLogged={setLogin} /> : <Navigate to="/" />}
        />
        <Route path="/createuser" element={<CreateUser isLogged={handleLogin} />} />
      </Routes>
    </Router>
  );
}

export default App;
