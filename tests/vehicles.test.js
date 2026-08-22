const request = require("supertest");
const app = require("../index");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your-secret-key-change-this-later";
const token = jwt.sign({ id: 1, email: "test@test.com", role: "user" }, JWT_SECRET);

describe("POST /api/vehicles", () => {
  it("should add a new vehicle and return 201", async () => {
    const res = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({ make: "Toyota", model: "Corolla", category: "Sedan", price: 20000, quantity: 5 });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
  });
});
