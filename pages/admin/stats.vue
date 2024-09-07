<script setup>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";
import { getStats } from "~/services/adminService";
definePageMeta({
  layout: "minimal",
});

const chartCanvas = ref(null);
let barChartInstance = null;

// Données pour les stats et le graphique
const totalOrdersToday = ref(0);
const totalAmountToday = ref(0);
const itemsCountToday = ref(0);
const topProducts = ref([]);

// Configuration du graphique
const chartData = ref({
  labels: [], // Les dates seront générées ici
  datasets: [
    {
      label: "Nombre de commandes",
      backgroundColor: "#1FA254",
      data: [], // Les données seront mises à jour
    },
  ],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

// Fonction pour récupérer les données et mettre à jour les stats et le graphique
const fetchOrdersData = async () => {
  const stats = await getStats();

  totalAmountToday.value = stats.totalAmountToday;
  itemsCountToday.value = stats.itemsCountToday;

  // Gérer les données côté client pour le graphique
  const ordersLast7Days = Object.values(stats.ordersByDay);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toLocaleDateString();
  }).reverse();

  totalOrdersToday.value = ordersLast7Days[0];

  chartData.value.labels = last7Days;
  chartData.value.datasets[0].data = ordersLast7Days.reverse(); // Mettez les données dans l'ordre pour correspondre aux jours

  // Mise à jour des produits les plus vendus
  const sortedProducts = Object.entries(stats.sortedProductQuantitiesObject)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, quantity]) => ({ name, quantity }));

  topProducts.value = sortedProducts;

  barChartInstance = new Chart(chartCanvas.value, {
    type: "bar",
    data: chartData.value, // Utilisation des données réactives
    options: chartOptions,
  });
};
// Récupérer les données et initialiser le graphique lors du montage du composant
onMounted(async () => {
  await fetchOrdersData(); // Attendre que les données soient prêtes avant d'initialiser le graphique
});
</script>

<template>
  <div class="statPage">
    <h2>Statistiques</h2>
    <NuxtLink to="/admin/home">
      <el-button class="colorButton" type="primary" round size="large"
        >Retour</el-button
      >
    </NuxtLink>

    <!-- Today's stats -->
    <div class="today container">
      <h3>Statistique du jour</h3>
      <div class="statContainer">
        <div class="stat">
          <p>Nombre de commandes</p>
          <span>{{ totalOrdersToday }}</span>
        </div>
        <div class="stat">
          <p>Chiffre d'affaire (€)</p>
          <span>{{ totalAmountToday.toFixed(2) }}</span>
        </div>
        <div class="stat">
          <p>Nombre de produits</p>
          <span>{{ itemsCountToday }}</span>
        </div>
      </div>
    </div>

    <!-- Last 7 days stats -->
    <div class="sevenDays container">
      <h3>Ces 7 derniers jours</h3>
      <section class="sevenDaysContainer">
        <div style="height: 400px; width: 600px">
          <canvas ref="chartCanvas"></canvas>
        </div>

        <!-- Top 10 Products -->
        <div class="topProduct">
          <h3>Top 10 des meilleurs produits</h3>
          <div v-for="(product, index) in topProducts" :key="index">
            <p>
              {{ index + 1 }}. {{ product.name }} ({{ product.quantity }}
              ventes)
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.statPage {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.statPage h2 {
  font-size: 36px;
  margin-bottom: 15px;
}
.today {
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
}
.today h3 {
  font-size: 24px;
  font-weight: 400;
}
.statContainer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.stat {
  width: 30%;
  position: relative;
  background-color: white;
  overflow: hidden;
  height: 80px;
  border-radius: 8px;
  border: 2px solid #1fa254;
}
.stat p {
  color: black;
  font-size: 18px;
  position: relative;
  z-index: 999;
  margin: 10px;
}
.stat span {
  color: black;
  position: absolute;
  bottom: 5px;
  right: 10px;
  z-index: 999;
  font-size: 24px;
  font-weight: 500;
}
.stat::before {
  content: "";
  position: absolute;
  background-color: #1fa254;
  width: 300px;
  height: 300px;
  z-index: 0;
  transform: translateX(-90px) translateY(-150px) rotateZ(45deg);
}
.sevenDays {
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
}
.sevenDays h3 {
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 20px;
}
.sevenDaysContainer {
  display: flex;
  justify-content: space-between;
}
.topProduct {
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.topProduct .showAll {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.topProduct h3 {
  margin-bottom: 10px;
}
.topProduct p {
  margin: 2px 0;
}
</style>
