"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const GameArchiveSchema = new mongoose_1.Schema({
    originalDocument: mongoose_1.Schema.Types.Mixed,
    deletedAt: {
        type: Date,
        default: Date.now()
    },
    reason: String
}, {
    versionKey: false
});
const GameArchiveModel = (0, mongoose_1.model)("game-datas-archive", GameArchiveSchema);
exports.default = GameArchiveModel;
