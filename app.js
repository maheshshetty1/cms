const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const database = require('./config/database');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const passport = require('passport');

//mongoose.Promise = global.Promise;
mongoose.connect(database.mongodbUrl, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then((db) => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});




app.use(express.static(path.join(__dirname, 'public')));
//Set View 




const { select, dateModifier, paginate } = require('./helpers/handlebars-helper');
const { fetchUser } = require('./helpers/comments-helper');

app.engine('handlebars', exphbs({ defaultLayout: 'home', extname: 'handlebars', helpers: { select: select, dateModifier: dateModifier, fetchUser: fetchUser, paginate:paginate } }));
app.set('view engine', 'handlebars');

//Upload Middleware
app.use(upload());

//Session
app.use(session({
    secret: 'maheshshetty',
    saveUninitialized: true,
    resave: true
}));

//use flash
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.form_errors = req.flash('form_errors');
    res.locals.error = req.flash('error');
    next();
});

//Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));


//Load routes
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');
const comments = require('./routes/admin/comments');

// use routes
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);
app.use('/admin/comments', comments);

//PASSPORT Configs for user Authentication



app.listen(4112, () => {
    console.log('listening on 4112');
});