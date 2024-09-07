<script setup>
import { ref, computed, onMounted } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { LMap, LTileLayer, LMarker, LTooltip } from "@vue-leaflet/vue-leaflet";
import { getAllFarm, searchFarm } from "../../services/farmService";

const zoom = ref(11);
const farms = ref([]);
const search = ref("");
const loading = ref(false);
const origin = ref([50.57975423480725, 4.066898556856221]);
const showAllFarms = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const data = await getAllFarm();
    farms.value = data;
  } catch (error) {
    console.error("Failed to load farms:", error);
  } finally {
    loading.value = false;
  }
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    const farm = await searchFarm(search.value);
    farms.value = farm.farm;
    const coords = [farm.origin.latitude, farm.origin.longitude];
    origin.value = coords;
  } catch (error) {
    console.error("Failed to perform search:", error);
  } finally {
    loading.value = false;
    search.value = "";
  }
};

const filteredFarms = computed(() => {
  if (showAllFarms.value) {
    return farms.value;
  }
  return farms.value.filter((farm) => farm.distance <= 30);
});
</script>

<template>
  <div class="centerView">
    <Loader v-if="loading" />
    <div class="content" v-if="!loading">
      <h2>Rechercher une ferme</h2>
      <p style="margin-bottom: 20px; text-align: center">
        Le point de départ pour les recherche est le centre de Soignies
      </p>
      <form class="searchBar" @submit.prevent="handleSubmit">
        <input type="text" v-model="search" placeholder="Entrer une ville" />
        <el-button
          class="colorButton"
          size="large"
          type="primary"
          circle
          @click="handleSubmit"
        >
          <FontAwesomeIcon color="#ffffff" :icon="faMagnifyingGlass" />
        </el-button>
      </form>
      <el-checkbox
        v-model="showAllFarms"
        label="Afficher les fermes à plus de 30km"
      />
      <div class="searchFarm">
        <div class="farmList container">
          <FarmCard
            v-for="farm in filteredFarms"
            :key="farm.id"
            :id="farm.id"
            :farmName="farm.name"
            :distance="farm.distance"
          />
        </div>
        <div class="container map">
          <l-map ref="map" v-model:zoom="zoom" :center="origin">
            <l-tile-layer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              layer-type="base"
              name="OpenStreetMap"
            ></l-tile-layer>
            <LMarker
              v-for="farm in filteredFarms"
              :key="farm.id"
              :lat-lng="[farm.latitude, farm.longitude]"
            >
              <LTooltip>{{ farm.name }}</LTooltip>
            </LMarker>
          </l-map>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map {
  height: 500px;
  width: 600px;
}
.centerView {
  display: flex;
  justify-content: center;
  margin-top: 25px;
  min-height: 80vh;
}
.centerView .content {
  max-width: 1100px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.searchBar {
  border: 1px solid #1fa254;
  border-radius: 25px;
  padding: 5px;
}
.searchBar input {
  padding: 4px 4px 4px 10px;
  margin-right: 10px;
  border: none;
  font-size: 15px;
  outline: none;
}
.farmList {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 500px;
  width: 350px;
  overflow-y: auto;
}
.farmList > * + * {
  margin-top: 10px; /* Ajoute un espace de 10px entre chaque enfant */
}
.searchFarm {
  margin: 30px 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

@media (max-width: 947px) {
  .searchFarm {
    flex-wrap: wrap;
  }
  .farmList {
    height: 200px;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .map {
    width: 100%;
  }
}
</style>
