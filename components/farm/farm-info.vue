<script setup>
import { ref } from "vue";
import { farmParams, updateFarm } from "~/services/farmService";
import { ElMessage } from "element-plus";
import Cookies from "js-cookie";

const farm = ref({});
const farmPicture = ref(null);
const schedule = ref([]);

const data = await farmParams();
farm.value = data.farm;
schedule.value = farm.value.schedule.split(",");

const isValidSchedule = (time) => {
  const regex = /^(?:\d{1,2}h\d{2}-\d{1,2}h\d{2}|fermé)$/i;
  return regex.test(time);
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    farmPicture.value = file;
  }
};

const handleChangeFarm = async () => {
  try {
    if (
      farm.value.name === "" ||
      farm.value.desc === "" ||
      schedule.value[0] === "" ||
      schedule.value[1] === "" ||
      schedule.value[2] === "" ||
      schedule.value[3] === "" ||
      schedule.value[4] === "" ||
      schedule.value[5] === "" ||
      schedule.value[6] === ""
    ) {
      ElMessage({
        message: "Veuillez remplir tous les champs avant de soumettre.",
        type: "error",
        showClose: true,
      });
      return;
    }
    for (const day of schedule.value) {
      if (!isValidSchedule(day)) {
        ElMessage({
          message: `L'horaire pour ${day} n'est pas valide. Utilisez le format 8h00-17h00 ou "fermé".`,
          type: "error",
          showClose: true,
        });
        return;
      }
    }
    farm.value.schedule = schedule.value.join(",");

    const formData = new FormData();
    formData.append("name", farm.value.name);
    formData.append("desc", farm.value.desc);
    formData.append("schedule", farm.value.schedule);
    if (farmPicture.value) {
      formData.append("farmPicture", farmPicture.value);
    }

    const token = Cookies.get("authToken");
    const response = await updateFarm(formData, token);

    if (response.message === "Farm updated successfully") {
      ElMessage({
        message: "Informations de la ferme mises à jour avec succès.",
        type: "success",
        showClose: true,
      });
      const data = await farmParams();
      farm.value = data.farm;
      schedule.value = farm.value.schedule.split(",");
    } else {
      throw new Error(response.message);
    }
  } catch (e) {
    console.log(e);
    ElMessage({
      message: "Erreur lors de la mise à jour des informations de la ferme.",
      type: "error",
      showClose: true,
    });
  }
};
</script>

<template>
  <div class="container farmInfo">
    <div class="container left">
      <input
        type="file"
        name="farmPicture"
        id="farmPicture"
        @change="handleFileChange"
      />
    </div>
    <div class="container center">
      <p>Nom</p>
      <input type="text" v-model="farm.name" />
      <p>Description</p>
      <textarea v-model="farm.desc"></textarea>
    </div>
  </div>
  <div class="container right">
    <div
      style="
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
      "
    >
      <div>
        <p>Lundi</p>
        <p>Mardi</p>
        <p>Mercredi</p>
        <p>Jeudi</p>
        <p>Vendredi</p>
        <p>Samedi</p>
        <p>Dimanche</p>
      </div>
      <div>
        <input v-model="schedule[0]" type="text" name="Lundi" />
        <input v-model="schedule[1]" type="text" name="Mardi" />
        <input v-model="schedule[2]" type="text" name="Mercredi" />
        <input v-model="schedule[3]" type="text" name="Jeudi" />
        <input v-model="schedule[4]" type="text" name="Vendredi" />
        <input v-model="schedule[5]" type="text" name="Samedi" />
        <input v-model="schedule[6]" type="text" name="Dimanche" />
      </div>
    </div>
    <el-button
      class="changeFarmInfo colorButton"
      type="primary"
      size="large"
      rounded
      @click="handleChangeFarm"
      >Modifier</el-button
    >
  </div>
</template>

<style scoped>
.farmInfo {
  width: 750px;
  display: flex;
  flex-direction: row;
}
.farmInfo .center {
  width: 33%;
  display: flex;
  flex-direction: column;
}
.farmInfo .center textarea {
  resize: none;
}
.farmInfo h2 {
  margin-bottom: 15px;
}
.farmInfo input {
  font-size: 14px;
  padding: 5px;
  border: 1px solid gray;
  border-radius: 4px;
}
.right {
  width: 750px;
  display: flex;
  align-items: center;
  flex-direction: column;
}
.right div {
  display: flex;
  flex-direction: column;
}
.right div p {
  margin: 3.5px;
  padding: 5px;
  font-size: 15px;
}
.right div input {
  margin: 3px;
  font-size: 14px;
  padding: 5px;
  border: 1px solid gray;
  border-radius: 4px;
}
.changeFarmInfo {
  width: 30%;
  margin-top: 20px;
}

@media (max-width: 1037px) {
  .farmInfo {
    display: flex;
    flex-direction: column;
    width: stretch;
  }
  .left {
    width: stretch;
  }
  .farmInfo .center {
    width: stretch;
  }
  .right {
    width: stretch;
  }
  .right input {
    width: 100%;
  }
}
@media (max-width: 375px) {
  #farmPicture {
    width: 230px;
  }
}
</style>
