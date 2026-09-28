import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/authApi";
import "./Login.css";

function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setSubmitting(true);

        try {
            await register(username.trim(), email.trim(), password);
            navigate("/login", {
                replace: true,
                state: { message: "Account created successfully. Please sign in." }
            });
        } catch (err) {
            console.error("Registration error:", err);
            setError(
                typeof err.response?.data === "string"
                    ? err.response.data
                    : err.response?.data?.message || "Unable to create account."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-brand">
                    <div className="login-logo">S</div>
                    <div>
                        <h1>SentinelCore</h1>
                        <span>Security Operations Platform</span>
                    </div>
                </div>

                <div className="login-heading">
                    <h2>Create viewer account</h2>
                    <p>Register a new account with read-only access to SentinelCore.</p>
                </div>

                {error && <div className="login-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="register-username">Username</label>
                        <input
                            id="register-username"
                            type="text"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            placeholder="Choose a username"
                            autoComplete="username"
                            minLength={3}
                            maxLength={50}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="register-email">Email</label>
                        <input
                            id="register-email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Enter email address"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="register-password">Password</label>
                        <input
                            id="register-password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="At least 6 characters"
                            autoComplete="new-password"
                            minLength={6}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="register-confirm-password">Confirm Password</label>
                        <input
                            id="register-confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            placeholder="Re-enter password"
                            autoComplete="new-password"
                            minLength={6}
                            required
                        />
                    </div>

                    <button className="login-button" type="submit" disabled={submitting}>
                        {submitting ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <div className="login-register">
                    <span>Already have an account?</span>
                    <Link to="/login">Back to sign in</Link>
                </div>

                <p className="login-footer">New accounts are created with Viewer access</p>
            </div>
        </div>
    );
}

export default Register;
