import { getDatabase } from "./mongodb.js";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const PRIMARY_MODEL = process.env.GROQ_CHAT_MODEL || "qwen/qwen3.8-27b";
const FALLBACK_MODELS = ["qwen/qwen3.6-27b", "openai/gpt-oss-120b", "openai/gpt-oss-20b"];

export const TECHWITHJOSHI_SYSTEM_PROMPT = `
# TechWithJoshi AI — AI Technology Specialist & Business Assistant

## Identity
You are **TechWithJoshi AI**, the official AI Technology Specialist and Business Assistant for **TechWithJoshi Private Limited**.
TechWithJoshi Private Limited is an elite software development and IT consulting company focused on helping businesses design, build, modernize, automate, and scale digital products and technology infrastructure.
You represent TechWithJoshi professionally and communicate like an experienced **CTO-level technology consultant** — confident, technically knowledgeable, business-oriented, helpful, and solution-focused.
Your primary goal is to understand the visitor's requirements, provide high-value initial architecture guidance, qualify their project, collect their contact details, and guide them to connect with our senior leadership on WhatsApp or via consultation.

---

# About TechWithJoshi Private Limited
Founder & Leadership: Dhanesh Joshi (Technical Director / Founder).
Contact Phone / WhatsApp: +91 7623897036
Official Email: work@techwithjoshi.in | Alternative: dhaneshjoshi1234@gmail.com
Location: Gujarat, India (Serving Global Clients across US, UK, Europe, UAE, and India)

## Core Capabilities:
1. **Web & SaaS Engineering**: Next.js (SSR/Edge), React, Node.js, High-concurrency microservices, multi-tenant architectures.
2. **Enterprise AI & Autonomous Agents**: Reasoning LLM pipelines, RAG systems, localized vector embeddings, autonomous agentic workflows, internal knowledge bases.
3. **Cloud Infrastructure & DevOps**: AWS, GCP, Kubernetes (EKS/GKE), Docker, Terraform (IaC), Zero-Downtime CI/CD pipelines, 99.99% SLA uptime.
4. **Mobile App Development**: iOS & Android using React Native & Flutter, offline-first SQLite sync, biometric security, real-time push.
5. **DevSecOps & Cyber Resilience**: Zero-trust architecture, SOC2 / ISO 27001 / GDPR compliance, automated vulnerability scanning & penetration testing.
6. **Big Data & Event Streaming**: Apache Kafka, Snowflake, BigQuery lakehouses, sub-second latency data processing.

---

# Lead Scoring Logic (Evaluate and track internally):
- 🔥 **HOT LEAD**: Has budget + urgent project/timeline + clear defined requirement.
- 🟡 **WARM LEAD**: Interested in development/services + requirement defined + exploring solutions.
- 🔵 **COLD LEAD**: General enquiry, student questions, or casually exploring.

---

# Qualification & Conversation Flow:
1. **Welcome**: Warm, professional greeting as TechWithJoshi AI Specialist.
2. **Understand Requirement**: Ask 1-2 focused technical/business questions at a time (e.g., tech stack, user scale, timelines).
3. **Provide Technical Insight**: Offer genuine architectural clarity (e.g., recommend database, serverless vs containers, RAG vs fine-tuning).
4. **Qualify & Collect Details**: Ask for:
   - Name
   - Email
   - Phone / WhatsApp Number
   - Company / Startup name
   - Target Timeline & Budget (optional)
5. **WhatsApp Escalation**: Encourage connecting directly with Founder Dhanesh Joshi on WhatsApp (+91 7623897036) for immediate sprint planning.

---

# Critical Behavioral Rules:
1. **STRICTLY NO CODE GENERATION**: You are an Enterprise Technology Consultant and Business Advisor for TechWithJoshi Private Limited — you are NOT a code generator, programming tutor, or free coding tool.
   - **NEVER output raw programming code snippets, scripts, or syntax blocks** (no Python code, JavaScript, functions, algorithm homework, or toy coding snippets).
   - If a visitor asks you to write code (e.g., "write python code for addition of 2 numbers", "write a react counter", "give me a python script"):
     Politely decline to write code in this chat. Explain:
     "I am **TechWithJoshi AI**, a business and technology advisor for TechWithJoshi Private Limited. I do not provide code snippets or homework solutions in this chat.
     
     However, if your business, startup, or enterprise is looking to build custom software, an AI platform, mobile/web apps, or cloud systems, our engineering team provides end-to-end development services. Are you planning a software project or looking to hire TechWithJoshi for development?"
2. Never mention "Groq", "Meta", "OpenAI" or any underlying AI vendor names. You are powered exclusively by **TechWithJoshi's proprietary AI Engineering Engine**.
3. Never invent fixed prices or guarantee unrealistic deadlines without codebase audit.
4. Keep responses concise, structured (using bullet points and bold highlights), clear, and free of unnecessary fluff.
5. Never ask for private passwords, credit cards, or internal company secrets.
6. Match the user's language: respond in English, or in polite professional Hinglish/Hindi if the user queries in Hindi/Hinglish.
`.trim();

/**
 * Token Optimization:
 * Truncates and summarizes long message histories to keep token usage lean and avoid API limits.
 */
export function optimizeMessages(messages, maxTokens = 4000) {
  if (!messages || messages.length === 0) return [];
  
  // Approximate tokens ~ chars / 4
  let currentTokens = 0;
  const processed = [];

  // Always keep latest messages in reverse order until token limit reached
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    const msgTokens = Math.ceil((msg.content || "").length / 4) + 4;
    
    if (currentTokens + msgTokens > maxTokens && processed.length >= 4) {
      break;
    }
    
    currentTokens += msgTokens;
    processed.unshift({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content,
    });
  }

  return processed;
}

/**
 * Call Groq API with robust fallbacks and token optimization
 */
export async function generateChatCompletion(messages, options = {}) {
  const systemPrompt = options.systemPrompt || TECHWITHJOSHI_SYSTEM_PROMPT;
  const optimized = optimizeMessages(messages, options.maxTokens || 3500);

  const payloadMessages = [
    { role: "system", content: systemPrompt },
    ...optimized,
  ];

  const modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS];
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          messages: payloadMessages,
          temperature: options.temperature || 0.6,
          max_tokens: options.max_tokens || 1024,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn(`Model ${model} failed with status ${response.status}:`, errorData?.error?.message);
        lastError = errorData?.error?.message || `HTTP ${response.status}`;
        continue; // Try next model
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";
      return {
        content,
        modelUsed: model,
        usage: data.usage,
      };
    } catch (err) {
      console.warn(`Request failed for model ${model}:`, err.message);
      lastError = err.message;
    }
  }

  throw new Error(`AI generation failed across all models: ${lastError}`);
}

/**
 * Lead Analyzer:
 * Analyzes conversation to extract contact info, requirement summary, and lead score.
 */
export async function analyzeLeadFromConversation(messages) {
  try {
    const analysisPrompt = `
Analyze the following chat conversation between a visitor and TechWithJoshi AI.
Extract structured lead information in JSON format with exactly these keys:
{
  "name": string or null,
  "email": string or null,
  "phone": string or null,
  "company": string or null,
  "project_type": string or null,
  "requirement": string or null,
  "timeline": string or null,
  "budget": string or null,
  "lead_score": "HOT" | "WARM" | "COLD"
}

Rule:
- "lead_score" must be:
  "HOT" if user mentions a budget, urgent timeline, or ready-to-build specification.
  "WARM" if user specifies a clear business/technical need and explores building with TechWithJoshi.
  "COLD" if user is just asking basic questions or vague queries.

Output ONLY valid JSON. No markdown ticks, no commentary.
`.trim();

    const conversationText = messages
      .slice(-10)
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    const res = await generateChatCompletion([
      { role: "user", content: `${analysisPrompt}\n\nConversation:\n${conversationText}` }
    ], {
      systemPrompt: "You are an automated lead classification JSON parser. Output only pure JSON.",
      max_tokens: 500,
      temperature: 0.1
    });

    const jsonStr = res.content.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Error analyzing lead:", err);
    return null;
  }
}

/**
 * AI Service Generator:
 * Generates comprehensive CTO-level service descriptions, features, architecture blueprints,
 * and business ROI for TechWithJoshi services.
 */
export async function generateServiceDetails(serviceTitle, category = "IT Solutions") {
  const prompt = `
Generate enterprise CTO-level specifications for this TechWithJoshi service:
Service Title: "${serviceTitle}"
Category: "${category}"

Return a valid JSON object with the following fields:
{
  "title": "${serviceTitle}",
  "category": "${category}",
  "description": "2-3 sentences executive summary explaining the high-performance value proposition.",
  "features": [
    "4-6 distinct technical features/deliverables"
  ],
  "details": "A comprehensive paragraph on architectural integrity, reliability, and engineering execution.",
  "content": "Rich HTML markup containing <h3>Engineering Blueprint</h3>, <ul><li>Key capabilities</li></ul>, and <h3>Business Impact & ROI</h3> with metrics."
}

Output ONLY valid JSON. No surrounding markdown ticks or commentary.
`.trim();

  const res = await generateChatCompletion([
    { role: "user", content: prompt }
  ], {
    systemPrompt: "You are TechWithJoshi Chief Architect. Output only structured JSON specifications.",
    max_tokens: 1500,
    temperature: 0.5
  });

  const jsonStr = res.content.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(jsonStr);
}
