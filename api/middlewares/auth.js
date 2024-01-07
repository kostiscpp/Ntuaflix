exports.authenticateadmin = (req, res, next) => {
    const secretKey = req.headers['x-observatory-auth'];
    console.log(req.headers);
    if (secretKey !== process.env.AUTH_ADMIN) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    next();
}
exports.authenticateuser = (req, res, next) => {
    const secretKey = req.headers['x-observatory-auth'];
    console.log(secretKey);
    if (secretKey !== process.env.AUTH_USER && secretKey !== process.env.AUTH_ADMIN) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    next();
}

