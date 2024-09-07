<template class="test">
  <NuxtLayout style="min-height: 100vh">
    <NuxtPage style="min-height: 100%" />
  </NuxtLayout>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

.colorButton {
  background-color: #1fa254;
  border: 1px solid #1fa254;
}

.colorButton:hover {
  background-color: #196f3d;
  border: 1px solid #196f3d;
}

* {
  margin: 0;
  padding: 0;
  font-family: "Poppins", sans-serif;
}
body {
  min-height: 100vh;
}
#__nuxt {
  min-height: 100vh;
}
.container {
  display: flex;
  justify-content: center;
  padding: 25px;
  border-radius: 8px;
  -webkit-box-shadow: inset 0px 0px 15px 0px rgba(31, 162, 84, 0.5);
  -moz-box-shadow: inset 0px 0px 15px 0px rgba(31, 162, 84, 0.5);
  box-shadow: inset 0px 0px 15px 0px rgba(31, 162, 84, 0.5);
  margin: 10px;
  width: fit-content;
}
</style>
