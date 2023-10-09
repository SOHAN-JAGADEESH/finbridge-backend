import express from 'express';
import OpenAI from 'openai';
import cors from 'cors'; // Import the cors middleware

const app = express();
const port = 3000;

app.use(cors()); // Use the cors middleware to handle CORS
app.use(express.json()); // Middleware to parse JSON requests

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/poem', async (req, res) => { // Change to POST
  try {
    const promptText = req.body.prompt; // Extract the prompt from the request body

    const stream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: promptText }],
      stream: true,
    });

    res.setHeader('Content-Type', 'text/plain');
    for await (const part of stream) {
      res.write(part.choices[0]?.delta?.content || '');
    }
    res.end();
  } catch (error) {
    res.status(500).send('Error processing request.');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
