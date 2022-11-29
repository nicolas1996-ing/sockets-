/* comunicación con el servidor */
// console.log("hello world");

/* referencias elementos html */
const labelOn = document.getElementById("lbl-online");
const labelOff = document.querySelector("#lbl-offline");
const btnSendMsm = document.querySelector("#btnSendMsm");
const inputMsm = document.querySelector("#inputTxtMsm");

/* conectarse al socket.io */
const socketClient = io();

/* configuración eventos asociados al socket */
socketClient.on("connect", () => {
  /* mensaje que se imprime cuando el socket está arriba */
  console.log("el servidor de sockets esta al aire y usted está conectado ...");
  labelOff.style.display = "none";
  labelOn.style.display = "";
});

socketClient.on("disconnect", () => {
  /* mensaje que se imprime cuando el socket está abajo */
  console.log(
    "el servidor de sockets esta al abajo y usted está desconectado ..."
  );
  labelOff.style.display = "";
  labelOn.style.display = "none";
});

/* escuchar eventos servidor=>cliente */
socketClient.on("ev1-from-server-send-msm", (payload) => {
  console.log(payload);
});

/* eventos html */
btnSendMsm.addEventListener("click", () => {
  console.log("se envio un msm hacia el servidor ...");
  const msm = inputMsm.value;
  const payload = {
    success: true,
    payload: msm,
    date: new Date(),
  };

  /* emitir eventos hacia el socket - cliente=>servidor */
  socketClient.emit("ev1-from-client-send-msm", payload, (socketResponse) => {
    console.log("socket response: ", socketResponse);
  });
});
