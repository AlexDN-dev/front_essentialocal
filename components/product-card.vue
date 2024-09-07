<script setup>
import { defineProps } from "vue";
const config = useRuntimeConfig();
const serverAddress = config.public.serverAddress;

const props = defineProps({
  id: String,
  productName: String,
  picture: String,
});
</script>

<template>
  <NuxtLink :to="`/product/${id}`" class="container productCard">
    <img
      :src="serverAddress + `/pictures/product/${picture}`"
      alt="Image de produit"
    />
    <h2>{{ productName }}</h2>
  </NuxtLink>
</template>

<style>
.productCard {
  max-width: 250px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  color: black;
  text-decoration: none;
}
.productCard img {
  width: 220px;
  height: 200px;
}
.productCard h2 {
  font-weight: 400;
  font-size: 20px;
  margin: 10px 0;
}
.productCard .weight {
  background-color: lightgray;
  padding: 5px;
  border-radius: 4px;
  font-size: 14px;
}
</style>
