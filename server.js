const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

// Validators
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set db
require('./data/reddit-db');

// Controllers
require('./controllers/posts')(app);

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

// POSTS

// NEW
app.get('/posts/new', function (req, res) {
    res.render('new-post', {});
});

app.listen(3000)