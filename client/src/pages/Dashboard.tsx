import { useEffect, useState } from "react";
import { useDeviceStatus, useHeartRateHistory, useSendSOS } from "@/hooks/use-device-data";
import { StatusHeader } from "@/components/StatusHeader";
import { MetricCard } from "@/components/MetricCard";
import { HeartRateChart } from "@/components/HeartRateChart";
import { 
  Heart, 
  Activity, 
  Footprints, 
  Thermometer, 
  AlertTriangle,
  RefreshCw,
  Phone,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { data: status, isLoading, isError, refetch } = useDeviceStatus();
  const { data: history } = useHeartRateHistory();
  const { mutate: sendSOS, isPending: isSendingSOS } = useSendSOS();
  
  const [sosActive, setSosActive] = useState(false);

  // Safety trigger for fall detection
  useEffect(() => {
    if (status?.isFallen) {
      setSosActive(true);
    }
  }, [status?.isFallen]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg font-medium text-slate-600 animate-pulse">Connecting to VitaPendant...</p>
        </div>
      </div>
    );
  }

  if (isError || !status) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Connection Lost</h1>
        <p className="text-slate-600 mb-8 max-w-xs mx-auto">
          Unable to reach the device. Please check internet connection.
        </p>
        <Button onClick={() => refetch()} size="lg" className="w-full max-w-xs">
          <RefreshCw className="mr-2 h-4 w-4" /> Retry Connection
        </Button>
      </div>
    );
  }

  const handleSOS = () => {
    if (confirm("Are you sure you want to send an emergency SOS alert?")) {
      sendSOS();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-8">
      {/* Top Status Bar */}
      <StatusHeader 
        batteryLevel={status.batteryLevel}
        wifiConnected={status.wifiConnected}
        bluetoothConnected={status.bluetoothConnected}
      />

      <main className="max-w-md mx-auto p-4 space-y-6 md:max-w-4xl md:p-8">
        
        {/* Welcome / Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Health Overview</h1>
            <p className="text-slate-500">Last updated: Just now</p>
          </div>
          
          {/* Status Indicator Pill */}
          <div className={cn(
            "flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 font-bold text-lg transition-all",
            status.isFallen 
              ? "bg-red-50 border-red-200 text-red-600 animate-pulse-red shadow-lg" 
              : "bg-emerald-50 border-emerald-200 text-emerald-700"
          )}>
            {status.isFallen ? (
              <>
                <AlertTriangle className="w-6 h-6 fill-current" />
                <span>FALL DETECTED</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-6 h-6" />
                <span>Status: SAFE</span>
              </>
            )}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard 
            label="Heart Rate" 
            value={status.heartRate} 
            unit="BPM" 
            icon={Heart}
            status={status.heartRate > 100 || status.heartRate < 50 ? "warning" : "normal"}
          />
          <MetricCard 
            label="Oxygen (SpO2)" 
            value={status.spo2} 
            unit="%" 
            icon={Activity}
            status={status.spo2 < 95 ? "danger" : "normal"}
          />
          <MetricCard 
            label="Steps Today" 
            value={status.steps} 
            icon={Footprints}
            status="normal"
          />
          <MetricCard 
            label="Body Temp" 
            value={status.temperature} 
            unit="°C" 
            icon={Thermometer}
            status={status.temperature > 37.5 ? "warning" : "normal"}
          />
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-slate-800">Heart Rate History</h3>
            <span className="text-sm text-slate-400 bg-slate-100 px-2 py-1 rounded-md">24h</span>
          </div>
          {history ? (
            <HeartRateChart data={history} />
          ) : (
            <div className="h-[200px] flex items-center justify-center text-slate-400">
              Loading chart data...
            </div>
          )}
        </div>

        {/* Emergency Actions - Stick to bottom on mobile */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-lg border-t md:static md:bg-transparent md:border-0 md:p-0">
          <div className="max-w-md mx-auto md:max-w-none flex flex-col gap-3">
            <Button 
              onClick={handleSOS}
              disabled={isSendingSOS}
              className={cn(
                "w-full h-16 text-xl font-bold rounded-2xl shadow-xl transition-all active:scale-[0.98]",
                "bg-red-600 hover:bg-red-700 text-white shadow-red-200",
                isSendingSOS && "opacity-80 cursor-wait"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Phone className={cn("w-6 h-6", isSendingSOS && "animate-spin")} />
                </div>
                {isSendingSOS ? "SENDING ALERT..." : "EMERGENCY SOS"}
              </div>
            </Button>
            
            <p className="text-center text-xs text-slate-400 md:hidden">
              Press and hold for 3 seconds to cancel
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
