import { Router } from "express";
const router = Router();
router.get("/", (req, res) => {
    res.status(200).json("List of categories");
});
export default router;
//# sourceMappingURL=categories.routes.js.map