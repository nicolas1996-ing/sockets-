/* comunicación con el servidor */

/* conectarse al socket.io */
const socketClient = io();

/* usuario activos en la sala */
let usersInRoom = [];
let msmRoom = [];

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
    renderUsers(resp, user.room);
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
  console.log("user left....", notification);

  const msm = {
    from: notification.from,
    date: notification.date,
    content: notification.message,
  };

  addNewGroupMsm(msm.from, msm.date, msm.content, true);
  renderUsers(notification.users, user.room);
});

/* escuchar eventos desde el servidor=>cliente */
socketClient.on("ev1-from-server-send-msm", (payload) => {
  console.log("msm room: ", payload);
  const msm = {
    from: payload.payload.from.name,
    date: payload.payload.date,
    content: payload.payload.payload,
  };
  addNewGroupMsm(msm.from, msm.date, msm.content);
});

socketClient.on("msm-private", (payload) => {
  console.log("has been received a private msm: ", payload);
});

/* formulario envio de msm */
formSendMsm.addEventListener("submit", (ev) => {
  ev.preventDefault(); // evita refresh de la pág
  const msm = inputMsm?.value;
  if (msm?.trim() === "") {
    return;
  }

  // const addressee = inputMsmTo.value; // destinatario
  // const isPrivateMsm = addressee ? verifyMsmType(addressee) : false;
  const addressee = null;
  const isPrivateMsm = false;

  const payload = {
    success: true,
    payload: msm,
    toId: addressee || null,
    date: new Date(),
    from: user,
  };

  addNewGroupMsm(user.name, new Date(), msm);

  if (addressee) {
    if (isPrivateMsm) {
      // mensajes privados ...
      socketClient.emit("ev3-cs-msm-private", payload);
      //alertMsm.style.display = "none";
      inputMsmTo.value = "";
      inputMsm.value = "";
    } else {
      console.log(isPrivateMsm);
      //alertMsm.style.display = "";
    }
  } else {
    /* emitir eventos hacia el socket - cliente=>servidor */
    console.log("se envio un msm hacia el servidor ...");
    //alertMsm.style.display = "none";
    inputMsm.value = "";
    socketClient.emit("ev1-from-client-send-msm", payload, (socketResponse) => {
      console.log("socket response: ", socketResponse);
    });
    // inputMsmTo.value = "";
    inputMsm.value = "";
    inputMsm.focus();
  }
});

function verifyMsmType(addressee) {
  console.log("users in room: ", usersInRoom);
  console.log("users that send msm: ", addressee);
  return usersInRoom.map((u) => u.id).includes(addressee);
}

function addNewGroupMsm(from, date, content, isInfoAboutConnection = false) {
  msmRoom.push({ from, date, content });
  console.log(msmRoom);
  renderGroupalMsm(msmRoom, isInfoAboutConnection);
}

function renderGroupalMsm(msms = [], isInfoAboutConnection) {
  // console.log(msms);

  const html = msms.map(
    (msm) =>
      `
     <li class=${msm.from === user.name ? "reverse" : ""}>

      ${
        msm.from !== user.name && !isInfoAboutConnection
          ? `<div class="chat-img">
            <img src="assets/images/users/1.jpg" alt="user" />
          </div>`
          : ""
      }

      <div class="chat-content">
        <h5>${msm.from}</h5>
        <div class=${
          msm.from !== user.name ? `bg-light-info` : "bg-light-inverse"
        }>
         ${msm.content}
        </div>
      </div>

      ${
        msm.from === user.name && !isInfoAboutConnection
          ? ` <div class="chat-img">
            <img src="assets/images/users/1.jpg" alt="user" />
          </div>`
          : ""
      }
      <div class="chat-time">${new Date(msm.date).toLocaleTimeString()}</div>
    </li>
   `
  );
  boxMsmGroupal.innerHTML = html;
}


