const request = require("supertest");
const app = require("../index");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your-secret-key-change-this-later";
const userToken = jwt.sign({ id: 1, email: "user@test.com", role: "user" }, JWT_SECRET);
const adminToken = jwt.sign({ id: 2, email: "admin@test.com", role: "admin" }, JWT_SECRET);

describe("DELETE /api/vehicles/:id", () => {
  it("should reject deletion by a non-admin user", async () => {
    const createRes = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ make: "Mazda", model: "3", category: "Hatchback", price: 19000, quantity: 2 });

    const res = await request(app)
      .delete(`/api/vehicles/${createRes.body.id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  it("should allow deletion by an admin", async () => {
    const createRes = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ make: "Kia", model: "Sportage", category: "SUV", price: 26000, quantity: 3 });

    const res = await request(app)
      .delete(`/api/vehicles/${createRes.body.id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });
});
