import { Router } from "express";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
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

router.post("/register", (req, res) => {
  const { name, email, login, phone, password } = req.body;
  const users = getUsers();

  if (users.find(u => u.email === email || u.login === login)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser: User = {
    id: uuidv4(),
    name,
    email,
    login,
    phone,
    password,
    cart: []
  };

  users.push(newUser);
  saveUsers(users);

  res.cookie("sessionId", newUser.id, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 10 * 60 * 1000
  });

  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
});

router.post("/login", (req, res) => {
  const { login, password } = req.body;
  const users = getUsers();

  const user = users.find(u => u.login === login && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.cookie("sessionId", user.id, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 10 * 60 * 1000
  });

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

router.get("/me", (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) return res.status(401).json({ message: "Not authenticated" });

  const users = getUsers();
  const user = users.find(u => u.id === sessionId);

  if (!user) return res.status(401).json({ message: "Session invalid" });

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

router.post("/logout", (req, res) => {
  res.clearCookie("sessionId");
  res.json({ message: "Logged out" });
});

export default router;
