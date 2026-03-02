# PR Description Generator

AI-powered tool that generates professional PR descriptions from Git diffs.

## 🚀 Deploy to Render

1. Connect this repo to Render
2. Set environment variables:
   - `ANTHROPIC_API_KEY` - Your Anthropic API key
   - `PORT` - 3000
3. Build command: `npm install`
4. Start command: `node index.js`

## 🔗 API Endpoints

### POST /generate
```bash
curl -X POST https://your-service.onrender.com/generate \
  -H "Content-Type: application/json" \
  -d '{"diff": "--- a/file.js\n+++ b/file.js\n@@ -1,3 +1,5 @@\n+const x = 1;\n+const y = 2;"}'
```

Response:
```json
{
  "success": true,
  "description": "- Title: Add two new constants\n\n- Description: Added x and y constants to file.js for...",

}
```

### Query Parameters
- `diff` (required): The Git diff
- `model` (optional): haiku, sonnet, opus (default: haiku)

## 💰 Pricing

- **Free**: 10 generations/day
- **Pro** ($5/mo): Unlimited generations, sonnet/opus models
- **Team** ($15/mo): Unlimited + team management

## 📦 Products

Gumroad: https://gumroad.com/l/pr-description-generator
