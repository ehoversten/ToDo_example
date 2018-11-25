// Load the express module and store it in the variable express (Where do you think this comes from?)
const express = require('express');
const exphbs = require('express-handlebars');

// invoke express and store the result in the variable app
const app = express()

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
