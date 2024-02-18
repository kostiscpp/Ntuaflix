import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';


export default function Login() {
    const [error, setError] = useState('');
    const router = useRouter();
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setError(''); // Reset error message

        const data = {
            username: event.target.username.value,
            password: event.target.password.value
        };

        try {
            const response = await fetch('https://localhost:8080/api/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
                
            if (response.ok) {
                const result = await response.json();
                localStorage.setItem('access_token', result.token); 
                if (result.redirect === 'admin'){
                  router.push('/adminhome');
                }
                else{  
                  router.push('/homepage');
                }
                
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
            <title>Login - Ntuaflix</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
      
          <div className="top-bar">
            <h1 className="welcome">Login to Ntuaflix</h1>
          </div>
            <div className="padding">
            <form onSubmit={handleSubmit} className="form ">
            <input type="text" placeholder="Username" name="username" required />
            <input type="password" placeholder="Password" name="password" required />
            <button type="submit" className="button">Login</button>
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
}