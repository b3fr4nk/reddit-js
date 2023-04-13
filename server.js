const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

// CASES RESOURCES

// NEW

app.get('/cases/new', (req, res) => {
    res.render('cases-new', {});
});

app.listen(3000)