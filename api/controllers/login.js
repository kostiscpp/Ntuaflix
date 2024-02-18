const { json } = require('express');
const { pool } = require('../utils/database');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
    if(req.headers['content-type'] !== "application/x-www-form-urlencoded") {
        return res.status(400).json({ message: 'Content-Type must be application/x-www-form-urlencoded' });
    }
    function generateToken(user) {
        const payload = {
            userId: user.user_id, // Include user ID in the payload
            role: user.role // Include the role in the payload
        };
        // Sign the token with your secret key and set an expiration (e.g., 1 hour)
        return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    }
    const username = req.body.username;
    const password = crypto.createHash('sha256').update(req.body.password).digest('hex');
    const query = `SELECT * FROM user WHERE username = ? AND password = ?`;
    pool.getConnection((err, connection) => {
        connection.query(query, [username, password],(err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Internal server error' });
            if (rows.length === 0) return res.status(401).json({ message: 'Wrong username or password' });
            return res.status(200).json({ token: generateToken(rows[0]) });
        });
    });
}