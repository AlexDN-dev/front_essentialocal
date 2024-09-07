<script setup>
import { getUser } from "~/services/userService";
import { ElMessage } from "element-plus";
import Cookies from "js-cookie";

const user = ref({});
const passwords = ref({
  password: "",
  newPassword: "",
  confirm: "",
});
const config = useRuntimeConfig();
const serverAddress = config.public.serverAddress;

const changeUserInfo = async () => {
  try {
    const data = {
      firstName: user.value.firstName,
      lastName: user.value.lastName,
    };
    const token = Cookies.get("authToken");
    if (token) {
      await $fetch(serverAddress + `/users/changeData/`, {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      ElMessage({
        message: `Vos données ont bien été modifié !`,
        type: "success",
        showClose: true,
      });
      const userData = await getUser();
      user.value = userData.user;
    } else {
      throw new Error("No authentication token found");
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

const changePassword = async () => {
  try {
    const token = Cookies.get("authToken");
    console.log(passwords);
    if (token) {
      await $fetch(serverAddress + `/users/changePassword/`, {
        method: "POST",
        body: {
          password: passwords.value.password,
          newPassword: passwords.value.newPassword,
          confirm: passwords.value.confirm,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      ElMessage({
        message: `Votre mot de passe a bien été modifié. Merci de vous reconnectez.`,
        type: "success",
        showClose: true,
      });
      Cookies.remove("authToken");
      await navigateTo("/auth/login");
    } else {
      throw new Error("No authentication token found");
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

onMounted(async () => {
  try {
    const data = await getUser();
    user.value = data.user;
  } catch (error) {
    console.error("Failed to load user data:", error);
  }
});
</script>

<template>
  <div class="container orders">
    <h3 style="text-align: center">Paramètres</h3>
    <form>
      <div>
        <div>
          <label for="firstname">Prénom</label>
          <input
            v-model="user.firstName"
            type="text"
            name="firstname"
            id="lastname"
          />
        </div>
        <div>
          <label for="lastname">Nom</label>
          <input
            v-model="user.lastName"
            type="text"
            name="lastname"
            id="lastname"
          />
        </div>
      </div>
      <el-button
        @click="changeUserInfo"
        style="margin-top: 10px"
        size="large"
        class="paramsButton colorButton"
        type="primary"
        round
        >Modifier</el-button
      >
    </form>
    <el-divider />
    <form class="passwordParams">
      <h3>Sécurité</h3>
      <div class="password">
        <div style="display: flex; flex-direction: row">
          <div>
            <label for="password">Mot de passe</label>
            <input
              type="password"
              v-model="passwords.password"
              name="password"
              id="password"
            />
          </div>
          <div>
            <label for="password"> Nouveau mot de passe</label>
            <input
              type="password"
              v-model="passwords.newPassword"
              name="password"
              id="password"
            />
          </div>
        </div>
        <div>
          <label for="confirm">Confirmer</label>
          <input
            type="password"
            v-model="passwords.confirm"
            name="confirm"
            id="confirm"
          />
        </div>
      </div>
      <el-button
        @click="changePassword"
        size="large"
        class="paramsButton colorButton"
        type="primary"
        round
        >Modifier</el-button
      >
    </form>
    <div style="position: relative" class="paramsOptions">
      <el-button
        style="position: relative; left: 0; bottom: -10px"
        size="large"
        class="paramsButton"
        type="danger"
        round
        >Supprimer le compte</el-button
      >
    </div>
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
form div {
  display: flex;
  margin: 10px;
  justify-content: space-between;
}
form div div {
  display: flex;
  flex-direction: column;
  align-items: center;
}
form div div input {
  font-size: 14px;
}
form input {
  padding: 5px;
  border: 1px solid gray;
  border-radius: 4px;
  font-size: 14px;
}
.paramsButton {
  width: fit-content;
}
.paramsOptions {
  display: flex;
  justify-content: space-between;
}
.password {
  display: flex;
  flex-direction: column;
}

@media (max-width: 619px) {
  form {
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
  }
  form div {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
  }
  .orders {
    overflow-y: auto;
  }
  .paramsButton {
    margin-top: 5px;
    width: fit-content;
  }
}
</style>
