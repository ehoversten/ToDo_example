// Load the express module and store it in the variable express (Where do you think this comes from?)
const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
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

// TO DO ITEM LIST PAGE
app.get('/items', (req, res) => {
    // ---- Return a CONTEXT to the view --- //
    Item.find({})
        .sort({date:'desc'})
        .then(items => {
            res.render('items/index', {
                items : items
            });
        });

    // ----  Return JSON Response ----- // 
    // Item.find( {}, (error, items) => {
    //     if(items) {
    //         console.log("Found: ", items)
    //         return res.status(200).json(items);
    //     } else {
    //         return res.status(404).json({
    //             "error": err,
    //             "message": "Something went terribly terribly wrong!",
    //         });
    //     }
    // });

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
        const newItem = {
            title   : req.body.title,
            details : req.body.details,
        }

        new Item(newItem)
            .save()
            .then(item => {
                res.redirect('/items')
            })
        // res.send('post item submitted');

    }

});

// Edit Todo Item
app.get('/items/edit/:id', (req, res) => {
    Item.findOne({
        _id: req.params.id 
    })
    .then(item => {
        res.render('items/edit', {
            item : item
        });
    });
});

// Process Edit Form
app.put('/items/:id', (req, res) => {
    Item.findOne({
        _id: req.params.id
    })
    .then(item => {
        // Update values
        item.title   = req.body.title;
        item.details = req.body.details;

        item.save()
            .then(item => {
                res.redirect('/items')
            })
    });
});

// Delete ITEM
app.delete('/items/:id', (req, res) => {
    Item.deleteOne({_id: req.params.id})
        .then(() => {
            res.redirect('/items')
        });
});




// tell the express app to listen on port 8000, always put this at the end of your server.js file
app.listen(5000, function () {
  console.log('listening on port 5000')
})
