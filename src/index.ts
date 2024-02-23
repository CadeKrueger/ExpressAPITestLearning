import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose";
import QuestRouter from "./routers/QuestRouter"
import GameRouter from "./routers/GameRouter"
import GameModel from "./models/GameSchema";

const PORT: number = 3001;

const app = express();

dotenv.config();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use("/quest", QuestRouter);

app.use("/game", GameRouter);

mongoose.connect(process.env.MONGO_URL ?? "");

const server = app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`)
});

//console.log(GameModel.find({}));