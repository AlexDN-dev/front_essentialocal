<script setup>
// Ajoutez le script setup si nécessaire
</script>

<template>
  <div class="landingContainer">
    <div class="circle"></div>
    <div class="landingText">
      <h2>Essentialocal</h2>
      <p>Découvrez les produits locaux qui vous entourent !</p>
    </div>
    <div class="bar1 left"></div>
    <div class="bar2 left"></div>
    <div class="bar1 right"></div>
    <div class="bar2 right"></div>
  </div>
</template>

<style scoped>
.landingContainer {
  border-top: 12px solid #1fa254;
  width: 100%;
  height: 85vh;
  overflow: hidden;
  position: relative;
}
.landingText {
  position: absolute;
  text-align: center;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.bar1,
.bar2 {
  height: 50px;
  position: absolute;
  background-color: #1fa254;
}
.bar1 {
  width: 15%;
  bottom: 20%;
}
.bar2 {
  width: 25%;
  bottom: 10%;
}
.left {
  animation: leftBar 2s ease-in-out forwards;
  animation-delay: 1s;
}
.right {
  right: 0;
}

.landingText h2 {
  font-size: 40px;
}
.landingText p {
  font-size: 25px;
}
.circle {
  position: absolute;
  top: 0%;
  left: 50%;
  width: 100%;
  height: 75vh;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: #1fa254;
  background: radial-gradient(circle, #1fa254 0%, rgba(255, 255, 255, 1) 100%);
}
</style>
