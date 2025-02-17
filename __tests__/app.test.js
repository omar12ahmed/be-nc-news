const endpointsJson = require("../endpoints.json");
const app = require("../app");
const request = require("supertest");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("app", () => {
  test("should respond with 404 when endpoint is invalid ", () => {
    return request(app)
      .get("/api/cats")
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ msg: "Endpoint not found" });
      });
  });

  describe("GET /api", () => {
    test("200: Responds with an object detailing the documentation for each endpoint", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { endpoints } }) => {
          expect(endpoints).toEqual(endpointsJson);
        });
    });
  });

  describe("GET/api/topics", () => {
    test("200: Responds with an object of topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics.length).toBe(3);

          topics.forEach((topic) => {
            expect(topic).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
  });
  describe("GET api/articles/", () => {
    test("200: should respond with an object containing article id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          article = body.article;
          id = article.article_id;
          expect(id).toEqual(1);

          expect(article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T19:11:00.000Z",
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("should respond with 404 with invalid id nunber", () => {
      return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No article found for article_id: 9999");
        });
    });

    test("should respond with a 404 with wrong data type", () => {
      return request(app)
        .get("/api/articles/cat")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Data Type");
        });
    });

    // ---
    test("should respond with 200 with an array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              comment_count: expect.any(Number),
              article_img_url: expect.any(String),
            });
            expect(typeof article.votes).toBe("number");
          });
        });
    });
    test("should respond with 404  when endpoint is incorrect", () => {
      return request(app)
        .get("/api/cat")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Endpoint not found");
        });
    });

    test("should be sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
  });
  // -------
  describe("GET api/articles article_id comments", () => {
    test("should filter comments by a specific id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const comments = body.comments;
          expect(Array.isArray(comments)).toBe(true);
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                body: expect.any(String),
                article_id: expect.any(Number),
                author: expect.any(String),
                votes: expect.any(Number),
                created_at: expect.any(String),
              })
            );
          });
        });
    });

    test("should retun an empty array if there are no comments ", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([]);
        });
    });
    test("should retun a 404 if id doesnt exist ", () => {
      return request(app)
        .get("/api/articles/9999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No article found for article_id: 9999");
        });
    });
  });

  test("should respond with 400 with incorrect data type", () => {
    return request(app)
      .get("/api/articles/cat/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Data Type");
      });
  });

  describe("POST /api/articles/:article_id/comments", () => {
    test("respond with a 201 containing the posted comment ", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter_bridge", body: "Hi World" })
        .expect(201)
        .then(({ body }) => {
          expect(body.newComment).toMatchObject({
            comment_id: expect.any(Number),
            body: "Hi World",
            article_id: 1,
            author: "butter_bridge",
            votes: 0,
            created_at: expect.any(String),
          });
        });
    });

    test("should return 400 if body is missing", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Missing required keys");
        });
    });

    test("should return 404 if ID doesnt exist", () => {
      return request(app)
        .post("/api/articles/99999/comments")
        .send({ username: "butter_bridge", body: "Hi World" })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No article found for article_id: 99999");
        });
    });

    test("should return 404 if username does not exist in db", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "omar", body: "hi omar" })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Username does not exist");
        });
    });
    test("should return 400 if input is wrong data type", () => {
      return request(app)
        .post("/api/articles/cats/comments")
        .send({ username: "butter_bridge", body: "Hi World" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Data Type");
        });
    });
  });

  describe("PATCH /api/articles/2", () => {
    test("should respond with 200 containing the updated article", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body }) => {
          expect(body.updatedArticle).toMatchObject({
            article_id: 2,
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: 1,
            article_img_url: expect.any(String),
          });
        });
    });
    test("should respond with 404 if article ID doesnt exsist ", () => {
      return request(app)
        .patch("/api/articles/9999")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No article found for article_id: 9999");
        });
    });
    test("should respond with 400 if article ID is not valid", () => {
      return request(app)
        .patch("/api/articles/cat")
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Data Type");
        });
    });
    test("should respond with 400 if Inc votes is not a number", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({ inc_votes: "cats" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Data Type");
        });
    });
    test("should respond with 400 if Inc votes is an empty object", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Missing required keys");
        });
    });
  });

  describe("DELETE /api/comments/:comment_id", () => {
    test("should respond with 204 when the given comment ID is deleted", () => {
      return request(app)
        .delete("/api/comments/2")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });
    test("should respond with a 404 if the comment does not exsist", () => {
      return request(app)
        .delete("/api/comments/9999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Comment does not exsistf for ID: 9999");
        });
    });

    test("should respond with 400 with invalid data type", () => {
      return request(app)
        .delete("/api/comments/cats")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Data Type");
        });
    });
  });

  describe("GET/api/users", () => {
    test("should respond with 200 with containing all users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const users = body.users;
          users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });
  describe(" GET/api/artciles with queries", () => {
    test("should respond with 200 and articles sorted by votes in ASC order", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=ASC")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("votes", {
            ascending: true,
          });
        });
    });
    test("should with 400 for invalid sort_by column ", () => {
      return request(app)
        .get("/api/articles?sort_by=cat&order=ASC")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid input");
        });
    });
    test("should with 400 for invalid order", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=cat")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid input");
        });
    });
  });
});
