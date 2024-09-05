import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Button } from "@/components/ui/button";
import { TextField } from "./FormComponents";
import Logo from "./Logo";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      }, {
        withCredentials: true
      });

      const userName = response.data.name;
      setUser({ name: userName });

      // Handle successful response (e.g., save token, redirect user)
      console.log('Login successful:', response.data);
      navigate('/feed'); // Navigate to dashboard page
    } catch (error) {
      // Handle error response
      console.error('Error logging in:', error);
      setError('Invalid email or password');
    }
  };

  return (
    <>
      <Logo />
      <div className="bg-[#5878d8] h-screen flex p-12">
        <div className="flex-[3] flex items-center justify-center bg-[#96B9F9] rounded-l-md">
          <img className="absolute left-36" src="/images/login.svg" alt="Login Illustration" />
        </div>
        <div className="flex-[5] flex flex-col items-center justify-center bg-[#FFFFFF] rounded-r-md">
          <h1 className="font-bold text-2xl">Login</h1>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
            <TextField
              id="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              id="password"
              type="password"
              label="Password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="bg-[#5878d8] my-3 hover:bg-[rgb(64,84,172)] transition-all duration-300 rounded-lg text-black">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
