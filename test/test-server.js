const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

describe("Blog Posts", function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });
  // GET method
  it("should list blog posts on GET", function() {

    return chai
    .request(app)
    .get("/blogposts")
    .then(function(res) {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.a("array");

      expect(res.body.length).to.be.at.least(1);

      const expectedKeys = ["id", "title", "content", "author", "publishDate"];
      res.body.forEach(function(post) {
        expect(post).to.be.a("object");
        expect(post).to.include.keys(expectedKeys);
      });
    });
  });

  // POST method
  it("should add an item on POST", function() {
    const newPost = {
      title: "How Life Goes",
      content: "This blog post is about life in general. Enjoy!",
      author: "David Parkerio",
      publishDate: "August 22nd, 2018"
    };
    return chai
    .request(app)
    .post("/blogposts")
    .send(newPost)
    .then(function(res) {
      expect(res).to.have.status(201);
      expect(res).to.be.json;
      expect(res.body).to.be.a("object");
      expect(res.body).to.include.keys("id", "title", "content", "author", "publishDate");
      expect(res.body.id).to.not.equal(null);
      expect(res.body).to.deep.equal(
        Object.assign(newPost, { id: res.body.id})
      );
    });
  });

  // PUT method
  it("should update posts on PUT", function() {
    const updateData = {
      title: "The Real Story About Life",
      content: "Hello, here is my story. Keep reading",
      author: "Joey Ramone",
      publishDate: "Yesterday at 2pm"
    };

    return (
      chai
        .request(app)
        .get("/blogposts")
        .then(function(res) {
          updateData.id = res.body[0].id;
          return chai
          .request(app)
          .put(`/blogposts/${updateData.id}`)
          .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a("object");
          expect(res.body).to.deep.equal(updateData);
        })
    );
  });

  // DELETE method
  it("should delete posts on DELETE", function() {
    return (
      chai
        .request(app)
        .get("/blogposts")
        .then(function(res) {
          return chai.request(app).delete(`/blogposts/${res.body[0].id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
        })
    );
  });

});
