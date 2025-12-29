
import { type DeviceReading, type InsertDeviceReading } from "@shared/schema";

export interface IStorage {
  getLatestReading(): Promise<DeviceReading>;
  getHistory(): Promise<{ time: string; heartRate: number }[]>;
}

export class MemStorage implements IStorage {
  private currentReading: DeviceReading;

  constructor() {
    this.currentReading = this.generateMockReading();
  }

  private generateMockReading(): DeviceReading {
    const now = new Date();
    // Simulate heart rate 60-100 normally, occasionally spike
    const heartRate = 60 + Math.floor(Math.random() * 40);
    
    // SpO2 95-100%
    const spo2 = 95 + Math.floor(Math.random() * 6);
    
    // Steps accumulating
    const steps = 1500 + Math.floor(Math.random() * 500);
    
    // Temp 36-38C
    const temperature = 36 + Math.random() * 2;
    
    // Fall detection (very rare mock)
    const isFallen = Math.random() > 0.98; // 2% chance for demo purposes of alert state

    return {
      id: 1,
      heartRate,
      spo2,
      steps,
      temperature: Number(temperature.toFixed(1)),
      isFallen,
      batteryLevel: 85 - Math.floor(Math.random() * 5),
      wifiConnected: Math.random() > 0.1,
      bluetoothConnected: Math.random() > 0.1,
      timestamp: now,
    };
  }

  async getLatestReading(): Promise<DeviceReading> {
    // Regenerate on every fetch to simulate live updates
    this.currentReading = this.generateMockReading();
    return this.currentReading;
  }

  async getHistory(): Promise<{ time: string; heartRate: number }[]> {
    // Generate 24h mock history
    const history = [];
    const now = new Date();
    for (let i = 24; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      history.push({
        time: time.toISOString(),
        heartRate: 60 + Math.floor(Math.random() * 40),
      });
    }
    return history;
  }
}

export const storage = new MemStorage();
