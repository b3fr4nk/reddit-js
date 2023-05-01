const Post = require('../models/post');

module.exports = (app) => {

  // CREATE
  app.post('/posts/new', (req, res) => {
    // can only post if a user is logged in
    if(req.user){
      // INSTANTIATE INSTANCE OF POST MODEL
      const userId = req.user._id;
      const post = new Post(req.body);
      post.author = userId;

      // SAVE INSTANCE OF POST MODEL TO DB AND REDIRECT TO THE ROOT
      post.save(() => res.redirect('/'));
    }else{
      return res.status(401) // UNAUTHORIZED
    }
  });

  app.get('/posts/new', (req, res) => {
    // render template
    res.render('post-new');
  });

  // LOOK UP THE POST
  app.get('/posts/:id', (req, res) => {
    const currentUser = req.user;
    Post.findById(req.params.id).lean()
      .then((post) => res.render('posts-show', { post, currentUser }))
      .catch((err) => {
        console.log(err.message);
      });
  });

  //SUBREDDIT
  app.get('/n/:subreddit', (req, res) => {
    const currentUser = req.user;
    const { subreddit } = req.params;
    Post.find({subreddit}).lean()
    .then((posts) => res.render('posts-index', {posts, currentUser}))
    .catch((err) => {
      console.log(err);
    })
  });

};