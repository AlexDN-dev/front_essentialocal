<script setup>
import { ref, onMounted } from "vue";
import Cookies from "js-cookie";
import {
  ElTable,
  ElTableColumn,
  ElButton,
  ElDialog,
  ElMessage,
} from "element-plus";

const config = useRuntimeConfig();
const serverAddress = config.public.serverAddress;
const orders = ref([]);
const dialogVisible = ref(false);
const selectedOrder = ref(null);
const isConfirmed = ref(false);

const fetchOrders = async () => {
  try {
    const token = Cookies.get("authToken");
    if (token) {
      const response = await $fetch(
        serverAddress + `/orders/deliverer/getOrders`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      orders.value = response;
    }
  } catch (error) {
    console.error("Failed to load orders:", error);
  }
};

onMounted(() => {
  fetchOrders();
});

const completeDelivery = async (orderId) => {
  try {
    const token = Cookies.get("authToken");
    if (token) {
      await $fetch(serverAddress + `/orders/deliverer/completeDelivery`, {
        method: "POST",
        body: JSON.stringify({
          orderId: orderId,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      ElMessage({
        message: "La livraison est confirmé !",
        type: "success",
      });
      dialogVisible.value = false;
      fetchOrders(); // Recharger les commandes après la livraison
    }
  } catch (error) {
    console.error("Failed to complete delivery:", error);
    ElMessage({
      message: "Erreur dans la confirmation de la commande",
      type: "error",
    });
  }
};

const handleViewDetails = (order) => {
  selectedOrder.value = order;
  dialogVisible.value = true;
};
</script>

<template>
  <div class="container deliveryList">
    <h2>Livraisons</h2>
    <el-table :data="orders" style="width: stretch">
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="author" label="Client" />
      <el-table-column prop="status" label="Statut" />
      <el-table-column label="Actions" width="180">
        <template #default="scope">
          <el-button size="small" @click="handleViewDetails(scope.row)"
            >Voir plus</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" width="375px">
      <template #title>
        <span>Détails de la commande</span>
      </template>
      <div v-if="selectedOrder">
        <p>ID de la commande: {{ selectedOrder.id }}</p>
        <p>Client: {{ selectedOrder.author }}</p>
        <p>Adresse de livraison: {{ selectedOrder.address }}</p>
        <p>Statut: {{ selectedOrder.status }}</p>
        <h3>Produits</h3>
        <el-table :data="selectedOrder.items" style="width: 100%">
          <el-table-column prop="productName" label="Nom du produit" />
          <el-table-column prop="weight" label="Poids (kg)" />
          <el-table-column prop="quantity" label="Quantité" />
        </el-table>
        <div
          v-if="selectedOrder.status !== 'Terminé'"
          style="display: flex; flex-direction: column; align-items: center"
        >
          <el-checkbox
            style="margin-top: 10px"
            v-model="isConfirmed"
            label="Je confirme avoir livrer la commande"
            size="large"
          />
          <el-button
            class="colorButton"
            type="primary"
            @click="completeDelivery(selectedOrder.id)"
            :disabled="!isConfirmed"
          >
            Valider la commande
          </el-button>
        </div>
        <div v-else style="text-align: center; margin-top: 10px">
          <p>Cette commande a déjà été livré</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style>
div .deliveryList {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 67.27%;
}
</style>
