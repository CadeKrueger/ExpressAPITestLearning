"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSorted = exports.DeleteBy = exports.RestoreDocuments = exports.RevertUpdate = exports.UpdateGame = exports.GetAverage = exports.AddGame = void 0;
const GameSchema_1 = __importStar(require("../models/GameSchema"));
const GameArchiveSchema_1 = __importDefault(require("../models/GameArchiveSchema"));
// Create
const AddGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const highestIdGame = yield GameSchema_1.default.findOne({}, {}, { sort: { id: -1 } });
        const newId = (highestIdGame ? highestIdGame.id : 0) + 1;
        const data = new GameSchema_1.default(Object.assign(Object.assign({}, req.body), { id: newId }));
        yield data.save();
        res.status(201).json(data);
    }
    catch (error) {
        res.status(404).send(error);
    }
});
exports.AddGame = AddGame;
// Read
const GetAverage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const field = req.params.field;
        const games = (yield GameSchema_1.default.find());
        const enumMap = GameSchema_1.default.schema.path(field).options.enum;
        const validator = (_a = GameSchema_1.default.schema.path(field).options.validate) === null || _a === void 0 ? void 0 : _a.validator;
        const hasEnum = enumMap !== undefined;
        const sum = games.reduce((acc, game) => {
            return hasEnum ? acc + enumMap[game[field].toUpperCase()] : acc + game[field];
        }, 0);
        const avg = hasEnum ? enumMap[Math.round(sum / games.length)]
            : (validator && !validator(sum / games.length))
                ? Math.round(sum / games.length)
                : (sum / games.length).toFixed(2);
        res.status(200).json(`Average ${field} is ${avg}`);
    }
    catch (error) {
        res.status(404).send(error);
    }
});
exports.GetAverage = GetAverage;
// Update
const UpdateGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingGame = yield GameSchema_1.default.findOne({ id: req.params.id });
        if (existingGame == null) {
            throw new Error();
        }
        const oldRecord = Object.assign({}, existingGame.toObject());
        const result = yield GameSchema_1.default.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        var message = { message: 'Game updated successfully' };
        if (result != null && JSON.stringify(oldRecord) == JSON.stringify(result)) {
            message = { message: 'Game was not updated' };
        }
        else {
            yield GameSchema_1.default.findOneAndUpdate({ id: req.params.id }, { $set: { previous_version: oldRecord } });
        }
        res.status(200).json(message);
    }
    catch (error) {
        res.status(404).send(error);
    }
});
exports.UpdateGame = UpdateGame;
const RevertUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const previousVersion = (_b = (yield GameSchema_1.default.findOne({ id: req.params.id }))) === null || _b === void 0 ? void 0 : _b.previous_version;
        if (previousVersion == null) {
            throw new Error();
        }
        yield GameSchema_1.default.findOneAndUpdate({ id: req.params.id }, previousVersion, { new: true });
        res.status(201).json({ message: 'Game reverted successfully' });
    }
    catch (error) {
        res.status(404).send(error);
    }
});
exports.RevertUpdate = RevertUpdate;
const RestoreDocuments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reason = req.body.reason || '';
        const documentsToRestore = yield GameArchiveSchema_1.default.find(reason ? { reason: reason } : {});
        const restorePromises = documentsToRestore.map((archiveDocument) => __awaiter(void 0, void 0, void 0, function* () {
            yield GameSchema_1.default.create(archiveDocument.originalDocument);
        }));
        yield Promise.all(restorePromises);
        yield GameArchiveSchema_1.default.deleteMany(reason ? { reason: reason } : {});
        res.status(201).json(`${documentsToRestore.length} document(s) restored`);
    }
    catch (error) {
        res.status(404).send(error);
    }
});
exports.RestoreDocuments = RestoreDocuments;
// Delete
const DeleteBy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const documentsToDelete = yield GameSchema_1.default.find({ [req.params.field]: req.params.data });
        const reason = `DeleteBy request where field = ${req.params.field} and data = ${req.params.data}`;
        const archivePromises = documentsToDelete.map((document) => __awaiter(void 0, void 0, void 0, function* () {
            yield GameArchiveSchema_1.default.create({ originalDocument: document, reason: reason });
        }));
        yield Promise.all(archivePromises);
        const result = yield GameSchema_1.default.deleteMany({ [req.params.field]: req.params.data });
        res.status(201).json(`${result.deletedCount} document(s) deleted`);
    }
    catch (error) {
        res.status(404).send(error);
    }
});
exports.DeleteBy = DeleteBy;
// SortBy
const GetSorted = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const schemaKeys = Object.keys(GameSchema_1.GameSchema.paths);
        var result = null;
        if (data.hasOwnProperty('field') && schemaKeys.includes(data.field)) {
            result = yield GameSchema_1.default.find().sort({ [data.field]: data.asc ? 1 : -1 }).limit(data.limit);
        }
        res.status(201).json(result);
    }
    catch (error) {
        res.status(404).send(error);
    }
});
exports.GetSorted = GetSorted;
