import React, { useState } from "react";
import InputBox from "../component/ui/InputBox";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { toast } from "react-toastify";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

interface LoginProps {
    onShowRegister: () => void;
    onHide: () => void;
}

const Login: React.FC<LoginProps> = ({ onHide, onShowRegister }) => {
    const { login } = useAuth()
    const handleLoginClick = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleLogin = async () => {
        try {
            if (!email && !password) {
                return;
            }
            const formData = new URLSearchParams();
            formData.append("username", email);
            formData.append("password", password);
            const response = await axios.post(`${API_BASE_URL}/auth/login`, formData, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            if (response.status === 200) {
                const data = response.data
                localStorage.setItem("token", data.access_token);
                const { access_token } = response.data;
                localStorage.setItem("token", access_token);
                api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
                const res = await api.get(`/user/${email}`);
                const userData = res.data;
                login(userData);
                localStorage.setItem("user", JSON.stringify(userData));
                localStorage.setItem("email", userData.email);
                localStorage.setItem("userId", userData.id);
                toast.success("Login successful!");
                onHide()
            }

        } catch (error: any) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                toast.error("Email or password is incorrect.");
            } else {
                toast.error("Unable to process the request. Please try again later.");
            }
        }
    };


    return (
        <div className="p-3">
            <form onSubmit={handleLoginClick}>
                <div className="mb-3">
                    <InputBox
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <InputBox
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="d-flex justify-content-center">
                    <button type="submit" className="btn btn-primary px-5" onClick={handleLogin}>
                        Login
                    </button>
                </div>

                <div className="text-center mt-3">
                    Don’t have an account?{" "}
                    <a href="#" className="text-decoration-none" onClick={onShowRegister}>
                        Register
                    </a>
                </div>
            </form>
        </div>
    );
};

export default Login;
