import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const WatchedPage = () => {
    interface Movie{  
        title: string;
        poster_url: string;
    }
    const [movies, setMovies] = React.useState<Movie[]>([]);
    const router = useRouter();
    const home = async () => {
        try {
            const response = await fetch('https://localhost:8080/api/isadmin', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token')},
            });
            const data = await response.json();
            if (data.isAdmin) {
                router.push('/adminhome');
            } else { 
                router.push('/homepage');
            
            }
        } catch (e) {
            console.log(e);
        }
    }
    const logout = async () => {  
        try{
            const response = await fetch('https://localhost:8080/api/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            if (data.success) {
                localStorage.removeItem('access_token');
                router.push('/');
            } else {
                console.log("failure");
            }
        }catch(e){
            console.log(e);
        }
    }

    const fetchWatched = async () => {  
        try{  
            const response = await fetch('https://localhost:8080/api/watchedlist', {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') },
            });
            const data = await response.json();
            setMovies(data);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchWatched();
    }, []);

    const find_movie = (name: string) => {  
        router.push({
            pathname: '/movieinfo',
            query: { movie: name },
        });``
    }

    return (
        <div className="container">
          <Head>
            <title>Ntuaflix - Watched</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className="top-bar">
            <div className="top-left" onClick={home}>
                Ntuaflix
            </div>
            <div className="top-center">
                Watched
            </div>
            <div className="top-right" onClick={logout}>
                Logout
            </div>
        </div>
      
          <div className="movie-container">
            {movies.map((movie, index) => (
              <div key={index} className="movie-box" onClick={() => find_movie(movie.title)}>
                <div>
                    <img src={movie.poster_url} alt={movie.title} className="movie-image" />    
                </div>
                <div className='movie-title'>
                    {movie.title}
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
                width: 200px; // Adjust the width as needed
                display: flex;
                flex-direction: column;
                align-items: center;
                background-color: white; // Optional, for better visibility
                padding: 10px;
                border-radius: 8px; // Optional, for rounded corners
                box-shadow: 0 2px 4px rgba(0,0,0,0.1); // Optional, for a subtle shadow
                cursor: pointer;
                transition: transform 0.3s ease;
            }

            .movie-box:hover {
                transform: scale(1.05); // Optional, for a hover effect
            }

            .movie-image {
                width: 100%; // Make the image take the full width of the card
                height: auto; // Keep the aspect ratio of the image
                border-radius: 4px; // Optional, for rounded image corners
            }

            .movie-title {
                margin-top: 10px; // Space between image and title
                font-size: 1rem; // Adjust the font size as needed
                text-align: center; // Center align the title
            }
      
            
          `}</style>
        </div>
      );


};

export default WatchedPage;