const request = require("supertest");
const app = require("../index");

describe("POST /api/auth/login", () => {
  it("should log in an existing user and return a token", async () => {
    await request(app).post("/api/auth/register").send({
      email: "login-test@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "login-test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
