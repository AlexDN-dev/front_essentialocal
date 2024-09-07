<script setup>
import { ref, onMounted, watch } from "vue";
import { getStats } from "~/services/farmService";
import Chart from "chart.js/auto";

const doughnutCanvas = ref(null);
let doughnutChartInstance = null;
const data = ref({});
const tableData = ref([]);
const nameChart = ref([]);
const quantityChart = ref([]);
const criticalStock = ref([]);

// Fonction pour récupérer les statistiques
const switchTime = async (time) => {
  data.value = await getStats(time);

  // Mettre à jour les noms et quantités pour le graphique
  nameChart.value = data.value.productsSold.map((product) => product.name);
  quantityChart.value = data.value.productsSold.map(
    (product) => product.quantity
  );

  criticalStock.value = data.value.lowStockProducts;
  tableData.value = data.value.loyalCustomers;

  // Si le graphique est déjà initialisé, le mettre à jour
  if (doughnutChartInstance) {
    updateChart();
  }
};

// Données réactives pour le graphique
const chartData = {
  labels: nameChart.value,
  datasets: [
    {
      label: "Nombre de ventes",
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      data: quantityChart.value,
    },
  ],
};

// Options du graphique
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          return `${tooltipItem.label}: ${tooltipItem.raw} ventes`;
        },
      },
    },
  },
};

// Initialiser le graphique
const initializeChart = () => {
  if (doughnutCanvas.value) {
    doughnutChartInstance = new Chart(doughnutCanvas.value, {
      type: "doughnut",
      data: chartData,
      options: chartOptions,
    });
  }
};

// Mettre à jour le graphique avec les nouvelles données
const updateChart = () => {
  doughnutChartInstance.data.labels = nameChart.value;
  doughnutChartInstance.data.datasets[0].data = quantityChart.value;
  doughnutChartInstance.update();
};

// Recharger le graphique lors du montage du composant
onMounted(async () => {
  await switchTime(0);
  initializeChart();
  updateChart();
});
</script>

<template>
  <div class="container statsPage">
    <el-button-group class="selectTime">
      <el-button class="colorButton" type="primary" @click="switchTime(0)"
        >Aujourd'hui</el-button
      >
      <el-button class="colorButton" type="primary" @click="switchTime(1)"
        >1 Semaine</el-button
      >
      <el-button class="colorButton" type="primary" @click="switchTime(2)"
        >1 Mois</el-button
      >
      <el-button class="colorButton" type="primary" @click="switchTime(3)"
        >3 Mois</el-button
      >
    </el-button-group>
    <section class="today">
      <div class="statsContainer">
        <div class="stats container">
          <p>Nbr de commandes</p>
          <span>{{ data.totalOrders }}</span>
        </div>
        <div class="stats container">
          <p>Chiffre d'affaire</p>
          <span>{{ data.totalRevenue }}€</span>
        </div>
        <div class="stats container">
          <p>Montant moyen</p>
          <span>{{ data.averageAmount }}€</span>
        </div>
        <div class="stats container">
          <p>Temps de préparation</p>
          <span>{{ data.averagePreparationTime }} min</span>
        </div>
      </div>
    </section>
    <section class="statsStock">
      <div style="height: 350px; width: 350px">
        <h3>Les 5 meilleurs produits</h3>
        <canvas ref="doughnutCanvas"></canvas>
      </div>
      <div>
        <h3>Les stocks critiques</h3>
        <p>Ici sont affichés les produits avec moins de 5 stocks</p>
        <div>
          <p style="margin: 3px" v-for="p in criticalStock">
            {{ p.name }} {{ p.weight }} ({{ p.stock }} restants)
          </p>
        </div>
      </div>
    </section>
    <section class="fidelity">
      <h3>Les meilleurs client de votre ferme</h3>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="email" label="mail" />
        <el-table-column prop="orderCount" label="Nombre de commandes" />
        <el-table-column prop="averageBasket" label="Montant moyen" />
      </el-table>
    </section>
  </div>
</template>

<style scoped>
.statsPage {
  width: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.selectTime {
  margin: 10px 0;
}
.container {
  justify-content: start;
}
.today {
  display: flex;
  flex-direction: column;
  text-align: start;
}
.statsContainer {
  display: flex;
  width: 1000px;
  justify-content: space-between;
}
.stats {
  width: 25%;
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  height: 110px;
  font-size: 20px;
  text-align: center;
}
.stats span {
  font-size: 24px;
  font-weight: 500;
}
.statsStock {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  margin-top: 15px;
}
.statsStock h3 {
  font-size: 24px;
}
.fidelity {
  width: 100%;
  margin-top: 60px;
}
.fidelity h3 {
  font-size: 24px;
}
</style>
