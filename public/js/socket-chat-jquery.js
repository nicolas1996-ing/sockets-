/* referencias html */
const divUser = document.getElementById("divUsuarios");
const nameChatRoom = document.getElementById("name-chat-room");
const formSendMsm = document.getElementById("form-send-msm");
const inputMsm = document.getElementById("msm-content");
const boxMsmGroupal = document.getElementById("divChatbox");

const labelOn = document.getElementById("lbl-online");
const labelOff = document.querySelector("#lbl-offline");
const btnSendMsm = document.querySelector("#btnSendMsm");
const inputMsmTo = document.querySelector("#inputMsmTo");
const alertMsm = document.querySelector("#incorrectUserIdAlert");

/* funciones para renderizar información */
function renderUsers(persons = [], room) {
  let html = `
            <li>
                <a href="javascript:void(0)" class="active">
                    Chat de <span> ${room}</span></a>
            </li>
  `;

  nameChatRoom.innerText = room;

  persons.forEach((p) => {
    html += `
    <li>
        <a href="javascript:void(0)" >
        <img
            src="assets/images/users/1.jpg"
            alt="user-img"
            class="img-circle"
            id="${p.id}"
        />
        <span
            >${p.name}
            <small class="text-success">online</small>
        </span>
        </a>
    </li>`;
  });

  divUser.innerHTML = html;
  addEvOnUser(persons);
}

divUser.addEventListener;

function addEvOnUser(users) {
  const htmlUser = users.map((user) => document.getElementById(user.id));
  htmlUser.forEach((user) => {
    user.addEventListener("click", (ev) => {
      if (ev?.target?.attributes?.id?.nodeValue) {
        const id = ev?.target?.attributes?.id?.nodeValue;
        console.log(id);
      }
    });
  });
}
