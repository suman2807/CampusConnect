import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';
import express from "express";
import cors from "cors";
import axios from "axios";
import connectDB from './config/database.js';
import apiRoutes from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config(); // Try default locations first
dotenv.config({ path: path.join(__dirname, '.env') }); // Then try current directory

const app = express();
const PORT = 5000;

// Connect to MongoDB
connectDB();

const HF_API_KEY = process.env.HF_API_KEY;
console.log('Debug: HF_API_KEY loaded:', HF_API_KEY ? 'Yes (length: ' + HF_API_KEY.length + ')' : 'No');
if (!HF_API_KEY) {
  console.warn("Hugging Face API key is missing! Running without profanity check.");
} else {
  console.log("✅ Hugging Face API key loaded successfully! Profanity detection enabled.");
}

app.use(express.json());
app.use(cors());

// API Routes
app.use('/api', apiRoutes);  

app.post("/api/profanity-check", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Missing 'text' in request body" });
    }

    // If no API key, return false (not offensive) as default
    if (!HF_API_KEY) {
      console.log("No API key available, defaulting to not offensive");
      return res.json({ isOffensive: false });
    }

    // Send request to Hugging Face model
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/unitary/toxic-bert",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extracting predictions from response
    const predictions = response.data[0]; // Model returns an array of predictions
    console.log("Model Response:", predictions);

    // Checking the toxic score to determine if the message is offensive or not
    const toxicScore = predictions[0]?.score || 0;
    
    // Setting a threshold for considering the text offensive
    const isOffensive = toxicScore > 0.5;  // You can adjust the threshold as needed

    // Respond back with the result
    res.json({ isOffensive });
  } catch (error) {
    console.error("Error in proxy server:", error.response?.data || error.message);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});

// Export the checkProfanity function for use in other modules
export async function checkProfanity(text) {
  try {
    if (!text) {
      return false;
    }

    // If no API key, return false (not offensive) as default
    if (!HF_API_KEY) {
      console.log("No API key available, defaulting to not offensive");
      return false;
    }

    // Send request to Hugging Face model
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/unitary/toxic-bert",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extracting predictions from response
    const predictions = response.data[0]; // Model returns an array of predictions
    console.log("Model Response:", predictions);

    // Checking the toxic score to determine if the message is offensive or not
    const toxicScore = predictions[0]?.score || 0;
    
    // Setting a threshold for considering the text offensive
    const isOffensive = toxicScore > 0.5;  // You can adjust the threshold as needed

    return isOffensive;
  } catch (error) {
    console.error("Error in checkProfanity:", error.response?.data || error.message);
    return false; // Default to not offensive if there's an error
  }
}
