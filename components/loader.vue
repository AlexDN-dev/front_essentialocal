<template>
  <div class="loader">
    <img src="../public/pictures/loader.svg" alt="loader" />
    <p>Merci de patienter</p>
  </div>
</template>

<style>
.loader {
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.loader img {
  width: 100px;
  height: 100px;
}
.loader p {
  padding: 15px 0;
  font-size: 20px;
}
</style>
