"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSchema = void 0;
const mongoose_1 = require("mongoose");
const GameEnums_1 = require("../enums/GameEnums");
;
exports.GameSchema = new mongoose_1.Schema({
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
        enum: GameEnums_1.DifficultyEnum,
        required: true
    },
    genre: {
        type: String,
        validate: {
            validator: function (value) {
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
            validator: function (value) {
                return Number.isInteger(value) && value <= new Date().getFullYear();
            },
            message: props => `${props.value} is not a valid year. It should be a whole number before ${new Date().getFullYear()}`
        }
    },
    mode: [
        {
            type: String,
            validate: {
                validator: function (value) {
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
        enum: GameEnums_1.RatingEnum,
        required: true,
        default: "RP"
    },
    enjoyment_rating: {
        type: Number,
        min: 0,
        max: 10,
        validate: {
            validator: function (value) {
                return value >= 0 && value <= 10;
            },
            message: props => `${props.value} is not a valid enjoyment rating. It should be between 0 and 10.`
        }
    },
    previous_version: {
        type: mongoose_1.Schema.Types.Mixed,
        default: null
    }
}, {
    versionKey: false
});
const GameModel = (0, mongoose_1.model)("game-datas", exports.GameSchema);
exports.default = GameModel;
