import express, { type Request, type Response } from "express";
import productsRoutes from "./routes/products.routes";
import categoriesRoutes from "./routes/categories.routes";
import usersRoutes from "./routes/users.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();
app.use(express.json());

app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({ message: "API is running" });
});

app.use("/api/products", productsRoutes);

app.use("/api/categories", categoriesRoutes);

app.use("/api/users", usersRoutes);

//ERROR HANDLER
app.use(errorHandler);

//404 error
app.use((req: Request, res: Response) => {
  res
    .status(404)
    .send(
      "<h1>404 Not Found</h1><p>The requested resource was not found on this server.</p>",
    );
});

export default app;
