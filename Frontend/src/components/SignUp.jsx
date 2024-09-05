import React, { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { TextField } from "./FormComponents";
import Logo from "./Logo";

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/signup', {
        name,
        email,
        password,
      });

      // Handle successful response (e.g., show success message, redirect user)
      console.log('Signup successful:', response.data);
      setSuccess(true);
      setError(null);
    } catch (error) {
      // Handle error response
      console.error('Error signing up:', error);
      setError('Signup failed. Please try again.');
      setSuccess(false);
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
          <h1 className="font-bold text-2xl">Create Account</h1>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">Signup successful!</p>}
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
            <TextField
              id="name"
              type="text"
              label="Name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
            <TextField
              id="cpassword"
              type="password"
              label="Confirm Password"
              placeholder="re-Enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

export default SignUp;
