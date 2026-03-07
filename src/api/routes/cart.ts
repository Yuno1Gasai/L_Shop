import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "../models/types.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersPath = path.join(__dirname, "../data/users.json");

const router = Router();

const getUsers = (): User[] => {
  const data = fs.readFileSync(usersPath, "utf-8");
  return JSON.parse(data);
};

const saveUsers = (users: User[]) => {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
};

router.post("/add", (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) return res.status(401).json({ message: "Login required" });

  const { productId, quantity = 1 } = req.body;
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === sessionId);

  if (userIndex === -1) return res.status(401).json({ message: "User not found" });

  const existingItem = users[userIndex].cart.find(item => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    users[userIndex].cart.push({ productId, quantity });
  }

  saveUsers(users);
  res.json(users[userIndex].cart);
});

router.post("/update", (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) return res.status(401).json({ message: "Login required" });

  const { productId, quantity } = req.body;
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === sessionId);

  if (userIndex === -1) return res.status(401).json({ message: "User not found" });

  const itemIndex = users[userIndex].cart.findIndex(item => item.productId === productId);
  if (itemIndex !== -1) {
    if (quantity <= 0) {
      users[userIndex].cart.splice(itemIndex, 1);
    } else {
      users[userIndex].cart[itemIndex].quantity = quantity;
    }
  }

  saveUsers(users);
  res.json(users[userIndex].cart);
});

router.post("/remove", (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) return res.status(401).json({ message: "Login required" });

  const { productId } = req.body;
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === sessionId);

  if (userIndex === -1) return res.status(401).json({ message: "User not found" });

  users[userIndex].cart = users[userIndex].cart.filter(item => item.productId !== productId);

  saveUsers(users);
  res.json(users[userIndex].cart);
});

export default router;
