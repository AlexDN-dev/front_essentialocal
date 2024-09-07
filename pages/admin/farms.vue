<script setup>
import { computed, ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getAllFarms, removeFarm } from "~/services/adminService";
import { getFarmReview } from "~/services/farmService";
definePageMeta({
  layout: "minimal",
});

const search = ref("");
const dialog = ref(false);
const selectedFarm = ref({});
const value = ref("");
const onlyRequest = ref(false);
const deleteFarmDialog = ref(false);
const reviewFarmDialog = ref(false);
const reviews = ref([]);

const tableData = ref([]);

const filterTableData = computed(() => {
  return Array.isArray(tableData.value)
    ? tableData.value.filter(
        (data) =>
          (!search.value ||
            data.name.toLowerCase().includes(search.value.toLowerCase())) &&
          (!onlyRequest.value || data.status === 0)
      )
    : [];
});

const handleEdit = (row) => {
  dialog.value = true;
  selectedFarm.value = row;
};

const getFarms = async () => {
  const data = await getAllFarms();
  if (Array.isArray(data)) {
    tableData.value = data;
  } else {
    console.error("Les données récupérées ne sont pas un tableau:", data);
  }
};

const deleteFarm = async () => {
  const response = await removeFarm(selectedFarm.value.id);
  ElMessage({
    message: response.message,
    type: "success",
    grouping: true,
    showClose: true,
  });
  await getFarms();
  deleteFarmDialog.value = false;
  dialog.value = false;
};

const getFarmReviews = async () => {
  reviewFarmDialog.value = true;
  reviews.value = await getFarmReview(selectedFarm.value.id);
};

onMounted(async () => {
  try {
    await getFarms();
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
          <h3>Fermes</h3>
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
          <el-checkbox v-model="onlyRequest"
            >N'afficher que les demandes</el-checkbox
          >
        </div>
      </div>
      <div class="container userTableContainer">
        <el-table class="table" :data="filterTableData">
          <el-table-column label="Nom" prop="name" />
          <el-table-column label="Adresse" width="300" prop="address" />
          <el-table-column label="Statut" prop="status">
            <template #default="scope">
              <p v-if="scope.row.status === 1">Visible</p>
              <p v-if="scope.row.status === 0">En attente</p>
              <p v-if="scope.row.status === -1">Supprimé</p>
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">
                Voir plus
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>

  <el-drawer class="drawer" v-model="dialog" title="Description de la ferme">
    <section>
      <div>
        <p>ID</p>
        <span>{{ selectedFarm.id }}</span>
      </div>
      <div>
        <p>ID du gérant</p>
        <span>{{ selectedFarm.owner }}</span>
      </div>
      <div>
        <p>Nom</p>
        <span>{{ selectedFarm.name }}</span>
      </div>
      <div>
        <p>Description</p>
        <span>{{ selectedFarm.desc }}</span>
      </div>
      <div>
        <p>Adresse</p>
        <span>{{ selectedFarm.address }}</span>
      </div>
      <div>
        <p>Horaire</p>
        <span>{{ selectedFarm.schedule }}</span>
      </div>
    </section>
    <template #footer>
      <div class="userFooter">
        <el-button type="primary" v-if="selectedFarm.status === 0"
          >Accepter la demande</el-button
        >
        <el-button
          type="primary"
          class="colorButton"
          @click="getFarmReviews"
          v-if="selectedFarm.status === 1"
          >Commentaire</el-button
        >
        <el-button
          type="danger"
          @click="deleteFarmDialog = true"
          v-if="selectedFarm.status !== -1"
          >Supprimer la ferme</el-button
        >
      </div>
    </template>
  </el-drawer>
  <el-dialog v-model="deleteFarmDialog" title="Attention" width="500" center>
    <p style="text-align: center">
      Voulez-vous vraiment supprimer cette ferme ? Cela supprimera également les
      produits, les variantes et les commentaires de cette dernière.
    </p>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="deleteFarm" type="danger">Confirmer</el-button>
        <el-button
          class="colorButton"
          type="primary"
          @click="deleteFarmDialog = false"
        >
          Annuler
        </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="reviewFarmDialog" title="Commentaire" width="500">
    <div class="demo-collapse">
      <p style="text-align: center" v-if="reviews.length === 0">
        Pas de commentaire :(
      </p>
      <el-collapse v-else accordion>
        <el-collapse-item v-for="review in reviews" :title="review.title">
          <p><strong>Auteur: </strong>{{ review.author }}</p>
          <p><strong>Notation: </strong>{{ review.rating }}/5</p>
          <p>{{ review.comment }}</p>
        </el-collapse-item>
      </el-collapse>
    </div>
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
  width: 50%;
  justify-content: center;
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
.demo-collapse {
  height: 400px;
  overflow-y: scroll;
}
</style>
