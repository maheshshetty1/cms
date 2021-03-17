const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const { userAuthenticated } = require('../../helpers/authentication');


router.all('/*', userAuthenticated, (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});


// router.get('/', (req, res) => {
//     //Comment.find({ user: req.user }).populate('user').lean().then(comments =>
//     Comment.find({}).populate('user').lean().then(comments => {
//         res.render('admin/comments', { comments: comments });
//     }).catch(err => {
//         res.send(err);
//     })

// });

router.get('/',(req,res)=>{
    Post.find({user : req.user._id}).populate({path:'comments',populate:({path:'user',model:'users'})}).lean().then(posts=>{
        const comments = [];
        posts.forEach( post => {
            post.comments.forEach(comment => {
                comments.push(comment);
            });
        });
        res.render('admin/comments',{comments:comments});
    }).catch(err=>{
        if(err) throw err;
    });
});


router.post('/', (req, res) => {
    Post.findOne({ _id: req.body.id }).then(post => {
        const newComment = new Comment({
            user: req.user._id,
            body: req.body.body
        });
        post.comments.push(newComment);
        post.save().then(() => {
            newComment.save();
            req.flash('success_message', 'your comment will be reviewed shortly');
            res.redirect(`/post/${post.slug}`);
        });

    }).catch(err => {
        console.log(err);
        res.send('error');
    })
});

router.put('/approveComment/:id', (req, res) => {
    Comment.findOneAndUpdate({ _id: req.params.id }, { $set: { approveComment: req.body.approveComment } }, (err, result) => {
        if (err) return err;
        res.send(result);
    });

});


router.delete('/:id', (req, res) => {
    Post.findOneAndUpdate({ comments: req.params.id }, { $pull: { comments: req.params.id } }).then(updatedPost => {
        Comment.findOneAndDelete({ _id: req.params.id }).then(commentDeleted => {
            res.redirect('/admin/comments');
        }).catch(err => {
            res.send('something gone wrong while deleteing this comment');
        });
    }).catch(err => {
        res.send('something gone wrong while deleteing this comment from  the post');
    });
});


module.exports = router;