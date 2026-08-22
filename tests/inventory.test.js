const request = require("supertest");
const app = require("../index");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your-secret-key-change-this-later";
const userToken = jwt.sign({ id: 1, email: "user@test.com", role: "user" }, JWT_SECRET);
const adminToken = jwt.sign({ id: 2, email: "admin@test.com", role: "admin" }, JWT_SECRET);

describe("POST /api/vehicles/:id/purchase", () => {
  it("should decrease quantity by 1 when purchased", async () => {
    const createRes = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ make: "Nissan", model: "Altima", category: "Sedan", price: 21000, quantity: 5 });

    const res = await request(app)
      .post(`/api/vehicles/${createRes.body.id}/purchase`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(4);
  });
});

describe("POST /api/vehicles/:id/restock", () => {
  it("should reject restock by a non-admin user", async () => {
    const createRes = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ make: "Subaru", model: "Outback", category: "SUV", price: 27000, quantity: 2 });

    const res = await request(app)
      .post(`/api/vehicles/${createRes.body.id}/restock`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ amount: 5 });

    expect(res.statusCode).toBe(403);
  });

  it("should increase quantity when restocked by admin", async () => {
    const createRes = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ make: "Jeep", model: "Wrangler", category: "SUV", price: 32000, quantity: 3 });

    const res = await request(app)
      .post(`/api/vehicles/${createRes.body.id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ amount: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(8);
  });
});
