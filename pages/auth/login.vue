<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { loginUser } from "../../services/userService";
definePageMeta({
  layout: "minimal",
});

const user = ref({
  email: "",
  password: "",
});

const handleSubmit = async () => {
  try {
    if (user.value.email !== "" && user.value.password !== "") {
      await loginUser(user.value);
      ElMessage({
        message: "Connexion réussite !",
        type: "success",
        grouping: true,
        showClose: true,
      });
      await navigateTo("/");
    } else {
      ElMessage({
        message: "Merci de remplir tout les champs.",
        type: "error",
        grouping: true,
        showClose: true,
      });
    }
  } catch (e) {
    ElMessage({
      message: e.response._data,
      type: "error",
      grouping: true,
      showClose: true,
    });
  }
};
</script>

<template>
  <div class="loginPage">
    <NuxtLink class="returnToHome" to="/">
      <el-button class="colorButton" size="large" type="primary" round
        >Retour à l'accueil</el-button
      >
    </NuxtLink>
    <div class="authContainer">
      <form class="loginForm">
        <h2>CONNEXION</h2>
        <p>Merci de vous connecter pour accéder à toutes les pages du site.</p>
        <label for="email">Adresse mail</label>
        <input type="email" name="email" id="email" v-model="user.email" />
        <label for="password">Mot de passe</label>
        <input type="password" v-model="user.password" />
        <el-checkbox label="Rester connecté" />
        <el-button
          class="colorButton"
          type="primary"
          round
          @click="handleSubmit"
          >Connexion</el-button
        >
        <div class="authOptions">
          <NuxtLink to="/">Mot de passe oublié ?</NuxtLink>
          <NuxtLink to="/auth/register">Créer un compte</NuxtLink>
        </div>
      </form>
    </div>
    <div class="rightSide"></div>
  </div>
</template>

<style>
.loginPage {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  background: rgb(255, 255, 255);
}
.authContainer {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.authContainer form {
  min-width: 370px;
  width: 50%;
  position: relative;
  z-index: 999;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  padding: 20px;
  text-align: center;
  margin: 10px;
  background-color: white;
}
.authContainer a {
  text-decoration: none;
  color: black;
  position: relative;
  top: 10px;
}
.authContainer a:hover {
  color: #409eff;
}
.rightSide {
  width: 100%;
  height: 100%;
  background-image: url("/pictures/background.jpg");
  background-position: center;
  background-size: cover;
  z-index: 0;
  top: -50%;
}
.loginForm {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.loginForm input {
  width: 50%;
  padding: 5px;
  border: 1px solid gray;
  border-radius: 4px;
  font-size: 14px;
}
.loginForm label {
  margin: 5px;
}
.authOptions {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.authOptions a {
  margin: 10px;
}
.returnToHome {
  position: absolute;
  top: 25px;
  left: 25px;
}
@media screen and (max-width: 680px) {
  .leftSide {
    width: 100%;
    height: 100%;
  }
  .rightSide {
    display: none;
  }
}
</style>
