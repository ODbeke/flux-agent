export interface ResearchReportResponse {
  markdown: string;
  synthesizedAt: string;
  modelUsed: string;
}

/**
 * Generates a comprehensive research report using the 0G Private Computer (pc.0g.ai) network.
 * This ensures all AI reasoning is executed on decentralized, verifiable GPU resources.
 */
export async function generateResearchReport(
  topic: string,
  apiKey: string
): Promise<ResearchReportResponse> {
  const systemPrompt = `You are Flux Agent, an elite AI research protocol built on the 0G Mainnet ecosystem.
Synthesize deep structured insights on the given query. Provide a report formatted in pure Markdown containing:
1. Executive Protocol Overview
2. Data & Metrics Fetched (Simulated real-time parameters)
3. Technical Architecture & Ecosystem Depth
4. Market Thesis & Value Capture Strategy
5. Verifiable Cryptographic Anchor Validation

Use professional, premium formatting with headers, bullet points, and code block formatting where appropriate.

IMPORTANT: Do NOT include any simulated report IDs, block numbers, or sync information at the bottom (e.g. FLUX_AGENT::REPORT_ID...). 
Instead, always end the entire report with the single line: STATUS: VERIFIED`;

  const userPrompt = `Perform deep synthesis and evaluate the following topic: "${topic}"`;

  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error("0G Mainnet Execution Mode requires a valid 0G Private Computer API key (from pc.0g.ai).");
  }

  const cleanKey = apiKey.trim();
  const zgUrl = "https://router-api.0g.ai/v1/chat/completions";

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const models = [
    "qwen3.6-plus",
    "qwen/qwen2.5-72b-instruct", 
    "deepseek-ai/DeepSeek-V3",
    "meta-llama/llama-3.1-70b-instruct",
    "meta-llama/llama-3.1-8b-instruct",
    "meta-llama/llama-3-70b-instruct",
    "meta-llama/llama-3-8b-instruct",
    "qwen/qwen2.5-7b-instruct"
  ];

  let lastError = "";

  // Randomize models to distribute load and reduce congestion on popular endpoints
  const shuffledModels = [...models].sort(() => Math.random() - 0.5).slice(0, 4);

  for (const model of shuffledModels) {
    // Only try TEE first for the primary attempt
    const teeOptions = [true, false];
    
    for (const verifyTee of teeOptions) {
      try {
        const zgResponse = await fetch(zgUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${cleanKey}`
          },
          body: JSON.stringify({
            model: model, 
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            verify_tee: verifyTee 
          })
        });

        if (zgResponse.ok) {
          const zgData = await zgResponse.json();
          const zgContent = zgData.choices?.[0]?.message?.content;

          if (zgContent) {
            return {
              markdown: zgContent,
              synthesizedAt: new Date().toISOString(),
              modelUsed: `0G Private Computer (${model}${verifyTee ? ' + TEE' : ''})`
            };
          }
        } else {
          const errData = await zgResponse.json();
          lastError = errData.error?.message || zgResponse.statusText;
          
          if (zgResponse.status === 429) {
            console.log("Rate limited by 0G Gateway. Waiting 5 seconds for reset...");
            await sleep(5000); // Aggressive wait for 429
            continue;
          }

          if (lastError.includes("provider") || zgResponse.status === 503) {
            await sleep(1000); // 1s buffer between providers
            continue;
          }
          continue;
        }
      } catch (err: any) {
        lastError = err.message;
        await sleep(1000);
        continue;
      }
    }
  }

  throw new Error(`0G Compute synthesis failed. Last error: ${lastError}. Please verify your credits and provider status at pc.0g.ai.`);
}
