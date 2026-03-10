const rateLimit = new Map<string, { count: number; lastReset: number }>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5; // 5 attempts per window

export function checkRateLimit(identifier: string): { success: boolean; remaining: number } {
    const now = Date.now();
    const entry = rateLimit.get(identifier);

    if (!entry || now - entry.lastReset > WINDOW_MS) {
        rateLimit.set(identifier, { count: 1, lastReset: now });
        return { success: true, remaining: MAX_REQUESTS - 1 };
    }

    if (entry.count >= MAX_REQUESTS) {
        return { success: false, remaining: 0 };
    }

    entry.count++;
    return { success: true, remaining: MAX_REQUESTS - entry.count };
}
