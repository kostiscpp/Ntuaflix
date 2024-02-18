const express = require('express');
const mysql = require('mysql');
const app = express();
const PORT = 8080;
const cors = require('cors');
const crypto = require('crypto');
const { parse } = require('path');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const path = require('path');

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { stringify } = require('querystring');
const { authenticate } = require('passport');


dotenv.config();


//Create a connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASS,
    database: 'softeng'
});


app.use(cors(
    {
        origin: 'https://localhost:3000',
        credentials: true,
        allowedHeaders: 'Content-Type,Authorization'
    }
));
app.use(express.json());

app.use(bodyParser.json());
app.use(cookieParser());

//default user_id = 1, username = 'user'
// let currentUser_id = 1;
function generateAccessToken(username, role) {
    payload = {  
        userId: username,
        role: role
    }
    return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1h' });
}

function authenticateToken(token) {
    return new Promise((resolve, reject) => {
        if (token == null) {
            return resolve("");
        }

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return resolve("");
            }
            console.log(user);
            resolve({ user_id: user.userId, role: user.role });
        });
    });
}

app.post('/api/signup', (req, res) => {
    const { username, password, first_name, last_name, birth_date} = req.body; 
    const hash_pas = crypto.createHash('sha256').update(password).digest('hex');
    const approved = true;
    // Perform validation and create new user logic here
    // ...
    pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error getting database connection:', err);
          approved = false;
        }
        query1 = "SELECT * FROM user WHERE username='" + username + "';"
        

        query2 = "INSERT INTO user (username,password,first_name,last_name,birth_date,role,account_status) VALUES ('" + username + "','" + hash_pas + "','" 
                + first_name + "','" + last_name + "','" + birth_date + "'," + "'user'," + "'active');"; 

        connection.query(query1, (queryErr1, results1) => {
            if (queryErr1) { 
                console.error('Error executing query:', queryErr1);
                approved = false;
              }

            if (results1.length > 0) {
                connection.release();
                res.status(401).json({ success: false, message: 'Username already exists' });
            }
            else {
                connection.query(query2, (queryErr2, results2) => {
                    if (queryErr2) { 
                      console.error('Error executing query:', queryErr2);
                      approved = false;
                    }
          
                    if (approved){
                        let currentUser_id;
                        connection.query(query1, (queryErr3, results3) => {
                            connection.release();
                            if (queryErr3) {
                                console.error('Error executing query:', queryErr3);
                            }
                            currentUser_id = results3[0].user_id;
                        })
                        const token = generateAccessToken(currentUser_id,'user');
                        res.json({ success: true, message: 'Signup successful', redirect: '/homepage', token: token });
                    }
                    else{
                        res.status(401).json({ success: false, message: 'Invalid credentials' });
                    }
              
                  });
            }
            
        }); 
    });
    
})




app.post('/api/login', (req, res) => {
    const { username, password } = req.body; 
    const hash_pas = crypto.createHash('sha256').update(password).digest('hex');
    console.log(hash_pas);
    pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error getting database connection:', err);
          approved = false;
        }
        query1 = "SELECT account_status FROM user WHERE username = '" + username + "';"; 
    
        connection.query(query1, (queryErr1, results1) => {
            if (queryErr1) {
                console.error('Error executing query:', queryErr1);
            }

            if (results1.length == 0){
                connection.release();
                res.status(401).json({ success: false, message: 'Username doesn\'t exist'});
            }
            else{
                query2 = "SELECT account_status, user_id, role FROM user where username = '" + username + "' and password = '" + hash_pas + "';";
                connection.query(query2, (queryErr2, results2) => {
                    connection.release();
                    if (results2.length == 0) {
                        res.status(401).json({ success: false, message: 'Wrong password'});
                    }
                    else if (results2[0].account_status == 'disabled') {
                        res.status(401).json({ success: false, message: 'Account is disabled'});
                    }
                    else {
                        currentUser_id = results2[0].user_id;

                        const token = generateAccessToken(currentUser_id,  results2[0].role);
                        if (results2[0].role === 'admin') {
                            res.json({ success: true, message: 'Log in successful', redirect: 'admin', token: token });
                        }
                        else {
                            res.json({ success: true, message: 'Log in successful', redirect: 'homepage', token: token });
                        }
                    }
                })
            }
    
        });
    });
})

//Spyros
/* 
Logout return a response with success:true
*/
app.post('/api/logout', (req, res) => {
    
    res.json({ success: true, message: 'Logout successful' });
})

// Spyros
/*
αν μπορείς βάλε ένα απι που να επιστρεφει τα  genres για το dropdown
*/
app.get('/api/genres', (req, res) => {
    query1 = "select genre_name from genre order by genre_name";
    pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error getting database connection:', err);
        }
    
        connection.query(query1, (queryErr1, results1) => {
            connection.release();
            if (queryErr1) {
                console.error('Error executing query:', queryErr1);
            }
            let names = []
            for (const row of results1) {
                names.push(row.genre_name);
            }
            res.json(names.map((name, index) => ({ id: index + 1, name})));
        });
    });
})


// Spyros
/*
εδω θα σου έχω στείλει κάποια από τα εξης (ονομα ή μερος ονόματος,  κάποιος ηθοποιος, κάποιο είδος)
και θέλω να μου επιστρέφεις μια λίστα με όλα τα ονόματα ταινιών που περνάνε από όλα τα φίλτρα
*/
app.post('/api/search', (req, res) => {
    const {actor, title, genre} = req.body;
    let modifiedTitle = '';
    for (let i = 0; i < title.length; i++) {
        if (title[i] === '\'') {
            modifiedTitle += '\\\'';
        }
        else {
            modifiedTitle += title[i];
        }
    }
    let res1 = [];
    let res2 = [];
    let res3 = [];
    let promises = [];
    query1 = "SELECT DISTINCT primary_title, poster_url FROM media WHERE primary_title like '%" + modifiedTitle + "%';";
    query2 = "SELECT DISTINCT m.primary_title, m.poster_url FROM media m INNER JOIN belongs b ON m.media_id = b.media_id INNER JOIN genre g ON b.genre_id = g.genre_id "
            + " WHERE g.genre_name = '" + genre+ "';";
    query3 = "select DISTINCT m.primary_title, m.poster_url from media m inner join principal p on p.media_id = m.media_id inner join professional pr on pr.professional_id = p.professional_id where pr.primary_name = '" + actor + "';";
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            approved = false;
        }
        if(title && title.trim() != "") {
            let promise1 = new Promise((resolve, reject) => {
                connection.query(query1, (queryErr1, results1) => {
                    if (queryErr1) {
                        console.error('Error executing query:', queryErr1);
                        reject(queryErr1);
                    } 
                    else {
                        for (const row of results1) {
                            temp = {};
                            temp.title = row.primary_title;
                            temp.photourl = row.poster_url;
                            res1.push(temp);
                        }
                        resolve();
                    }
                });
            });
            promises.push(promise1);
        }

        //genre && genre.trim() != ""
        if(1) {
            let promise2 = new Promise((resolve, reject) => {
                connection.query(query2, (queryErr2, results2) => {
                    if (queryErr2) {
                        console.error('Error executing query:', queryErr2);
                        reject(queryErr2);
                    } 
                    else {
                        for (const row of results2) {
                            temp = {};
                            temp.title = row.primary_title;
                            temp.photourl = row.poster_url;
                            res2.push(temp);
                        }
                        resolve();
                    }
                });
            });
            promises.push(promise2);
        }
        if(actor && actor.trim() != "") {
            let promise3 = new Promise((resolve, reject) => {
                connection.query(query3, (queryErr3, results3) => {
                    if (queryErr3) {
                        console.error('Error executing query:', queryErr3);
                        reject(queryErr3);
                    } 
                    else {
                        for (const row of results3) {
                            temp = {};
                            temp.title = row.primary_title;
                            temp.photourl = row.poster_url;
                            res3.push(temp);
                        }
                        resolve();
                    }
                });
            });
            promises.push(promise3); 
        }
        let final_result;
        let commonMovies = []
        Promise.all(promises)
        .then(() => {
            if (res1.length != 0) {
                commonMovies = res1;
            }
            if (commonMovies.length != 0) {
                if (res2.length != 0) {
                    commonMovies = commonMovies.filter(name => res2.includes(name));
                }
            } else {
                commonMovies = res2;
            }
            
            if (commonMovies.length != 0) {
                if (res3.length != 0) {
                    commonMovies = commonMovies.filter(name => res3.includes(name));
                }
            } else {
                commonMovies = res3;
            }
        })
        .catch((err) => {
            console.error('error:', err);
        })
        .finally(() => {
            connection.release();
            res.json(commonMovies);
        });
    });
});

// Spyros
/*
βάλε εδω να επιστρεφει τα reviews για την ταινία
με νοιάζει το rate και το text να έχουν το ίδιο όνομα στο json
*/
app.post('/api/reviews', (req, res) => { 
    const { movie } = req.body; 
    console.log(req.body); 
    let modifiedMovie = '';
    for (let i = 0; i < movie.length; i++) {
        if (movie[i] === '\'') {
            modifiedMovie += '\\\'';
        }
        else {
            modifiedMovie += movie[i];
        }
    }

    query1 = "SELECT DISTINCT r.rating, r.description FROM rates r INNER JOIN media m  ON r.media_id = m.media_id WHERE m.primary_title = '" 
            + modifiedMovie + "';";
    pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error getting database connection:', err);
        }
    
        connection.query(query1, (queryErr1, results1) => {
            connection.release();
            if (queryErr1) {
                console.error('Error executing query:', queryErr1);
            }
            const final_result = results1.map((row, index) => ({id:index + 1, rate: row.rating, movieName: movie, text: row.description}));
            res.json(final_result);
        });
    });
});

// Spyros
/*
εδω θα σου στέλνω το review
*/
app.post('/api/addReview', async (req, res) => {
    const { movie, rate, text, token } = req.body; 
    console.log(req.body); 
    let modifiedMovie = '';
    const user_data = await authenticateToken(token);
    const currentUser_id = user_data.user_id;
    for (let i = 0; i < movie.length; i++) {
        if (movie[i] === '\'') {
            modifiedMovie += '\\\'';
        }
        else {
            modifiedMovie += movie[i];
        }
    }
    if (rate < 0 || rate > 10) {
        res.json({ success: false, message: 'Rating must be between 0 and 10' });
    }
    else {
        query1 = "SELECT media_id FROM media WHERE primary_title = '" + modifiedMovie+ "';";
        pool.getConnection((err, connection) => {
            if (err) {
            console.error('Error getting database connection:', err);
            }
            connection.query(query1, (queryErr1, results1) => {
                if (queryErr1) {
                    console.error('Error executing query:', queryErr1);
                }
                query2 = "SELECT rating FROM rates WHERE media_id = " + results1[0].media_id + " and user_id = " + currentUser_id + ";"; 
                query3 = "DELETE FROM rates where media_id = " + results1[0].media_id + " and user_id = " + currentUser_id + ";";
                query4 = "INSERT INTO rates (media_id, user_id, rating, description) VALUES (" + results1[0].media_id + "," + currentUser_id + ","
                        + rate + ",'" + text + "');";
                query5 = "SELECT rating, no_of_ratings FROM media WHERE media_id = " + results1[0].media_id; + ";";
                connection.query(query2, (queryErr2, results2) => {
                    if(queryErr2) {
                        console.error('Error executing query:', queryErr2);
                    }
                    connection.query(query3, (queryErr3, results3) => {
                        if(queryErr3) {
                            console.error('Error executing query3');
                        }
                        connection.query(query4, (queryErr4, results4) => {
                            if(queryErr4) {
                                console.error('Error executing query4');
                            }
                            connection.query(query5, (queryErr5, results5) => {
                                if(queryErr5) {
                                    console.error('Error executing query 5');
                                }
                                let query6 = "";
                                if (results5[0].no_of_ratings === null) {
                                    query6 = "UPDATE media SET rating = " + rate + ", no_of_ratings = 1 WHERE media_id = " + results1[0].media_id + ";";
                                }
                                else {
                                    const average_rating = Number(results5[0].rating);
                                    const rateFloat = parseFloat(rate); // Cast rate to a double
                                    const number_ratings = results5[0].no_of_ratings;
                                    let new_average = 0.0;
                                    let new_number = 0;
                                    //we have to check if we've already reviewed because then we change only the average
                                    if (results2[0] != null) {
                                        new_average = ((average_rating * number_ratings + rateFloat - parseFloat(results2[0].rating)) / number_ratings);
                                        new_number = number_ratings;
                                    }
                                    else {
                                        new_average = ((average_rating * number_ratings + rateFloat) / (number_ratings + 1));
                                        new_number = number_ratings + 1;
                                    }

                                    query6 = "UPDATE media SET rating = " + new_average + ", no_of_ratings = " + new_number + " WHERE media_id = " + results1[0].media_id + ";";
                                }
                                connection.query(query6, (queryErr6, results6) => {
                                    connection.release();
                                    if(queryErr6) {
                                        console.error('Error executing query5');
                                    }
                                    res.json({ success: true, message: 'Review added successfully' });
                                });
                            });
                        });
                    });
                });
            });
        });
    }
});


// Spyros
/*
εδω θα μου στέλνεις αν έχει τη δει ο χρήστης την ταινία
*/
app.post('/api/watched', async (req, res) => {
    const { movie, token} = req.body;
    let modifiedMovie = '';
    const user_data = await authenticateToken(token);
    const currentUser_id = user_data.user_id;
    for (let i = 0; i < movie.length; i++) {
        if (movie[i] === '\'') {
            modifiedMovie += '\\\'';
        }
        else {
            modifiedMovie += movie[i];
        }
    }
    query1 = "SELECT m.media_id FROM media m INNER JOIN watched w ON m.media_id = w.media_id WHERE w.user_id = " + currentUser_id+ " and m.primary_title = '" + modifiedMovie + "';";
    pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error getting database connection:', err);
        }
        connection.query(query1, (queryErr1, results1) => {
            connection.release();
            if (queryErr1) {
                console.error('Error executing query:', queryErr1);
            }
            if(results1.length == 1) {
                    res.json({ watched: true, message: 'Movie is watched' });
                }
            else {
                res.json({ watched: false, message: 'Movie is not watched' });
            }
        });
    });
});
// Spyros
/*
εδω θα σου στέλνω να αλλάξεις το αν έχει δει την ταινία ο χρήστης
σου στέλνω change, όχι state
*/
app.post('/api/watchedChange', async (req, res) => {
    const { movie, token} = req.body;
    let modifiedMovie = '';
    const user_data = await authenticateToken(token);
    const currentUser_id = user_data.user_id;
    for (let i = 0; i < movie.length; i++) {
        if (movie[i] === '\'') {
            modifiedMovie += '\\\'';
        }
        else {
            modifiedMovie += movie[i];
        }
    }
    query1 = "SELECT media_id FROM media WHERE primary_title = '" + modifiedMovie + "';";
    pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error getting database connection:', err);
        }
        connection.query(query1, (queryErr1, results1) => {
            if (queryErr1) {
                console.error('Error executing query:', queryErr1);
            }
            query2 = "SELECT * FROM watched where user_id = " + currentUser_id + " and media_id = " + results1[0].media_id + ";";
            connection.query(query2, (queryErr2, results2) => {
                if(queryErr2) {
                    console.error('Error executing query:', queryErr2);
                }
                let query3 = "";
                if(results2.length == 1) {
                    query3 = "DELETE FROM watched WHERE user_id = " + currentUser_id + " and media_id = "+ results1[0].media_id  + ";";
                }
                else {
                    query3 = "INSERT INTO watched(media_id, user_id) VALUES (" + results1[0].media_id + "," + currentUser_id + ");";
                }
                connection.query(query3, (queryErr3, results3) => {
                    connection.release();
                    if (queryErr3) {
                        console.error('Error exeucuting query3');
                        res.status(401).json({ success: false, message: 'Something wrong in backend' });
                    }
                    res.json({ success: true, message: 'Watched status changed successfully' });
                });
            });
        });
    });
});

// Spyros
/*
εδω ελέγχεις αν μια ταινία την έχει βάλει στο watch later ο χρήστης
*/
app.post('/api/watchLater', async (req, res) => {
    const { movie, token} = req.body; 
    let modifiedMovie = '';
    const user_data = await authenticateToken(token);
    const currentUser_id = user_data.user_id;
    for (let i = 0; i < movie.length; i++) {
        if (movie[i] === '\'') {
            modifiedMovie += '\\\'';
        }
        else {
            modifiedMovie += movie[i];
        }
    }
    query1 = "SELECT m.media_id FROM media m INNER JOIN watch_later w ON m.media_id = w.media_id WHERE w.user_id = " + currentUser_id+ " and m.primary_title = '"+ modifiedMovie + "';";
    pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error getting database connection:', err);
        }
        connection.query(query1, (queryErr1, results1) => {
            connection.release();
            console.log(query1);
            if (queryErr1) {
                console.error('Error executing query:', queryErr1);
            }
            if(results1.length == 1) {
                    res.json({ watchLater: true, message: 'Movie is in watch later' });
                }
            else {
                res.json({ watchLater: false, message: 'Movie is not in watch later' });
            }
        });
    });
});


// Spyros
/*
εδώ αλλάζεις το άν έχει βάλει ο χρήστης την ταινία στο watch later
*/
app.post('/api/watchLaterChange', async (req, res) => { 
    const { movie, token } = req.body; 
    console.log(req.body); 
    const user_data = await authenticateToken(token);
    const currentUser_id = user_data.user_id;
    let modifiedMovie = '';
    for (let i = 0; i < movie.length; i++) {
        if (movie[i] === '\'') {
            modifiedMovie += '\\\'';
        }
        else {
            modifiedMovie += movie[i];
        }
    }
    query1 = "SELECT media_id FROM media WHERE primary_title = '" + modifiedMovie + "';";
    pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error getting database connection:', err);
        }
        connection.query(query1, (queryErr1, results1) => {
            if (queryErr1) {
                console.error('Error executing query:', queryErr1);
            }
            query2 = "SELECT * FROM watch_later where user_id = " + currentUser_id + " and media_id = " + results1[0].media_id + ";";
            connection.query(query2, (queryErr2, results2) => {
                if(queryErr2) {
                    console.error('Error executing query:', queryErr2);
                }
                let query3 = "";
                if(results2.length == 1) {
                    query3 = "DELETE FROM watch_later WHERE user_id = " + currentUser_id + " and media_id = "+ results1[0].media_id  + ";";
                }
                else {
                    query3 = "INSERT INTO watch_later(user_id, media_id) VALUES (" + currentUser_id + "," + results1[0].media_id  + ");";
                }
                connection.query(query3, (queryErr3, results3) => {
                    connection.release();
                    if (queryErr3) {
                        console.error('Error exeucuting query3');
                        res.status(401).json({ success: false, message: 'Something wrong in backend' });
                    }
                    res.json({ success: true, message: 'Watch later status changed successfully' });
                });
            });
        });
    });
});


// Spyros
/*
εδω θέλω να βάλεις τις πληροφορίες για τις ταινίες ακριβώς στη μορφή που θα σου
τις έχω αλλιώς θα σπάει όλο το frontend
νο πρεσσουρε <3
*/
app.post('/api/movieInfo', (req, res) => {
    const { movie } = req.body;
    console.log(req.body); 
    let modifiedMovie = '';
    for (let i = 0; i < movie.length; i++) {
        if (movie[i] === '\'') {
            modifiedMovie += '\\\'';
        }
        else {
            modifiedMovie += movie[i];
        }
    }
    query1 = "SELECT * FROM media WHERE primary_title = '" + modifiedMovie + "';";
    let final_result = {};
    pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error getting database connection:', err);
        }
    
        connection.query(query1, (queryErr1, results1) => {
            if (queryErr1) {
                console.error('Error executing query:', queryErr1);
            }
            if (results1 && results1.length > 0) {
                final_result.title_type = results1[0].title_type;
                final_result.primary_title = results1[0].primary_title;
                final_result.original_title = results1[0].original_title;
                if (results1[0].is_adult == 1) {
                    final_result.is_adult = true;
                }
                else {
                    final_result.is_adult = false;
                }
                final_result.start_year = results1[0].start_year;
                final_result.end_year = results1[0].end_year;
                final_result.runtime_minutes = results1[0].runtime_minutes;
                final_result.poster_url = results1[0].poster_url;
                final_result.rating = results1[0].rating;
                final_result.no_of_ratings  =results1[0].no_of_ratings;

                query2 = "SELECT alt_title, region, language, is_original FROM aka WHERE media_id = " + results1[0].media_id + ";";
                query3 = "SELECT DISTINCT type FROM types WHERE media_id = " + results1[0].media_id + " ORDER BY type;";
                query4 = "SELECT attribute FROM attributes WHERE media_id = " + results1[0].media_id + ";";
                query5 = "SELECT g.genre_name FROM genre g INNER JOIN belongs b ON g.genre_id = b.genre_id  WHERE b.media_id = " + results1[0].media_id + ";";
                query6 = "SELECT season_number, episode_number FROM episode_details WHERE belongs_to = " + results1[0].media_id + ";";
                query7 = "SELECT p.primary_name FROM professional p INNER JOIN directs d ON p.professional_id = d.professional_id" +
                        " WHERE d.media_id = " + results1[0].media_id + ";";
                query8 = "SELECT p.primary_name FROM professional p INNER JOIN writes w ON p.professional_id = w.professional_id" +
                        " WHERE w.media_id = " + results1[0].media_id + ";";
                query9 = "SELECT p.primary_name, pr.category, c.name FROM professional p INNER JOIN principal pr on p.professional_id = pr.professional_id" +
                        " INNER JOIN characters c ON c.professional_id = pr.professional_id WHERE pr.media_id = " + results1[0].media_id + ";";

                let promises = []

                //Query2
                let promises2 = new Promise((resolve, reject) => {
                    connection.query(query2, (queryErr2, results2) => {
                        if(queryErr2) {
                            console.error('Error executing query2');
                        }
                        let akas = []
                        for (const row of results2) {
                            temp = {}
                            temp.alt_title = row.alt_title;
                            temp.region = row.region;
                            temp.language = row.language;
                            if (row.is_original == 1) {
                                temp.is_original = true;
                            }
                            else {
                                temp.is_original = false;
                            }
                            temp.types = []
                            temp.attributes = []
                            akas.push(temp)
                        }
                        final_result.akas = akas;
                        resolve();
                    });
                });
                promises.push(promises2);
               

                // Query 3
                let promises3 = new Promise((resolve, reject) => {
                    connection.query(query3, (queryErr3, results3) => {
                        if (queryErr3) {
                            console.error('Error executing query3');
                        }
                        let all_types = []
                        for (const row of results3) {
                            all_types.push(row.type);
                        }
                        for (const row of final_result.akas) {
                            row.types = all_types;
                        }
                        resolve();
                    });
                });
                promises.push(promises3);
                

                // Query 4
                let promises4 = new Promise((resolve, reject) => {
                    connection.query(query4, (queryErr4, results4) => {
                        if (queryErr4) {
                            console.error('Error executing query4');
                        }
                        let all_atributes = []
                        for (const row of results4) {
                            all_atributes.push(row.attribute);
                        }
                        for (const row of final_result.akas) {
                            row.attributes = all_atributes;
                        }
                        resolve();
                    });
                });
                promises.push(promises4);


                // Query 5
                let promises5 = new Promise((resolve, reject) => {
                    connection.query(query5, (queryErr5, results5) => {
                        if (queryErr5) {
                            console.error('Error executing query5');
                        }
                        let all_genres = []
                        for (const row of results5) {
                            all_genres.push(row.genre_name);
                        }
                        final_result.genres = all_genres;
                        resolve();
                    });
                });
                promises.push(promises5);


                // Query 6
                let promises6 = new Promise((resolve, reject) => {
                    connection.query(query6, (queryErr6, results6) => {
                        if (queryErr6) {
                            console.error('Error executing query6');
                        }
                        episode_details = {}
                        if (results6.length == 0) {
                            episode_details.parent_title = null;
                            episode_details.episode_number = null;
                            episode_details.season_number = null;
                        }
                        else {
                            episode_details.parent_title = movie;
                            episode_details.episode_number = results6[0].episode_number;
                            episode_details.season_number = results6[0].season_number;
                        }
                        final_result.episode_details = episode_details;
                        resolve();
                    });
                });
                promises.push(promises6);
                

                // Query 7
                let promises7 = new Promise((resolve, reject) => {
                    connection.query(query7, (queryErr7, results7) => {
                        if (queryErr7) {
                            console.error('Error executing query7');
                        }
                        let all_directors = []
                        for (const row of results7) {
                            all_directors.push(row.primary_name);
                        }
                        final_result.directors = all_directors;
                        resolve();
                    });
                });
                promises.push(promises7);
                

                // Query 8
                let promises8 = new Promise((resolve, reject) => {
                    connection.query(query8, (queryErr8, results8) => {
                        if (queryErr8) {
                            console.error('Error executing query8');
                        }
                        let all_writers = []
                        for (const row of results8) {
                            all_writers.push(row.primary_name);
                        }
                        final_result.writers = all_writers;
                        resolve();
                    });
                });
                promises.push(promises8);
                

                // Query 9
                let promises9 = new Promise((resolve, reject) => {
                    connection.query(query9, (queryErr9, results9) => {
                        if (queryErr9) {
                            console.error('Error executing query9');
                        }
                        all_principals = []
                        for (const row of results9) {
                            temp = {}
                            temp.name = row.primary_name;
                            temp.category = row.category;
                            characters = []
                            characters.push(row.name)
                            temp.characters = characters
                            all_principals.push(temp)
                        }
                        final_result.principals = all_principals;
                        resolve();
                    });
                });
                promises.push(promises9);
                
                Promise.all(promises)
                    .then(() => {
                        console.log(final_result);
                    })
                    .catch(err => {
                        console.error('Error in promises', err);
                    })
                    .finally(() => {
                        connection.release();
                        res.json(final_result);
                    });
            }
        });
    });
});

// Spyros
/*
εδω μου στέλνεις τις πληροφορίες που θα δείχνουμε για τους ηθοποιούς
*/
app.post('/api/searchactor', (req, res) => {
    const { name } = req.body; 
    console.log('printed');
    query1 = "SELECT DISTINCT primary_name, image_url FROM professional WHERE primary_name like '%" + name +"%';";
    pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error getting database connection:', err);
        }
    
        connection.query(query1, (queryErr1, results1) => {
            connection.release();
            if (queryErr1) {
                console.error('Error executing query:', queryErr1);
            }
            console.log(query1);
            const final_result = [];
            for (const row of results1) {
                temp = {};
                temp.name = row.primary_name;
                temp.photourl = row.image_url;
                final_result.push(temp);
            }
            if(final_result && final_result.length > 0) {
                // console.log(final_result);
            }
            res.json(final_result);
        });
    });
});


// Spyros
/*
εδώ μου στέλνεις τις πληροφορίες για τον ηθοποιό
και πάλι η δομή της απάντησης είναι πολύ σημαντική οπότε προσπάθησε να ακολουθήσεις το παράδειγμα που γράφω
*/
app.post('/api/actorInfo', (req, res) => {
    const { actor } = req.body; 
    console.log(req.body);
    query1 = "SELECT * FROM professional WHERE primary_name = '" + actor + "';";
    let final_result = {}
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
        }
        connection.query(query1, (queryErr1, results1) => {
            if (queryErr1) {
                console.error('Error executing query:', queryErr1);
            }
            if (results1 && results1.length > 0) {
                final_result.primary_name = actor;
                final_result.birth_year = results1[0].birth_date;
                final_result.death_year = results1[0].death_date;
                final_result.biography = results1[0].biography;
                final_result.image_url = results1[0].image_url;

                query2 = "SELECT category, COUNT(category) as category_count FROM principal WHERE professional_id = " + results1[0].professional_id +
                        " GROUP BY category ORDER BY category_count DESC LIMIT 1;";
                query3 = "SELECT m.primary_title FROM media m INNER JOIN known_for k ON m.media_id = k.media_id WHERE k.professional_id = " + results1[0].professional_id + ";";
                query4 = "SELECT m.primary_title FROM media m INNER JOIN directs d ON m.media_id = d.media_id WHERE d.professional_id = " + results1[0].professional_id + ";";
                query5 = "SELECT m.primary_title FROM media m INNER JOIN writes w ON m.media_id = w.media_id WHERE w.professional_id = " + results1[0].professional_id + ";";
                query6 = "SELECT DISTINCT m.primary_title, p.category, c.name FROM media m INNER JOIN principal p ON m.media_id = p.media_id " + 
                        "INNER JOIN characters c ON p.professional_id = c.professional_id WHERE p.professional_id = " + results1[0].professional_id + ";";
                
                let promises = []

                //Query2
                let promises2 = new Promise((resolve, reject) => {
                    connection.query(query2, (queryErr2, results2) => {
                        if(queryErr2) {
                            console.error('Error executing query2');
                        }
                        temp = []
                        temp.push(results2[0].category);
                        final_result.primary_profession = temp;
                        resolve();
                    });
                });
                promises.push(promises2);
               

                // Query 3
                let promises3 = new Promise((resolve, reject) => {
                    connection.query(query3, (queryErr3, results3) => {
                        if (queryErr3) {
                            console.error('Error executing query3');
                        }
                        let all_known_for = [];
                        for (const row of results3) {
                            all_known_for.push(row.primary_title);
                        }
                        final_result.known_for = all_known_for;
                        resolve();
                    });
                });
                promises.push(promises3);
                

                // Query 4
                let promises4 = new Promise((resolve, reject) => {
                    connection.query(query4, (queryErr4, results4) => {
                        if (queryErr4) {
                            console.error('Error executing query4');
                        }
                        let all_directs = []
                        for (const row of results4) {
                            all_directs.push(row.primary_title);
                        }
                        final_result.directs = all_directs;
                        resolve();
                    });
                });
                promises.push(promises4);


                // Query 5
                let promises5 = new Promise((resolve, reject) => {
                    connection.query(query5, (queryErr5, results5) => {
                        if (queryErr5) {
                            console.error('Error executing query5');
                        }
                        let all_writes = []
                        for (const row of results5) {
                            all_writes.push(row.primary_title);
                        }
                        final_result.writes = all_writes;
                        resolve();
                    });
                });
                promises.push(promises5);


                // Query 6
                let promises6 = new Promise((resolve, reject) => {
                    connection.query(query6, (queryErr6, results6) => {
                        if (queryErr6) {
                            console.error('Error executing query6');
                        }
                        let all_principals = []
                        for (const row of results6) {
                            temp = {}
                            temp.title = row.primary_title;
                            temp.category = row.category;
                            characters = [];
                            characters.push(row.name);
                            temp.characters = characters;
                            all_principals.push(temp);
                        }
                        final_result.principals = all_principals;
                        resolve();
                    });
                });
                promises.push(promises6);

                Promise.all(promises)
                    .then(() => {
                        console.log(final_result);
                    })
                    .catch(err => {
                        console.error('Error in promises', err);
                    })
                    .finally(() => {
                        connection.release();
                        res.json(final_result);
                    });
            }
        });
    });
});


// Spyros
/*
επίστρεψέ μου όλες τις ταινίες που ο χρήστης έχει βάλει στα watch later
*/
app.get('/api/watchLaterList', async (req, res)  => {
    const token = req.headers.authorization;
    const user_data = await authenticateToken(token.split(' ')[1]);
    const currentUser_id = user_data.user_id;
    console.log(currentUser_id);
    query1 = "SELECT m.primary_title FROM media m INNER JOIN watch_later w ON m.media_id = w.media_id WHERE w.user_id = " + currentUser_id + ";";
    pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error getting database connection:', err);
        }
    
        connection.query(query1, (queryErr1, results1) => {
            connection.release();
            if (queryErr1) {
                console.error('Error executing query:', queryErr1);
            }
            const final_result = [];
            for (const row of results1) {
                final_result.push(row.primary_title);
            }
            res.json(final_result);
        });
    });
});


//Spyros
/*
A list of all the movies I've watched
I want the title and the image url
*/
app.get('/api/watchedList', async (req, res) => {
    const token = req.headers.authorization;
    console.log(token);
    const user_data = await authenticateToken(token.split(' ')[1]);
    const currentUser_id = user_data.user_id;
    query1 = "SELECT m.primary_title, m.poster_url FROM media m INNER JOIN watched w ON m.media_id = w.media_id WHERE w.user_id = " + currentUser_id + ";";
    pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error getting database connection:', err);
        }
    
        connection.query(query1, (queryErr1, results1) => {
            connection.release();
            if (queryErr1) {
                console.error('Error executing query:', queryErr1);
            }
            const final_result = [];
            for (const row of results1) {
                final_result.push({
                    title: row.primary_title,
                    poster_url: row.poster_url
                });
            }
            res.json(final_result);
        });
    });

});


app.get('/api/topmovies', (req, res) => {
    let pageNumber = parseInt(req.query.page, 1);
    if (isNaN(pageNumber) || pageNumber < 1) {
        pageNumber = 1;
    }
    const offset = 5 * pageNumber - 5;
    query1 = "select primary_title, poster_url from media order by (rating*no_of_ratings+11)/(no_of_ratings+2) desc limit 5 offset ?;";
    pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error getting database connection:', err);
        }
    
        connection.query(query1, [offset], (queryErr1, results1) => {
            connection.release();
            if (queryErr1) {
                console.error('Error executing query:', queryErr1);
            }
            let final_result = {done:false, result:[]};
            if (results1.length === 0) {
                final_result.done = true;
                res.json(final_result);
            }
            for (const row of results1) {
                temp = {}
                temp.title = row.primary_title;
                temp.poster_url = row.poster_url;
                final_result.result.push(temp);
            }
            console.log(final_result);
            res.json(final_result);
        });
    });
});

app.get('/api/isadmin', async (req, res) => {
    try{  
        const token = req.headers.authorization;
        const user_data = await authenticateToken(token.split(' ')[1]);
        const role = user_data.role;
        if (role === 'admin') {
            res.json({isAdmin: true});
        } else {
            res.json({isAdmin: false});
        }
    }
    catch (err) {
        res.json({isAdmin: false});
    }
    
});


const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, '../certs', 'ntuaflix_server.key.pem')), // Path to your key.pem file
    cert: fs.readFileSync(path.join(__dirname, '../certs', 'ntuaflix_server.cert.pem')), // Path to your cert.pem file
}, app);

sslServer.listen(PORT, () => console.log(`HTTPS Server running on port ${PORT}`));
