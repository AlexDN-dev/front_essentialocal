<script setup>
import { ref, computed } from "vue";
import dayjs from "dayjs";

const props = defineProps({
  orders: Array,
});

const dialog = ref(false);
const selectedOrder = ref({
  id: "",
  author: "",
  status: "",
  items: [],
  isAllPrepared: false,
  deliveryMethod: "",
});

const search = ref("");

const filterTableData = computed(() =>
  props.orders.filter(
    (data) =>
      !search.value ||
      data.id.toLowerCase().includes(search.value.toLowerCase())
  )
);

const handleEdit = async (row) => {
  dialog.value = true;
  selectedOrder.value = { ...row };
};

const formatDate = (dateString) => {
  return dayjs(dateString).format("DD MMMM YYYY, HH:mm");
};
</script>

<template>
  <div class="container orders">
    <h3 style="text-align: center">Mes commandes ({{ orders.length }})</h3>
    <div class="orderList">
      <el-table :data="filterTableData" style="width: 100%" height="475">
        <el-table-column width="200" label="ID" prop="id" />
        <el-table-column label="Date" prop="createdAt">
          <template #default="scope">
            {{ formatDate(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="Prix (€)" prop="price" />
        <el-table-column label="Statut" prop="status" />
        <el-table-column align="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">
              Voir plus
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="dialog" width="375">
      <form class="dialogForm">
        <h2>Informations</h2>
        <div>
          <p>ID: {{ selectedOrder.id }}</p>
          <p>Statut: {{ selectedOrder.status }}</p>
        </div>
        <h2>Les produits demandés</h2>
        <div class="productList">
          <p v-for="item in selectedOrder.items" :key="item.name">
            {{ item.product }} ({{ item.weight }}) | {{ item.quantity }}x
          </p>
        </div>
        <p class="message" v-if="selectedOrder.status === 'En préparation'">
          Votre commande est en préparation par le(s) ferme(s) concernée(s).
          Vous receverez un mail lorsque la commande sera prête.
        </p>
        <p
          class="message"
          v-if="
            selectedOrder.status === 'Prête' &&
            selectedOrder.deliveryMethod === 'self'
          "
        >
          Votre commande est prête à être récupéré. Les adresses des fermes
          concernées vous ont été envoyées par mail.
        </p>
        <p
          class="message"
          v-if="
            selectedOrder.status === 'Prête' &&
            selectedOrder.deliveryMethod === 'deliverer'
          "
        >
          Votre commande est prête et un livreur va être assigner à celle-ci
          pour entamé la livraison vers l'adresse renseigné.
        </p>
        <p class="message" v-if="selectedOrder.status === 'Terminé'">
          La commande a bien été livré / récupéré.
        </p>
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
  text-align: center;
}
.dialogForm div {
  display: flex;
  justify-content: start;
  flex-direction: column;
  align-items: start;
}
.message {
  text-align: center;
  margin-top: 15px;
}
</style>
