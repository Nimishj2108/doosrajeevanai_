import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { runOrganDonationAgent, evaluateWithMistral, sendResendEmail, sendTelegramAlert, getAgentConfigStatus, getTelegramBotInfo, getLatestTelegramChatId } from "./src/services/organDonationAgent";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser Middleware
  app.use(express.json());

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "NOTTO Agentic AI Orchestrator" });
  });

  // System Configuration & Real API Status
  app.get("/api/agent/system-status", (req, res) => {
    res.json({
      status: "online",
      timestamp: new Date().toISOString(),
      agents: getAgentConfigStatus()
    });
  });

  // Telegram Bot Info
  app.get("/api/agent/telegram-bot-info", async (req, res) => {
    const info = await getTelegramBotInfo();
    res.json(info);
  });

  // Telegram Latest Active Chat Auto-Detection
  app.get("/api/agent/telegram-latest-chat", async (req, res) => {
    const chat = await getLatestTelegramChatId();
    res.json(chat);
  });

  /**
   * Main Agentic AI Workflow Endpoint: POST /api/agent/run-organ-donation
   * Evaluates donor viability with Mistral AI and triggers Resend & Telegram downstream tools.
   */
  app.post("/api/agent/run-organ-donation", async (req, res) => {
    try {
      const donorData = req.body;
      if (!donorData || !donorData.organ || !donorData.bloodGroup) {
        return res.status(400).json({
          success: false,
          error: "Missing required donor fields (organ, bloodGroup, age, fullName)"
        });
      }

      console.log(`[API Route] Received Agentic AI request for donor: ${donorData.fullName || 'Anonymous'}`);
      const report = await runOrganDonationAgent(donorData);
      
      return res.status(200).json(report);
    } catch (error: any) {
      console.error("[API Route Error] Agent execution failed:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Internal server error during agent execution"
      });
    }
  });

  /**
   * Modular API Endpoint for Standalone Mistral Evaluation
   */
  app.post("/api/agent/evaluate-viability", async (req, res) => {
    try {
      const donorData = req.body;
      const evaluation = await evaluateWithMistral(donorData);
      return res.status(200).json({ success: true, evaluation });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  /**
   * Modular API Endpoint for Hospital Emergency Email
   */
  app.post("/api/agent/send-email", async (req, res) => {
    try {
      const { donorData, evaluation } = req.body;
      const result = await sendResendEmail(donorData, evaluation);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  /**
   * Modular API Endpoint for Admin Telegram Alert
   */
  app.post("/api/agent/send-telegram", async (req, res) => {
    try {
      const { donorData, evaluation } = req.body;
      const result = await sendTelegramAlert(donorData, evaluation);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // Vite middleware for development & static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] NOTTO Organ Twin + Agentic AI Backend running on http://localhost:${PORT}`);
  });
}

startServer();
