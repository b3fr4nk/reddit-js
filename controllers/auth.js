const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = (app) => {
    // SIGN UP FORM
    app.post('/sign-up', (req, res) => {
        // Create User and JWT
        const user = new User(req.body);

        user.save()
        .then((user) => {
            const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '60 days' });
            res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
            return res.redirect('/');
            })
            .catch((err) => {
            console.log(err.message);
            return res.status(400).send({ err });
        });
    });

    app.get('/sign-up', (req, res) => res.render('sign-up'));

    //LOG OUT
    app.get('/logout', (req, res) => {
        res.clearCookie('nToken');
        return res.redirect('/')
    });

};