/**
 * api/openai.js — Vercel serverless proxy for OpenAI Responses API.
 * Keeps the API key server-side so it is never exposed in the browser.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: 'OPENAI_API_KEY is not configured.' });

  try {
    const {
      input,
      instructions,
      max_output_tokens = 1500,
      model = 'gpt-5',
      web_search = false,
    } = req.body || {};

    if (!input || typeof input !== 'string') {
      return res.status(400).json({ error: 'Missing required string field: input' });
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        input,
        ...(instructions ? { instructions } : {}),
        max_output_tokens,
        ...(web_search ? { tools: [{ type: 'web_search' }] } : {}),
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'OpenAI API error' });
    }

    const text = data.output_text
      || data.output?.flatMap(item => item.content || [])
        .filter(part => part.type === 'output_text')
        .map(part => part.text)
        .join('\n')
      || '';

    res.status(200).json({ text, raw: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
