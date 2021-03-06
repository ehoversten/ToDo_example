// Load the express module and store it in the variable express (Where do you think this comes from?)
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

// invoke express and store the result in the variable app
const app = express()

// Require body-parser (to receive post data from clients)
const bodyParser = require('body-parser');


// Require path
const path = require('path');

// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')))
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'))



// #### DATABASE CONNECTION #####

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// CONNECT TO MONGOOSE DB
mongoose.connect('mongodb://localhost/todo-dev', {
    useNewUrlParser: true
})
.then(() => console.log('MongoDB Connected ... '))
.catch(err => console.log(err));



// #### MODELS #####

// Load Item Model
require('./models/Item')
const Item = mongoose.model('Item');


// #### MIDDLEWARE #####

// Handlebars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

// EXPRESS - SESSION
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
}));


// CONNECT-FLASH (MESSAGES)
app.use(flash());


// #### GLOBAL VARIABLES ####
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();

});

// Connect/Load external Routes
const todos = require('./controllers/todo_routes');

// #### ROUTING #####

// Index Route
app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index', { title:title })
});

// About Route
app.get('/about', (req, res) => {
    res.render('about')
});


// All /items Routes
app.use('/items', todos)


// tell the express app to listen on port 8000, always put this at the end of your server.js file
app.listen(5000, function () {
  console.log('listening on port 5000')
})
