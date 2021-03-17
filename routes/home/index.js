const express = require('express');
const router = express.Router();

const Post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require("../../models/User");
const bcryptjs = require('bcryptjs');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const {userAuthenticated} = require('../../helpers/authentication');



passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
   
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    }).lean();
  });

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'home';
    next();
});

router.get('/', (req, res) => {
    const perPage = 5;
    const page = req.query.page || 1;
    Post.find({}).skip((perPage*page)-perPage).limit(perPage).lean().then(posts => {
        Post.countDocuments().then(postsCount=>{
            Category.find({}).lean().then(categories => {
                res.render('home/index', { posts: posts, categories: categories,perPage:perPage, pages: Math.ceil(postsCount/perPage), current: parseInt(page) });
            }).catch(err => {
                if (err) throw err;
            });
        }).catch(err=>{if(err) throw err;});
    }).catch(err => {
        throw err;
    })


});

router.get('/post/:slug',(req, res) => {
    Post.findOne({ slug: req.params.slug}).populate({path:'comments',match:{approveComment: true},populate:{path:'user',model:'users'}}).populate('user').lean().then(post => {
        Category.find({}).lean().then(categories => {
            res.render('home/post', { post: post, categories: categories});
        }).catch(err => {
            if (err) throw err;
        });

    }).catch(err => {
        throw err;
    })


});


router.get('/about', (req, res) => {
    res.render('home/about');
});

router.get('/register', (req, res) => {
    res.render('home/register');
});

router.get('/login', (req, res) => {
    res.render('home/login');
});

router.get('/logout',(req,res)=>{
    req.logOut();
    res.redirect('/login');
});

passport.use(new LocalStrategy({usernameField: 'email'},(email,password,done)=>{
    User.findOne({email:email},(err,user)=>{
        if (err) { return done(err); }
      if (!user) { return done(null, false,{message :'user not found'}); }
      bcryptjs.compare(password,user.password,(err,matched)=>{
        if (!matched) { return done(null, false,{message :'Incorrect Password'}); }
        return done(null, user);
      });
    });
}));

router.post('/login', (req, res,next) => {
    passport.authenticate('local',{
        successRedirect : '/admin',
        failureRedirect: '/login',
        failureFlash : true
    })(req,res,next);
});

router.post('/register', (req, res) => {


    let errors = [];
    if (!req.body.firstName) {
        errors.push({ message: 'please add the first name' });
    }
    if (!req.body.lastName) {
        errors.push({ message: 'please add the last name ' });
    }
    if (!req.body.email) {
        errors.push({ message: 'please add an email' });
    }
    if (!req.body.password) {
        errors.push({ message: 'please add the password' });
    }
    if (!req.body.passwordConfirm) {
        errors.push({ message: 'please add the confirm password' });
    }
    if (!(req.body.password == req.body.passwordConfirm)) {
        errors.push({ message: 'passwords dont match' });
    }

    if(errors.length > 0 ){
        res.render('home/register', {
            errors: errors, firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, password: req.body.password, passwordConfirm: req.body.passwordConfirm
        });
    } else {
        User.findOne({email : req.body.email}).lean().then(user=>{
            if(!user){
                const salt = bcryptjs.genSalt();
            const password = '';
            bcryptjs.genSalt(10,(err,salt)=>{
                
                bcryptjs.hash(req.body.password,salt,(err,hashPassword)=>{
                    const newUser = new User({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: hashPassword
                    });
                    newUser.save().then(user => {
                        req.flash('success_message', `user registered successfully please login`);
                        res.redirect('/login');
                    }).catch(err => {
                        if (err) throw err;
                    })
                })
            })
                
            } else{
                errors.push({message : 'user already exists please login'});
                res.render('home/login',{errors:errors,email:user.email});
            }
        }).catch(err => {
            throw err;
        });
    }
});

module.exports = router;