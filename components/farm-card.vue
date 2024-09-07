<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
const props = defineProps({
  id: String,
  farmName: String,
  distance: String,
});
</script>

<template>
  <NuxtLink :to="`/farm/${id}`" style="text-decoration: none" class="farmCard">
    <div>
      <div class="icon">
        <FontAwesomeIcon color="#ffffff" :icon="faLocationDot" />
      </div>
      <p>{{ farmName }}</p>
    </div>
    <span>{{ distance }} km</span>
  </NuxtLink>
</template>

<style>
.farmCard {
  width: 300px;
  min-height: 75px;
  height: 75px;
  border-radius: 8px;
  margin: 5px;
  padding: 8px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  position: relative;
}
.farmCard div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.farmCard .icon {
  background-color: #1fa254;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
}
.farmCard span {
  position: absolute;
  bottom: 5px;
  right: 8px;
}
.farmCard div p {
  color: black;
  text-decoration: none;
}
.farmCard span {
  color: black;
  text-decoration: none;
}
</style>
