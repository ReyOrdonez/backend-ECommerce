import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import productsRoutes from "./routes/products.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import {
  publicUsersRouter,
  privateUsersRouter,
} from "./routes/users.routes.js";
import { AppError } from "./errors/errors.classes.js";
import { ZodError } from "zod";
import authRout from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import verifyToken from "./middlewares/tokenVerification.middleware.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

// Public routes
app.use("/api/login", authRout);
app.use("/api/products", productsRoutes);
app.use("/api/users", publicUsersRouter);

// Auth middleware — everything below is protected
app.use("/api", verifyToken);

// Private routes
app.use("/api/categories", categoriesRoutes);
app.use("/api/users", privateUsersRouter);

//ERROR HANDLER
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      errors: err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  return res.status(500).json({
    message: "Internal server error",
  });
});

export default app;
