import express from "express"
import { AddGame, GetAverage, UpdateGame, RevertUpdate, RestoreDocuments, DeleteBy, GetSorted } from "../controllers/GameController"

const router = express.Router();

// Create
router.post("/addGame", AddGame);

// Read
router.get("/getAverage/:field", GetAverage);

// Update
router.put("/update/:id", UpdateGame);
router.put("/revertUpdate/:id", RevertUpdate);
router.put("/restore", RestoreDocuments)

// Delete
router.delete("/deleteBy/:field/:data", DeleteBy);

// SortBy
router.post("/getSorted", GetSorted);

export default router;