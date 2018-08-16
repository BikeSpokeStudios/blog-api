const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {BlogPosts} = require('./models');

const jsonParser = bodyParser.json();
const app = express();

// log the http layer, yo!
app.use(morgan('common'));

// Add some basic Blog posts
BlogPosts.create(
  'My First Day',
  'Today was my first day at work! It was exciting.',
  'David Parker');
BlogPosts.create(
  'My Second Day',
  'Today I learned how to bake bread! It was thrilling.',
  'David Parker',
  'January 1st 2017');

// Establish the CRUD operations

app.get('/blogposts', (req, res) => {
  res.json(BlogPosts.get());
});

app.post('/blogposts', jsonParser, (req, res) => {
  // ensure that there is a title, content, author name,
  // and an optional publication Date
  const requiredFields = ['title', 'content', 'author'];
  for (let i = 0; i<requiredFields.length; i++) {
    if (!(requiredFields[i] in req.body)) {
      const message = `Missing '${requiredFields[i]}' in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  post = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
  res.status(201).json(post);
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
