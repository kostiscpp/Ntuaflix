const { json } = require('express');
const { pool } = require('../utils/database');

exports.login = (req, res) => {
    if(req.headers['content-type'] !== "application/x-www-form-urlencoded") {
        return res.status(400).json({ message: 'Content-Type must be application/x-www-form-urlencoded' });
    }
    function generateToken(role) {
        return role === 'admin' ? process.env.AUTH_ADMIN : process.env.AUTH_USER;
    }
    const username = req.body.username;
    const password = req.body.password;
    const query = `SELECT * FROM user WHERE username = ? AND password = ?`;
    pool.getConnection((err, connection) => {
        connection.query(query, [username, password],(err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Internal server error' });
            if (rows.length === 0) return res.status(401).json({ message: 'Wrong username or password' });
        
            return res.status(200).json({ token: generateToken(rows[0].role) });
        });
    });
}