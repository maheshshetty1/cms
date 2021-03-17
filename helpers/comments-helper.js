const { use } = require('passport');
const Comment = require('../models/Comment');
const User = require('../models/User');
module.exports = {

    fetchUser : function(id){
        Comment.findOne({_id:id}).populate('user').lean().then(comment=> {
            return comment;
        }).catch(err=>{
            return null;
        });
    }


};