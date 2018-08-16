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

//Here's if they want to get a single blog post
app.get('/blogposts/:id', (req, res) => {
  console.log(`Returning Blog Post ${req.params.id}`);
  res.json(BlogPosts.get(req.params.id));
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

app.delete('/blogposts/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted Blog Post ${req.params.id}`);
  res.status(204).end();
});

app.put('/blogposts/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author', 'publishDate'];
  for (var i = 0; i < requiredFields.length; i++) {
    if (!(requiredFields[i] in req.body)) {
      const message = `Request body missing ${requiredFields[i]} field`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  if (req.params.id !== req.body.id) {
    const message = `Request body id ${req.body.id} doesn't match parameter id ${req.params.id}`;
    console.error(message);
    return res.status(400).send(message);
  }

  console.log(`Updating blog post ${req.body.title}`);
  BlogPosts.update({
    title: req.body.title,
    id: req.body.id,
    author: req.body.author,
    content: req.body.content,
    publishDate: req.body.publishDate
  });
  res.status(204).end();
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
