"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const QuestRouter_1 = __importDefault(require("./routers/QuestRouter"));
const GameRouter_1 = __importDefault(require("./routers/GameRouter"));
const PORT = 3001;
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/quest", QuestRouter_1.default);
app.use("/game", GameRouter_1.default);
mongoose_1.default.connect((_a = process.env.MONGO_URL) !== null && _a !== void 0 ? _a : "");
const server = app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`);
});
//console.log(GameModel.find({}));
