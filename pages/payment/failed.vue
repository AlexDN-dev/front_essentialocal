<script setup>
definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <div class="centerView">
    <div class="content">
      <div class="payement">
        <img src="../../public/pictures/failed_payment.jpg" alt="" />
        <p>
          Une erreur ou annulation est survenue dans le payement, aucun montant
          n'a été débité. Si le problème persiste merci de contacter un
          administrateur via le support.
        </p>
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
.centerView .content {
  max-width: 1100px;
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
  height: 60vh;
}
.content .payement {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.payement img {
  width: 350px;
  height: 350px;
}
.payement p {
  font-size: 18px;
}
</style>
