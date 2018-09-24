"use strict";

const mongoose = require("mongoose");

// Create the schema
const authorSchema = mongoose.Schema({
  firstName: 'string',
  lastName: 'string',
  userName: {
    type: 'string',
    unique: true
  }
});

const commentSchema = mongoose.Schema({ content: 'string' });

const blogPostSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Author'
  },
  content: { type: String, required: true },
  comments: [commentSchema]
});

blogPostSchema.pre('findOne', function(next) {
  this.populate('author');
  next();
})

blogPostSchema.pre('find', function(next) {
  this.populate('author');
  next();
})

blogPostSchema.virtual("authorString").get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogPostSchema.methods.serialize = function() {
  return {
      id: this._id,
      title: this.title,
      author: this.authorString,
      content: this.content
  };
};

var Author = mongoose.model('Author', authorSchema);
const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = { Author, BlogPost };
