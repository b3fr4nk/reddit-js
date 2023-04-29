const Post = require('../models/post');

module.exports = (app) => {

  // CREATE
  app.post('/posts/new', (req, res) => {
    // can only post if a user is logged in
    if(req.user){
      // INSTANTIATE INSTANCE OF POST MODEL
    const post = new Post(req.body);

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
    Post.findById(req.params.id).lean().populate('comments')
      .then((post) => res.render('posts-show', { post }))
      .catch((err) => {
        console.log(err.message);
      });
  });

};