"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GameController_1 = require("../controllers/GameController");
const router = express_1.default.Router();
// Create
router.post("/addGame", GameController_1.AddGame);
// Read
router.get("/getAverage/:field", GameController_1.GetAverage);
// Update
router.put("/update/:id", GameController_1.UpdateGame);
router.put("/revertUpdate/:id", GameController_1.RevertUpdate);
router.put("/restore", GameController_1.RestoreDocuments);
// Delete
router.delete("/deleteBy/:field/:data", GameController_1.DeleteBy);
// SortBy
router.post("/getSorted", GameController_1.GetSorted);
exports.default = router;
