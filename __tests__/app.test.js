const endpointsJson = require("../endpoints.json");
const app = require("../app");
const request = require("supertest");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");
/* Set up your test imports here */
beforeEach(() => {
  return seed(testData);
});
/* Set up your beforeEach & afterAll functions here */
afterAll(() => {
  return db.end();
});

describe("app", () => {
  test("should 404 when endpoint is invalid ", () => {
    return request(app)
      .get("/api/cats")
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ error: "Endpoint not found" });
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
  describe("GET api/articles/:article_id", () => {
    test("200: should respond with an object containing article id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          article = body.article;
          console.log(article);
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
  });
});
