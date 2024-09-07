import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { Food } from './models/food';
import { connectToDatabase, db } from '../lib/mongodb.js';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let foodCollection;

// Connect to MongoDB
async function initializeApp() {
  try {
    await connectToDatabase();
    foodCollection = db.collection("Hackathon");
    console.log("Collection 'Hackathon' is ready to use.");

    // MongoDB Mongoose connection (if you are also using Mongoose for schema models)
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Mongoose connected successfully');

    // Start Express Server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error initializing app:", error);
  }
}

// API Endpoints
app.post('/api/foods', async (req, res) => {
  const { id, ingredient, quantity, co2Emission } = req.body;

  try {
    const newFood = { id, ingredient, quantity, co2Emission };
    const result = await foodCollection.insertOne(newFood);
    res.status(201).json(result.ops[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/foods', async (req, res) => {
  try {
    const foods = await foodCollection.find().toArray();
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/foods/:id', async (req, res) => {
  try {
    const food = await foodCollection.findOne({ id: req.params.id });
    if (!food) return res.status(404).json({ message: 'Food not found' });

    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/foods/:id', async (req, res) => {
  const { id, ingredient, quantity, co2Emission } = req.body;

  try {
    const updatedFood = await foodCollection.findOneAndUpdate(
      { id: req.params.id },
      { $set: { id, ingredient, quantity, co2Emission } },
      { returnOriginal: false }
    );

    if (!updatedFood.value) return res.status(404).json({ message: 'Food not found' });

    res.status(200).json(updatedFood.value);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/foods/:id', async (req, res) => {
  try {
    const result = await foodCollection.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Food not found' });

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Initialize the application
initializeApp();
