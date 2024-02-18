const { json } = require('express');
const { pool } = require('../utils/database');
const nOfromArray = require('../utils/nOfromArray');

exports.name = async (req, res) => {
    const nameID = req.params.nameID;
    if (!nameID) {
        return res.status(400).send('nameID is required');
    }
    const query = `SELECT pf.nconst, pf.primary_name, pf.image_url, pf.birth_date, 
        pf.death_date, (
            SELECT pr.profession
            FROM primary_profession pr
            WHERE pr.professional_id = pf.professional_id LIMIT 1
        ) AS profession, m.tconst, p.category
        FROM professional pf
        LEFT JOIN principal p
        ON p.professional_id = pf.professional_id
        LEFT JOIN media m
        ON m.media_id = p.media_id
        WHERE pf.nconst = ?`;
    pool.getConnection((err, connection) => {
        connection.query(query, [nameID], (err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Internal server error' });
            return res.status(200).json(nOfromArray(rows));
        });
    });
}