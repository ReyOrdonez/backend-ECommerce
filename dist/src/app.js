import express from "express";
import productsRoutes from "./routes/products.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import usersRoutes from "./routes/users.routes.js";
import { AppError } from "./errors/errors.classes.js";
const app = express();
app.use(express.json());
app.get("/api", (req, res) => {
    res.status(200).json({ message: "API is running" });
});
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/users", usersRoutes);
//ERROR HANDLER
app.use((err, req, res, next) => {
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
//# sourceMappingURL=app.js.map