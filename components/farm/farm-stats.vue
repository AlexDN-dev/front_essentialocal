<script setup>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";

// Référence pour le canevas du graphique
const doughnutCanvas = ref(null);
let doughnutChartInstance = null;
const tableData = [
  {
    mail: "test1@gmail.com",
    order_number: "2",
    average: "28,65€",
  },
  {
    mail: "test1@gmail.com",
    order_number: "2",
    average: "28,65€",
  },
  {
    mail: "test1@gmail.com",
    order_number: "2",
    average: "28,65€",
  },
  {
    mail: "test1@gmail.com",
    order_number: "2",
    average: "28,65€",
  },
  {
    mail: "test1@gmail.com",
    order_number: "2",
    average: "28,65€",
  },
  {
    mail: "test1@gmail.com",
    order_number: "2",
    average: "28,65€",
  },
];

// Données fictives pour les 5 meilleurs produits
const chartData = {
  labels: ["Pomme", "Banane", "Orange", "Raisin", "Fraise"], // Les 5 meilleurs produits
  datasets: [
    {
      label: "Nombre de ventes",
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      data: [120, 90, 80, 70, 50], // Nombre de ventes fictif pour chaque produit
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

onMounted(() => {
  initializeChart();
});
</script>

<template>
  <div class="container statsPage">
    <el-button-group class="selectTime">
      <el-button class="colorButton" type="primary">Ajourd'hui</el-button>
      <el-button class="colorButton" type="primary">1 Semaine</el-button>
      <el-button class="colorButton" type="primary">1 Mois</el-button>
      <el-button class="colorButton" type="primary">3 Mois</el-button>
    </el-button-group>
    <section class="today">
      <div class="statsContainer">
        <div class="stats container">
          <p>Nbr de commandes</p>
          <span>3</span>
        </div>
        <div class="stats container">
          <p>Chiffre d'affaire</p>
          <span>54,97€</span>
        </div>
        <div class="stats container">
          <p>Montant moyen</p>
          <span>17,58€</span>
        </div>
        <div class="stats container">
          <p>Temps de préparation</p>
          <span>37,12 min</span>
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
          <p style="margin: 3px">Product57 (3 restants)</p>
          <p style="margin: 3px">Product58 (3 restants)</p>
          <p style="margin: 3px">Product54 (3 restants)</p>
          <p style="margin: 3px">Product59 (3 restants)</p>
          <p style="margin: 3px">Product51 (3 restants)</p>
        </div>
      </div>
    </section>
    <section class="fidelity">
      <h3>Les meilleurs client de votre ferme</h3>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="mail" label="mail" />
        <el-table-column prop="order_number" label="Nombre de commandes" />
        <el-table-column prop="average" label="Montant moyen" />
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
