const express = require("express");
const cors = require("cors");
const { socketController } = require("../controllers/socket.controller");

class Server {
  constructor() {
    /* express */
    this.app = express();
    this.port = process.env.PORT || 8080;

    /* sockets.io */
    this.server = require("http").createServer(this.app);
    this.io = require("socket.io")(this.server); // io permite enviar msm a todas las conexiones que estén activas en el back-end

    this.middlewares();
    this.paths = {};
    this.routes();

    /* sockets.io */
    this.sockets();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json()); // config json format input
    this.app.use(express.static("public")); // localhost:port/ ( front-end )
  }

  routes() {}

  /* sockets.io */
  sockets() {
    /* mensajes de conex. desconex. de clientes del socket - public/index.html */
    this.io.on("connection", socketController);
  }

  // init server
  listen() {
    this.server.listen(this.port, () => {
      console.log(`App listening on port ${this.port}`);
    });
  }
}

module.exports = {
  Server,
};
