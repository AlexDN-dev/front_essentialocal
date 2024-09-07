<script setup>
definePageMeta({
  middleware: "auth",
});

onMounted(async () => {
  try {
    localStorage.removeItem("cart");
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <div class="centerView">
    <div class="content">
      <div class="payement">
        <img src="../../public/pictures/success_payment.png" alt="" />
        <p>
          La commande a été validé ! Vous allez recevoir un mail contenant toute
          les informations de cette dernière.
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
  font-size: 20px;
}
</style>
