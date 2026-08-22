const request = require("supertest");
const app = require("../index");

describe("Protected route middleware", () => {
  it("should reject requests without a token", async () => {
    const res = await request(app).get("/api/vehicles");
    expect(res.statusCode).toBe(401);
  });
});
