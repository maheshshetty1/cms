const express = require('express');
const Post = require('../../models/Post');
const faker = require('faker');
const router = express.Router();
const {userAuthenticated} = require('../../helpers/authentication');

router.all('/*',(req,res,next)=>{
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    Post.countDocuments().then(postsCount=>{
        res.render('admin/index',{postsCount:postsCount});
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