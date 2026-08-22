const request = require("supertest");
const app = require("../index");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your-secret-key-change-this-later";
const token = jwt.sign({ id: 1, email: "test@test.com", role: "user" }, JWT_SECRET);

describe("PUT /api/vehicles/:id", () => {
  it("should update an existing vehicle", async () => {
    const createRes = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({ make: "Ford", model: "Focus", category: "Hatchback", price: 18000, quantity: 4 });

    const vehicleId = createRes.body.id;

    const res = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ price: 17500 });

    expect(res.statusCode).toBe(200);
    expect(res.body.price).toBe(17500);
  });
});
