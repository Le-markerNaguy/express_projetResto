import { Router } from "express";
import {
  getAllTables,
  createTable,
  deleteTable,
} from "../controllers/tableController"
import  authenticateAdmin  from "../middleware/authMiddleware";

const router = Router();

// Tables
router.get("/", getAllTables);
router.post("/", authenticateAdmin, createTable);
router.delete("/:id", authenticateAdmin, deleteTable);

export default router;
