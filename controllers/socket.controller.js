const socketController = (client) => {
  console.log("cliente connect !!! socket-io - id_conection: ", client.id);

  client.on("disconnect", () => {
    console.log(
      "cliente disconnect !!! socket-io - id_desconection: ",
      client.id
    );
  });

  /* configurar eventos que escuchará el servidor de sus clientes */
  client.on("ev1-from-client-send-msm", (payload, callback) => {
    console.log(payload);

    /* emitir eventos hacia el cliente forma1. */
    /* emitir eventos hacia todos los clientes exceptuando el cliente que lo envió ... */
    /* this.io.emit(...) : cuando se usa dentro de la clase */
    client.broadcast.emit("ev1-from-server-send-msm", {
      message:
        "ev1 emitido desde el servidor al recibir un msm de un cliente - forma1 directamente",
      broadcast: true,
      payload,
      client: client.id,
    });

    /* emitir eventos hacia el cliente forma2. */
    /* ejecutar callback declarado del lado del cliente */
    callback({
      message:
        "ev1 emitido desde el servidor al recibir un msm de un cliente - forma2 disparando callback",
      date: new Date(),
      clientId: client.id,
    });
  });
};

module.exports = {
  socketController,
};
