const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDb } = require("./database");
const { authMiddleware } = require("./middleware");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = "your-secret-key-change-this-later";

app.get("/", (req, res) => {
  res.send("Car Dealership API is running");
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const db = await getDb();
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword]
    );
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const db = await getDb();
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

app.get("/api/vehicles/search", authMiddleware, async (req, res) => {
  try {
    const { make, model, category, minPrice, maxPrice } = req.query;
    const db = await getDb();

    let query = "SELECT * FROM vehicles WHERE 1=1";
    const params = [];

    if (make) {
      query += " AND make LIKE ?";
      params.push(`%${make}%`);
    }
    if (model) {
      query += " AND model LIKE ?";
      params.push(`%${model}%`);
    }
    if (category) {
      query += " AND category LIKE ?";
      params.push(`%${category}%`);
    }
    if (minPrice) {
      query += " AND price >= ?";
      params.push(minPrice);
    }
    if (maxPrice) {
      query += " AND price <= ?";
      params.push(maxPrice);
    }

    const vehicles = await db.all(query, params);
    res.status(200).json(vehicles);
  } catch (err) {
    res.status(500).json({ message: "Error searching vehicles", error: err.message });
  }
});

app.get("/api/vehicles", authMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    const vehicles = await db.all("SELECT * FROM vehicles");
    res.status(200).json(vehicles);
  } catch (err) {
    res.status(500).json({ message: "Error fetching vehicles", error: err.message });
  }
});

app.post("/api/vehicles", authMiddleware, async (req, res) => {
  try {
    const { make, model, category, price, quantity } = req.body;

    if (!make || !model || !category || price === undefined || quantity === undefined) {
      return res.status(400).json({ message: "All vehicle fields are required" });
    }

    const db = await getDb();
    const result = await db.run(
      "INSERT INTO vehicles (make, model, category, price, quantity) VALUES (?, ?, ?, ?, ?)",
      [make, model, category, price, quantity]
    );

    res.status(201).json({ id: result.lastID, make, model, category, price, quantity });
  } catch (err) {
    res.status(500).json({ message: "Error adding vehicle", error: err.message });
  }
});

const PORT = 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
