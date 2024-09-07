<template>
  <div class="landingV3">
    <div class="action">
      <h2>Essentialocal</h2>
      <p>Découvrez les produits locaux qui vous entourent !</p>
      <el-button class="colorButton" type="primary" size="large" rounded
        >Commencer vos recherches</el-button
      >
    </div>
  </div>
</template>

<style scoped>
.landingV3 {
  height: 88vh;
  overflow: hidden;
  background-image: url("/public/landing/landingV3.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}
.action {
  background-color: rgba(32, 108, 64, 0.6);
  border-radius: 8px;
  width: 40%;
  height: 35%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.action h2 {
  margin-bottom: 10px;
  font-size: 52px;
}
.action p {
  font-size: 28px;
  text-align: center;
}
.action button {
  margin-top: 25px;
}
</style>
