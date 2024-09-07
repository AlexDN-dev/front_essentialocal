<script setup>
import { computed, ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import {
  getAllUsers,
  banUser,
  unbanUser,
  promoteUser,
  derankUser,
  addDeliverer,
  removeDeliverer,
} from "~/services/adminService";
definePageMeta({
  layout: "minimal",
});

const search = ref("");
const dialog = ref(false);
const selectedUser = ref({
  id: 0,
  email: "",
  lastname: "",
  firstname: "",
  status: "",
  roles: "",
  orders: [],
});
const value = ref("");
const dialogCommand = ref(false);

const tableData = ref([]);

const filterTableData = computed(() => {
  return Array.isArray(tableData.value)
    ? tableData.value.filter(
        (data) =>
          (!search.value ||
            data.email.toLowerCase().includes(search.value.toLowerCase())) &&
          (!value.value || data.roles === parseInt(value.value))
      )
    : [];
});

const handleEdit = (row) => {
  dialog.value = true;
  selectedUser.value = row;
};

const getUser = async () => {
  const data = await getAllUsers();
  if (Array.isArray(data)) {
    tableData.value = data;
  } else {
    console.error("Les données récupérées ne sont pas un tableau:", data);
  }
};

onMounted(async () => {
  try {
    await getUser();
  } catch (error) {
    console.error("Failed to load user data:", error);
  }
});

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const options = [
  {
    value: "0",
    label: "Utilisateur",
  },
  {
    value: "10",
    label: "Administrateur",
  },
  {
    value: "1",
    label: "Livreur",
  },
  {
    value: "2",
    label: "Fermier",
  },
  {
    value: "-1",
    label: "Banni",
  },
];

const getTagType = (status) => {
  switch (status) {
    case 0:
      return "info";
    case 10:
      return "warning";
    case 1:
      return "primary";
    case -1:
      return "danger";
    default:
      return "success";
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 0:
      return "Utilisateur";
    case 1:
      return "Livreur";
    case 10:
      return "Administrateur";
    case -1:
      return "Banni";
    default:
      return "Inconnu";
  }
};

const userAction = async (action) => {
  switch (action) {
    case 0: {
      const response = await banUser(selectedUser.value.id);
      ElMessage({
        message: response,
        type: "success",
        grouping: true,
        showClose: true,
      });
      dialog.value = false;
      await getUser();
      break;
    }
    case 1: {
      const response = await unbanUser(selectedUser.value.id);
      ElMessage({
        message: response,
        type: "success",
        grouping: true,
        showClose: true,
      });
      dialog.value = false;
      await getUser();
      break;
    }
    case 2: {
      const response = await promoteUser(selectedUser.value.id);
      ElMessage({
        message: response,
        type: "success",
        grouping: true,
        showClose: true,
      });
      dialog.value = false;
      await getUser();
      break;
    }
    case 3: {
      const response = await derankUser(selectedUser.value.id);
      ElMessage({
        message: response,
        type: "success",
        grouping: true,
        showClose: true,
      });
      dialog.value = false;
      await getUser();
      break;
    }
    case 4: {
      const response = await addDeliverer(selectedUser.value.id);
      ElMessage({
        message: response,
        type: "success",
        grouping: true,
        showClose: true,
      });
      dialog.value = false;
      await getUser();
      break;
    }
    case 5: {
      const response = await removeDeliverer(selectedUser.value.id);
      ElMessage({
        message: response,
        type: "success",
        grouping: true,
        showClose: true,
      });
      dialog.value = false;
      await getUser();
      break;
    }
  }
};
</script>

<template>
  <div class="adminUser">
    <div class="home">
      <div class="container adminHeader">
        <div class="userContainer">
          <h3>Utilisateurs</h3>
          <NuxtLink to="/admin/home">
            <el-button class="colorButton" type="primary" round
              >Retour</el-button
            >
          </NuxtLink>
        </div>
        <div class="userContainer">
          <el-input
            class="selector"
            v-model="search"
            placeholder="Rechercher"
          />
          <el-select
            class="selector"
            v-model="value"
            clearable
            placeholder="Afficher uniquement"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <div class="container userTableContainer">
        <el-table class="table" :data="filterTableData">
          <el-table-column width="300" label="Mail" prop="email" />
          <el-table-column label="Nom" prop="lastName" />
          <el-table-column label="Prénom" prop="firstName" />
          <el-table-column label="Rôles" prop="roles">
            <template #default="scope">
              <el-tag :type="getTagType(scope.row.roles)" disable-transitions>
                {{ getStatusLabel(scope.row.roles) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">
                Voir plus
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog v-model="dialogCommand" title="Aperçu des commandes" width="500">
      <div class="demo-collapse">
        <el-collapse accordion>
          <el-collapse-item
            v-for="(order, index) in selectedUser.orders"
            :key="index"
            :title="`${formatDate(order.createdAt)}` + ' | ' + order.status"
            :name="index"
          >
            <div>
              <strong>Détails de la commande :<br /></strong>
              <p><strong>ID: </strong>{{ order.id }}</p>
              <ul>
                <li v-for="(item, idx) in order.items" :key="idx">
                  {{ item.product_name }} {{ item.quantity }}x |
                  {{ item.weight }}
                </li>
              </ul>
            </div>
            <div>
              <strong>Prix total :</strong>
              {{ order.price }}€
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-dialog>
  </div>

  <el-drawer
    class="drawer"
    v-model="dialog"
    title="Description de l'utilisateur"
  >
    <section>
      <div>
        <p>ID Client</p>
        <span>{{ selectedUser.id }}</span>
      </div>
      <div>
        <p>Email</p>
        <span>{{ selectedUser.email }}</span>
      </div>
      <div>
        <p>Nom</p>
        <span>{{ selectedUser.lastName }}</span>
      </div>
      <div>
        <p>Prénom</p>
        <span>{{ selectedUser.firstName }}</span>
      </div>
      <div class="divider"></div>
      <div>
        <p>Nombre de commande(s)</p>
        <span>{{ selectedUser.orders.length }}</span>
      </div>
      <div>
        <p>Panier moyen</p>
        <span>{{ selectedUser.averageOrderAmount }}€</span>
      </div>
    </section>
    <template #footer>
      <div class="userFooter">
        <el-button
          class="colorButton"
          type="primary"
          v-if="
            selectedUser.status !== 'Banni' && selectedUser.orders.length !== 0
          "
          @click="dialogCommand = true"
          >Voir les commandes</el-button
        >
        <el-button
          class="colorButton"
          type="primary"
          v-if="selectedUser.roles !== 10 && selectedUser.roles !== -1"
          @click="userAction(2)"
          >Promouvoir</el-button
        >
        <el-button
          class="colorButton"
          type="primary"
          v-if="selectedUser.roles === 10"
          @click="userAction(3)"
          >Rétrograder</el-button
        >
        <el-button
          type="danger"
          v-if="selectedUser.roles !== 10 && selectedUser.roles !== -1"
          @click="userAction(0)"
          >Bannir</el-button
        >
        <el-button
          class="colorButton"
          type="primary"
          v-if="selectedUser.roles === -1"
          @click="userAction(1)"
          >Rétablir le compte</el-button
        >
        <el-button
          type="primary"
          v-if="selectedUser.roles !== 1"
          @click="userAction(4)"
          >Ajouter comme livreur</el-button
        >
        <el-button
          type="danger"
          v-if="selectedUser.roles === 1"
          @click="userAction(5)"
          >Retirer des livreurs</el-button
        >
      </div>
    </template>
  </el-drawer>
</template>

<style scoped>
.el-drawer {
  width: 55%;
}
.drawer section {
  min-width: 550px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.drawer div {
  width: 50%;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.drawer .userFooter {
  width: 100%;
}
.drawer .divider {
  background-color: #1fa254;
  width: 90%;
  height: 3px;
  margin: 20px 0;
}
.drawer section div p {
  margin: 10px 0;
  font-weight: 500;
  font-size: 18px;
}
.adminUser {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.home {
  width: 100%;
  max-width: 1500px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.adminHeader {
  display: flex;
  justify-content: space-between;
  width: 75%;
}
.adminHeader h3 {
  font-size: 28px;
  font-weight: 500;
  text-align: center;
}
.adminHeader div p {
  flex: 1;
  text-align: center;
}
.userTableContainer {
  width: 75%;
  height: 400px;
}
.selector {
  margin: 10px 5px;
  width: 250px;
}
.userContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin: 0 20px;
}
.table {
  height: 390px;
  overflow-y: scroll;
}
</style>
