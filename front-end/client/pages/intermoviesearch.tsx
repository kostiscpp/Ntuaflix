import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';


const InterMovieSearch = () => {
    interface Genre {
        id: number;
        name: string;
    }
    interface Result {
        title: string;
        photourl: string;
    }

    const router = useRouter();
    const [genres, setGenres] = useState<Genre[]>([]);
    const [movieform, setmovieForm] = useState({ actor: '', title: '', genre: '' });
    const [searchResults, setSearchResults] = useState<Result[]>([]);

    useEffect(() => {

        const updatedInputs = {
            actor: router.query.actor as string || "",
            title: router.query.title as string || "",
            genre: router.query.genre as string || ""
        };

        const fetchGenres = async () => {
            const response = await fetch('https://localhost:8080/api/genres');
            const data = await response.json();
            setGenres(data);
            console.log("the data is", data);

        };

        const fetchData = async () => {
            try {
                const response = await fetch('https://localhost:8080/api/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedInputs),
                });
                const data = await response.json();
                setSearchResults(data);

            } catch (error) {
                console.log(error);
            }

            
        };

        if (updatedInputs.actor || updatedInputs.title || updatedInputs.genre) {
            fetchData();
        }
        fetchGenres();
    }, [router.query.actor, router.query.title, router.query.genre]);

    const fetchGenres = async () => {
        const response = await fetch('https://localhost:8080/api/genres');
        const data = await response.json();
        setGenres(data);
        console.log("the data is", data);

    };

    const handleMovieInputChange = (e: any) => {
        setmovieForm({ ...movieform, [e.target.name]: e.target.value });
    };

    const logout = async () => {
        try {
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
        } catch (e) {
            console.log(e);
        }
    }
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


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            router.push({
                pathname: '/intermoviesearch',
                query: { actor: movieform.actor, title: movieform.title, genre: movieform.genre },
            });
        } catch (error) {
            console.log(error);
        }
    };



    const SelectMovie = (movieName: string) => {
        console.log("the movie name is", movieName);
        router.push({
            pathname: '/movieinfo',
            query: { movie: movieName },
        });
    };


    return (
        <div className='container'>
            <Head>
                <title>Ntuaflix</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='top-bar'>
                <div className='top-bar-content'>
                    <div className='ntuaflix-title' onClick={home}>
                        Ntuaflix
                    </div>
                    <div className='actions' onClick={logout}>
                        Log Out
                    </div>
                </div>
            </div>
            <div className='main-content'>
                <div className="search-bar">
                <div className="mt-5">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Actor:</label>
                            <input type="text" className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200" name="actor" value={movieform.actor} onChange={handleMovieInputChange} />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
                            <input type="text" className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200" name="title" value={movieform.title} onChange={handleMovieInputChange} />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Genre:</label>
                            <select name="genre" className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200" value={movieform.genre} onChange={handleMovieInputChange}>
                                <option value="">Select a Genre</option>
                                {genres.map((genre) => (
                                    <option key={genre.id} value={genre.name}>{genre.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Search</button>
                    </form>

                </div>
                </div>
                <div className='movie-list'>
                {searchResults.map((movie, index) => (  
                    <div  className='movie-item' onClick={() => SelectMovie(movie.title)}>
                        <img src={movie.photourl} alt={movie.title} className='movie-image'/>
                        <p className='movie-title'>{movie.title}</p>
                    </div>
                ))}
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
      }

      .top-bar {
        background-color: #0074d9; /* Blue color */
        color: #fff;
        padding: 10px;
        text-align: center;
        width: 100%;
        max-width: 1200px;
      }

      .top-bar-content {
        display: flex;
        justify-content: space-between; /* Adjusts children to each end */
        align-items: center;
        width: 100%;
      }

      .actions {
            text-align: right;
            cursor: pointer;
            font-size: 24px;
        }

    .search-bar + .movie-list { /* Added for a bit of spacing between search bar and movie list */
        margin-top: 20px;
      }

      .search-bar {
        width: 48%; /* Narrower width */
        display: flex;
        flex-direction: column;
      }

      .home-link a {
        text-decoration: none;
        color: #fff;
        font-weight: bold;
      }

      .ntuaflix-title {
        text-align: left;
        cursor: pointer;
        font-size: 24px;
      }



      .main-content {
        padding: 20px;
        display: block;
        justify-content: space-between;
        align-items: flex-start;
        max-width: 1200px;
        margin: 20px auto;
        width: 100%;
      }



      .search-button {
        background-color: #0074d9; /* Blue color */
        color: #fff;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        text-decoration: none;
        display: block;
        margin: 0 auto;
        margin-bottom: 20px;
      }

      .movie-list {
        max-width: 1200px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px;
    }
    .movie-item {
        width: 200px;
        margin-bottom: 20px;
        text-align: center;
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        border-radius: 10px;
        overflow: hidden;
        background: #fff;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .movie-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.2);
    }
    .movie-image {
        width: 100%;
        height: auto;
        display: block;
    }
    .movie-title {
        padding: 10px;
    }

    `}</style>
        </div>
    );
};

export default InterMovieSearch;
