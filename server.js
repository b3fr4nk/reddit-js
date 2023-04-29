require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const Post = require('./models/post');
const cookieParser = require('cookie-parser')
const checkAuth = require('./middleware/checkAuth')
const app = express();

// Validators
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuth);

// Set db
require('./data/reddit-db');

// Controllers
require('./controllers/posts')(app);
require('./controllers/comments')(app);
require('./controllers/auth')(app);

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    const currentUser = req.user;

    Post.find({}).lean().populate('author')
    .then((posts) => res.render('post-index', {posts, currentUser}))
    .catch((err) => {
        console.log(err.message);
    })
});

app.listen(3000)

module.exports = app;