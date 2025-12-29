
import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const deviceReadings = pgTable("device_readings", {
  id: serial("id").primaryKey(),
  heartRate: integer("heart_rate").notNull(),
  spo2: integer("spo2").notNull(),
  steps: integer("steps").notNull(),
  temperature: real("temperature").notNull(),
  isFallen: boolean("is_fallen").default(false).notNull(),
  batteryLevel: integer("battery_level").notNull(),
  wifiConnected: boolean("wifi_connected").default(true).notNull(),
  bluetoothConnected: boolean("bluetooth_connected").default(true).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertReadingSchema = createInsertSchema(deviceReadings).omit({ id: true });

export type DeviceReading = typeof deviceReadings.$inferSelect;
export type InsertDeviceReading = z.infer<typeof insertReadingSchema>;

// For the graph
export type HistoryPoint = {
  time: string;
  heartRate: number;
};
