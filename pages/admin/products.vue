<script setup>
import { computed, ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getAllProducts, removeProduct } from "~/services/adminService";
definePageMeta({
  layout: "minimal",
});

const config = useRuntimeConfig();
const serverAddress = config.public.serverAddress;
const search = ref("");
const dialog = ref(false);
const selectedProduct = ref({});

const tableData = ref([]);

const filterTableData = computed(() => {
  return Array.isArray(tableData.value)
    ? tableData.value.filter(
        (data) =>
          !search.value ||
          data.name.toLowerCase().includes(search.value.toLowerCase()) ||
          data.farmName.toLowerCase().includes(search.value.toLowerCase())
      )
    : [];
});

const handleEdit = (row) => {
  dialog.value = true;
  selectedProduct.value = row;
};

const getFarms = async () => {
  const data = await getAllProducts();
  if (Array.isArray(data)) {
    tableData.value = data;
  } else {
    console.error("Les données récupérées ne sont pas un tableau:", data);
  }
};

const remove = async () => {
  const response = await removeProduct(selectedProduct.value.id)
  ElMessage({
        message: response.message,
        type: "success",
        grouping: true,
        showClose: true,
      });

  dialog.value = false;
  await getFarms();
}

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
          <h3>Produits</h3>
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
        </div>
      </div>
      <div class="container userTableContainer">
        <el-table class="table" :data="filterTableData">
          <el-table-column label="ID" prop="id" />
          <el-table-column label="Nom" prop="name" />
          <el-table-column label="Ferme" prop="farmName" />
          <el-table-column label="Statut" prop="status">
            <template #default="scope">
              <p v-if="scope.row.status === 1">Visible</p>
              <p v-if="scope.row.status === 0">Supprimé</p>
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
  <el-drawer class="drawer" v-model="dialog" title="Description du produit">
    <article class="productImage">
        <img :src="serverAddress + `/pictures/product/${selectedProduct.picture}`"></img>
      </article>
    <section>
      <div>
        <p>ID</p>
        <span>{{ selectedProduct.id }}</span>
      </div>
      <div>
        <p>Ferme</p>
        <span>{{ selectedProduct.farmName }}</span>
      </div>
      <div>
        <p>Nom</p>
        <span>{{ selectedProduct.name }}</span>
      </div>
      <div>
        <p>Mots clés</p>
        <span>{{ selectedProduct.keywords }}</span>
      </div>
      <div>
        <p>Description</p>
        <span>{{ selectedProduct.desc }}</span>
      </div>
    </section>
      <el-table class="variantesContainer" :data="selectedProduct.variants">
          <el-table-column label="Poids" prop="weight" />
          <el-table-column label="Prix" prop="price" />
          <el-table-column label="Stock" prop="stock" />
        </el-table>
    <template #footer>
      <div class="userFooter">
        <el-button
          type="danger"
          v-if="selectedProduct.status === 1"
          @click="remove"
          >Supprimer le produit</el-button
        >
      </div>
    </template>
  </el-drawer>
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
.productImage {
  display: flex;
  justify-content: center;
  align-items: center;
}
.productImage img {
  width: 150px;
  height: 150px;
  margin-bottom: 20px
}
.drawer .variantesContainer {
  width: 100%;
  margin-top: 25px;
}
</style>
