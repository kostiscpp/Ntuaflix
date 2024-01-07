import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const WatchLaterPage = () => {
    const [movies, setMovies] = useState<string[]>([]);
    const router = useRouter();
    const home = () => {
        router.push('/homepage');
    }

    const logout = async () => {
      try{
          const response = await fetch('http://localhost:8080/api/logout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
          });
          const data = await response.json();
          if (data.success) {
              router.push('/');
          } else {
              console.log("failure");
          }
      }catch(e){
          console.log(e);
      }
  }

    const fetchWatchLater = async () => {
        try{
            const response = await fetch('http://localhost:8080/api/watchlaterlist', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            });
        const data = await response.json();
        setMovies(data);
        }catch(e){
            console.log(e);
        } 
    };

    useEffect(() => {
        fetchWatchLater();
    });

    const handleWatchedClick = async (movie: string) => {
        try{
            const response = await fetch('http://localhost:8080/api/watchLaterChange', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({movie: movie}),
            });
            const data = await response.json();
            if (data.success) {
                console.log("success");
            } else {
                console.log("failure");
            }
        }catch(e){
            console.log(e);
        }

        fetchWatchLater();
    };

    return (
        <div className="container">
          <Head>
            <title>Ntuaflix - Watch Later</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className="top-bar">
            <div className="top-left" onClick={home}>
                Ntuaflix
            </div>
            <div className="top-center">
                Watch Later
            </div>
            <div className="top-right" onClick={logout}>
                Logout
            </div>
        </div>
      
          <div className="movie-container">
            {movies.map((movie, index) => (
              <div key={index} className="movie-box">
                <div className="movie-text">
                  <h2>{movie}</h2>
                </div>
                <div className="movie-buttons">
                  <button onClick={() => handleWatchedClick(movie)} className="watched-button">Watched</button>
                </div>
              </div>
            ))}
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
            }
            

            .top-bar {
                background-color: #0074d9; /* Blue color */
                color: #fff;
                padding: 10px;
                text-align: left;
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                max-width: 1200px;
                margin: 0 auto;
            }

            .top-left {
                flex: 1;
                font-size: 24px;
                cursor: pointer;
            }
            .top-center {
                flex: 1;
                text-align: center;
                font-size: 24px;
            }

            .top-right {
                flex: 1;
                text-align: right;
                font-size: 24px;
                cursor: pointer;
            }
      
            .movie-container {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 20px;
              max-width: 1200px;
              margin: 20px auto;
            }
      
            .movie-box {
              background-color: #fff;
              border: 1px solid #ccc;
              border-radius: 5px;
              padding: 20px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 300px;
            }
      
            .movie-text {
              flex: 1;
            }
      
            .movie-text h2 {
              font-size: 18px;
              margin-bottom: 5px;
            }
      
            .movie-buttons {
              display: flex;
              flex-direction: column;
            }
      
            .watched-button {
              background-color: #0074d9; /* Blue color */
              color: #fff;
              border: none;
              padding: 5px 10px;
              border-radius: 5px;
              cursor: pointer;
              text-decoration: none;
              margin: 5px 0;
            }
          `}</style>
        </div>
      );
      
};

export default WatchLaterPage;
