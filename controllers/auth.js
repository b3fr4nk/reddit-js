const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = (app) => {
    // LOGIN
    app.post('/login', (req, res) => {
        const {username, password} = req.body;
        //find the user
        User.findOne({username}, 'username password')
        .then((user) => {
            if(!user){
                //user not found
                return res.status(401).send({message: 'Wrong username or password'});
            }
            //check the password
            user.comparePassword(password, (err, isMatch) => {
                if(!isMatch){
                    //password does not match
                    return res.status(401).send({ message: 'Wrong username or password'});
                }
                const token = jwt.sign({_id: user._id, username: user.username}, process.env.SECRET, {
                    expiresIn: '60 days'
                });
                // Set a cookie and redirect to root
                res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
                return res.redirect('/');
            });
        })
        .catch((err) => {
            console.log(err);
        });
    });

    app.get('/login', (req, res) => {
        return res.render('login')
    })

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