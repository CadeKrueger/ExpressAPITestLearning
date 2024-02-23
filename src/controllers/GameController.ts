import { Request, Response } from "express"
import GameModel, { GameSchema } from "../models/GameSchema";
import GameArchiveModel from "../models/GameArchiveSchema";

// Create
export const AddGame = async (req: Request, res: Response) => {
    try {
        const highestIdGame = await GameModel.findOne({}, {}, { sort: { id: -1 } });
        const newId = (highestIdGame ? highestIdGame.id : 0) + 1;
        const data = new GameModel({ ...req.body, id: newId });
        await data.save();
        res.status(201).json(data);
    } catch (error) {
        res.status(404).send(error);
    }
}

// Read
export const GetAverage = async (req: Request, res: Response) => {
    try {
        const field = req.params.field;
        const games = (await GameModel.find());
        const enumMap = GameModel.schema.path(field).options.enum;
        const validator = GameModel.schema.path(field).options.validate?.validator;
        const hasEnum = enumMap !== undefined;
        const sum = games.reduce((acc: number, game: any) => {
            return hasEnum ? acc + enumMap[game[field].toUpperCase()] : acc + game[field];
        }, 0);
        const avg = hasEnum ? enumMap[Math.round(sum / games.length)] 
            : (validator && !validator(sum / games.length))
            ? Math.round(sum / games.length)
            : (sum / games.length).toFixed(2);
        res.status(200).json(`Average ${field} is ${avg}`);
    } catch (error) {
        res.status(404).send(error);
    }
}

// Update
export const UpdateGame = async (req: Request, res: Response) => {
    try {
        const existingGame = await GameModel.findOne({ id: req.params.id });
        if (existingGame == null) { throw new Error(); }
        const oldRecord = { ...existingGame.toObject() };
        const result = await GameModel.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        var message = { message: 'Game updated successfully' };
        if (result != null && JSON.stringify(oldRecord) == JSON.stringify(result)) {
            message = { message: 'Game was not updated' };
        } else {
            await GameModel.findOneAndUpdate({ id: req.params.id }, { $set: { previous_version: oldRecord } });
        }
        res.status(200).json(message);
    } catch (error) {
        res.status(404).send(error);
    }
};

export const RevertUpdate = async (req: Request, res: Response) => {
    try {
        const previousVersion = (await GameModel.findOne({ id: req.params.id }))?.previous_version;
        if (previousVersion == null) { throw new Error(); }
        await GameModel.findOneAndUpdate({ id: req.params.id }, previousVersion, { new: true });
        res.status(201).json({ message: 'Game reverted successfully' });
    } catch (error) {
        res.status(404).send(error);
    }
}

export const RestoreDocuments = async (req: Request, res: Response) => {
    try {
        const reason: string = req.body.reason || '';
        const documentsToRestore = await GameArchiveModel.find(reason ? { reason: reason } : {});
        const restorePromises = documentsToRestore.map(async (archiveDocument) => {
            await GameModel.create(archiveDocument.originalDocument);
        });
        await Promise.all(restorePromises);
        await GameArchiveModel.deleteMany(reason ? { reason: reason } : {});
        res.status(201).json(`${documentsToRestore.length} document(s) restored`);
    } catch (error) {
        res.status(404).send(error);
    }
}

// Delete
export const DeleteBy = async (req: Request, res: Response) => {
    try {
        const documentsToDelete = await GameModel.find({ [req.params.field]: req.params.data });
        const reason = `DeleteBy request where field = ${req.params.field} and data = ${req.params.data}`
        const archivePromises = documentsToDelete.map(async (document) => {
            await GameArchiveModel.create({ originalDocument: document, reason: reason });
        });
        await Promise.all(archivePromises);
        const result = await GameModel.deleteMany({ [req.params.field]: req.params.data });
        res.status(201).json(`${result.deletedCount} document(s) deleted`);
    } catch (error) {
        res.status(404).send(error);
    }
}

// SortBy
export const GetSorted = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const schemaKeys = Object.keys(GameSchema.paths) as string[];
        var result = null;
        if (data.hasOwnProperty('field') && schemaKeys.includes(data.field)) {
            result = await GameModel.find().sort({ [data.field]: data.asc ? 1 : -1 }).limit(data.limit);
        }
        res.status(201).json(result);
    } catch (error) {
        res.status(404).send(error);
    }
}