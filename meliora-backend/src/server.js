import express from "express";
import { config } from "dotenv";
import { pingRouter } from "./routers/ping.js";
import { postRouter } from "./routers/post.js";
import { userRouter } from "./routers/user.js";
import { catRouter } from "./routers/categories.js";

import cors from "cors";
import { adminRouter } from "./routers/admin.js";

config();

let server = express();

server.use(
  express.json({
    limit: "50mb",
  })
);

server.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

server.use("/ping", pingRouter);
server.use("/api/posts", postRouter);
server.use("/api/users", userRouter);
server.use("/api/categories", catRouter);
server.use("/admin", adminRouter);

export { server };
