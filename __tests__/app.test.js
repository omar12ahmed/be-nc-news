const endpointsJson = require("../endpoints.json");
const app = require("../app");
const request = require("supertest");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
/* Set up your test imports here */
beforeEach(() => {
  return seed(testData);
});
/* Set up your beforeEach & afterAll functions here */
afterAll(() => {
  return db.end();
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
const fd = () => {};
