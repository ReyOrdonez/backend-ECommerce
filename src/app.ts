//EXPRESS
import express from "express";

//ROUTES
import {
  publicProductsRouter,
  privateProductsRouter,
} from "./routes/products.routes.js";
import privateCategoriesRoutes from "./routes/categories.routes.js";
import {
  publicUsersRouter,
  privateUsersRouter,
} from "./routes/users.routes.js";
import authRout from "./routes/auth.routes.js";

//MIDDLEWARES
import cookieParser from "cookie-parser";
import verifyToken from "./middlewares/tokenVerification.middleware.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

// Public routes
app.use("/api/login", authRout);
app.use("/api/products", publicProductsRouter);
app.use("/api/users", publicUsersRouter);

// Auth middleware — everything below is protected
app.use("/api", verifyToken);

// Private routes
app.use("/api/products", privateProductsRouter);
app.use("/api/categories", privateCategoriesRoutes);
app.use("/api/users", privateUsersRouter);

//ERROR HANDLER
app.use(errorHandler);

export default app;
