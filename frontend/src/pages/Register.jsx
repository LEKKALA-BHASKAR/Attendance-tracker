import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
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
      await axios.post("https://attendance-tracker-bktf.onrender.com/api/auth/register", formData);
      alert("Registered! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-bold">Register</h2>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full border p-2 rounded" required />
        <button className="w-full bg-blue-500 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
}

export default Register;
