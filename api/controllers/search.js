const { json } = require('express');
const { pool } = require('../utils/database');
const jsonifyArray = require('../utils/tOfromArray');
const nOfromArray = require('../utils/nOfromArray');
const tOfromArray = require('../utils/tOfromArray');

exports.searchTitle = async (req, res) => {
    const titlePart = req.query.titlePart;
    if (!titlePart) {
        return res.status(400).send('titlePart is required');
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
        WHERE m.original_title LIKE ?`;
    pool.getConnection((err, connection) => {
        connection.query(query, ['%' + titlePart + '%'], (err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Internal server error' });
            return res.status(200).json(jsonifyArray(rows));
        });
    });
}

exports.byGenre = async (req, res) => {
    const qgenre = req.query.qgenre;
    const minrating = req.query.minrating;
    const yrFrom = req.query.yrFrom;
    const yrTo = req.query.yrTo;
    if (!qgenre) {
        return res.status(400).send('qgenre is required');
    }
    if (!minrating) {
        return res.status(400).send('minrating is required');
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
        WHERE m.media_id IN (
            SELECT 
                media_id 
            FROM 
                belongs  
            WHERE 
                genre_id IN (
                    SELECT 
                        genre_id 
                    FROM 
                        genre
                    WHERE 
                        genre_name = ?
                )
        ) AND m.rating >= ?` + (yrFrom ? " AND m.start_year >= ?" : "") +  (yrTo? " AND m.start_year <= ?" : "");
    pool.getConnection((err, connection) => {
        var prms = [qgenre, minrating];
        if (yrFrom) prms.push(yrFrom);
        if (yrTo) prms.push(yrTo);
        connection.query(query, prms, (err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Internal server error' });
            return res.status(200).json(tOfromArray(rows));
        });
    });
}


exports.searchName = async (req, res) => {
    const namePart = req.query.namePart;
    if (!namePart) {
        return res.status(400).send('namePart is required');
    }
    const query = `SELECT pf.professional_id, pf.primary_name, pf.image_url, pf.birth_date, 
        pf.death_date, (
            SELECT pr.profession
            FROM primary_profession pr
            WHERE pr.professional_id = pf.professional_id LIMIT 1
        ) AS profession, m.media_id, p.category
        FROM professional pf
        JOIN principal p
        ON p.professional_id = pf.professional_id
        JOIN media m
        ON m.media_id = p.media_id
        WHERE pf.primary_name LIKE ?`;
    pool.getConnection((err, connection) => {
        connection.query(query, ['%' + namePart + '%'], (err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Internal server error' });
            return res.status(200).json(nOfromArray(rows));
        });
    });
}