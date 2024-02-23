"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestSchema = void 0;
const mongoose_1 = require("mongoose");
;
exports.QuestSchema = new mongoose_1.Schema({
    questid: {
        type: Number,
        required: true
    },
    questname: {
        type: String,
        required: true
    },
    questdetails: {
        type: String,
        required: true
    },
    isComplete: {
        type: Boolean,
        default: false
    },
    involvedNPCs: [
        {
            type: String
        }
    ],
    goldReward: Number
});
const QuestModel = (0, mongoose_1.model)("sample-data", exports.QuestSchema);
exports.default = QuestModel;
