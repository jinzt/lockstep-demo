import http from "http";
import express from "express";
import path from "path";
import cors from "cors";
import { Server } from "colyseus";
import { monitor } from "@colyseus/monitor";
// import socialRoutes from "@colyseus/social/express"

import session from "express-session";
import connectRedis from "connect-redis";

import { MyRoom } from "./rooms/MyRoom";


declare module "http" {
  interface IncomingMessage {
    session: Express.Session;
  }
}

const port = Number(process.env.PORT || 2567);
const app = express()


// const RedisStore = connectRedis(session);
// const redisClient = redis.createClient();
const sessionParser = session({
  secret: "xxx secret xxx",
  // store: new RedisStore({ client: redisClient })
});

app.use(cors());
app.use(express.json())
app.use(sessionParser);
app.use(express.static(path.resolve("public")))

app.get("/set", (req, res) => {
  const data = req.query;

  for (let field in data) {
    req.session![field] = data[field];
  }

  res.redirect("/");
});

const server = http.createServer(app);
const gameServer = new Server({
  server,
  verifyClient: (info, next) => {
    // Make "session" available for the WebSocket connection (during onAuth())
    sessionParser(info.req as any, {} as any, () => next(true));
  }
});

// register your room handlers
gameServer.define('my_room', MyRoom);

/**
 * Register @colyseus/social routes
 *
 * - uncomment if you want to use default authentication (https://docs.colyseus.io/authentication/)
 * - also uncomment the import statement
 */
// app.use("/", socialRoutes);

// register colyseus monitor AFTER registering your room handlers
app.use("/colyseus", monitor());

gameServer.listen(port);
console.log(`Listening on ws://localhost:${ port }`)
