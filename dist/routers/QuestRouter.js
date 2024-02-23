"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const QuestController_1 = require("../controllers/QuestController");
const router = express_1.default.Router();
router.get("/getAll", QuestController_1.GetAll);
router.get("/get/:id", QuestController_1.GetById);
router.post("/addQuest", QuestController_1.AddQuest);
router.post("/getSorted", QuestController_1.GetSorted);
// GetSorted POST request
// takes in:
//{
//  "field": "<Field Name>",
//  "limit": "Number",
//  "asc": "Boolean"
//}
// Parse the string to return all things sorted based on Field Name
// limit is how many things are returned
// if asc true, sort ascending, else descending
// Create a new data model based on something you want to model and create a couple routes for it
// 5 funcs:  Create, Read, Update, Delete, SortById(takes in limit and direction)
// Restriction: something cardable
exports.default = router;
