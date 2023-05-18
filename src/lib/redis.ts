import { Redis } from '@upstash/redis'

const redisUrl = process.env.UPSTASH_REDIS_REST_URL
//test for redis url
if (!redisUrl) { 
    throw new Error('Redis URL is missing!')
}
console.log("redis URL", redisUrl)
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN
//test for redis token
if (!redisToken) {
    throw new Error('Redis token is missing!')
}


export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

