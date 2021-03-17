const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
const uploadHelper = require('../../helpers/upload-helper');
const fs = require('fs');
const Category = require('../../models/Category');
const Comment = require('../../models/Comment');
const {userAuthenticated} = require('../../helpers/authentication');

router.all('/*', userAuthenticated, (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    Post.find().populate('category').lean().then(posts => {
        res.render('admin/posts', { posts: posts });
    }).catch(err => {
        if(err) throw err;
    })

});

router.get('/my-posts', (req, res) => {
    Post.find({user: req.user._id}).populate('category').lean().then(posts => {
        res.render('admin/posts', { posts: posts });
    }).catch(err => {
        res.render('admin/posts');
    })

});

router.get('/create', (req, res) => {
    Category.find({}).lean().then(categories => {
        res.render('admin/posts/create',{categories:categories});
    }).catch(err=>{
        res.send('error');
    });
    

});

router.get('/edit/:id', (req, res) => {
    Post.findOne({ _id: req.params.id }).lean().then(post => {
        Category.find({}).lean().then(categories => {
            res.render('admin/posts/edit', { post: post,categories:categories });    
        }).catch(err => {
            res.send('error');
        })
        
    }).catch(err => {
        res.send('error');
    });
});

router.put('/edit/:id', (req, res) => {
    Post.findOne({ _id: req.params.id }).then(post => {
        if (req.body.allowComments) {
            allowComments = true;
        } else {
            allowComments = false;
        }

        post.title = req.body.title;
        post.status = req.body.status;
        post.allowComments = allowComments;
        post.date = Date.now();
        post.body = req.body.body;
        post.category = req.body.category;
        if (!isEmpty(req.files)) {
            let file = req.files.file;
            fileName = Date.now() + '-' + file.name;
            post.file = fileName;
            let dirToUpload = './public/uploads/';
            file.mv(dirToUpload + fileName, (err) => {
                if (err) throw err;
            });
        }

        post.save().then(updatedPost => {
            req.flash('success_message', `updated successfully`);
            res.redirect('/admin/posts/my-posts');
        }).catch(err => {

        });

    }).catch(err => {

    })
});


router.delete('/:id', (req, res) => {
    Post.findOne({ _id: req.params.id }).populate('comments').then(post => {
        
        if(!post.comments.length <1){
            post.comments.forEach(comment => {
                comment.remove();
            });
        }

        if (fs.existsSync(uploadDir + post.file)) {
            fs.unlink(uploadDir + post.file, (err) => {
                if (err) throw err;
            });
        }
        
        post.remove().then(commentsRemoved=>{
            req.flash('success_message', `post deleted successfully`);
        res.redirect('/admin/posts/my-posts');
        }).catch(err=>{
            throw err;
        });
        

    }).catch(err => {
        res.send('error deleting the post ' + err);
    });
});

router.post('/create', (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({ message: 'please add a title' });
    }
    if (errors.length > 0) {
        res.render('admin/posts/create', {
            errors: errors
        });
    } else {
        let fileName = '';
        if (!isEmpty(req.files)) {
            let file = req.files.file;
            fileName = Date.now() + '-' + file.name;
            let dirToUpload = './public/uploads/';
            file.mv(dirToUpload + fileName, (err) => {
                if (err) throw err;
            });
        }
        if (req.body.allowComments) {
            allowComments = true;
        } else {
            allowComments = false;
        }
        new Post({
            user: req.user._id,
            title: req.body.title,
            status: req.body.status,
            allowComments: allowComments,
            body: req.body.body,
            file: fileName,
            category: req.body.category,
        }).save().then((post) => {
            req.flash('success_message', `post ${post.title} created successfully`);
            res.redirect('/admin/posts/my-posts');
        }).catch((err) => {
            res.send('unable to save post ' + err);
        });
    }

});

module.exports = router;