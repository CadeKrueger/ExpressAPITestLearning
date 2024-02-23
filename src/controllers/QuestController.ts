import { Request, Response } from "express"
import QuestModel, { QuestSchema } from "../models/QuestSchema";

export const GetAll = async (req: Request, res: Response) => {
    console.log('All data in the "sample-data" collection:');
    try {
        const result = await QuestModel.find({});
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        res.status(406).send(error);
    }
};

export const GetById = async (req: Request, res: Response) => {
    try {
        const qid = req.params.id;
        const result = await QuestModel.findOne({ questid: qid });
        res.status(200).json(result);
    } catch (error) {
        res.status(404).send(error);
    }
}

export const AddQuest = async (req: Request, res: Response) => {
    try {
        const data = new QuestModel({ ...req.body });
        await data.save();
        res.status(201).json(data);
    } catch (error) {
        res.status(404).send(error);
    }
}

export const GetSorted = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const schemaKeys = Object.keys(QuestSchema.paths) as string[];
        var result = null;
        if (data.hasOwnProperty('field') && schemaKeys.includes(data.field)) {
            result = await QuestModel.find().sort({ [data.field]: data.asc ? 1 : -1 }).limit(data.limit);
        }
        res.status(201).json(result);
    } catch (error) {
        res.status(404).send(error);
    }
}