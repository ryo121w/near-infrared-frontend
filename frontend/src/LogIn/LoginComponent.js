import React, { useState } from 'react';
import axios from 'axios';

function LoginComponent({ onSuccessfulLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");




    const BASE_API_URL = "http://localhost:8000/";




    const handleLogin = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post(`${BASE_API_URL}api/user_login/`, {
                username,
                password
            });
            if (response.status === 200) {
              onSuccessfulLogin();
            }

        } catch (error) {
            console.log("Login failed", error);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Login</button>
        </form>
    );
}

export default LoginComponent;
