import { useRouter } from 'next/router';
import React from "react";
import Head from 'next/head';

function index() {

  const router = useRouter();
  function handleClick(route: string) {
    router.push(route);
  }
  

  return (
    <div className="container">
      <Head>
        <title>Ntuaflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
  
      <div className="top-bar">
        <h1 className="welcome">Welcome to Ntuaflix</h1>
      </div>
  
      <div className="options padding">
        <div className="card" onClick={() => handleClick('/login')}>
          <div className="card-content">Login</div>
        </div>
  
        <div className="card" onClick={() => handleClick('/signup')}>
          <div className="card-content">Sign Up</div>
        </div>
      </div>
  
      <style jsx>{`
        .container {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f0f0f0;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh; /* Center content vertically */
        }
  
        .top-bar {
          background-color: #0074d9; /* Blue color */
          color: #fff;
          padding: 10px;
          text-align: center;
          width: 100%;
        }
  
        .welcome {
          font-size: 24px;
          margin-bottom: 20px;
        }
  
        .options {
          display: flex;
          justify-content: center;
          gap: 40px;
        }

        .padding {
          padding-top: 50px;
        }
  
        .card {
          height: 200px; 
          background-color: rgba(0, 116, 217, 0.7); /* Light blue with transparency */
          border: 1px solid #ccc;
          border-radius: 10px;
          padding: 80px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          text-align: center;
          font-size: 20px;
          width: 300px; /* Adjust the card width as needed */
          cursor: pointer; /* Add pointer cursor for the entire card */
          transition: transform 0.2s ease; /* Add a smooth hover effect */
        }
  
        .card:hover {
          transform: scale(1.05); /* Scale up the card on hover */
        }
  
        .card a {
          text-decoration: none;
          color: #333;
          font-size: 18px; /* Make the text larger */
        }
  
        .button {
          background-color: transparent; /* Transparent background */
          color: #0074d9; /* Blue color for text */
          border: 1px solid #0074d9; /* Blue border */
          border-radius: 10px; /* Rounded corners */
          padding: 10px 20px;
          transition: background-color 0.2s ease, color 0.2s ease; /* Smooth hover effect */
          display: inline-block; /* Remove underline from the link */
        }
  
        .button:hover {
          background-color: #0074d9; /* Change background color on hover */
          color: #fff; /* Change text color on hover */
        }
      `}</style>
    </div>
  );
}

export default index
