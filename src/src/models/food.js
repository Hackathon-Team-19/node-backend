import mongoose from 'mongoose';

const { Schema } = mongoose;

const foodSchema = new Schema({
  id: { type: String, required: true },
  ingredient: { type: String, required: true },
  quantity: { type: Number, required: true },
  co2Emission: { type: String, required: true },
});

export const Food = mongoose.model('Food', foodSchema);
