import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Product } from "../models/types.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsPath = path.join(__dirname, "../data/products.json");

const router = Router();

const getProducts = (): Product[] => {
  const data = fs.readFileSync(productsPath, "utf-8");
  return JSON.parse(data);
};

router.get("/", (req, res) => {
  let products = getProducts();
  const { search, category, available, sort } = req.query;

  if (search) {
    const s = (search as string).toLowerCase();
    products = products.filter(p => 
      p.title.toLowerCase().includes(s) || 
      p.description.toLowerCase().includes(s)
    );
  }

  if (category) {
    products = products.filter(p => p.category === category);
  }

  if (available === "true") {
    products = products.filter(p => p.available);
  }

  if (sort === "price_asc") {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    products.sort((a, b) => b.price - a.price);
  }

  res.json(products);
});

router.get("/categories", (req, res) => {
  const products = getProducts();
  const categories = Array.from(new Set(products.map(p => p.category)));
  res.json(categories);
});

export default router;
