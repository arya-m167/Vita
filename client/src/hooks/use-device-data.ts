import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type DeviceReadingResponse, type HistoryResponse } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// Fetch latest device status
export function useDeviceStatus() {
  return useQuery({
    queryKey: [api.status.latest.path],
    queryFn: async () => {
      const res = await fetch(api.status.latest.path);
      if (!res.ok) throw new Error("Failed to fetch device status");
      // Using parse is good practice, but for speed we trust the shared schema types in API response
      const data = await res.json();
      return api.status.latest.responses[200].parse(data);
    },
    refetchInterval: 5000, // Poll every 5 seconds for safety
  });
}

// Fetch heart rate history
export function useHeartRateHistory() {
  return useQuery({
    queryKey: [api.status.history.path],
    queryFn: async () => {
      const res = await fetch(api.status.history.path);
      if (!res.ok) throw new Error("Failed to fetch history");
      const data = await res.json();
      return api.status.history.responses[200].parse(data);
    },
    refetchInterval: 30000, // Poll every 30 seconds
  });
}

// Send SOS Alert
export function useSendSOS() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.status.sos.path, {
        method: api.status.sos.method,
      });
      if (!res.ok) throw new Error("Failed to send SOS");
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "SOS SENT!",
        description: "Emergency contacts have been notified immediately.",
        variant: "destructive",
        duration: 10000,
      });
    },
    onError: () => {
      toast({
        title: "Connection Error",
        description: "Could not send SOS. Please call emergency services directly.",
        variant: "destructive",
      });
    },
  });
}
