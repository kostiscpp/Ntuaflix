const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');
const parseFormat = require('./middlewares/parseformat');
/* Import routes */
const admin = require('./endpoints/admin.js');
const title = require('./endpoints/title.js');
const name = require('./endpoints/name.js');
const search = require('./endpoints/search.js');
const login = require('./endpoints/login.js');
const logout = require('./endpoints/logout.js');

/* Bind all endpoints to app router */
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.text({ type: 'text/tab-separated-values' , limit: '500mb' }));
app.use(parseFormat);


/* Routes used */
app.use('/ntuaflix_api/title',parseFormat, title);
app.use('/ntuaflix_api/admin',parseFormat, admin);
app.use('/ntuaflix_api/', parseFormat,search);
app.use('/ntuaflix_api/login', parseFormat,login);
app.use('/ntuaflix_api/logout', parseFormat,logout);
app.use('/ntuaflix_api/name',parseFormat, name);
app.use((req, res, next) => { res.status(404).json({ message: 'Endpoint not found' }) });

module.exports = app;