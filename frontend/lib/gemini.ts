// Client-side Gemini integration ("bring your own key"). Called directly
// from the device straight to Google's API - no backend involved, and the
// key never leaves the device except to Google. If no key is configured,
// or the request fails/times out for any reason, callers fall back to the
// local quote library automatically.

const GEMINI_MODEL = 'gemini-2.0-flash';
const TIMEOUT_MS = 8000;

const PROMPT =
  'Generate one unique, powerful reason (max 15 words) for someone to close their phone ' +
  'and engage with real life right now. Be creative, caring, and varied - focus on health, ' +
  'relationships, productivity, nature, or mindfulness. Reply with only the reason itself, ' +
  'no quotation marks, no preamble, no labels.';

export async function fetchGeminiReason(apiKey: string): Promise<string | null> {
  const key = apiKey?.trim();
  if (!key) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(key)}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: PROMPT }] }],
        generationConfig: { temperature: 1, maxOutputTokens: 60 },
      }),
      signal: controller.signal,
    });

    if (!response.ok) return null;
    const data = await response.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    return text.trim().replace(/^["']|["']$/g, '');
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
