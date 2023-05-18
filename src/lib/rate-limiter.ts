import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

// rate limiter via upstash

export const rateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(4, '10 s'), // four every 10 seconds
    prefix: '@upstash/ratelimit' // optional
})