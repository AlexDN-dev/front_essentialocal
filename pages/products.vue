<script setup>
import { ref, onMounted } from "vue";
import { searchProduct } from "~/services/productService";

// Référence pour les filtres
const query = ref("");
const selectedCategories = ref([
  "Fruit",
  "Légume",
  "Viande",
  "Produit laitier",
  "Autre",
]); // Toutes les catégories cochées par défaut
const products = ref([]);
const loading = ref(false);

// Fonction pour rechercher les produits avec filtres
const fetchProducts = async () => {
  loading.value = true; // Démarrer le loader
  try {
    const response = await searchProduct(query.value, selectedCategories.value);
    products.value = response.products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
  } finally {
    setTimeout(() => {
      loading.value = false; // Arrêter le loader après 2 secondes
    }, 1500);
  }
};

// Fonction déclenchée lors du clic sur le bouton rechercher
const searchProducts = async () => {
  await fetchProducts();
};

// Charger les produits lors du montage du composant
onMounted(async () => {
  try {
    await fetchProducts();
  } catch (error) {
    console.error("Failed to load product details:", error);
  }
});
</script>

<template>
  <div class="centerView">
    <div class="content">
      <Loader v-if="loading" />
      <div v-if="!loading" class="filter container">
        <h1 style="margin: 15px 0">Les produits</h1>
        <div class="search">
          <input v-model="query" type="text" placeholder="Rechercher" />
          <el-button class="colorButton" type="primary" @click="searchProducts"
            >Rechercher</el-button
          >
        </div>

        <!-- Filtres par catégorie -->
        <div>
          <el-checkbox
            v-model="selectedCategories"
            label="Fruit"
            size="large"
          />
          <el-checkbox
            v-model="selectedCategories"
            label="Légume"
            size="large"
          />
          <el-checkbox
            v-model="selectedCategories"
            label="Viande"
            size="large"
          />
          <el-checkbox
            v-model="selectedCategories"
            label="Produit laitier"
            size="large"
          />
          <el-checkbox
            v-model="selectedCategories"
            label="Autre"
            size="large"
          />
        </div>
      </div>
      <div v-if="!loading" class="listProduct">
        <ProductCard
          v-for="p in products"
          :key="p.id"
          :picture="p.picture"
          :id="p.id"
          :productName="p.name"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.centerView {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 25px;
  min-height: 80vh;
}
.content {
  max-width: 1100px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.content h1 {
  text-align: center;
}
.listProduct {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}
.filter {
  display: flex;
  flex-direction: column;
  min-width: 350px;
  width: 50%;
  max-width: 930px;
}
.filter div {
  display: flex;
  margin-top: 20px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.search input {
  margin-bottom: 10px;
  padding: 4px;
}
.search button {
  margin-bottom: 10px;
  margin-left: 10px;
}
</style>
