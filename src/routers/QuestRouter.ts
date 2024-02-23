import express from "express"
import { GetAll, GetById, AddQuest, GetSorted } from "../controllers/QuestController"

const router = express.Router();

router.get("/getAll", GetAll);

router.get("/get/:id", GetById);

router.post("/addQuest", AddQuest);

router.post("/getSorted", GetSorted);

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

export default router;