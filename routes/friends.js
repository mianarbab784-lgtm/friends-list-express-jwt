const express = require("express");
const router = express.Router();

let friends = [
  { email: "ali@example.com", name: "Ali", age: 26 },
  { email: "ahmed@example.com", name: "Ahmed", age: 27 }
];

// Get all friends
router.get("/", (req, res) => {
  res.json(friends);
});

// Get friend by email
router.get("/:email", (req, res) => {
  const friend = friends.find(f => f.email === req.params.email);
  if (!friend) return res.status(404).json({ message: "Friend not found" });
  res.json(friend);
});

// Add new friend
router.post("/", (req, res) => {
  const { name, email, age } = req.body;
  if (!name || !email) return res.status(400).json({ message: "Name and email required" });

  friends.push({ name, email, age });
  res.status(201).json({ message: "Friend added successfully" });
});

// Update friend
router.put("/:email", (req, res) => {
  const friend = friends.find(f => f.email === req.params.email);
  if (!friend) return res.status(404).json({ message: "Friend not found" });

  friend.name = req.body.name || friend.name;
  friend.age = req.body.age || friend.age;

  res.json({ message: "Friend updated", friend });
});

// Delete friend
router.delete("/:email", (req, res) => {
  friends = friends.filter(f => f.email !== req.params.email);
  res.json({ message: "Friend deleted successfully" });
});

module.exports = router;
