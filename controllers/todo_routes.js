// Load the express module
const express = require('express');
// Load the express router
const router = express.Router();
const methodOverride = require('method-override');
const mongoose = require('mongoose');

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
require('../models/Item')
const Item = mongoose.model('Item');

// TO DO ITEM LIST PAGE
router.get('/', (req, res) => {
    // ---- Return a CONTEXT to the view --- //
    Item.find({})
        .sort({ date: 'desc' })
        .then(items => {
            res.render('items/index', {
                items: items
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
router.get('/add', (req, res) => {
    res.render('items/add')
});

// Process Form
router.post('/', (req, res) => {
    // initial form testing
    // console.log("Post Data: ", req.body)
    // res.send('OK')

    // INITIALIZE AN ARRAY TO HOLD ERRORS THROWN
    let errors = [];

    if (!req.body.title) {
        errors.push({ text: "Please enter a title" })
    }
    if (!req.body.details) {
        errors.push({ text: "Please enter item details" })
    }

    if (errors.length > 0) {
        // redirect to the item add view
        res.render('items/add', {
            // pass in the errors to the template
            errors: errors,
            title: req.body.title,
            details: req.body.details,
        });
    } else {
        // successfully posted form
        const newItem = {
            title: req.body.title,
            details: req.body.details,
        }

        new Item(newItem)
            .save()
            .then(item => {
                req.flash('success_msg', 'New To-Do item added!')
                res.redirect('/items')
            })
    }
});

// Edit Todo Item
router.get('/edit/:id', (req, res) => {
    Item.findOne({
        _id: req.params.id
    })
        .then(item => {
            res.render('items/edit', {
                item: item
            });
        });
});

// Process Edit Form
router.put('/:id', (req, res) => {
    Item.findOne({
        _id: req.params.id
    })
        .then(item => {
            // Update values
            item.title = req.body.title;
            item.details = req.body.details;

            item.save()
                .then(item => {
                    req.flash('success_msg', 'Item has been updated!')
                    res.redirect('/items')
                })
        });
});

// Delete ITEM
router.delete('/:id', (req, res) => {
    Item.deleteOne({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', "Item has been removed");
            res.redirect('/items')
        });
});


module.exports = router;