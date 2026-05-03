const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No API key found in .env");
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // There is no direct listModels in the client, but we can try to initialize one
    console.log("Attempting to initialize gemini-1.5-flash...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("test");
    console.log("Success! Response:", result.response.text());
  } catch (error) {
    console.error("Error details:", JSON.stringify(error, null, 2));
    if (error.message) console.error("Error message:", error.message);
  }
}

listModels();
