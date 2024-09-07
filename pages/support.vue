<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import {
  getTickets,
  createTickets,
  getMessages,
  closeTicket,
  sendMessage,
} from "~/services/supportService";
import { ElMessage } from "element-plus";
import Cookies from "js-cookie";

const addTicketDialog = ref(false);
const closeTicketDialog = ref(false);

const tickets = ref([]);
const activeTicket = ref(0);
const activeTicketStatus = ref(1);
const message = ref("");
const messages = ref([]);
const ticket = ref({
  title: "",
  category: "",
  content: "",
});
const options = [
  {
    value: "Problème de compte",
    label: "Problème de compte",
  },
  {
    value: "Problème dans une commande",
    label: "Problème dans une commande",
  },
  {
    value: "Problème de payement",
    label: "Problème de payement",
  },
  {
    value: "Problème avec ma ferme",
    label: "Problème avec ma ferme",
  },
];

const getAllTickets = async () => {
  const data = await getTickets();
  tickets.value = data;
};

const addTicket = async () => {
  if (
    ticket.value.title !== "" &&
    ticket.value.category !== "" &&
    ticket.value.content !== ""
  ) {
    const response = await createTickets(ticket.value);
    ElMessage({
      message: response.message,
      type: "success",
      grouping: true,
      showClose: true,
    });
    addTicketDialog.value = false;
    await getAllTickets();
  } else {
    ElMessage({
      message: "Merci de remplir tout les champs.",
      type: "error",
      grouping: true,
      showClose: true,
    });
  }
};

const getMessageTicket = async (id, status) => {
  const data = await getMessages(id);
  messages.value = data;
  activeTicket.value = id;
  activeTicketStatus.value = status;
};

const clotureTicket = async () => {
  const response = await closeTicket(activeTicket.value);
  ElMessage({
    message: response.message,
    type: "success",
    grouping: true,
    showClose: true,
  });
  closeTicketDialog.value = false;
  messages.value = [];
  await getAllTickets();
};

const handleSendMessage = async () => {
  const data = {
    ticketId: activeTicket.value,
    content: message.value,
  };
  const response = await sendMessage(data);
  ElMessage({
    message: response.message,
    type: "success",
    grouping: true,
    showClose: true,
  });
  await getMessageTicket(activeTicket.value, 1);
  message.value = "";
};

function formatDate(dateString) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(2);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Retourne la date formatée
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

onMounted(() => {
  const token = Cookies.get("authToken");
  if (token) {
    getAllTickets();
  }
});
</script>

<template>
  <div class="centerView">
    <div class="content">
      <div class="noTicket" v-if="tickets.length === 0">
        <h2>Support</h2>
        <p>
          Un problème particulier sur notre site ? Merci d'ouvrir un ticket, un
          administrateur vous répondra le plus vite possible à votre demande.
        </p>
        <el-buttton
          @click="addTicketDialog = true"
          type="primary"
          style="margin-top: 20px; padding: 5px 15px"
          class="colorButton addTicket"
          round
        >
          <p>Créer un ticket</p>
        </el-buttton>
      </div>
      <div v-if="tickets.length !== 0" class="container tickets">
        <div class="ticketHeader">
          <h2>Mes tickets</h2>
          <el-buttton
            @click="addTicketDialog = true"
            type="primary"
            class="colorButton addTicket"
            round
          >
            <p>Créer</p>
          </el-buttton>
        </div>
        <div>
          <TicketCard
            v-for="t in tickets"
            @click="getMessageTicket(t.id, t.status)"
            :id="t.id"
            :subject="t.title"
            :status="t.status"
          />
        </div>
      </div>
      <div v-if="tickets.length !== 0" class="container conversation">
        <h2 v-if="messages.length !== 0">Conversation</h2>
        <el-button
          v-if="messages.length !== 0 && activeTicketStatus === 1"
          class="closeTicket"
          @click="closeTicketDialog = true"
          type="danger"
          rounded
          >Cloturer</el-button
        >
        <div v-if="messages.length !== 0" class="container convBox">
          <div
            v-for="m in messages"
            :class="{
              self: m.sender === 'user',
              receiver: m.sender === 'admin',
            }"
            class="message"
          >
            <p>
              {{ m.content }}
            </p>
            <span>{{ formatDate(m.createdAt) }}</span>
          </div>
        </div>
        <p v-if="activeTicketStatus === 0">Ce ticket est cloturé.</p>
        <form
          v-if="messages.length !== 0 && activeTicketStatus === 1"
          class="searchBar"
          @submit.prevent=""
        >
          <input type="text" v-model="message" placeholder="Votre message..." />
          <el-button
            @click="handleSendMessage"
            class="colorButton"
            size="large"
            type="primary"
            circle
          >
            <FontAwesomeIcon color="#ffffff" :icon="faPaperPlane" />
          </el-button>
        </form>
      </div>
    </div>
    <el-dialog
      v-model="addTicketDialog"
      title="Créer un ticket"
      width="500"
      align-center
    >
      <form class="ticketForm">
        <div>
          <p>Titre du ticket</p>
          <input v-model="ticket.title" type="text" />
        </div>
        <div>
          <p>Catégorie</p>
          <el-select v-model="ticket.category" placeholder="Select" width="260">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div>
          <p>Description du problème</p>
          <textarea
            v-model="ticket.content"
            style="resize: none"
            placeholder="Merci de décrire un maximum votre problème afin que les administrateurs vous aide au mieux !"
          ></textarea>
        </div>
      </form>
      <template #footer>
        <div
          style="display: flex; justify-content: center; align-items: center"
        >
          <el-button @click="addTicket" type="primary" class="colorButton"
            >Créer mon ticket</el-button
          >
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="closeTicketDialog" title="Attention" width="500" center>
      <span>
        Voulez-vous vraiment cloturer votre ticket ? Seul un administrateur
        pourra le réouvrir.
      </span>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" class="colorButton" @click="clotureTicket"
            >Cloturer</el-button
          >
          <el-button @click="closeTicketDialog = false"> Annuler </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.centerView {
  display: flex;
  justify-content: center;
  margin-top: 25px;
  min-height: 70vh;
}
.centerView .content {
  max-width: 1100px;
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
  max-height: 60vh;
}
.content .tickets {
  width: 30%;
  display: flex;
  justify-content: start;
  flex-direction: column;
  position: relative;
}
.ticketHeader {
  display: flex;
  justify-content: space-around;
}
.addTicket {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  cursor: pointer;
}
.content .tickets div {
  overflow-y: auto;
}
.content h2 {
  margin-bottom: 15px;
}
.content .conversation {
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  position: relative;
}
.convBox {
  width: stretch;
  display: flex;
  flex-direction: column;
  justify-content: start;
  position: relative;
  max-height: 320px;
  height: 320px;
  overflow-y: auto;
}
.message {
  min-width: 100px;
  max-width: 400px;
  padding: 10px;
  padding-bottom: 25px;
  border-radius: 8px;
  margin: 5px 0;
  position: relative;
}
.message span {
  position: absolute;
  bottom: 5px;
  right: 10px;
  font-size: 12px;
  font-weight: 600;
}
.self {
  align-self: flex-end;
  color: black;
  background-color: rgb(214, 214, 214);
}
.receiver {
  align-self: flex-start;
  background-color: #1fa254;
  color: white;
}
.convBox .message p {
  font-size: 12px;
  font-weight: 500;
  text-align: left;
}
.searchBar {
  border: 1px solid #1fa254;
  border-radius: 25px;
  padding: 5px;
  display: flex;
  justify-content: space-between;
}
.searchBar input {
  padding: 4px 4px 4px 10px;
  margin-right: 10px;
  border: none;
  font-size: 15px;
  outline: none;
  width: auto;
}
.ticketForm {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.ticketForm div {
  text-align: center;
  width: 260px;
}
.ticketForm div p {
  margin: 10px 0;
}
.ticketForm div input {
  padding: 5px;
  outline: none;
  border: 2px solid gray;
  border-radius: 4px;
}
.ticketForm div input:focus {
  border: 2px solid #1fa254;
}
.ticketForm div textarea {
  width: 245px;
  height: 350px;
  font-size: 14px;
  padding: 5px;
  border: 2px solid gray;
  border-radius: 4px;
  outline: none;
}
.ticketForm div textarea:focus {
  border: 2px solid #1fa254;
}
.noTicket {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.noTicket h2 {
  font-size: 48px;
}
.noTicket p {
  font-size: 20px;
}
.closeTicket {
  position: absolute;
  top: 25px;
  right: 35px;
}
</style>
