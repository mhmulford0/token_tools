import * as dotenv from "dotenv";

dotenv.config();
import Redis from "ioredis";

export const redis = new Redis(process.env.CONNECTION_STRING as string);
