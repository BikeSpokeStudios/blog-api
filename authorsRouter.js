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

module.exports = router;
