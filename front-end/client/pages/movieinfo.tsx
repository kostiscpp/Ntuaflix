import React, { useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const MovieInfo = () => {
    interface Review{
        rate: number;
        text: string;
    }
    interface Akas{
        alt_title: string;
        region: string;
        language: string;
        is_original: boolean;
        types: string[];
        attributes: string[];
    }
    interface EpisodeDetails{
        parent_title: string;
        episode_number: number;
        season_number: number;
    }
    interface Principals{
        name: string;
        category: string;
        characters: string;
    }
    interface MovieInfo{
        title_type: string; //movie episode or short
        primary_title: string; // the title
        original_title: string; // the original title
        is_adult: boolean; // bool
        start_year: number; // year
        end_year: number; // year
        runtime_minutes: number;  // minutes
        poster_url: string; // url
        rating: number; // rating
        no_of_ratings: number; // number of ratings
        akas: Akas[];
        genres: string[];
        episode_details: EpisodeDetails;
        directors: string[];
        writers: string[];
        principals: Principals[];
    }
    
    const router = useRouter();
    const  name  = router.query.movie;

    const [showReviews, setShowReviews] = useState(false);
    const [showaddreview, setShowAddReview] = useState(false);
   
    const [hasWatched, setHasWatched] = useState(false);
    const [watchLater, setWatchLater] = useState(false);

    const [reviewResults, setReviewResults] = useState<Review[]>([]);
    const [movieInfo, setMovieInfo] = useState<MovieInfo>({title_type: "", primary_title: "", original_title: "", is_adult: false, start_year: 0, end_year: 0, runtime_minutes: 0, poster_url: "", rating: 0, no_of_ratings: 0, akas: [], genres: [], episode_details: {parent_title: "", episode_number: 0, season_number: 0} , directors: [], writers: [], principals: []});

    const handleReadReviewsClick = () => {
        setShowReviews(!showReviews);
    }
    const handleAddReviewClick = () => {
        setShowAddReview(!showaddreview);
    }
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

    const find_principal = (name: string) => {
        router.push({
            pathname: '/actorinfo',
            query: {name: name},
        });
    }

    useEffect(() => {
        const fetchReviews = async () => {
            const response = await fetch(`http://localhost:8080/api/reviews/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({movie: name}),
            });
            const data = await response.json();
            setReviewResults(data);
        };

        if (name) {
            fetchReviews();
        }
    }, [name]);


    // Fetch movie details and watched status from the database
    useEffect(() => {
        // Placeholder for database query
        const fetchMovieInfo = async () => {
           
            try {
                const response = await fetch(`http://localhost:8080/api/movieInfo/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({movie: name}),
                });
                const data = await response.json();
                setMovieInfo(data);

            } catch (error) {
                console.log(error);
            }

            try {
                const response = await fetch(`http://localhost:8080/api/watchLater/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({movie: name}),
                });
                const data = await response.json();
                setWatchLater(data.watchLater);
            } catch (error) {
                console.log(error);
            }

            try {
                const response = await fetch(`http://localhost:8080/api/watched/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({movie: name}),
                });
                const data = await response.json();
                setHasWatched(data.watched);
            } catch(error) {
                console.log(error);
            } // Assume the user hasn't watched the movie initially
        };

        if (name) {
            fetchMovieInfo();
        }
    }, [name]);

    const handleWatchedClick = async (e: any) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/watchedChange', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({movie: name}),
            });
            const data = await response.json();
            if (data.success) {
                setHasWatched(!hasWatched);
            }
            else {
                console.log("error");
            }

        } catch (error) {
            console.log(error);
        }
    };

    const handleWatchLaterClick = async (e: any) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/watchLaterChange', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({movie: name}),
            });
            const data = await response.json();
            if (data.success) {
                setWatchLater(!watchLater);
            }
            else {
                console.log("error");
            }

        } catch (error) {
            console.log(error);
        }
    }
    
    const handleSubmit = async (e: any) => { 
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/addReview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({movie: name, rate: e.target.rating.value, text: e.target.review.value}),
            });
            const data = await response.json();
            if (data.success) {
                alert("Review added!");
                setShowAddReview(false);
            }
            else {
                console.log("error");
            }

        } catch (error) {
            console.log(error);
        }
    }



    

    return (
        
        <div className="max-w-4xl mx-auto p-4">
            <Head>
                <title>Ntuaflix - Movie</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="container">
                <div className="top-bar">
                    <div className="top-left" onClick={home}>
                        Ntuaflix
                    </div>
                    <div className="top-center">
                        {name}
                    </div>
                    <div className="top-right" onClick={logout}>
                        Log Out
                    </div>
                </div>
            </div>
            <div className="padding"></div>
            <div className="bg-blue-200 shadow rounded-lg p-6 mb-6 flex">
                <div className="w-1/3">
                    {/* Assuming movieInfo.poster_url is a valid image URL */}
                    <img src={movieInfo.poster_url} alt="Movie Poster" className="rounded-lg shadow" />
                </div>
                <div className="w-2/3 ml-6">
                    <h2 className="text-2xl font-bold mb-2">{movieInfo.original_title}</h2>
                    <p className="text-sm text-gray-600 mb-4">({movieInfo.title_type})</p>
                    <p className="font-semibold">R-Rated: {movieInfo.is_adult ? 'Yes' : 'No'}</p>
                    <p>From {movieInfo.start_year} - to {movieInfo.end_year}</p>
                    <p>Runtime: {movieInfo.runtime_minutes} minutes</p>
                    <p>Average Rating: {movieInfo.rating} ({movieInfo.no_of_ratings} ratings)</p>
                </div>
            </div>


            
            <div className="bg-blue-200 rounded-lg py-3 px-4">
                <h1 className="text-3xl font-bold mb-4 text-center rounded-lg p-6">Also Known As</h1>
                <div className="flex flex-row overflow-x-auto">
                    {movieInfo.akas.map((aka, index) => (
                        <div key={index} className="flex-none w-60 mr-4 bg-[#0074d9] shadow rounded-lg p-6 text-white">
                            <h2 className='text-center text-2xl font-bold mb-4'>{aka.alt_title}</h2>
                            <ul className=" list-inside">
                                <li className="font-bold">{aka.region} ({aka.language})</li>
                                <li>Types: {aka.types.join(', ')}</li>
                                <li>Attributes: {aka.attributes.join(', ')}</li>
                            </ul>
                            {aka.is_original && (
                                    <p className="text-center">(original)</p>
                                )}
                        </div>
                    ))}
                </div>
            </div>
            <div className='padding'></div>
            <div className="bg-blue-200 rounded-lg py-3 px-4">
                <h1 className="text-3xl font-bold mb-4 text-center rounded-lg p-6">Genres</h1>
                <div className="rounded-lg p-6">
                    <ul className="list-disc list-inside">
                        {movieInfo.genres.map((genre, index) => (
                            <li key={index} className="text-xl mb-2">{genre}</li>
                        ))}
                    </ul>
                </div>
            </div>


            
            {
                (movieInfo.episode_details.parent_title != null || movieInfo.episode_details.episode_number != null || movieInfo.episode_details.season_number != null) && (
                <div>
                <h1 className="text-2xl font-bold mb-4">episode_details</h1>
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-3">Info:</h2>
                    <ul className="list-disc list-inside">
                        <li>parent_title: {movieInfo.episode_details.parent_title}</li>
                        <li>episode_number: {movieInfo.episode_details.episode_number}</li>
                        <li>season_number: {movieInfo.episode_details.season_number}</li>
                    </ul>
                </div>
                </div>
                )
            }
            <div className="padding"></div>
            
            <div className="bg-blue-200 rounded-lg py-3 px-4">
                <h1 className="text-3xl font-bold mb-4 text-center rounded-lg p-6">Directors</h1>
                <div className="rounded-lg p-6">
                    <ul className="list-disc list-inside">
                    {movieInfo.directors.map((director: any, index: number) => (
                        <li className='clickable' onClick={() => find_principal(director)}>{director}</li>
                    ))}
                    </ul>
                </div>
            </div>

            <div className='padding'></div>
            <div className="bg-blue-200 rounded-lg py-3 px-4">
                <h1 className="text-3xl font-bold mb-4 text-center rounded-lg p-6">Writers</h1>
                <div className="rounded-lg p-6">
                    <ul className="list-disc list-inside">
                    {movieInfo.writers.map((writer: any, index: number) => (
                        <li className='clickable' onClick={() => find_principal(writer)}>{writer}</li>
                    ))}
                    </ul>
                </div>
            </div>
            <div className='padding'></div>

            <div className="bg-blue-200 rounded-lg py-3 px-4">
                <h1 className="text-3xl font-bold mb-4 text-center rounded-lg p-6">Principals</h1>
                <div className="flex flex-row overflow-x-auto">
                    {movieInfo.principals.map((principal, index) => (
                        <div key={index} 
                            className="flex-none w-60 mr-4 bg-[#0074d9] shadow rounded-lg p-6 text-white" 
                            onClick={() => find_principal(principal.name)}>
                            <h2 className='text-center text-xl font-bold '>{principal.name}</h2>
                            <p className="font-bold text-center">({principal.characters})</p>
                            
                            
                            <p className="text-center">{principal.category}</p>
                            
                        </div>
                    ))}
                </div>
            </div>


<div className="mt-6">
        <button 
            className={`py-2 px-4 rounded text-white font-semibold ${hasWatched ? 'bg-blue-500 hover:bg-blue-700' : 'bg-blue-300 hover:bg-blue-400'}`}
            onClick={handleWatchedClick}
        >
            {hasWatched ? 'Watched ✔️' : 'Watched'}
        </button>
        <button
            className={`py-2 px-4 rounded text-white font-semibold ml-4 ${watchLater ? 'bg-blue-500 hover:bg-blue-700' : 'bg-blue-300 hover:bg-blue-400'}`} 
            onClick={handleWatchLaterClick}
        >
            {watchLater ? 'Watch Later ✔️': 'Watch Later'}
        </button>
        <button 
            className="py-2 px-4 rounded text-white bg-green-500 hover:bg-green-700 ml-4"
            onClick={handleReadReviewsClick}
        >
            Read Reviews
        </button>
    </div>

    {showReviews && (
        <div className="mt-6 bg-blue-100 rounded-lg py-3 px-4">
        <h2 className="text-xl font-semibold mb-3 text-center  p-3">Reviews</h2>
        <button 
            className="py-2 px-4 rounded text-white bg-purple-500 hover:bg-purple-700"
            onClick={handleAddReviewClick}
        >
            Add Review
        </button>
    
        {showaddreview && (
            <form onSubmit={handleSubmit} className="mt-4 bg-white shadow rounded-lg p-6">
                <input 
                    type="number" 
                    placeholder="Rating" 
                    name="rating" 
                    required 
                    className="border border-gray-300 rounded-md p-2 mr-2"
                />
                <input 
                    type="text" 
                    placeholder="Review" 
                    name="review" 
                    required 
                    className="border border-gray-300 rounded-md p-2 mr-2"
                />
                <button 
                    type="submit"
                    className="py-2 px-4 rounded text-white bg-green-500 hover:bg-green-700"
                >
                    Add Review
                </button>
            </form>
        )}
    
        <div className="mt-4">
            {reviewResults.length > 0 && (
                reviewResults.map((review, index) => (
                    <div key={index} className="bg-blue-200 shadow rounded-lg p-4 mb-4">
                        <p className="font-semibold ">{review.rate}/5</p>
                        <p>{review.text}</p>
                    </div>
                ))
            )}
        </div>
    </div>
    )}
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
                font-size: 24px;
                cursor: pointer;
                text-align: right;
            }

            .padding{
                padding-top: 20px;
            }
        
            .clickable{
                cursor: pointer;
            }
            
          `}</style>
        </div>
    );
};

export default MovieInfo;
