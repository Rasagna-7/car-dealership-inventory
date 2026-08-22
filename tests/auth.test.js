const request = require("supertest");
const app = require("../index");

describe("POST /api/auth/register", () => {
  it("should register a new user and return 201", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message");
  });
});
