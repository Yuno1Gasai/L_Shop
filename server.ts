import express from "express";
import { createServer as createViteServer } from "vite";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import authRoutes from "./src/api/routes/auth.ts";
import productRoutes from "./src/api/routes/products.ts";
import cartRoutes from "./src/api/routes/cart.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  const dataDir = path.join(__dirname, "src/api/data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const files = ["users.json", "products.json"];
  files.forEach(file => {
    const filePath = path.join(dataDir, file);
    if (!fs.existsSync(filePath)) {
      if (file === "products.json") {
        const initialProducts = [
          {
            id: "1",
            title: "Механическая клавиатура",
            description: "Компактная механическая клавиатура с переключателями Cherry MX и RGB подсветкой.",
            price: 280,
            category: "Периферия",
            available: true,
            image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800"
          },
          {
            id: "2",
            title: "Студийные наушники",
            description: "Профессиональные беспроводные наушники с кристально чистым звуком.",
            price: 490,
            category: "Аудио",
            available: true,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800"
          },
          {
            id: "3",
            title: "Эргономичная мышь",
            description: "Беспроводная мышь with высокоточным сенсором для долгой работы за компьютером.",
            price: 180,
            category: "Периферия",
            available: true,
            image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800"
          },
          {
            id: "4",
            title: "Портативная колонка",
            description: "Мощный звук в компактном корпусе с защитой от воды IPX7.",
            price: 250,
            category: "Аудио",
            available: false,
            image: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&q=80&w=800"
          }
        ];
        fs.writeFileSync(filePath, JSON.stringify(initialProducts, null, 2));
      } else {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      }
    }
  });

  app.use(cors({
    origin: true,
    credentials: true
  }));
  app.use(express.json());
  app.use(cookieParser());

  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/cart", cartRoutes);

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
