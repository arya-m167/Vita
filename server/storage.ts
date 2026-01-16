
import { type DeviceReading, type InsertDeviceReading } from "@shared/schema";

export interface IStorage {
  getLatestReading(): Promise<DeviceReading>;
  getHistory(): Promise<{ time: string; heartRate: number }[]>;
}

export class MemStorage implements IStorage {
  private currentReading: DeviceReading;
  // SisFall Thresholds (Gravity is ~1.0g normalized or ~9.8 m/s^2)
  // High impact threshold (SVM > 2.5g) and orientation change
  private FALL_THRESHOLD_SVM = 2.5; 

  constructor() {
    this.currentReading = this.generateMockReading();
  }

  private calculateSVM(x: number, y: number, z: number): number {
    return Math.sqrt(x * x + y * y + z * z);
  }

  private generateMockReading(): DeviceReading {
    const now = new Date();
    
    // Simulate raw accelerometer values (in g-force)
    // Normal ADL: subtle variations around 1g total magnitude
    let accelX = (Math.random() - 0.5) * 0.2;
    let accelY = 1.0 + (Math.random() - 0.5) * 0.2; // Gravity mainly on Y axis
    let accelZ = (Math.random() - 0.5) * 0.2;

    // Simulate a fall (High acceleration impact)
    const simulateFallEvent = Math.random() > 0.95;
    if (simulateFallEvent) {
      accelX = (Math.random() - 0.5) * 4.0;
      accelY = (Math.random() - 0.5) * 4.0;
      accelZ = (Math.random() - 0.5) * 4.0;
    }

    const svm = this.calculateSVM(accelX, accelY, accelZ);
    // SisFall Logic: Fall detected if Signal Vector Magnitude (SVM) exceeds threshold
    const isFallen = svm > this.FALL_THRESHOLD_SVM;

    const heartRate = 60 + Math.floor(Math.random() * 40);
    const spo2 = 95 + Math.floor(Math.random() * 6);
    const steps = 1500 + Math.floor(Math.random() * 500);
    const temperature = 36 + Math.random() * 2;

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
      accelX: Number(accelX.toFixed(3)),
      accelY: Number(accelY.toFixed(3)),
      accelZ: Number(accelZ.toFixed(3)),
      timestamp: now,
    };
  }

  async getLatestReading(): Promise<DeviceReading> {
    this.currentReading = this.generateMockReading();
    return this.currentReading;
  }

  async getHistory(): Promise<{ time: string; heartRate: number }[]> {
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
