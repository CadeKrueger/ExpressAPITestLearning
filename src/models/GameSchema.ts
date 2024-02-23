import { Schema, model } from "mongoose"
import { DifficultyEnum, RatingEnum } from "../enums/GameEnums";

interface IGameSchema {
    id: number,
    name: string,
    description: string,
    difficulty: string,
    genre: string,
    release_year: number,
    mode: Array<string>,
    theme: Array<string>,
    features: Array<string>,
    rating: string,
    enjoyment_rating: number
    previous_version: JSON
};

export const GameSchema = new Schema<IGameSchema>({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: DifficultyEnum,
        required: true
    },
    genre: {
        type: String,
        validate: {
            validator: function(value: string) {
                const validGenres = ["action", "adventure", "arcade", "board", "casual", "puzzle", 
                                     "platformer", "strategy", "simulation"];
                return validGenres.includes(value.toLowerCase());
            },
            message: props => `${props.value} is not a valid genre.`
        }
    },
    release_year: {
        type: Number,
        max: new Date().getFullYear(),
        validate: {
            validator: function(value: number) {
                return Number.isInteger(value) && value <= new Date().getFullYear();
            },
            message: props => `${props.value} is not a valid year. It should be a whole number before ${new Date().getFullYear()}`
        }
    },
    mode: [
        {
            type: String,
            validate: {
                validator: function(value: string) {
                    const validModes = ['single-player', 'multiplayer'];
                    return validModes.includes(value.toLowerCase());
                },
                message: props => `${props.value} is not a valid mode.`
            },
            required: true
        }
    ],
    theme: [
        {
            type: String
        }
    ],
    features: [
        {
            type: String
        }
    ],
    rating: {
        type: String,
        enum: RatingEnum,
        required: true,
        default: "RP"
    },
    enjoyment_rating: {
        type: Number,
        min: 0,
        max: 10,
        validate: {
            validator: function(value: number) {
                return value >= 0 && value <= 10;
            },
            message: props => `${props.value} is not a valid enjoyment rating. It should be between 0 and 10.`
        }
    },
    previous_version: {
        type: Schema.Types.Mixed,
        default: null
    }
}, {
    versionKey: false
});

const GameModel = model("game-datas", GameSchema);

export default GameModel;