<script setup>
definePageMeta({
  layout: "default",
  middleware: "auth",
});
import { ref, onMounted } from "vue";
import Cookies from "js-cookie";
import { getUser } from "~/services/userService";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faRightFromBracket,
  faWrench,
  faTractor,
} from "@fortawesome/free-solid-svg-icons";

const currentView = ref("orders");
const user = ref({});
const orders = ref([]);
const hasFarm = ref(false);
const isAdmin = ref(false);
const hisDeliverer = ref(false);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const data = await getUser();
    user.value = data.user;
    hasFarm.value = data.farm;
    isAdmin.value = data.admin;
    orders.value = data.orders;
    hisDeliverer.value = data.deliverer;
  } catch (error) {
    console.error("Failed to load user data:", error);
  } finally {
    loading.value = false;
  }
});

function setCurrentView(view) {
  currentView.value = view;
}

const handleLogout = () => {
  Cookies.remove("authToken");
};
</script>

<template>
  <div class="profile">
    <Loader v-if="loading" />
    <div class="center" v-if="!loading">
      <div class="profileHeader">
        <div class="container userInfo">
          <h3>Informations</h3>
          <div class="mainInfo">
            <div>
              <p>Nom: {{ user.lastName }}</p>
              <p>Prénom: {{ user.firstName }}</p>
              <p>Adresse mail: {{ user.email }}</p>
            </div>
          </div>
          <NuxtLink class="logoutButton" @click="handleLogout" to="/auth/login">
            <el-button type="danger" round>
              <FontAwesomeIcon
                size="xl"
                color="#ffffff"
                :icon="faRightFromBracket"
            /></el-button>
          </NuxtLink>
          <NuxtLink v-if="isAdmin" class="adminButton" to="/admin/home">
            <el-button class="colorButton" type="primary" round
              ><FontAwesomeIcon size="xl" color="#ffffff" :icon="faWrench"
            /></el-button>
          </NuxtLink>
          <NuxtLink v-if="hasFarm" class="farmButton" to="/farm/params">
            <el-button class="colorButton" type="primary" round
              ><FontAwesomeIcon size="xl" color="#ffffff" :icon="faTractor"
            /></el-button>
          </NuxtLink>
        </div>
      </div>
      <section>
        <div class="container paramsSelection">
          <p
            :class="{ activeParams: currentView === 'orders' }"
            @click="setCurrentView('orders')"
          >
            Mes commandes
          </p>
          <p
            :class="{ activeParams: currentView === 'delivery' }"
            @click="setCurrentView('delivery')"
            v-if="hisDeliverer"
          >
            Livraison
          </p>
          <p
            :class="{ activeParams: currentView === 'settings' }"
            @click="setCurrentView('settings')"
          >
            Paramètres
          </p>
        </div>
        <OrdersList v-if="currentView === 'orders'" :orders="orders" />
        <DeliveryList v-if="currentView === 'delivery'" />
        <UserParams v-if="currentView === 'settings'" />
      </section>
    </div>
  </div>
</template>

<style scoped>
.profile {
  min-height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
}
.center {
  width: 100%;
  max-width: 1100px;
  height: 100%;
}
.container img {
  width: 150px;
  height: 150px;
  border-radius: 8px;
}
.profileHeader {
  display: flex;
  width: 100%;
}
section {
  height: 550px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.profileHeader .userInfo {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}
.profileHeader .userInfo h3 {
  font-size: 24px;
  font-weight: 500;
  text-align: center;
}
.profileHeader p {
  font-size: 18px;
  margin-top: 10px;
}
.userInfo .mainInfo {
  display: flex;
}
.mainInfo > div:nth-child(2) {
  margin-left: 50px;
}
.paramsSelection {
  display: flex;
  flex-direction: column;
  justify-content: start;
  width: 20%;
  height: 550px;
}
.paramsSelection p {
  font-size: 16px;
  margin: 5px;
  cursor: pointer;
  padding: 5px;
  border-radius: 8px;
}
.paramsSelection .activeParams {
  color: white;
  background-color: #1fa254;
}
.paramsSelection p:hover {
  color: white;
  background-color: #1fa254;
}
.orders {
  height: 550px;
  width: 67.27%;
  display: flex;
  flex-direction: column;
  justify-content: start;
}
.orders .title {
  display: flex;
  width: 100%;
  margin-top: 20px;
}
.orders .title p {
  width: 33%;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
}
.orders h3 {
  font-size: 24px;
  font-weight: 500;
  text-align: center;
}
.orderList {
  overflow-y: auto;
  height: 100%;
  scrollbar-color: gray lightgray;
  scrollbar-width: thin;
}
.order {
  display: flex;
  cursor: pointer;
  padding: 5px 0;
  margin: 5px 0;
  border-radius: 8px;
}
.order:hover {
  background-color: #409eff;
  color: white;
}
.order p {
  font-size: 18px;
  width: 33%;
  text-align: center;
}
.adminButton {
  position: absolute;
  top: 25px;
  left: 25px;
}
.farmButton {
  position: absolute;
  top: 25px;
  right: 25px;
}
.logoutButton {
  position: absolute;
  bottom: 25px;
  right: 25px;
}
@media (max-width: 1099px) {
  section {
    position: relative;
    height: 800px;
  }
  .paramsSelection {
    height: 80px;
    width: 100%;
  }
  .orders {
    height: 70%;
    width: calc(100% - 70px);
  }
  .orderList {
    height: 100%;
  }
}
@media (max-width: 789px) {
}
</style>
