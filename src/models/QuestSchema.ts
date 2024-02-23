import { Schema, model } from "mongoose"

interface IQuestSchema {
    questid: number,
    questname: string,
    questdetails: string,
    isComplete: boolean,
    involvedNPCs: Array<string>,
    goldReward: number
};

export const QuestSchema = new Schema<IQuestSchema>({
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

const QuestModel = model("sample-data", QuestSchema);

export default QuestModel;