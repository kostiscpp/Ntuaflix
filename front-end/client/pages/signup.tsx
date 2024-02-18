import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Signup() {
    const [error, setError] = useState('');
    const router = useRouter();
    const handleSignup = async (event: any) => {
        event.preventDefault();
        setError(''); // Reset error message

        const data = {
            username: event.target.username.value,
            password: event.target.password.value,
            first_name: event.target.first_name.value,
            last_name: event.target.last_name.value,
            birth_date: event.target.birth_date.value
        };

        try {
            const response = await fetch('https://localhost:8080/api/signup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
                
            if (response.ok) { 
                router.push('/homepage');
            } else {
                const result = await response.json();
                setError(result.message); // Display the error message from server
            }
            // If the credentials are correct, the server will redirect, and the browser will follow the redirect automatically.
            // No additional client-side logic is needed for successful login.
        } catch (error) {
            setError('An error occurred while trying to log in.');
        }
    };

    return (
        <div className="container">
          <Head>
            <title>Sign Up - Ntuaflix</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
      
          <div className="top-bar">
            <h1 className="welcome">Sign Up for Ntuaflix</h1>
          </div>
            <div className='padding'>
          <form onSubmit={handleSignup} className="form">
            <label>Username:</label>
            <input
              type="text"
              placeholder="Username"
              name="username"
              required
            />
      
            <label>Password:</label>
            <input
              type="password"
              placeholder="Password"
              name="password"
              required
            />
      
            <label>First Name:</label>
            <input
              type="text"
              placeholder="First Name"
              name="first_name"
              required
            />
      
            <label>Last Name:</label>
            <input
              type="text"
              placeholder="Last Name"
              name="last_name"
              required
            />
      
            <label>Birth Date:</label>
            <input
              type="date"
              name="birth_date"
              required
            />
      
            <button type="submit" className="button">
              Sign Up
            </button>
          </form>
          </div>
      
          {error && <p className="error">{error}</p>}
      
      <style jsx>{`
        .container {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-image: url('/background.jpg'); /* Path to your background image */
          background-size: cover;
          background-position: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
        }
  
        .top-bar {
          background-color: #0074d9;
          color: #fff;
          padding: 10px;
          text-align: center;
          width: 100%;
        }
  
        .welcome {
          font-size: 24px;
          margin-bottom: 20px;
        }
        .padding{
            padding-top: 50px;
        }
        .form {
          background-color: rgba(0, 116, 217, 0.7);
          border: 1px solid #ccc;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          text-align: center;
          width: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
  
        .form input {
          margin: 10px 0;
          padding: 10px;
          width: 100%;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
  
        .button {
          background-color: #0074d9;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          text-decoration: none;
        }
  
        .error {
          color: red;
        }
      `}</style>
        </div>
      );
      
};


