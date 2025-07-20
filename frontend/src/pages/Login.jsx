// src/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  useEffect(() => {
  if (localStorage.getItem("token")) {
    navigate("/calendar");
  }
}, []);


  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      navigate("/calendar");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-bold">Login</h2>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full border p-2 rounded" required />
        <button className="w-full bg-green-600 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
}

export default Login;
