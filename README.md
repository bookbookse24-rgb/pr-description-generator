# PR Description Generator

AI-powered tool that generates professional PR descriptions from git diffs using Claude.

## Features

- 🎯 Generates clear, professional PR descriptions from diffs
- 🚀 Supports haiku, sonnet, and opus models
- 📊 Free tier: 10 generations/day
- ⚡ Fast, simple API

## Deployment

### Render.com (Recommended)

1. Push this repo to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Create new Web Service
4. Connect your GitHub repo
5. Set environment variables:
   - `ANTHROPIC_API_KEY` - Your Anthropic API key
   - `PORT` - 10000 (Render provides this)
6. Deploy!

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key |
| `PORT` | No | Server port (default: 3000) |

## API Usage

```bash
curl -X POST https://your-service.onrender.com/generate \
  -H "Content-Type: application/json" \
  -d '{"diff": "--- a/index.js\n+++ b/index.js\n@@ -1,3 +1,5 @@\n+const foo = 'bar';\n+console.log(foo);"}'
```

Response:
```json
{
  "description": "## Summary\n\nThis PR adds a simple console.log example...",
  "model": "haiku"
}
```

## Pricing

- **Free**: 10 generations/day
- **Pro**: 100 generations/day - $9/month (Gumroad link coming soon)

## License

MIT
