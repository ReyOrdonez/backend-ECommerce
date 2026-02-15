import { Router } from "express";
const router = Router();
router.get("/", (req, res) => {
    res.status(200).json("List of products");
});
export default router;
//# sourceMappingURL=products.routes.js.map