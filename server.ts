import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Initialize Google Gemini AI client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API Route: Status check
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    appName: 'Smart Campus AI',
    hasGeminiKey: Boolean(apiKey),
    activeModel: 'gemini-3.8-flash',
  });
});

// API Route: AI Study Assistant Chat
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history = [], role = 'student' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured in environment.',
        keyMissing: true,
      });
    }

    // Build chat contents from history
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // System prompt framing
    const systemPrompt = `You are "Athena", the dedicated AI Academic Study Mentor of Smart Campus University System.
The user is logged in as a ${role}. 
Your goal is to explain difficult academic subjects (Computer Science, Engineering, Mathematics, Data Science, etc.) with crystal clarity, provide relevant analogies, break down steps, and generate helpful examples or code snippets when appropriate.
Keep answers well-structured using markdown headers, bullet points, and code blocks where helpful. Be encouraging, intellectually rigorous, and helpful for college-level learning.`;

    for (const h of history) {
      contents.push({
        role: h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.content }],
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'I could not generate an answer at this time.';
    res.json({ reply });
  } catch (err: any) {
    console.error('Error in /api/ai/chat:', err);
    res.status(500).json({
      error: err.message || 'Failed to generate AI response',
      details: err.toString(),
    });
  }
});

// API Route: Summarize Notes
app.post('/api/ai/summarize', async (req, res) => {
  try {
    const { text, subject, format = 'detailed' } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured in environment.',
        keyMissing: true,
      });
    }

    const prompt = `Please summarize the following lecture notes/academic content for the subject "${subject || 'General Academic'}".
Format requirement: ${format}.
Organize the summary into the following clear markdown sections:
1. 🎯 **Executive Summary & Big Picture** (2-3 concise sentences)
2. 🔑 **Core Concepts & Key Definitions** (Bullet points with bold terms)
3. ⚙️ **Formulas, Laws, or Technical Details** (If applicable)
4. 📝 **Exam Hotspots & Quick Revision Points** (Crucial exam takeaways)

Content to summarize:
${text}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.5,
      },
    });

    res.json({ summary: response.text || 'Unable to generate summary.' });
  } catch (err: any) {
    console.error('Error in /api/ai/summarize:', err);
    res.status(500).json({
      error: err.message || 'Failed to summarize notes',
    });
  }
});

// API Route: Generate Multiple-Choice Quiz
app.post('/api/ai/quiz', async (req, res) => {
  try {
    const { topic, count = 5, difficulty = 'intermediate' } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured in environment.',
        keyMissing: true,
      });
    }

    const prompt = `Generate a high quality academic multiple choice quiz on the topic "${topic}" with ${count} questions at a ${difficulty} difficulty level for college undergraduate students.
Return pure JSON with the following structure:
{
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "id": 1,
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "explanation": "Why this answer is correct"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const rawText = response.text || '{}';
    let quizData;
    try {
      quizData = JSON.parse(rawText);
    } catch {
      quizData = {
        topic,
        difficulty,
        questions: [],
      };
    }

    res.json(quizData);
  } catch (err: any) {
    console.error('Error in /api/ai/quiz:', err);
    res.status(500).json({
      error: err.message || 'Failed to generate quiz',
    });
  }
});

// API Route: Generate Exam Study Plan
app.post('/api/ai/study-plan', async (req, res) => {
  try {
    const { subject, daysRemaining = 7, dailyHours = 3, focusTopics = '' } = req.body;

    if (!subject) {
      return res.status(400).json({ error: 'Subject is required' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured in environment.',
        keyMissing: true,
      });
    }

    const prompt = `Create a realistic, high-impact college study plan for "${subject}".
Time available: ${daysRemaining} days remaining until exam.
Study allocation: ${dailyHours} hours per day.
Specific student focus or weak areas: ${focusTopics || 'Comprehensive syllabus coverage'}.

Respond in pure JSON matching this exact structure:
{
  "subject": "${subject}",
  "daysRemaining": ${daysRemaining},
  "totalEstimatedHours": ${daysRemaining * dailyHours},
  "schedule": [
    {
      "day": "Day 1",
      "phase": "Foundation & Core Theory",
      "topics": ["Topic 1", "Topic 2"],
      "actionItems": ["Review notes", "Solve 5 practice problems"],
      "timeAllocation": "${dailyHours} hrs"
    }
  ],
  "highYieldTips": ["Tip 1", "Tip 2", "Tip 3"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.5,
      },
    });

    const rawText = response.text || '{}';
    let planData;
    try {
      planData = JSON.parse(rawText);
    } catch {
      planData = {
        subject,
        schedule: [],
        highYieldTips: [],
      };
    }

    res.json(planData);
  } catch (err: any) {
    console.error('Error in /api/ai/study-plan:', err);
    res.status(500).json({
      error: err.message || 'Failed to generate study plan',
    });
  }
});

// Vite or Static files handling
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Smart Campus] Full-stack Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
