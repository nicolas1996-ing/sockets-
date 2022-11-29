require("dotenv").config();
const { Server } = require("./models/server");
const server = new Server(); /// instance
server.listen(); // launch server
