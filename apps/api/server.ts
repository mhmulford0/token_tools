import * as dotenv from "dotenv";
dotenv.config();

import Fastify, { FastifyInstance } from "fastify";

import cors from "@fastify/cors";
import { erc20Router } from "./routes/erc20";

const server: FastifyInstance = Fastify({});

server.register(cors, {
  methods: ["GET", "POST"],
  origin: "*",
});

// routes
server.register(erc20Router);

const start = async () => {
  try {
    await server.listen({
      host: "0.0.0.0",
      port: parseInt(process.env.PORT as string) || 3001,
    });

    const address = server.server.address();
    const port = typeof address === "string" ? address : address?.port;
  } catch (err) {
    console.log(err);
    server.log.error(err);
    process.exit(1);
  }
};
start();
