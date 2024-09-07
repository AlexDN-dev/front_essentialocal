<script setup>
import { computed, ref, onMounted } from "vue";
import { getTickets, getMessages, openTicket } from "~/services/adminService";
import { sendMessage, closeTicket } from "~/services/supportService";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { ElMessage } from "element-plus";

definePageMeta({
  layout: "minimal",
});

const search = ref("");
const dialog = ref(false);
const messages = ref([]);
const ticket = ref({
  content: "",
  ticketId: 0,
});
const tableData = ref([]);
const hideClosedTickets = ref(false); // Ajoutez une variable pour la case à cocher

const filterTableData = computed(() => {
  const searchValue = search.value.toLowerCase();
  return Array.isArray(tableData.value)
    ? tableData.value.filter((data) => {
        const idMatch = data.id
          ? data.id.toString().includes(searchValue)
          : false;
        const titleMatch = data.title
          ? data.title.toLowerCase().includes(searchValue)
          : false;
        const statusMatch = hideClosedTickets.value ? data.status !== 0 : true;
        return (idMatch || titleMatch) && statusMatch;
      })
    : [];
});

const handleEdit = async (row) => {
  dialog.value = true;
  ticket.value.ticketId = row.id;
  await getMessage(row.id);
};

const getMessage = async (id) => {
  messages.value = await getMessages(id);
};

const getTicket = async () => {
  const data = await getTickets();
  if (Array.isArray(data)) {
    tableData.value = data;
  } else {
    console.error("Les données récupérées ne sont pas un tableau:", data);
  }
};

const handleClose = async (row) => {
  const response = await closeTicket(row.id);
  ElMessage({
    message: response.message,
    type: "success",
    grouping: true,
    showClose: true,
  });
  await getTicket();
};

const handleOpenTicket = async (row) => {
  const response = await openTicket(row.id);
  ElMessage({
    message: response.message,
    type: "success",
    grouping: true,
    showClose: true,
  });
  await getTicket();
};

const handleSendMessage = async () => {
  const response = await sendMessage(ticket.value);
  ticket.value.content = "";
  ElMessage({
    message: response.message,
    type: "success",
    grouping: true,
    showClose: true,
  });
  await getMessage(ticket.value.ticketId);
};

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(2);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

onMounted(async () => {
  try {
    await getTicket();
  } catch (error) {
    console.error("Failed to load user data:", error);
  }
});
</script>

<template>
  <div class="adminUser">
    <div class="home">
      <div class="container adminHeader">
        <div class="userContainer">
          <h3>Support</h3>
          <NuxtLink to="/admin/home">
            <el-button class="colorButton" type="primary" round
              >Retour</el-button
            >
          </NuxtLink>
        </div>
        <div class="userContainer">
          <el-input
            class="selector"
            v-model="search"
            placeholder="Rechercher"
          />
          <el-checkbox
            label="Cacher les tickets fermé"
            v-model="hideClosedTickets"
          />
        </div>
      </div>
      <div class="container userTableContainer">
        <el-table class="table" :data="filterTableData">
          <el-table-column label="ID" prop="id" />
          <el-table-column label="Catégorie" prop="category" width="300" />
          <el-table-column label="Sujet" prop="title" width="300" />
          <el-table-column label="Statut" prop="status">
            <template #default="scope">
              <p v-if="scope.row.status === 0">Cloturé</p>
              <p v-else>Ouvert</p>
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template #default="scope">
              <el-button
                v-if="scope.row.status === 1"
                size="small"
                type="danger"
                style="margin-bottom: 5px"
                @click="handleClose(scope.row)"
                >Cloturer</el-button
              >
              <el-button
                v-else
                size="small"
                type="primary"
                style="margin-bottom: 5px"
                @click="handleOpenTicket(scope.row)"
                >Réouvrir</el-button
              >
              <el-button
                v-if="scope.row.status === 1"
                size="small"
                @click="handleEdit(scope.row)"
                >Voir plus</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
  <el-dialog class="drawer" v-model="dialog" width="600" title="Conversation">
    <div class="convBox">
      <div
        v-for="m in messages"
        :class="{
          self: m.sender === 'admin',
          receiver: m.sender === 'user',
        }"
        class="message"
      >
        <p>
          {{ m.content }}
        </p>
        <span>{{ formatDate(m.createdAt) }}</span>
      </div>
    </div>
    <form class="searchBar" @submit.prevent="">
      <input
        type="text"
        v-model="ticket.content"
        placeholder="Votre message..."
      />
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
  </el-dialog>
</template>

<style scoped>
.table {
  height: 390px;
  overflow-y: scroll;
}
.el-drawer {
  width: 55%;
}
.drawer section {
  min-width: 550px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.drawer div {
  justify-content: start;
  align-items: center;
  text-align: center;
}
.drawer .userFooter {
  width: 100%;
}
.drawer .divider {
  background-color: #1fa254;
  width: 90%;
  height: 3px;
  margin: 20px 0;
}
.drawer section div p {
  margin: 15px 0;
  font-weight: 500;
  font-size: 18px;
  text-decoration: underline;
}
.adminUser {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.home {
  width: 100%;
  max-width: 1500px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.adminHeader {
  display: flex;
  justify-content: space-between;
  width: 75%;
}
.adminHeader h3 {
  font-size: 28px;
  font-weight: 500;
  text-align: center;
}
.adminHeader div p {
  flex: 1;
  text-align: center;
}
.userTableContainer {
  width: 75%;
  height: 400px;
}
.selector {
  margin: 10px 5px;
  width: 250px;
}
.userContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin: 0 20px;
}
.productImage {
  display: flex;
  justify-content: center;
  align-items: center;
}
.productImage img {
  width: 150px;
  height: 150px;
  margin-bottom: 20px;
}
.drawer .variantesContainer {
  width: 100%;
  margin-top: 25px;
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
  width: 100%;
}
</style>
