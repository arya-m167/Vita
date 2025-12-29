
import { z } from 'zod';
import { insertReadingSchema, deviceReadings } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  status: {
    latest: {
      method: 'GET' as const,
      path: '/api/status',
      responses: {
        200: z.custom<typeof deviceReadings.$inferSelect>(),
      },
    },
    history: {
      method: 'GET' as const,
      path: '/api/history',
      responses: {
        200: z.array(z.object({
          time: z.string(),
          heartRate: z.number(),
        })),
      },
    },
    sos: {
      method: 'POST' as const,
      path: '/api/sos',
      responses: {
        200: z.object({ sent: z.boolean() }),
      },
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type DeviceReadingResponse = z.infer<typeof api.status.latest.responses[200]>;
export type HistoryResponse = z.infer<typeof api.status.history.responses[200]>;
