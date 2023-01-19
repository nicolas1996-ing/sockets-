/* comunicación con el servidor */
// console.log("hello world");

/* referencias elementos html */
const labelOn = document.getElementById("lbl-online");
const labelOff = document.querySelector("#lbl-offline");
const btnSendMsm = document.querySelector("#btnSendMsm");
const inputMsm = document.querySelector("#inputTxtMsm");
const inputMsmTo = document.querySelector("#inputMsmTo");
const alertMsm = document.querySelector("#incorrectUserIdAlert");

/* conectarse al socket.io */
const socketClient = io();

/* usuario activos en la sala */
let usersInRoom = [];

/* leer params de la ruta */
const params = new URLSearchParams(window.location.search);
if (!params.has("name") || !params.has("room")) {
  window.location = "/index.html";
  throw new Error("name and room is mandatory"); // detiene la app
}

const user = {
  name: params.get("name"),
  room: params.get("room") === "" ? "commun" : params.get("room"),
};

/* configuración eventos asociados al socket */
socketClient.on("connect", () => {
  /* mensaje que se imprime cuando el socket está arriba */
  console.log("el servidor de sockets esta al aire y usted está conectado ...");
  labelOff.style.display = "none";
  labelOn.style.display = "";
  alertMsm.style.display = "none";

  /* emitir msm hacia el socket */
  socketClient.emit("ev2-cs-enter-the-chat", user, (resp) => {
    console.log(resp);
    usersInRoom = resp;
  });
});

socketClient.on("disconnect", () => {
  /* mensaje que se imprime cuando el socket está abajo */
  console.log(
    "el servidor de sockets esta al abajo y usted está desconectado ..."
  );
  labelOff.style.display = "";
});

/* evento que notifica los usuario actuales en la sala */
socketClient.on("ev2-sc-new-users-connected", (notification) => {
  console.log(notification.message);
  usersInRoom = notification.users;
});

/* escuchar eventos desde el servidor=>cliente */
socketClient.on("ev1-from-server-send-msm", (payload) => {
  console.log(payload);
});

socketClient.on("msm-private", (payload) => {
  console.log("has been received a private msm: ", payload);
});

/* eventos html */
btnSendMsm.addEventListener("click", () => {
  /* verificar si es un msm grupal o privado */
  const addressee = inputMsmTo.value; // destinatario
  console.log("users that send msm: ", addressee);
  const isPrivateMsm = addressee ? verifyMsmType(addressee) : false;
  const msm = inputMsm.value;

  const payload = {
    success: true,
    payload: msm,
    toId: addressee || null,
    date: new Date(),
    from: user,
  };

  if (addressee) {
    if (isPrivateMsm) {
      // mensajes privados ...
      socketClient.emit("ev3-cs-msm-private", payload);
      alertMsm.style.display = "none";
      inputMsmTo.value = "";
      inputMsm.value = "";
    } else {
      console.log(isPrivateMsm);
      alertMsm.style.display = "";
    }
  } else {
    /* emitir eventos hacia el socket - cliente=>servidor */
    console.log("se envio un msm hacia el servidor ...");
    alertMsm.style.display = "none";
    inputMsm.value = "";
    socketClient.emit("ev1-from-client-send-msm", payload, (socketResponse) => {
      console.log("socket response: ", socketResponse);
    });
    inputMsmTo.value = "";
    inputMsm.value = "";
  }
});

function verifyMsmType(addressee) {
  console.log("users in room: ", usersInRoom);
  console.log("users that send msm: ", addressee);
  return usersInRoom.map((u) => u.id).includes(addressee);
}
