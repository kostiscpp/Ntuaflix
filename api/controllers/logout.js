const { json } = require('express');
const { pool } = require('../utils/database');

exports.logout = (req, res) => {
    return res.status(200).json({ message: 'Logout successful' });
}