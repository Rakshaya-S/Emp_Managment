import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig.js";

function Login(props) {
    const [formData, setFormdata] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;
        setFormdata({
            ...formData,
            [name]: value,
        });
    }

    async function loginHandler(e) {
        e.preventDefault();
        setError(""); // Clear previous errors

        if (!formData.username || !formData.password) {
            setError("Please enter both username and password.");
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_LOGIN_URL}/login`,
                formData
            );

            console.log("Login API Response:", response.data); // Debugging line

            if (response.data.success && response.data.token) {
                props.isLogin(response); // Pass the response to the parent
                navigate("/welcome");
            } else {
                setError(response.data.message || "Invalid username or password.");
            }
        } catch (err) {
            console.error("Error during login:", err);
            setError("An error occurred while logging in. Please try again later.");
        }
    }

    return (
        <div className="glass-container">
            <form method="post" className="loginForm">
                <h1>Login</h1>
                <label>Username</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} />
                <label>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} />
                <button onClick={loginHandler}>Login</button>
            </form>
            <a href="/createuser" style={{ color: "white" }}>Create user</a>
            {error && <h1 style={{ color: "red" }} className="error">{error}</h1>}
        </div>
    );
}

export default Login;
