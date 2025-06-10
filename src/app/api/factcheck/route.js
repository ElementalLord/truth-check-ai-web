import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    const { claim } = await req.json();
    console.log("Claim received:", claim);

    const geminiApiKey = process.env.GEMINI_API_KEY;
    const googleSearchApiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const googleSearchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!geminiApiKey || !googleSearchApiKey || !googleSearchEngineId) {
      return new Response(JSON.stringify({ error: "Missing one or more API keys" }), { status: 500 });
    }

    // Step 1: Search the internet for the claim
    const searchUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      claim
    )}&key=${googleSearchApiKey}&cx=${googleSearchEngineId}`;

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    const topResults = (searchData.items || [])
      .slice(0, 5)
      .map(item => `Title: ${item.title}\nSnippet: ${item.snippet}\nLink: ${item.link}`)
      .join("\n\n");

    const context = `Claim: ${claim}\n\nHere are some online search results:\n\n${topResults}\n\nBased on the above sources, is the claim true, false, or partially true? Respond clearly.`;

    // Step 2: Send the context to Gemini AI
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: [{ role: "user", parts: [{ text: context }] }]
    });

    const text = result.text;
    console.log("Gemini response:", text);

    // Tagging logic
    const lower = text.toLowerCase();
    let tag = "unknown";
    if (lower.includes("true") && !lower.includes("partial")) tag = "true";
    else if (lower.includes("false")) tag = "false";
    else if (lower.includes("partial")) tag = "partial";

    return new Response(JSON.stringify({ result: text, tag }), { status: 200 });
  } catch (err) {
    console.error("Fact checking failed:", err);
    return new Response(JSON.stringify({ error: "Fact checking failed" }), { status: 500 });
  }
}
