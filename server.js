const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.send("Laurex AI Backend is running!");
});

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const response = await client.responses.create({
      model: "gpt-5-mini",
      instructions:
        "You are Laurex AI, a helpful, friendly and educational AI assistant.",
      input: message
    });

    res.json({
      reply: response.output_text
    });

  } catch (error) {

    console.error("========== OPENAI ERROR ==========");
    console.error("Status:", error.status);
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    console.error("===================================");

    res.status(500).json({
      error: "OpenAI request failed",
      details: error.message || "Unknown OpenAI error"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Laurex backend running on port ${PORT}`);
});