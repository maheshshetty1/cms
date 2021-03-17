const express = require('express');
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const Comment = require('../../models/Comment');
const faker = require('faker');
const router = express.Router();
const {userAuthenticated} = require('../../helpers/authentication');

router.all('/*',(req,res,next)=>{
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {

    const promises = [Post.countDocuments().exec(),Category.countDocuments().exec(),Comment.countDocuments().exec()];
    Promise.all(promises).then(([postCount,categoryCount,commentCount])=>{
        res.render('admin/index',{postCount:postCount,categoryCount:categoryCount,commentCount:commentCount});
    }).catch(err=>{
        if(err) throw err;
    });
});

router.post('/generate-fake-posts',(req,res)=>{
    for (let index = 0; index < req.body.amount; index++) {
        let post = new Post();
        post.title = faker.name.title();
        post.status = 'public';
        post.allowComments = faker.random.boolean();
        post.body = faker.lorem.sentence();
        post.slug = faker.name.title();
        post.save(function(err,savedPost){
            if(err) throw err; 
        }); 
    }
    res.redirect('/admin/posts');
});


module.exports = router;