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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSorted = exports.AddQuest = exports.GetById = exports.GetAll = void 0;
const QuestSchema_1 = __importStar(require("../models/QuestSchema"));
const GetAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('All data in the "sample-data" collection:');
    try {
        const result = yield QuestSchema_1.default.find({});
        console.log(result);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(406).send(error);
    }
});
exports.GetAll = GetAll;
const GetById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const qid = req.params.id;
        const result = yield QuestSchema_1.default.findOne({ questid: qid });
        res.status(200).json(result);
    }
    catch (error) {
        res.status(404).send(error);
    }
});
exports.GetById = GetById;
const AddQuest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = new QuestSchema_1.default(Object.assign({}, req.body));
        yield data.save();
        res.status(201).json(data);
    }
    catch (error) {
        res.status(404).send(error);
    }
});
exports.AddQuest = AddQuest;
const GetSorted = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const schemaKeys = Object.keys(QuestSchema_1.QuestSchema.paths);
        var result = null;
        if (data.hasOwnProperty('field') && schemaKeys.includes(data.field)) {
            result = yield QuestSchema_1.default.find().sort({ [data.field]: data.asc ? 1 : -1 }).limit(data.limit);
        }
        res.status(201).json(result);
    }
    catch (error) {
        res.status(404).send(error);
    }
});
exports.GetSorted = GetSorted;
