const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors());
app.use(express.json());

app.post('/api/suggest-songs', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            'Du er en musikekspert. Returner præcist 10 sanganbefalinger som rå JSON array. Format: [{"title":"...","artist":"...","reason":"..."}] Kun JSON, ingen markdown.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000
    });

    const text = completion.choices?.[0]?.message?.content?.trim();
    if (!text) {
      throw new Error('Ingen tekst modtaget fra Groq');
    }

    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (error) {
    console.error('AI suggestion error:', error);
    res.status(500).json({ error: 'Kunne ikke hente sangforslag fra Groq.' });
  }
});

app.listen(port, () => {
  console.log(`Backend proxy kører på http://localhost:${port}`);
});
