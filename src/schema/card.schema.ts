import mongoose from "mongoose";

interface cardI extends mongoose.Document {
    cardId: string
    userContact: string
}

const cardSchema = new mongoose.Schema({
    cardId: {
        type: String,
        required: true
    },
    userContact: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Card = mongoose.model<cardI>('Cards', cardSchema)

export {Card, cardI }