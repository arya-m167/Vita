
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.status.latest.path, async (_req, res) => {
    const status = await storage.getLatestReading();
    res.json(status);
  });

  app.get(api.status.history.path, async (_req, res) => {
    const history = await storage.getHistory();
    res.json(history);
  });

  app.post(api.status.sos.path, async (_req, res) => {
    // In a real app, this would trigger SMS/Push notifications
    console.log("SOS Alert Triggered!");
    res.json({ sent: true });
  });

  return httpServer;
}
