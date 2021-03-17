const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
const uploadHelper = require('../../helpers/upload-helper');
const fs = require('fs');
let errors = [];
router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    Category.find().lean().then(categories => {
        res.render('admin/categories/index',{categories:categories,errors:errors});
        errors=[];
    }).catch(err=>{
        if(err) throw err;
    });
    
});

router.post('/create', (req, res) => {
    errors = [];
    if(!req.body.name){
        errors.push({message: 'Please enter the name'});
    }
    if(errors.length>0){
        res.redirect('/admin/categories');
    }
    else{
        new Category({ name : req.body.name }).save().then(category => {
            req.flash('success_message', `Category with Name ${category.name} successfully created`);
            res.redirect('/admin/categories');
        }).catch(err => {
            if(err) throw err;
        });

    }
    

});

router.get('/edit/:id', (req, res) => {
    Category.findOne({_id:req.params.id}).lean().then(category => {
        res.render('admin/categories/edit',{category:category});
        errors=[];
    }).catch(err=>{
        if(err) throw err;
    });
    
});

router.put('/edit/:id', (req, res) => {
    errors = [];
    if(!req.body.name){
        errors.push({message: 'Please enter the name'});
    }
    if(errors.length>0){
        res.redirect('/admin/categories');
    }
    else{

        Category.updateOne({_id:req.params.id},{
            name : req.body.name
        }).then(updatedCategory => {
            console.log(updatedCategory);
            req.flash('success_message', `Category successfully updated`);
            res.redirect('/admin/categories');
        }).catch(err=>{
            if(err) throw err;
        });

    }
    

});

router.delete('/delete/:id', (req, res) => {
    Category.deleteOne({_id:req.params.id}).lean().then(result => {
        req.flash('success_message',`Category successfully deleted`);
        res.redirect('/admin/categories');
        errors=[];
    }).catch(err=>{
        if(err) throw err;
    });
    
});

module.exports = router;