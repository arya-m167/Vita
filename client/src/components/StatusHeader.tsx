import { Battery, Wifi, Bluetooth, Signal } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusHeaderProps {
  batteryLevel: number;
  wifiConnected: boolean;
  bluetoothConnected: boolean;
}

export function StatusHeader({ batteryLevel, wifiConnected, bluetoothConnected }: StatusHeaderProps) {
  const isLowBattery = batteryLevel < 20;

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-sm font-semibold text-slate-600">VitaPendant Active</span>
      </div>

      <div className="flex items-center gap-4 text-slate-500">
        <div className={cn("flex items-center gap-1", !bluetoothConnected && "opacity-30")}>
          <Bluetooth className="w-4 h-4" />
        </div>
        
        <div className={cn("flex items-center gap-1", !wifiConnected && "opacity-30")}>
          <Wifi className="w-4 h-4" />
        </div>

        <div className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded-full font-mono text-xs font-bold",
          isLowBattery ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-700"
        )}>
          <span>{batteryLevel}%</span>
          <Battery className={cn("w-4 h-4", isLowBattery && "fill-current")} />
        </div>
      </div>
    </div>
  );
}
