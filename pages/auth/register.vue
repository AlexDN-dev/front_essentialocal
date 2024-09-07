<script setup>
import { registerUser } from "../../services/userService";
import { ref } from "vue";
import { ElMessage } from "element-plus";

definePageMeta({
  layout: "minimal",
});

const termsAccepted = ref(false);
const user = ref({
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const handleSumbit = async () => {
  try {
    if (
      user.value.first_name !== "" &&
      user.value.last_name !== "" &&
      user.value.email !== "" &&
      user.value.password !== "" &&
      user.value.confirmPassword !== ""
    ) {
      if (user.value.password === user.value.confirmPassword) {
        if (termsAccepted.value) {
          const response = await registerUser(user.value);
          ElMessage({
            message: "Inscription réussie !",
            type: "success",
            grouping: true,
            showClose: true,
          });
          await navigateTo("/auth/login");
        } else {
          ElMessage({
            message: "Merci d'accepter les CGU et CGV.",
            type: "error",
            grouping: true,
            showClose: true,
          });
        }
      } else {
        ElMessage({
          message: "Les mots de passe sont différents.",
          type: "error",
          grouping: true,
          showClose: true,
        });
      }
    } else {
      ElMessage({
        message: "Merci de bien remplir tout les champs.",
        type: "error",
        grouping: true,
        showClose: true,
      });
    }
  } catch (e) {
    console.log(e.response._data.message);
    ElMessage({
      message: e.response._data.message,
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
        <h2>INSCRIPTION</h2>
        <div class="formInfo">
          <div>
            <label for="firstname">Prénom</label>
            <input type="text" id="firstname" v-model="user.first_name" />
          </div>
          <div>
            <label for="lastname">Nom</label>
            <input type="text" id="lastname" v-model="user.last_name" />
          </div>
        </div>
        <label for="email">Adresse mail</label>
        <input
          class="inputEmail"
          type="email"
          id="email"
          v-model="user.email"
        />
        <div class="formInfo">
          <div>
            <label for="password">Mot de passe</label>
            <input type="password" id="password" v-model="user.password" />
          </div>
          <div>
            <label for="confirm">Confirmer</label>
            <input
              type="password"
              id="confirm"
              v-model="user.confirmPassword"
            />
          </div>
        </div>
        <el-checkbox label="J'accepte les CGU-CGV" v-model="termsAccepted" />
        <el-button
          class="colorButton"
          type="primary"
          round
          @click="handleSumbit"
          >Inscription</el-button
        >
        <div class="authOptions">
          <NuxtLink to="/auth/login">J'ai déjà un compte</NuxtLink>
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
  color: #1fa254;
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
.loginForm .inputEmail {
  width: 96%;
}
.formInfo {
  display: flex;
}
.formInfo div {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin: 10px;
}
.formInfo div input {
  width: 100%;
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
