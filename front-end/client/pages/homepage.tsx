import React, { useState, useEffect } from 'react';
import {useRouter} from 'next/router';
import Head from 'next/head';

const MovieSearch = () => {
    interface Genre{
        id: number;
        name: string;
    }

    const router = useRouter();
    const [showDiv, setShowDiv] = useState(false);
    const [showActorDIv, setShowActorDiv] = useState(false);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [form, setForm] = useState({ actor: '', title: '', genre: '' });
    const [searchResults, setSearchResults] = useState([]);
    const [searchActorResults, setSearchActorResults] = useState([]);

    useEffect(() => {
        // Fetch genres from the backend
        const fetchGenres = async () => {
            const response = await fetch('http://localhost:8080/api/genres');
            const data = await response.json();
            setGenres(data);
            console.log("the data is", data);
            
        };

        fetchGenres();
        console.log("the genres are", genres);
    }, []);

    useEffect(() => {
        console.log("the genres are", genres);
    }, [genres]);

    const handleInputChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

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

    const handleSearchClick = () => {
        setShowDiv(!showDiv);
    };
    const handleActorSearchClick = () => {
        setShowActorDiv(!showActorDIv);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await response.json();
            setSearchResults(data);

        } catch (error) {
            console.log(error);
        }
    };

    const handleActorSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/searchactor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await response.json();
            setSearchActorResults(data);

        } catch (error) {
            console.log(error);
        }
    }

    const SelectMovie = (movieName: string) => {
        console.log("the movie name is", movieName);
        router.push({
            pathname: '/movieinfo',
            query: { movie: movieName },
        });
    };

    const SelectActor = (actorName: string) => {
        console.log("the actor name is", actorName);
        router.push({
            pathname: '/actorinfo',
            query: { actor: actorName },
        });
    }

    return (
        <div className='container'>
            <Head>
                <title>Ntuaflix</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='top-bar'>
                <div className='top-bar-content'>
                    <div className='ntuaflix-title'>
                        Ntuaflix
                    </div>
                    <div className='top-right' onClick={logout}>
                        Log Out
                    </div>
                </div>
            </div>
            <div className='main-content'>
                <div className='search-bar'>
                    <button onClick={handleSearchClick} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Search for a Movie</button>
                    {showDiv && (
                        <div className="mt-5">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Actor:</label>
                                    <input type="text" className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200" name="actor" value={form.actor} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
                                    <input type="text" className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200" name="title" value={form.title} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Genre:</label>
                                    <select name="genre" className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200" value={form.genre} onChange={handleInputChange}>
                                        <option value="">Select a Genre</option>
                                        {genres.map((genre) => (
                                            <option key={genre.id} value={genre.name}>{genre.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Search</button>
                            </form>
                            {searchResults.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-bold my-4">Search Results</h2>
                                    <ul className="list-disc pl-5">
                                        {searchResults.map(movie => (
                                            <li key={movie}>
                                                <button onClick={() => SelectMovie(movie)} className="text-blue-600 hover:text-blue-800">{movie}</button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                    
                </div>
                <div className='search-bar'>
                <button onClick={handleActorSearchClick} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Search for an Actor</button>
                {showActorDIv && (
                    <div className="mt-5">
                        <form onSubmit={handleActorSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                                <input type="text" className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200" name="actor" value={form.actor} onChange={handleInputChange} />
                            </div>
                            <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Search</button>
                        </form>
                        {searchActorResults.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold my-4">Search Actor Results</h2>
                            <ul className="list-disc pl-5">
                                {searchActorResults.map(actor => (
                                    <li key={actor}>
                                        <button onClick={() => SelectActor(actor)} className="text-blue-600 hover:text-blue-800">{actor}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        )}
                    </div>
                )}
                </div>
            </div>
 
            <div className='centered-button'>
                <button onClick={() => router.push('/watchlater')} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Watch Later</button>
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
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
      }

      .home-link a {
        text-decoration: none;
        color: #fff;
        font-weight: bold;
      }

      .ntuaflix-title {
        flex: 1;
        font-size: 24px;
        text-align: left;
      }
      .top-right {
        flex: 1;
        text-align: right;
        font-size: 24px;
        cursor: pointer;
      }

      .main-content {
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        max-width: 1200px;
        margin: 20px auto;
        width: 100%;
      }

      .search-bar {
        width: 48%; /* 50% with a little space in between */
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

      .search-form {
        /* Your search form styles here */
      }

      .centered-button {
        padding-top: 20px;
        text-align: center;
        padding-bottom: 20px;
      }

      .watch-later-button {
        background-color: #0074d9; /* Blue color */
        color: #fff;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        text-decoration: none;
        display: block;
        margin: 0 auto;
      }

    `}</style>
        </div>
    );
};

export default MovieSearch;
