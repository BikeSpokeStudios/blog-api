const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require("./config");
const { Author, BlogPost } = require("./models");

// Establish the CRUD operations
router.get('/', (req, res) => {
  BlogPost.find()
  .then(blogposts => {
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

router.get('/:id', (req, res) => {
  // Get a single post by id
  BlogPost.findById(req.params.id)
  .then(blogpost => {
    res.json({
      id: blogpost._id,
      title: blogpost.title,
      author: blogpost.authorString,
      content: blogpost.content,
      comments: blogpost.comments
    });
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  });
});

router.post('/', (req, res) => {
  // Add a new Blog Post
  const requiredFields = ["title", "content", "author_id"];
  for ( let i = 0; i < requiredFields.length; i++ ) {
    const field = requiredFields[i];
    if ( !( field in req.body ) ) {
      const message = `Missing ${field} in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  var start = req.body.author_id.indexOf("(");
  var end = req.body.author_id.indexOf(")");
  var length = end - start;
  var id = req.body.author_id.substr(start + 1, length - 1);
  //console.log(start, end, length, id);
  Author.findById(id)
  .then(author => {
    if (author) {
      //console.log(author);
      BlogPost.create({
        title: req.body.title,
        content: req.body.content,
        author: author._id
      })
      .then(blogpost => res.status(201).json({
        id: blogpost._id,
        author: `${author.firstName} ${author.lastName}`,
        content: blogpost.content,
        title: blogpost.title,
        comments: blogpost.comments
      }))
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
      });
    } else {
      const message = `Something went wrong!`;
      console.error(message);
      return res.status(500).send(message);
    }
  }).catch(err => {
    console.error(err);
    res.status(400).json({ message: `Author Id ${req.body.author_id} not in the database` });
  });

});

router.delete('/:id', (req, res) => {
  BlogPost.findByIdAndRemove(req.params.id)
  .then(() => {
    console.log(`${req.params.id} was deleted from the database`);
    res.status(204).end();
  }).catch(err => res.status(500).json({ message: "Internal server error" }));
});

router.put('/:id', (req, res) => {
  if ( !( req.params.id && req.body.id && req.params.id === req.body.id ) ) {
    const message =  `Request path id and request body id must match`;
    console.error(message);
    return res.status(400).json({ message: message });
  }

  const toUpdate = {};
  const updateableFields = ["title", "content"];

  updateableFields.forEach(field => {
    if ( field in req.body ) {
      toUpdate[field] = req.body[field];
    }
  });

  BlogPost.findByIdAndUpdate( req.params.id, { $set: toUpdate }, { new: true } )
  .then(blogpost => res.status(200).json({
    title: blogpost.title,
    content: blogpost.content,
    author: blogpost.authorString
  }))
  .catch(err => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  });
});

module.exports = router;
