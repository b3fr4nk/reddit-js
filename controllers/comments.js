const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports = (app) => {
    // CREATE Comment
    app.post('/posts/:postId/comments', (req, res) => {
        if(req.user){
            // INSTANTIATE INSTANCE OF MODEL
            const comment = new Comment(req.body);
            comment.author = req.user._id;

            // SAVE INSTANCE OF Comment MODEL TO DB
            comment.save()
            .then(() => Post.findById(req.params.postId))
            .then((post) => {
                console.log(post)
                post.comments.unshift(comment);
                return post.save();
            })
            .then(() => res.redirect('/posts/' + req.params.postId))
            .catch((err) => {
                console.log(err);
            });
        }
        
    });
};
