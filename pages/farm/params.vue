<script setup>
import { ref, onMounted } from "vue";
import { farmParams } from "~/services/farmService";

definePageMeta({
  middleware: "has-farm",
});

const activeSection = ref("info");
const loading = ref(false);
const farm = ref({});

onMounted(async () => {
  loading.value = true;
  try {
    const data = await farmParams();
    farm.value = data.farm;
  } catch (error) {
    console.error("Failed to load farms:", error);
  } finally {
    loading.value = false;
  }
});

const setActiveSection = (section) => {
  activeSection.value = section;
};
</script>

<template>
  <div class="centerView">
    <Loader v-if="loading" />
    <div class="content" v-if="!loading">
      <div class="container farmNav">
        <p
          :class="{ activeParams: activeSection === 'info' }"
          @click="setActiveSection('info')"
        >
          Informations
        </p>
        <p
          :class="{ activeParams: activeSection === 'products' }"
          @click="setActiveSection('products')"
        >
          Produits
        </p>
        <p
          :class="{ activeParams: activeSection === 'orders' }"
          @click="setActiveSection('orders')"
        >
          Commandes
        </p>
        <p
          :class="{ activeParams: activeSection === 'stats' }"
          @click="setActiveSection('stats')"
        >
          Statistiques
        </p>
      </div>
      <div style="width: stretch">
        <FarmInfo v-if="activeSection === 'info'" />
        <FarmProduct v-if="activeSection === 'products'" />
        <FarmOrder v-if="activeSection === 'orders'" />
        <FarmStats v-if="activeSection === 'stats'" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.centerView {
  display: flex;
  justify-content: center;
  margin-top: 25px;
}
.centerView .content {
  max-width: 1500px;
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
}
.farmNav {
  width: 300px;
  min-width: 155px;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
}
.farmNav p {
  font-size: 16px;
  margin: 5px;
  cursor: pointer;
  padding: 5px;
  border-radius: 8px;
  width: stretch;
  text-align: left;
}
.farmNav .activeParams {
  color: white;
  background-color: #1fa254;
}
.farmNav p:hover {
  color: white;
  background-color: #1fa254;
}
@media (max-width: 1037px) {
  .content {
    flex-direction: column;
  }
  .farmNav {
    width: stretch;
  }
}
</style>
