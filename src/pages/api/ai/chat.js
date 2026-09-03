import { getDatabase } from "@/lib/mongodb";
import { generateChatCompletion, analyzeLeadFromConversation } from "@/lib/ai";
import crypto from "crypto";

export default async function handler(req, res) {
  const db = await getDatabase();
  const sessionsCol = db.collection("ai_chat_sessions");
  const inquiriesCol = db.collection("inquiries");

  // GET: Fetch existing chat history for a session
  if (req.method === "GET") {
    const { sessionId } = req.query;
    if (!sessionId) {
      return res.status(400).json({ error: "sessionId required" });
    }

    try {
      const session = await sessionsCol.findOne({ sessionId });
      if (!session) {
        return res.status(200).json({ messages: [], leadData: null, leadScore: null });
      }
      return res.status(200).json({
        messages: session.messages || [],
        leadData: session.leadData || null,
        leadScore: session.leadScore || null,
        createdAt: session.createdAt,
      });
    } catch (err) {
      console.error("GET /api/ai/chat error:", err);
      return res.status(500).json({ error: "Failed to load chat history" });
    }
  }

  // POST: Send a message & get AI response
  if (req.method === "POST") {
    try {
      const { message, sessionId: incomingSessionId, userDetails } = req.body || {};
      if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({ error: "Message cannot be empty" });
      }

      const sessionId = incomingSessionId || `twj_session_${crypto.randomBytes(8).toString("hex")}`;
      const now = new Date();

      // Retrieve existing session or initialize
      let session = await sessionsCol.findOne({ sessionId });
      const previousMessages = session?.messages || [];

      const userMsgObj = {
        id: `msg_${Date.now()}_u`,
        role: "user",
        content: message.trim(),
        timestamp: now,
      };

      const updatedMessages = [...previousMessages, userMsgObj];

      // Generate AI response using token-optimized rolling window
      const aiResult = await generateChatCompletion(updatedMessages);

      const aiMsgObj = {
        id: `msg_${Date.now() + 1}_a`,
        role: "assistant",
        content: aiResult.content,
        timestamp: new Date(),
        modelUsed: aiResult.modelUsed,
      };

      const finalMessages = [...updatedMessages, aiMsgObj];

      // Analyze lead data in the background or immediately if enough turns
      let existingLeadData = session?.leadData || {};
      if (userDetails && typeof userDetails === "object") {
        existingLeadData = { ...existingLeadData, ...userDetails };
      }

      let detectedLead = null;
      if (finalMessages.length >= 2) {
        try {
          detectedLead = await analyzeLeadFromConversation(finalMessages);
        } catch (e) {
          console.warn("Lead analysis failed:", e.message);
        }
      }

      const mergedLeadData = {
        ...existingLeadData,
        ...(detectedLead || {}),
      };

      const leadScore = mergedLeadData.lead_score || session?.leadScore || "COLD";

      // Save to ai_chat_sessions in MongoDB
      await sessionsCol.updateOne(
        { sessionId },
        {
          $set: {
            sessionId,
            messages: finalMessages,
            leadData: mergedLeadData,
            leadScore,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: now,
            source: "TechWithJoshi AI Specialist",
          },
        },
        { upsert: true }
      );

      // If user provided contact info (email, phone, or name) or scored WARM/HOT, sync to inquiries collection
      const hasContact = mergedLeadData.email || mergedLeadData.phone;
      if (hasContact || leadScore === "HOT" || leadScore === "WARM") {
        const leadName = mergedLeadData.name || "Website AI Visitor";
        const leadEmail = mergedLeadData.email || "Pending Email";
        const leadPhone = mergedLeadData.phone || "";
        const requirement = mergedLeadData.requirement || message;
        const projectType = mergedLeadData.project_type || "Custom Software / AI";

        await inquiriesCol.updateOne(
          { aiSessionId: sessionId },
          {
            $set: {
              name: leadName,
              email: leadEmail,
              phone: leadPhone,
              company: mergedLeadData.company || "N/A",
              service: projectType,
              budget: mergedLeadData.budget || "Discussion",
              timeline: mergedLeadData.timeline || "Standard Sprint",
              message: requirement,
              leadScore: leadScore,
              isAiLead: true,
              aiSessionId: sessionId,
              source: "TechWithJoshi AI Sales Specialist",
              status: "qualified",
              updatedAt: new Date(),
            },
            $setOnInsert: {
              createdAt: new Date(),
              read: false,
            },
          },
          { upsert: true }
        );
      }

      return res.status(200).json({
        success: true,
        sessionId,
        response: aiResult.content,
        leadData: mergedLeadData,
        leadScore,
      });
    } catch (error) {
      console.error("POST /api/ai/chat error:", error);
      return res.status(500).json({
        error: "Our AI specialist is temporarily recalibrating. Please reach out via WhatsApp at +91 7623897036.",
      });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
