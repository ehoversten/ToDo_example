// Load the express module and store it in the variable express (Where do you think this comes from?)
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose')

// invoke express and store the result in the variable app
const app = express()

// Require body-parser (to receive post data from clients)
const bodyParser = require('body-parser')
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }))
// Require path
const path = require('path')
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')))
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'))



// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// CONNECT TO MONGOOSE DB
mongoose.connect('mongodb://localhost/todo-dev', {
  useNewUrlParser: true
})
    .then(() => console.log('MongoDB Connected ... '))
    .catch(err => console.log(err));


// Handlebars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Index Route
app.get('/', (req, res) => {

    const title = 'Welcome';

    res.render('index', { title:title })
})

// About Route
app.get('/about', (req, res) => {
    res.render('about')

})

// tell the express app to listen on port 8000, always put this at the end of your server.js file
app.listen(5000, function () {
  console.log('listening on port 5000')
})
