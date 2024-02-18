import React, {useState, useEffect} from 'react';

const RecommendedMovies = ({onMovieSelect}) => {  
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [done, setDone] = useState(false);

    const fetchMovies = async () => {  
        try {  
            const response = await fetch('https://localhost:8080/api/topmovies?page=' + page);
            const data = await response.json();
            if (data.done) setDone(true);
            else{  
                setMovies(prevMovies => [...prevMovies, ...data.result]);
            }
            
        } catch (error) {  
            console.log(error);
        }
    };

    useEffect(() => {  
        fetchMovies();
    }, [page]);

    const loadMore = () => {  
        setPage(prevPage => prevPage + 1);
    };

    return (  
        <div>
            <div className='movie-list'>
                {movies.map((movie, indext) => (  
                    <div  className='movie-item' onClick={() => onMovieSelect(movie.title)}>
                        <img src={movie.poster_url} alt={movie.title} className='movie-image'/>
                        <p className='movie-title'>{movie.title}</p>
                    </div>
                ))}
            </div>
            {!done && <button onClick={loadMore} className='load-more-btn'>Load More</button>}
            <style jsx>{`
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
                .load-more-btn {
                    display: block;
                    margin: 20px auto;
                    padding: 10px 20px;
                    background-color: #0074d9;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
            `}</style>
        </div>

        
    );
}

export default RecommendedMovies;