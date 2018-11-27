// Load the express module and store it in the variable express (Where do you think this comes from?)
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose')

// invoke express and store the result in the variable app
const app = express()

// Require body-parser (to receive post data from clients)
const bodyParser = require('body-parser')
// Require path
const path = require('path')
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')))
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'))




// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// #### DATABASE CONNECTION #####

// CONNECT TO MONGOOSE DB
mongoose.connect('mongodb://localhost/todo-dev', {
    useNewUrlParser: true
})
.then(() => console.log('MongoDB Connected ... '))
.catch(err => console.log(err));



// #### MODELS #####

// Load Item Model
require('./models/Item')
const Todo = mongoose.model('todos');


// #### MIDDLEWARE #####

// Handlebars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

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

// Add Todo Item Form
app.get('/items/add', (req, res) => {
    res.render('items/add')
});

// Process Form
app.post('/items', (req, res) => {
    // initial form testing
    // console.log("Post Data: ", req.body)
    // res.send('OK')

    // INITIALIZE AN ARRAY TO HOLD ERRORS THROWN
    let errors = [];

    if(!req.body.title) {
        errors.push({text:"Please enter a title"})
    }
    if(!req.body.details) {
        errors.push({text:"Please enter item details"})
    }

    if(errors.length > 0) {
        // redirect to the item add view
        res.render('items/add', {
            // pass in the errors to the template
            errors  : errors,
            title   : req.body.title,
            details : req.body.details,
        });
    } else {
        // successfully posted form
        res.send('post item submitted');
    }

});




// tell the express app to listen on port 8000, always put this at the end of your server.js file
app.listen(5000, function () {
  console.log('listening on port 5000')
})
