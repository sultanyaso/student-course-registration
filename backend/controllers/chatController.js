const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handleChat = async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Gemini API key not configured on server" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `You are a helpful student assistant for a Course Registration and Learning Management System. 
    The student is asking about: ${context || "general topics"}.
    Keep your answers concise and professional.`;

    const prompt = `${systemPrompt}\n\nStudent: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get AI response" });
  }
};
