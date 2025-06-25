import { Router } from "express";
import {
  getAllDishes,
  createDish,
  updateDish,
  deleteDish,
} from "../controllers/platController";
import authenticateAdmin from "../middleware/authMiddleware";


const router = Router();

// Plats
router.get("/", getAllDishes);
router.post("/", authenticateAdmin, createDish);
router.patch("/:id", authenticateAdmin, updateDish);
router.delete("/:id", authenticateAdmin, deleteDish);

export default router;
