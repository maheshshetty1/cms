const { date } = require('faker');
const mongoose = require('mongoose');
const URLSlug = require('mongoose-url-slugs');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'users'
    },
    title: {
        type: String,
        required: true
    },
    slug:{
        type:String
    },
    status: {
        type: String,
        default: 'Public'
    },

    allowComments: {
        type: Boolean,
        required: true
    },

    body: {
        type: String,
        required: true
    },

    file: {
        type: String
    },

    date:{
        type: Date,
        default: Date.now()
    },

    category:{
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },

    comments:[{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }]


});
PostSchema.plugin(URLSlug('title',{field:'slug'}));
module.exports = mongoose.model('posts',PostSchema);