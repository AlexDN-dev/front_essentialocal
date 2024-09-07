<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faUser,
  faTractor,
  faCube,
  faChartBar,
  faShoppingCart,
  faPaperPlane,
  faTicketSimple,
} from "@fortawesome/free-solid-svg-icons";
definePageMeta({
  layout: "minimal",
});
</script>

<template>
  <div class="adminPage">
    <h2>Panel Admin</h2>
    <NuxtLink to="/" style="margin-bottom: 50px">
      <el-button type="primary" class="colorButton" round
        >Retour au site</el-button
      >
    </NuxtLink>
    <div class="home">
      <NuxtLink to="/admin/users" class="navButton">
        <FontAwesomeIcon size="2xl" :icon="faUser" />
        <p>Utilisateurs</p>
      </NuxtLink>
      <NuxtLink to="/admin/farms" class="navButton">
        <FontAwesomeIcon size="2xl" :icon="faTractor" />
        <p>Fermes</p>
      </NuxtLink>
      <NuxtLink to="/admin/products" class="navButton">
        <FontAwesomeIcon size="2xl" :icon="faCube" />
        <p>Produits</p>
      </NuxtLink>
      <NuxtLink to="/admin/orders" class="navButton">
        <FontAwesomeIcon size="2xl" :icon="faShoppingCart" />
        <p>Commandes</p>
      </NuxtLink>
      <NuxtLink to="/admin/stats" class="navButton">
        <FontAwesomeIcon size="2xl" :icon="faChartBar" />
        <p>Statistiques</p>
      </NuxtLink>
      <NuxtLink to="/admin/support" class="navButton">
        <FontAwesomeIcon size="2xl" :icon="faPaperPlane" />
        <p>Support</p>
      </NuxtLink>
      <NuxtLink to="/admin/reviews" class="navButton">
        <FontAwesomeIcon size="2xl" :icon="faTicketSimple" />
        <p>Commentaires</p>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.adminPage {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.adminPage h2 {
  font-size: 54px;
  text-align: center;
}
.home {
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.navButton {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: black;
  padding: 15px;
  border: 2px solid #1fa254;
  border-radius: 8px;
  transition: 0.25s;
  margin: 10px;
  flex-wrap: wrap;
  width: 140px;
}
.navButton p {
  margin-top: 10px;
}
.navButton:hover {
  background-color: #1fa254;
  color: white;
}
</style>
