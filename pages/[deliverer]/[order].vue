<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { linkDeliverer, setDeliverer } from "~/services/delivererService";

const farm = ref([]);
const products = ref([]);
const route = useRoute();

onMounted(async () => {
  try {
    const data = await linkDeliverer(route.params.order);
    farm.value = data.farmAddresses || [];
    products.value = data.products || [];
  } catch (error) {
    console.error("Failed to load farms:", error);
    navigateTo("/");
  }
});

const setDelivererToOrder = async () => {
  try {
    await setDeliverer(route.params.order, route.params.deliverer);
    await navigateTo("/");
  } catch (error) {
    console.error("Failed to load farms:", error);
  }
};
</script>

<template>
  <div class="centerView">
    <div class="content">
      <div class="orderDetails">
        <div class="container farm">
          <h2>Les fermes</h2>
          <ul>
            <li v-for="(address, index) in farm" :key="index">
              {{ address.name }} - {{ address.address }}
            </li>
          </ul>
        </div>
        <div class="container product">
          <h2>Les produits</h2>
          <ul>
            <li v-for="(product, index) in products" :key="index">
              {{ product.productName }} ({{ product.weight }}kg) -
              {{ product.quantity }}x
            </li>
          </ul>
          <el-button
            style="margin-top: 20px"
            type="primary"
            size="large"
            class="colorButton"
            rounded
            @click="setDelivererToOrder"
            >Accepter la commande</el-button
          >
        </div>
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

.content {
  max-width: 1100px;
  min-height: 60vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.orderDetails {
  display: flex;
  justify-content: center;
}
.orderDetails .farm,
.product {
  width: 50%;
}
.orderDetails .farm {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
}

.container.product {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
