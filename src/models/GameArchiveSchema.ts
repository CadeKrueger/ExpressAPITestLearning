import { Schema, model } from "mongoose";

interface ArchiveSchema extends Document {
    originalDocument: JSON;
    deletedAt: Date;
    reason: string;
}

const GameArchiveSchema = new Schema<ArchiveSchema>({
    originalDocument: Schema.Types.Mixed,
    deletedAt: { 
        type: Date, 
        default: Date.now()
    },
    reason: String
}, {
    versionKey: false
});

const GameArchiveModel = model("game-datas-archive", GameArchiveSchema);

export default GameArchiveModel;