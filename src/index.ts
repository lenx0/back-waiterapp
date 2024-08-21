import path from "node:path";
import http from "node:http";
import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";

import { router } from "./router";

const app = express();
    const server = http.createServer(app);
    export const io = new Server(server);

mongoose
  .connect(
    "mongodb+srv://waiterappmongo:q6UoTxWxPYahY2JD@cluster0.ybga9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    const port = 3001;


    app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "*");
      res.setHeader("Access-Control-Allow-Headers", "*");

      next();
    });

    app.use(
      "/uploads",
      express.static(path.resolve(__dirname, "..", "uploads"))
    );
    app.use(express.json());
    app.use(router);

    server.listen(port, () => {
      console.log("MongoDB is connected");
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(() => console.log("erro ao contectar ao mongodb"));
