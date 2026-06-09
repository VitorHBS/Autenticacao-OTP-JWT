import { RequestHandler } from "express";

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    }
}

const store: RateLimitStore = {};

export const createRateLimiter = (
    windowMs: number = 60000, // 1 minuto
    maxRequests: number = 5
): RequestHandler => {
    return (req, res, next) => {
        const key = `${req.ip}-${req.path}`;
        const now = Date.now();

        if (!store[key]) {
            store[key] = { count: 1, resetTime: now + windowMs };
            return next();
        }

        if (now > store[key].resetTime) {
            store[key] = { count: 1, resetTime: now + windowMs };
            return next();
        }

        store[key].count++;

        if (store[key].count > maxRequests) {
            return res.status(429).json({
                error: "Muitas tentativas. Tente novamente em 1 minuto."
            });
        }

        next();
    };
};

// Limpar dados expirados a cada 5 minutos
setInterval(() => {
    const now = Date.now();
    for (const key in store) {
        if (store[key].resetTime < now) {
            delete store[key];
        }
    }
}, 300000);
