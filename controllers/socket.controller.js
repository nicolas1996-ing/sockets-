const { createMsm } = require("../helpers/utilities");
const { Users } = require("../models/users.model");
const users = new Users();

const socketController = (client) => {
  /* cada vez que un cliente se conecta al servidor de sockets ... */
  console.log("cliente connect !!! socket-io - id_conection: ", client.id);

  /* desconexion de un usuario */
  client.on("disconnect", () => {
    const userDeleted = users.deletePerson(client.id);
    console.log("user deleted: ", userDeleted);
    console.log(
      "cliente disconnect !!! socket-io - id_desconection: ",
      client.id
    );

    /* notificar a toda los usuarios ... */
    /* 
    client.broadcast.emit("ev2-sc-new-users-connected", {
      from: "Admin",
      message: `${userDeleted?.name} left the chat`,
      date: new Date(),
      users: users.getPersons(),
    });
    */

    /* notificar solo a los usuario de la sala... */
    client.broadcast
      .to(userDeleted?.room || "")
      .emit("ev2-sc-new-users-connected", {
        from: "Admin",
        message: `${userDeleted?.name} left the chat`,
        date: new Date(),
        users: users.getPersonsByRoom(userDeleted?.room || ""),
      });
  });

  /* conexión de un usuario */
  client.on("ev2-cs-enter-the-chat", (user, callback) => {
    console.log("ev2-cs-enter-the-chat: ", user);

    /* crear una sala privada asociada al user*/
    client.join(user.room);

    if (!user.name || !user.room) {
      return callback({
        success: false,
        message: "name and room is mandatory",
      });
    }

    /* agregar persona y retornar usuario de la sala asociada */
    users.addPerson(client.id, user.name, user.room);
    callback(users.getPersonsByRoom(user.room));

    /* notificar a la sala sobre los nuevos usuarios */
    /* solo notifica a los usuario conectados en una misma sala */
    client.broadcast.to(user.room).emit("ev2-sc-new-users-connected", {
      from: "Admin",
      message: `user ${user.name} is connected in room`,
      users: users.getPersonsByRoom(user.room),
      date: new Date(),
    });
  });

  /* configurar eventos que escuchará el servidor de sus clientes */
  client.on("ev1-from-client-send-msm", (payload, callback) => {
    // console.log(payload);

    /* emitir eventos hacia el cliente forma1. */
    /* emitir eventos hacia todos los clientes exceptuando el cliente que lo envió ... */
    /* this.io.emit(...) : cuando se usa dentro de la clase */
    console.log(payload);
    client.broadcast.to(payload.from.room).emit("ev1-from-server-send-msm", {
      message: "msm grupal enviado - rta del servidor",
      broadcast: true,
      payload,
      client: client.id,
    });

    /* emitir eventos hacia el cliente forma2. */
    /* ejecutar callback declarado del lado del cliente */
    callback({
      message: "rta al msm grupal enviado",
      date: new Date(),
      clientId: client.id,
    });
  });

  // mensajes privados
  client.on("ev3-cs-msm-private", (data) => {
    let person = users.getPersonById(client.id);
    const { toId, ...msgContent } = data;
    console.log("toId: ", toId);
    /* notificar solo a un cliente ...  */
    client.broadcast
      .to(toId)
      .emit("msm-private", createMsm(person.name, msgContent));
  });
};

module.exports = {
  socketController,
};
