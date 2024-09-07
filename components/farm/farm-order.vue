<script setup>
import { computed, ref, onMounted } from "vue";
import Cookies from "js-cookie";

const config = useRuntimeConfig();
const serverAddress = config.public.serverAddress;
const isConfirmed = ref(false);
const search = ref("");
const dialog = ref(false);
const selectedOrder = ref({
  id: "",
  author: "",
  status: "",
  items: [],
  isAllPrepared: false,
  deliveryMethod: "",
});
const tableData = ref([]);

const filterTableData = computed(() =>
  tableData.value.filter(
    (data) =>
      !search.value ||
      data.id.toLowerCase().includes(search.value.toLowerCase())
  )
);

const handleEdit = async (row) => {
  dialog.value = true;
  selectedOrder.value.id = row.id;
  selectedOrder.value.author = row.author;
  selectedOrder.value.status = row.status;
  await fetchOrderItems(row.id);
};

const fetchOrders = async () => {
  try {
    const token = Cookies.get("authToken");
    if (token) {
      const data = await $fetch(serverAddress + `/orders/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      tableData.value = data.orders; // Assurez-vous que la réponse JSON contient une clé 'orders'
    } else {
      throw new Error("No authentication token found");
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

const fetchOrderItems = async (orderId) => {
  try {
    const token = Cookies.get("authToken");
    if (token) {
      const data = await $fetch(serverAddress + `/orders/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      selectedOrder.value.items = data.items;
      selectedOrder.value.isAllPrepared = data.isAllPrepared;
      selectedOrder.value.deliveryMethod = data.deliveryMethod;

      console.log(selectedOrder);
    } else {
      throw new Error("No authentication token found");
    }
  } catch (error) {
    console.error("Error fetching order items:", error);
  }
};

const validateOrder = async () => {
  try {
    const token = Cookies.get("authToken");
    if (token) {
      const response = await $fetch(
        serverAddress + `/orders/${selectedOrder.value.id}/validate`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.message === "Order items validated successfully") {
        // Fetch the orders again to refresh the status
        await fetchOrders();
        // Fetch the order items again to refresh the status
        await fetchOrderItems(selectedOrder.value.id);
        isConfirmed.value = false; // Reset the checkbox
      }
    } else {
      throw new Error("No authentication token found");
    }
  } catch (error) {
    console.error("Error validating order items:", error);
  }
};

const completeOrder = async () => {
  try {
    const token = Cookies.get("authToken");
    if (token) {
      const response = await $fetch(
        serverAddress + `/orders/${selectedOrder.value.id}/complete`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.message === "Order items marked as collected successfully") {
        // Fetch the orders again to refresh the status
        await fetchOrders();
        // Fetch the order items again to refresh the status
        await fetchOrderItems(selectedOrder.value.id);
        isConfirmed.value = false; // Reset the checkbox
      }
    } else {
      throw new Error("No authentication token found");
    }
  } catch (error) {
    console.error("Error marking order items as collected:", error);
  }
};

onMounted(() => {
  fetchOrders();
});
</script>

<template>
  <div class="container orders">
    <h2>Les commandes</h2>
    <el-table :data="filterTableData" style="width: 100%" height="625">
      <el-table-column label="ID" prop="id" />
      <el-table-column label="Client (ID)" prop="author" />
      <el-table-column label="Statut" prop="status" />
      <el-table-column align="right">
        <template #header>
          <el-input
            width="100"
            v-model="search"
            placeholder="Rechercher par ID"
          />
        </template>
        <template #default="scope">
          <el-button
            style="margin: 3px"
            size="small"
            @click="handleEdit(scope.row)"
          >
            Voir plus
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialog" width="375">
      <form class="dialogForm">
        <h2>Informations</h2>
        <div>
          <p>ID de commande: {{ selectedOrder.id }}</p>
          <p>ID client: {{ selectedOrder.author }}</p>
          <p>Statut: {{ selectedOrder.status }}</p>
        </div>
        <h2>Les produits demandés</h2>
        <div class="productList">
          <p v-for="item in selectedOrder.items" :key="item.name">
            {{ item.product }} ({{ item.weight }}) | {{ item.quantity }}x
          </p>
        </div>
        <template v-if="selectedOrder.status === 'En préparation'">
          <template v-if="!selectedOrder.isAllPrepared">
            <el-checkbox
              style="margin-top: 10px"
              v-model="isConfirmed"
              label="Je confirme avoir préparé la commande"
              size="large"
            />
            <el-button
              class="colorButton"
              type="primary"
              :disabled="!isConfirmed"
              @click="validateOrder"
            >
              Valider la commande
            </el-button>
          </template>
          <template v-else>
            <p>
              Vous avez déjà préparé cette commande. Veuillez attendre que les
              autres fermes concernées valident leurs produits.
            </p>
          </template>
        </template>
        <template
          v-if="
            selectedOrder.status === 'Prête' &&
            selectedOrder.deliveryMethod === 'self'
          "
        >
          <template v-if="selectedOrder.isAllPrepared">
            <el-checkbox
              style="margin-top: 10px"
              v-model="isConfirmed"
              label="Le client a récupéré sa commande"
              size="large"
            />
            <el-button
              class="colorButton"
              type="primary"
              :disabled="!isConfirmed"
              @click="completeOrder"
            >
              Valider la récupération
            </el-button>
          </template>
          <template v-else>
            <p>
              Vous avez déjà préparé cette commande. Veuillez attendre que les
              autres fermes concernées valident leurs produits.
            </p>
          </template>
        </template>
        <template
          v-if="
            selectedOrder.deliveryMethod === 'deliverer' &&
            selectedOrder.status === 'Prête'
          "
        >
          <p style="margin-top: 10px">
            La commande a bien été préparé. Lorsque tout les produits seront
            prêt alors un livreur sera affecté à la commande pour la livraison.
          </p>
        </template>
        <template v-if="selectedOrder.status === 'Terminé'">
          <p>Cette commande est terminée.</p>
        </template>
      </form>
    </el-dialog>
  </div>
</template>

<style scoped>
.orders {
  display: flex;
  flex-direction: column;
  width: 750px;
  position: relative;
}
.dialogForm {
  color: black;
}
.dialogForm h2 {
  margin: 10px 0;
}
.dialogForm div {
  display: flex;
  justify-content: start;
  flex-direction: column;
  align-items: start;
}
</style>

<style scoped>
.orders {
  display: flex;
  flex-direction: column;
  width: 750px;
  position: relative;
}
.dialogForm {
  color: black;
}
.dialogForm h2 {
  margin: 10px 0;
}
.dialogForm div {
  display: flex;
  justify-content: start;
  flex-direction: column;
  align-items: start;
}

@media (max-width: 1037px) {
  .orders {
    width: stretch;
  }
}
</style>
