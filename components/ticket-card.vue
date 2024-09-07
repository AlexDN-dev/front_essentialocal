<script setup>
const props = defineProps({
  id: String,
  subject: String,
  status: String,
});
</script>

<template>
  <div class="container">
    <div class="infoTicket">
      <h2>#{{ props.id }}</h2>
      <el-tag :type="props.status === 1 ? 'success' : 'danger'" effect="dark">{{
        props.status === 1 ? "Ouvert" : "Fermé"
      }}</el-tag>
    </div>
    <p>{{ props.subject }}</p>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: start;
  width: stretch;
  cursor: pointer;
}
.container p {
  font-size: 14px;
}
.infoTicket {
  display: flex;
  width: stretch;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.infoTicket h2 {
  font-size: 16px;
  font-weight: 500;
}
</style>
