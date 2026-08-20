import { useState } from "react";
import { login } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

function Login({ onLoginSuccess }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { loginUser } = useAuth();

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");

        try {

            const response = await login(username, password);

            loginUser(
                response.data.accessToken,
                response.data.refreshToken
            );

            onLoginSuccess(
                response.data.accessToken,
                response.data.refreshToken
            );

        } catch (error) {

            console.error("Login error:", error);

            setError("Invalid username or password");
        }
    };

    return (
        <div className="login-container">

            <div className="login-card">

                <h1>SentinelCore</h1>

                <p className="login-subtitle">
                    Enterprise Security Operations Platform
                </p>

                <h2>Login</h2>

                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Username</label>

                        <input
                            type="text"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            placeholder="Enter username"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter password"
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="login-button"
                    >
                        Log In
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;