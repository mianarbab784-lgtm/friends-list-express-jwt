const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const friendsRoutes = require("./routes/friends");

const app = express();
app.use(bodyParser.json());

const users = []; // temporary in-memory user store
const SECRET_KEY = "secretkey123"; // normally from .env

// Register
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const existingUser = users.find((u) => u.username === username);
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully" });
});

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

// JWT Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Access denied. Token missing." });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

// Use Friends Routes (Protected)
app.use("/friends", authenticateToken, friendsRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
