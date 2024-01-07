const { json } = require('express');
const { pool } = require('../utils/database');
const jsonifyArray = require('../utils/tOfromArray');

exports.title = async (req, res) => {
    const titleID = req.params.titleID;
    if (!titleID) {
        return res.status(400).send('titleID is required');
    }
    const query = `SELECT m.media_id, m.title_type, m.original_title,
        m.poster_url, m.start_year, m.end_year,
        g.genre_name, a.alt_title, a.region, 
        p.professional_id, pf.primary_name, p.category,
        m.rating, m.no_of_ratings 
        FROM media m 
        JOIN belongs b 
        ON b.media_id = m.media_id
        JOIN genre g
        ON g.genre_id = b.genre_id
        JOIN aka a 
        ON a.media_id = m.media_id
        JOIN principal p
        ON p.media_id = m.media_id
        JOIN professional pf
        ON pf.professional_id = p.professional_id
        WHERE m.media_id = ?`;
    pool.getConnection((err, connection) => {
        connection.query(query, [titleID], (err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Internal server error' });
            return res.status(200).json(jsonifyArray(rows));
        });
    });
}