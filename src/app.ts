import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import productsRoutes from "./routes/products.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import usersRoutes from "./routes/users.routes.js";
import { AppError } from "./errors/errors.classes.js";
import authRout from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import verifyToken from "./middlewares/tokenVerification.middleware.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/login", authRout);

app.use("/api", verifyToken);

app.use("/api/products", productsRoutes);

app.use("/api/categories", categoriesRoutes);

app.use("/api/users", usersRoutes);

//ERROR HANDLER
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  if (err.name === "ZodError") {
    return res.status(400).json({
      message: "Validation error",
      errors: err.errors,
    });
  }

  return res.status(500).json({
    message: "Internal server error",
  });
});

export default app;
