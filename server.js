const express = require('express');
const morgan = require('morgan');
const mongoose = require("mongoose");

const { PORT, DATABASE_URL } = require("./config");

const app = express();
app.use(express.json());

const blogPostsRouter = require('./blogPostsRouter');
const authorsRouter = require('./authorsRouter');

// log the http layer, yo!
app.use(morgan('common'));

app.use('/posts', blogPostsRouter);
app.use('/authors', authorsRouter);

//app.listen(process.env.PORT || 8080, () => {
//  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
//});

// Add runServer and closeServer for testing
let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve();
          })
          .on("error", err => {
            mongoose.disconnect();
            reject(err);
          });
      }
    );
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
