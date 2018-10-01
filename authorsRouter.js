const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require("./config");
const { Author, BlogPost } = require("./models");

//Establish the CRUD Operations
router.post('/', (req, res) => {
  const requiredFields = ["firstName", "lastName", "userName"];
  for ( let i = 0; i < requiredFields.length; i++ ) {
    const field = requiredFields[i];
    if ( !( field in req.body ) ) {
      const message = `Missing ${field} in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Author.findOne( {userName: req.body.userName} )
  .then(author => {
    if (author) {
      const message = `Username ${req.body.userName} already exists`;
      console.log(message);
      res.status(400).json({ message: message });
    } else {
      // add the author to the database
      Author.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName
      })
      .then(author => res.status(201).json({
        _id: author._id,
        name: `${author.firstName} ${author.lastName}`,
        userName: author.userName
      })).catch(err => {
        console.error(err);
        res.status(500).json({ message: "Internal server error"});
      });
    }
  }).catch(err => {
    console.error(err);
    res.status(500).json({ message: "Internal server error"});
  });

});

router.put('/:id', (req, res) => {
  if ( !req.body.id ) {
    const message = "The request body must have an id!";
    console.error(message);
    return res.status(400).json({ message: message });
  }
  if ( !( req.params.id && req.body.id && req.params.id === req.body.id ) ) {
    const message = "Request body id and path id must match :)";
    console.error(message);
    return res.status(400).json({ message: message });
  }

  if ( req.body.userName ) {
    Author.findOne( {userName: req.body.userName} )
    .then(author => {
      if (author) {
        const message = `Username ${req.body.userName} already exists`;
        console.log(message);
        res.status(400).json({ message: message });
      }
    })
  }

  const toUpdate = {};
  const upDateableFields = ["firstName", "lastName", "userName"];

  upDateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Author.findByIdAndUpdate( req.params.id, { $set: toUpdate }, { new: true } )
  .then(author => res.status(200).json({
    _id: author._id,
    name: `${author.firstName} ${author.lastName}`,
    userName: author.userName
  }))
  .catch(err => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  });
});

module.exports = router;
