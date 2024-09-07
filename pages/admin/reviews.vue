<script setup>
import { computed, ref, onMounted } from "vue";
import { getReviews, deleteReview } from "~/services/adminService";
import { ElMessage } from "element-plus";

definePageMeta({
  layout: "minimal",
});

const search = ref("");
const dialog = ref(false);
const review = ref({});
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
  review.value = row;
};

const handleDelete = async () => {
  const response = await deleteReview(review.value.id);
  ElMessage({
    message: response.message,
    type: "success",
    grouping: true,
    showClose: true,
  });
  dialog.value = false;
  await LoadReviews();
};

const LoadReviews = async () => {
  const data = await getReviews();
  if (Array.isArray(data)) {
    tableData.value = data;
  } else {
    console.error("Les données récupérées ne sont pas un tableau:", data);
  }
};

onMounted(async () => {
  try {
    await LoadReviews();
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
          <h3>Commentaire</h3>
          <NuxtLink to="/admin/home">
            <el-button class="colorButton" type="primary" round
              >Retour</el-button
            >
          </NuxtLink>
        </div>
        <div class="userContainer">
          <el-checkbox
            label="Afficher uniquement les commentaires signalés"
            v-model="hideClosedTickets"
          />
        </div>
      </div>
      <div class="container userTableContainer">
        <el-table class="table" :data="filterTableData">
          <el-table-column label="ID" prop="id" />
          <el-table-column label="Titre" prop="title" width="300" />
          <el-table-column label="Statut" prop="status">
            <template #default="scope">
              <p v-if="scope.row.status === 0">Visible</p>
              <p v-else>Signalé</p>
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)"
                >Voir plus</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
  <el-dialog
    class="drawer"
    v-model="dialog"
    width="600"
    title="Description du commentaire"
    align-center
  >
    <span style="font-weight: 500; font-size: 16px; color: black">Titre</span>
    <p style="font-size: 18px">{{ review.title }}</p>
    <span style="font-weight: 500; font-size: 16px; color: black"
      >Commentaire</span
    >
    <p style="font-size: 18px">{{ review.comment }}</p>
    <el-button style="margin-top: 10px" type="danger" @click="handleDelete"
      >Supprimer</el-button
    >
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
