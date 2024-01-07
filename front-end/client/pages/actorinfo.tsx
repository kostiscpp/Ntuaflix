import React, { useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const ActorInfo = () => {
    interface Principal {
        title: string;
        category: string;
        characters: string[];
    };
    interface Actor {
        primary_name: string;
        birth_year: number;
        death_year: number;
        biography: string;
        image_url: string;
        primary_profession: string[];
        known_for: string[];
        directs: string[];
        writes: string[];
        principals: Principal[];
    };

    const router = useRouter();
    const name = router.query.actor;

    const [actor, setActor] = useState<Actor>({
        primary_name: '',
        birth_year: 0,
        death_year: 0,
        biography: '',
        image_url: '',
        primary_profession: [],
        known_for: [],
        directs: [],
        writes: [],
        principals: [],
    });

    const home = () => {
        router.push('/homepage');
    }
    const find_movie = (title: string) => {
        router.push({
            pathname: '/movieinfo',
            query: { title: title },
        });
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

    useEffect(() => { 
        try{
            const fetchActor = async () => {
                const response = await fetch(`http://localhost:8080/api/actorInfo`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({actor: name }),
                });
                const data = await response.json();
                setActor(data);
            };
            fetchActor();
        } catch (e) {
            console.log(e);
        }
        
    }, [actor]);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Head>
                <title>Ntuaflix - Actor</title>
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
                    <div className='top-right' onClick={logout}>
                        Log Out
                    </div>
                </div>
            </div>
            <div className="padding"></div>
            <div className="bg-blue-200 shadow rounded-lg p-6 mb-6 flex">
                <div className="w-1/3">
                    {/* Assuming movieInfo.poster_url is a valid image URL */}
                    <img src={actor.image_url} alt="Photo of Person" className="rounded-lg shadow" />
                </div>
                <div className="w-2/3 ml-6">
                    <h2 className="text-2xl font-bold mb-1">{actor.primary_name}</h2>
                    <p className="text-sm text-gray-600 mb-1">({actor.primary_profession.join(", ")})</p>
                    <p>Life: {actor.birth_year} - {actor.death_year}</p>
                    <p>Biography: {actor.biography}</p>

                </div>
            </div>
            <div className="padding"></div>
            <div className="bg-blue-200 rounded-lg py-3 px-4">
                <h1 className="text-3xl font-bold mb-4 text-center rounded-lg p-6">Known For</h1>
                <div className="rounded-lg p-6">
                    <ul className="list-disc list-inside">
                    {actor.known_for.map((title: string) => (
                        <li className='clickable' onClick={() => find_movie(title)}>{title}</li>
                    ))}
                    </ul>
                </div>
            </div>
            <div className="padding"></div>
            {
                (actor.directs.length != 0) && (
                <div className="bg-blue-200 rounded-lg py-3 px-4">
                <h1 className="text-3xl font-bold mb-4 text-center rounded-lg p-6">Directs</h1>
                <div className="rounded-lg p-6">
                    <ul className="list-disc list-inside">
                    {actor.directs.map((title: string) => (
                        <li className='clickable' onClick={() => find_movie(title)}>{title}</li>
                    ))}
                    </ul>
                </div>
                </div>
                )
            }
            <div className="padding"></div>
            {
                (actor.writes.length != 0) && (
                <div className="bg-blue-200 rounded-lg py-3 px-4">
                <h1 className="text-3xl font-bold mb-4 text-center rounded-lg p-6">Writes</h1>
                <div className="rounded-lg p-6">
                    <ul className="list-disc list-inside">
                    {actor.writes.map((title: string) => (
                        <li className='clickable' onClick={() => find_movie(title)}>{title}</li>
                    ))}
                    </ul>
                </div>
                </div>
                )
            }
            <div className="padding"></div>
            <div className="bg-blue-200 rounded-lg py-3 px-4">
                <h1 className="text-3xl font-bold mb-4 text-center rounded-lg p-6">Worked On</h1>
                <div className="flex flex-row overflow-x-auto">
                    {actor.principals.map((principal, index) => (
                        <div key={index} 
                            className="flex-none w-60 mr-4 bg-[#0074d9] shadow rounded-lg p-6 text-white" 
                            onClick={() => find_movie(principal.title)}>
                            <h2 className='text-center text-l font-bold '>{principal.title}</h2>
                            <p className="font-bold text-center">({principal.characters})</p>
                            
                            
                            <p className="text-center">{principal.category}</p>
                            
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

            .padding{
                padding-top: 20px;
            }
        
            .clickable{
                cursor: pointer;
            }
            
          `}</style>
        </div>
    );
}

export default ActorInfo;