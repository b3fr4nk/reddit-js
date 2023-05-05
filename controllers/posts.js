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
      post.upVotes = [];
      post.downVotes = [];
      post.voteScore = 0;

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
    Post.findById(req.params.id).populate('comments').lean()
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
    .then((posts) => res.render('post-index', {posts, currentUser}))
    .catch((err) => {
      console.log(err);
    })
  });

  // Update votes
  app.put('/posts/:id/vote-up', (req, res) => {
    Post.findById(req.params.id).then(post => {
      post.upVotes.push(req.user._id);
      post.voteScore += 1;
      post.save();

      return res.status(200);
    }).catch(err => {
      console.log(err);
    })
  });

  app.put('/posts/:id/vote-down', (req, res) => {
    if(req.user){
      Post.findById(req.params.id).then(post => {
        post.downVotes.push(req.user._id);
        post.voteScore -= 1;
        post.save();

        return res.status(200);
      }).catch(err => {
        console.log(err);
      });
    }
    
  });

};