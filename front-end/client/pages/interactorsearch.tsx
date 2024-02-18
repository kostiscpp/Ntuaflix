import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';


const InterActorSearch = () => {

    interface Result {
        name: string;
        photourl: string;
    }

    const router = useRouter();
    const [actorform, setactorForm] = useState({ name: '' });
    const [searchResults, setSearchResults] = useState<Result[]>([]);

    useEffect(() => {
        // Directly create the inputs object based on the current router query
        const updatedInputs = {
            name: router.query.name as string || ""
        };
        
        const fetchData = async () => {
            try {
                const response = await fetch('https://localhost:8080/api/searchactor', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedInputs), // Use updatedInputs directly here
                });
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.log(error);
            }
        };
    
        // Call fetchData only if there's a name in the query
        if (updatedInputs.name) {
            fetchData();
        }
    }, [router.query.name]);



    const handleInputChange = (e: any) => {
        setactorForm({ ...actorform, [e.target.name]: e.target.value });
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
                pathname: '/interactorsearch',
                query: { name: actorform.name },
            });
        } catch (error) {
            console.log(error);
        }
    };



    const SelectActor = (actorName: string) => {
        router.push({
            pathname: '/actorinfo',
            query: { actor: actorName },
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
                <div className='search-bar'>
                    <div className="mt-5">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                                <input type="text" className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200" name="name" value={actorform.name} onChange={handleInputChange} />
                            </div>
                            <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Search</button>
                        </form>
                    </div>
                </div>
                <div className='movie-list'>
                    {searchResults.map((actor, index) => (
                        <div className='movie-item' onClick={() => SelectActor(actor.name)}>
                            <img src={actor.photourl} alt={actor.name} className='movie-image' />
                            <p className='movie-title'>{actor.name}</p>
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

export default InterActorSearch;
