const request = require("supertest");
const app = require("../index");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your-secret-key-change-this-later";
const token = jwt.sign({ id: 1, email: "test@test.com", role: "user" }, JWT_SECRET);

describe("GET /api/vehicles/search", () => {
  it("should return vehicles matching a search query", async () => {
    await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({ make: "Honda", model: "Civic", category: "Sedan", price: 22000, quantity: 3 });

    const res = await request(app)
      .get("/api/vehicles/search?make=Honda")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].make).toBe("Honda");
  });
});
