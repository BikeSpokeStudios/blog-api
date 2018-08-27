const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require("./config");
const { BlogPost } = require("./models");

// Establish the CRUD operations
router.get('/', (req, res) => {
  //console.log("Middleware");
  BlogPost.find()
  .then(blogposts => {
    //console.log(blogposts);
    res.json({
      blogposts: blogposts.map(
        (blogpost) => blogpost.serialize())
    });
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({message: 'Internal server error'})
  });
});

//Here's if they want to get a single blog post
router.get('/:id', (req, res) => {
  // ADD THIS CODE
});

router.post('/', jsonParser, (req, res) => {
  // ADD THIS CODE
});

router.delete('/:id', (req, res) => {
  // ADD THIS CODE
});

router.put('/:id', jsonParser, (req, res) => {
  // ADD THIS CODE
});

module.exports = router;
