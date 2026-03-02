const express = require('express');
const bodyParser = require('body-parser');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '1mb' }));

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.API_KEY,
});

// Health check
app.get('/', (req, res) => {
  res.json({ 
    service: 'PR Description Generator',
    version: '1.0.0',
    status: 'running',
    endpoint: '/generate',
    usage: 'POST /generate with { diff: "..." }'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Main generation endpoint
app.post('/generate', async (req, res) => {
  try {
    const { diff, model = 'haiku' } = req.body;
    
    if (!diff || diff.trim().length === 0) {
      return res.status(400).json({ error: 'Missing diff parameter' });
    }

    if (diff.length > 50000) {
      return res.status(400).json({ error: 'Diff too large (max 50k chars)' });
    }

    // Map model aliases
    const modelMap = {
      haiku: 'claude-haiku-4-5',
      sonnet: 'claude-sonnet-4-6',
      opus: 'claude-opus-4-6'
    };
    const actualModel = modelMap[model] || 'claude-haiku-4-5';

    const systemPrompt = `You are a senior software engineer. Given a Git diff, generate a clear, professional PR description following conventional commits format. 

Output ONLY the PR description in this format:
- Title: A short, descriptive title
- Description: 2-4 sentences explaining what changed and why
- Changes: Bullet points of key changes
- Testing: How to test this change

Be concise and professional.`;

    const userMessage = `Here is the diff:\n\n${diff}`;

    const message = await anthropic.messages.create({
      model: actualModel,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userMessage }
      ]
    });

    const description = message.content[0].text;

    res.json({
      success: true,
      description,
      model: actualModel,
      tokens: message.usage
    });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ 
      error: 'Generation failed',
      message: error.message 
    });
  }
});

// Free tier: limited generations
const freeTierLimit = 10;
const freeTierUsers = new Map();

app.post('/generate/free', async (req, res) => {
  const { userId, diff, model = 'haiku' } = req.body;
  
  if (!userId || !diff) {
    return res.status(400).json({ error: 'Missing userId or diff' });
  }

  const count = freeTierUsers.get(userId) || 0;
  if (count >= freeTierLimit) {
    return res.status(429).json({ 
      error: 'Free tier limit reached',
      upgrade: 'https://gumroad.com/l/pr-description-generator'
    });
  }

  // Same as /generate but tracks usage
  try {
    const modelMap = {
      haiku: 'claude-haiku-4-5',
      sonnet: 'claude-sonnet-4-6',
      opus: 'claude-opus-4-6'
    };
    const actualModel = modelMap[model] || 'claude-haiku-4-5';

    const systemPrompt = `You are a senior software engineer. Given a Git diff, generate a clear, professional PR description following conventional commits format. 

Output ONLY the PR description in this format:
- Title: A short, descriptive title
- Description: 2-4 sentences explaining what changed and why
- Changes: Bullet points of key changes
- Testing: How to test this change

Be concise and professional.`;

    const message = await anthropic.messages.create({
      model: actualModel,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        { role: 'user', content: `Here is the diff:\n\n${diff}` }
      ]
    });

    freeTierUsers.set(userId, count + 1);

    res.json({
      success: true,
      description: message.content[0].text,
      remaining: freeTierLimit - count - 1
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`PR Description Generator running on port ${PORT}`);
});
