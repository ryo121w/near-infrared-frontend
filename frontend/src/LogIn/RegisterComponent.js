import React, { useState } from 'react';
import axios from 'axios';

function RegisterComponent({ onAuthSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/create/', {
                username,
                email,
                password
            });

            if (response.status === 201) {
                console.log("Registration successful", response.data);
                onAuthSuccess();  // これを追加
            }

        } catch (error) {
            console.log("Registration failed", error);
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <input type="text" placeholder="New Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Register</button>
        </form>
    );
}

export default RegisterComponent;
