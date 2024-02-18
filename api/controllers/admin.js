const { json } = require('express');
const { pool } = require('../utils/database');
const fs = require('fs');
const crypto = require('crypto');

exports.healthcheck = async (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) return res.status(500).json({ "status": "failed", "dataconnection" : "disconnected"});
        connection.release();
        return res.status(200).json({ "status": "OK", "dataconnection": "connected" });
    });
}

exports.resetall = async (req, res) => {
    const resetQuery = `
        SET FOREIGN_KEY_CHECKS = 0;
        TRUNCATE TABLE professional;
        TRUNCATE TABLE media;
        TRUNCATE TABLE genre;
        TRUNCATE TABLE belongs;
        TRUNCATE TABLE phone_no;
        TRUNCATE TABLE watch_later;
        TRUNCATE TABLE rates;
        TRUNCATE TABLE watched;
        TRUNCATE TABLE aka;
        TRUNCATE TABLE directs;
        TRUNCATE TABLE writes;
        TRUNCATE TABLE principal;
        TRUNCATE TABLE types;
        TRUNCATE TABLE attributes;
        TRUNCATE TABLE episode_details;
        TRUNCATE TABLE characters;
        TRUNCATE TABLE primary_profession;
        TRUNCATE TABLE known_for;
        SET FOREIGN_KEY_CHECKS = 1;
    `;
    
    // Assuming your SQL insert script is in a file named script.sql
    const sqlScript = fs.readFileSync('../data/dml_for_database_dump.sql', 'utf8');
    let connection;
    try {
        const connection = await pool.promise().getConnection();
        await connection.query(resetQuery);
        await connection.query(sqlScript);
        await connection.commit();
        console.log("Tables reset");
        res.status(200).json({ "status": "OK"});
    } catch (err) {
        console.error(err);
        if(connection) await connection.rollback();
        res.status(500).json({ "status": "failed", "reason": "Internal server error" });
    }
    finally {
        // Always release the connection
        if (connection) connection.release();
    }
}


exports.uploadTitleBasics = async (req, res) => {
    const format = req.headers['content-type'];
    if (format !== 'text/tab-separated-values') {
        return res.status(400).json({ message: 'Invalid format' });
    }

    let connection;

    try {
        // Get connection from the pool
        connection = await pool.promise().getConnection();
        
        // Start transaction
        await connection.beginTransaction();
        var rows = req.body.split(/\r\n|\n|\r|\n\r/);
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].split(/\t/); // Make sure the split is on tab character only
            if(!row) continue;
            if(row[0] == ''  &&  row.length == 1) continue; 
            if (row.length !== 10) {
                throw new Error('Invalid number of columns');
            }

            // Create the query using parameterized values
            const tconst = row[0] == '\\N' ? "NULL": "\"" +row[0]+ "\"";
            const title_type = row[1] == '\\N' ? "NULL": "\"" + row[1] + "\"";
            const primary_title = row[2] == '\\N' ? "NULL" : "\"" + row[2] + "\"";
            const original_title = row[3] == '\\N' ? "NULL" : "\"" + row[3] + "\"";
            const is_adult = row[4] == '\\N' ? "NULL" : row[4];
            const start_year = row[5] == '\\N' ? "NULL" : row[5];
            const end_year = row[6] == '\\N' ? "NULL" : row[6];
            const runtime = row[7]  == '\\N' ? "NULL" : row[7];
            var genres = row[8] == '\\N' ? "NULL" : row[8];
            const poster_url = row[9] == '\\N' ? "NULL" : "\"" + row[9] + "\"";
            const query = `INSERT INTO media (tconst, title_type , primary_title , original_title , is_adult , start_year , end_year , runtime_minutes , poster_url) VALUES (${tconst},${title_type}, ${primary_title}, ${original_title}, ${is_adult}, ${start_year}, ${end_year}, ${runtime}, ${poster_url})`;
            const mediaResults = await connection.query(query);
            const lastMediaId = mediaResults[0].insertId;

            // Process genres
            var genres = row[8] == '\\N' ? "NULL" : row[8].split(',');
            if (genres !== "NULL") {
                for (const genre of genres) {
                    // Insert into genre and get the genre id
                    const genreResults = await connection.query('INSERT INTO genre (genre_name) VALUES (?)', [genre]);
                    const lastGenreId = genreResults[0].insertId;

                    // Insert into belongs table
                    await connection.query('INSERT INTO belongs (media_id, genre_id) VALUES (?, ?)', [lastMediaId, lastGenreId]);
                }
            }
        }

        // Commit the transaction
        await connection.commit();
        res.status(200).json({ message: 'Title basics uploaded' });
    } catch (error) {
        // If error, roll back the transaction
        if (connection) await connection.rollback();

        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        // Always release the connection
        if (connection) connection.release();
    }
};


exports.uploadTitleAkas = async (req, res) => {
    const format = req.headers['content-type'];
    if (format !== 'text/tab-separated-values') {
        return res.status(400).json({ message: 'Invalid format' });
    }

    let connection;

    try {
        // Get connection from the pool
        connection = await pool.promise().getConnection();

        // Start transaction
        await connection.beginTransaction();

        const rows = req.body.split(/\r\n|\n|\r/);

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].split(/\t/); // Make sure the split is on tab character only
            if(!row) continue;
            if(row[0] == ''  &&  row.length == 1) continue; 
            if (row.length !== 8) {
                throw new Error('Invalid number of columns');
            }
            const mediaIdQuery = `SELECT media_id FROM media WHERE tconst = ?`; // Adjust table/column name accordingly
            const [mediaIdResults] = await connection.execute(mediaIdQuery, [row[0]]);
            if (mediaIdResults.length === 0) {
                throw new Error('Media ID not found');
            }

            
            // Create the query using parameterized values
            const media_id = mediaIdResults[0].media_id; 
            const ordering = row[1] == '\\N' ? "NULL" : row[1];
            const title = row[2] == '\\N' ? "NULL" : "\"" + row[2] + "\"";
            const region = row[3] == '\\N' ? "NULL" : "\"" + row[3] + "\"";
            const language = row[4] == '\\N' ? "NULL" : "\"" + row[4] + "\"";
            var types = row[5] == '\\N' ? "NULL" : "\"" + row[5] + "\"";
            var attributes = row[6]  == '\\N' ? "NULL" : "\"" + row[6] + "\"";
            const is_original_title = row[7] == '\\N' ? "NULL" : row[7];
            const query = `INSERT INTO aka (media_id , ordering , alt_title , region , language , is_original) VALUES (${media_id}, ${ordering}, ${title}, ${region}, ${language}, ${is_original_title})`;
            const results = await connection.query(query);
            if(types !== "NULL") {
                types = types.split(',');
                for (const type of types) {
                    await connection.query(`INSERT INTO types (media_id,ordering, type) VALUES (${media_id},${ordering}, ${type});`);
                }
            }
            if(attributes !== "NULL") {
                attributes = attributes.split(',');
                for (const attribute of attributes) {
                    await connection.query(`INSERT INTO attributes (media_id,ordering, attribute) VALUES (${media_id},${ordering}, ${attribute});`);
                }
            }
        }

        // Commit the transaction
        await connection.commit();
        res.status(200).json({ message: 'Title akas uploaded' });
    } catch (error) {
        // If error, roll back the transaction
        if (connection) await connection.rollback();

        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        if (connection) connection.release(); // Release the connection back to the pool
    }
};


exports.uploadNameBasics = async (req, res) => {
    const format = req.headers['content-type'];
    if (format !== 'text/tab-separated-values') {
        return res.status(400).json({ message: 'Invalid format' });
    }

    let connection;

    try {
        // Get connection from the pool
        connection = await pool.promise().getConnection();

        // Start transaction
        await connection.beginTransaction();

        const rows = req.body.split(/\r\n|\n|\r/);

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].split(/\t/); // Make sure the split is on tab character only
            if(!row) continue;
            if(row[0] == ''  &&  row.length == 1) continue; 
            if (row.length !== 7) {
                throw new Error('Invalid number of columns');
            }

            // Create the query using parameterized values
            const nconst = row[0] == '\\N' ? "NULL": "\"" + row[0] +"\"";
            const primary_name = row[1] == '\\N' ? "NULL": "\"" + row[1] + "\"";
            const birth_year = row[2] == '\\N' ? "NULL" : row[2];
            const death_year = row[3] == '\\N' ? "NULL" : row[3];
            const primary_profession = row[4] == '\\N' ? "NULL" : row[4].split(',');
            const known_for_titles = row[5] == '\\N' ? "NULL" : row[5].split(',');
            const image_url = row[6] == '\\N' ? "NULL" : "\"" + row[6] + "\"";
            const query = `INSERT INTO professional (nconst, primary_name , birth_date , death_date , image_url, biography) VALUES (${nconst},${primary_name}, ${birth_year}, ${death_year}, ${image_url}, NULL)`;
            const results = await connection.query(query);
            if(known_for_titles !== "NULL"){
                for (const title of known_for_titles) {
                    console.log(title);
                    const mediaIdQuery = `SELECT media_id FROM media WHERE tconst = ?`; // Adjust table/column name accordingly
                    const [mediaIdResults] = await connection.execute(mediaIdQuery, [title]);
                    if (mediaIdResults.length === 0) {
                        throw new Error('Media ID not found');
                    }
                    const media_id = mediaIdResults[0].media_id;
                    await connection.query(`INSERT INTO known_for (professional_id, media_id) VALUES (${results[0].insertId}, ${media_id})`);
                }
            }
            if(primary_profession == "NULL") continue;
            for (const profession of primary_profession) {
                await connection.query(`INSERT INTO primary_profession (professional_id, profession) VALUES (${results[0].insertId}, '${profession}');`);
            }
        }

        // Commit the transaction
        await connection.commit();
        res.status(200).json({ message: 'Name basics uploaded' });
    } catch (error) {
        // If error, roll back the transaction
        if (connection) await connection.rollback();

        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        if (connection) connection.release(); // Release the connection back to the pool
    }
}


exports.uploadTitleCrew = async (req, res) => {
    const format = req.headers['content-type'];
    if (format !== 'text/tab-separated-values') {
        return res.status(400).json({ message: 'Invalid format' });
    }

    let connection;

    try {
        // Get connection from the pool
        connection = await pool.promise().getConnection();

        // Start transaction
        await connection.beginTransaction();

        const rows = req.body.split(/\r\n|\n|\r/);

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].split(/\t/); // Make sure the split is on tab character only
            if(!row) continue;
            if(row[0] == ''  &&  row.length == 1) continue; 
            if (row.length !== 3) {
                throw new Error('Invalid number of columns');
            }

            // Create the query using parameterized values
            const mediaIdQuery = `SELECT media_id FROM media WHERE tconst = ?`; // Adjust table/column name accordingly
            const [mediaIdResults] = await connection.execute(mediaIdQuery, [row[0]]);
            if (mediaIdResults.length === 0) {
                throw new Error('Media ID not found');
            }

            
            // Create the query using parameterized values
            const media_id = mediaIdResults[0].media_id;
            const directors = row[1] == '\\N' ? "NULL" : row[1].split(',');
            const writers = row[2] == '\\N' ? "NULL" : row[2].split(',');
            if(directors !== "NULL"){
                for (const director of directors) {
                    const pr_id = `SELECT professional_id FROM professional WHERE nconst = ?`; // Adjust table/column name accordingly
                    const [prof_id] = await connection.execute(pr_id, [director]);
                    if (prof_id.length === 0) {
                        throw new Error('Professional ID not found');
                    }
                    await connection.query(`INSERT INTO directs (media_id, professional_id) VALUES (${media_id}, ${prof_id[0].professional_id});`);
                }
            }
            if(writers !== "NULL"){
                for (const writer of writers) {
                    const pr_id = `SELECT professional_id FROM professional WHERE nconst = ?`; // Adjust table/column name accordingly
                    const [prof_id] = await connection.execute(pr_id, [writer]);
                    if (prof_id.length === 0) {
                        throw new Error('Professional ID not found');
                    }
                    await connection.query(`INSERT INTO writes (media_id, professional_id) VALUES (${media_id}, ${prof_id[0].professional_id});`);
                }
            }
        }

        // Commit the transaction
        await connection.commit();
        res.status(200).json({ message: 'Title crew uploaded' });
    } catch (error) {
        // If error, roll back the transaction
        if (connection) await connection.rollback();

        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        if (connection) connection.release(); // Release the connection back to the pool
    }
}

exports.uploadTitleEpisode = async (req, res) => {
    const format = req.headers['content-type'];
    if (format !== 'text/tab-separated-values') {
        return res.status(400).json({ message: 'Invalid format' });
    }

    let connection;

    try {
        // Get connection from the pool
        connection = await pool.promise().getConnection();

        // Start transaction
        await connection.beginTransaction();

        const rows = req.body.split(/\r\n|\n|\r/);

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].split(/\t/); // Make sure the split is on tab character only
            if(!row) continue;
            if(row[0] == ''  &&  row.length == 1) continue; 
            if (row.length !== 4) {
                throw new Error('Invalid number of columns');
            }

            const mediaIdQuery = `SELECT media_id FROM media WHERE tconst = ?`; // Adjust table/column name accordingly
            const [mediaIdResults] = await connection.execute(mediaIdQuery, [row[0]]);
            if (mediaIdResults.length === 0) {
                throw new Error('Media ID not found');
            }
            const [belongsToResults] = await connection.execute(mediaIdQuery, [row[1]]);
            if (belongsToResults.length === 0) {
                throw new Error('Media ID not found');
            }
            // Create the query using parameterized values
            const media_id = mediaIdResults[0].media_id;
            const belongs_to = belongsToResults[0].media_id;
            const season_number = row[2] == '\\N' ? "NULL" : row[2];
            const episode_number = row[3] == '\\N' ? "NULL" : row[3];
            const query = `INSERT INTO episode_details (episode_id, belongs_to , season_number , episode_number) VALUES (${media_id}, ${belongs_to}, ${season_number}, ${episode_number})`;
            const results = await connection.query(query);
        }

        // Commit the transaction
        await connection.commit();
        res.status(200).json({ message: 'Title episode uploaded' });
    } catch (error) {
        // If error, roll back the transaction
        if (connection) await connection.rollback();

        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        if (connection) connection.release(); // Release the connection back to the pool
    }
}

exports.uploadTitlePrincipals = async (req, res) => {
    const format = req.headers['content-type'];
    if (format !== 'text/tab-separated-values') {
        return res.status(400).json({ message: 'Invalid format' });
    }

    let connection;

    try {
        // Get connection from the pool
        connection = await pool.promise().getConnection();

        // Start transaction
        await connection.beginTransaction();

        const rows = req.body.split(/\r\n|\n|\r/);

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].split(/\t/); // Make sure the split is on tab character only
            if(!row) continue;
            if(row[0] == ''  &&  row.length == 1) continue; 
            if (row.length !== 7) {
                throw new Error('Invalid number of columns');
            }
            const mediaIdQuery = `SELECT media_id FROM media WHERE tconst = ?`; // Adjust table/column name accordingly
            const [mediaIdResults] = await connection.execute(mediaIdQuery, [row[0]]);
            if (mediaIdResults.length === 0) {
                throw new Error('Media ID not found');
            }
            const media_id = mediaIdResults[0].media_id;
            const profIdQuery = `SELECT professional_id FROM professional WHERE nconst = ?`; // Adjust table/column name accordingly
            const [profIdResults] = await connection.execute(profIdQuery, [row[2]]);
            if (profIdResults.length === 0) {
                throw new Error('Professional ID not found');
            }
            const professional_id = profIdResults[0].professional_id;
            
            // Create the query using parameterized values
            
            const ordering = row[1] == '\\N' ? "NULL" : row[1];
            const category = row[3] == '\\N' ? "NULL" : "\"" + row[3] + "\"";
            const job = row[4] == '\\N' ? "NULL" : "\"" + row[4] + "\"";
            const characters = row[5] == '\\N' ? "NULL" :  row[5].split(',');
            const image_url = row[6] == '\\N' ? "NULL" : "\"" + row[6] + "\"";
            const query = `INSERT INTO principal (media_id , ordering , professional_id, category, job) VALUES (${media_id}, ${ordering}, ${professional_id}, ${category}, ${job})`;
            await connection.query(query);
            if(characters !== "NULL") {
                for (const character of characters) {
                    await connection.query(`INSERT INTO characters (professional_id,media_id, name) VALUES (${professional_id},${media_id}, '${character}');`);
                }
            }
        }

        // Commit the transaction
        await connection.commit();
        res.status(200).json({ message: 'Title principals uploaded' });
    } catch (error) {
        // If error, roll back the transaction
        if (connection) await connection.rollback();

        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        if (connection) connection.release(); // Release the connection back to the pool
    }
}

exports.uploadTitleRatings = async (req, res) => {
    const format = req.headers['content-type'];
    if (format !== 'text/tab-separated-values') {
        return res.status(400).json({ message: 'Invalid format' });
    }

    let connection;

    try {
        // Get connection from the pool
        connection = await pool.promise().getConnection();

        // Start transaction
        await connection.beginTransaction();

        const rows = req.body.split(/\r\n|\n|\r/);

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].split(/\t/); // Make sure the split is on tab character only
            if(!row) continue;
            if(row[0] == ''  &&  row.length == 1) continue; 
            if (row.length !== 3) {
                throw new Error('Invalid number of columns');
            }

            const mediaIdQuery = `SELECT media_id FROM media WHERE tconst = ?`; // Adjust table/column name accordingly
            const [mediaIdResults] = await connection.execute(mediaIdQuery, [row[0]]);
            if (mediaIdResults.length === 0) {
                throw new Error('Media ID not found');
            }

            // Create the query using parameterized values
            const media_id = mediaIdResults[0].media_id;
            const rating = row[1] == '\\N' ? "NULL" : row[1];
            const no_of_ratings = row[2] == '\\N' ? "NULL" : row[2];
            const query = `UPDATE media SET rating = ${rating}, no_of_ratings = ${no_of_ratings} WHERE media_id = ${media_id}`;
            await connection.query(query);
        }

        // Commit the transaction
        await connection.commit();
        res.status(200).json({ message: 'Title ratings uploaded' });
    } catch (error) {
        // If error, roll back the transaction
        if (connection) await connection.rollback();

        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        if (connection) connection.release(); // Release the connection back to the pool
    }
}

exports.usermod = async (req, res) => {
    const username = req.params.username;
    const password = crypto.createHash('sha256').update(req.params.password).digest('hex');
    let connection;

    try {
        // Get connection from the pool
        connection = await pool.promise().getConnection();

        // Start transaction
        await connection.beginTransaction();

        var query = `SELECT * FROM user WHERE username = '${username}'`;

        const results = await connection.query(query);
        query  = results[0].length == 0 ? `INSERT INTO user (username, password, first_name,last_name,
                                            birth_date,role,account_status) 
                                            VALUES ('${username}', '${password}', NULL, NULL, NULL, 'user', 'active')` : 
                                            `UPDATE user SET password = '${password}' WHERE username = '${username}'`;
        await connection.query(query);
        // Commit the transaction
        await connection.commit();
        res.status(200).json({ message: 'User Updated' });
    } catch (error) {
        // If error, roll back the transaction
        if (connection) await connection.rollback();

        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        if (connection) connection.release(); // Release the connection back to the pool
    }
}

exports.users = async (req, res) => {
    const username = req.params.username;
    const query = `SELECT * FROM user WHERE username = '${username}'`;
    pool.getConnection((err, connection) => {
        connection.query(query, (err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Internal server error' });
            return res.status(200).json(rows[0]);
        });
    });
}
