<script setup>
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import { farmRequest } from "../services/farmService";

const dialog = ref(false);
const lundi = ref("");
const mardi = ref("");
const mercredi = ref("");
const jeudi = ref("");
const vendredi = ref("");
const samedi = ref("");
const dimanche = ref("");

const farm = ref({
  name: "",
  address: "",
  desc: "",
});

const schedule = computed(() => {
  return `${lundi.value},${mardi.value},${mercredi.value},${jeudi.value},${vendredi.value},${samedi.value},${dimanche.value}`;
});

// Fonction pour valider le format des horaires
const isValidSchedule = (time) => {
  const regex = /^(?:\d{1,2}h\d{2}-\d{1,2}h\d{2}|fermé)$/i;
  return regex.test(time);
};

const handleSubmit = async () => {
  // Vérifiez que tous les champs de 'farm' et les jours de la semaine ne sont pas vides
  if (
    !farm.value.name ||
    !farm.value.address ||
    !farm.value.desc ||
    !lundi.value ||
    !mardi.value ||
    !mercredi.value ||
    !jeudi.value ||
    !vendredi.value ||
    !samedi.value ||
    !dimanche.value
  ) {
    ElMessage({
      message: "Veuillez remplir tous les champs avant de soumettre.",
      type: "error",
      showClose: true,
    });
    return;
  }

  // Vérifiez que les horaires sont valides
  const days = [
    lundi.value,
    mardi.value,
    mercredi.value,
    jeudi.value,
    vendredi.value,
    samedi.value,
    dimanche.value,
  ];
  for (const day of days) {
    if (!isValidSchedule(day)) {
      ElMessage({
        message: `L'horaire pour ${day} n'est pas valide. Utilisez le format 8h00-17h00 ou "fermé".`,
        type: "error",
        showClose: true,
      });
      return;
    }
  }
  try {
    await farmRequest({
      ...farm.value,
      schedule: schedule.value,
    });
    dialog.value = false;
    ElMessage({
      message: "Demande soumise avec succès !",
      type: "success",
      showClose: true,
    });
  } catch (error) {
    ElMessage({
      message: error.data.message,
      type: "error",
      showClose: true,
    });
  }
};

const resetFields = () => {
  // Réinitialiser les champs de farm
  farm.value = {
    name: "",
    address: "",
    desc: "",
  };

  // Réinitialiser les champs de l'horaire
  lundi.value = "";
  mardi.value = "";
  mercredi.value = "";
  jeudi.value = "";
  vendredi.value = "";
  samedi.value = "";
  dimanche.value = "";
};

const handleClose = (done) => {
  resetFields();
  done(); // Ceci ferme effectivement le dialogue
};
</script>

<template>
  <div>
    <el-button
      @click="dialog = true"
      class="colorButton"
      type="primary"
      size="large"
      rounded
      >Faire la demande d'ajout de ferme</el-button
    >
    <el-dialog v-model="dialog" width="375" :before-close="handleClose">
      <form class="dialog">
        <h2>Ajouter une ferme</h2>
        <input v-model="farm.name" required type="text" placeholder="Nom" />
        <input
          v-model="farm.address"
          required
          type="text"
          placeholder="adresse complète"
        />
        <textarea
          required
          style="resize: none"
          v-model="farm.desc"
          placeholder="Description"
        ></textarea>
        <h2>Horaire</h2>
        <span>Exemple: 8h00-17h00 ou fermé</span>
        <div class="farmSchedule">
          <input v-model="lundi" required type="text" placeholder="Lundi" />
          <input v-model="mardi" required type="text" placeholder="Mardi" />
          <input
            v-model="mercredi"
            required
            type="text"
            placeholder="Mercredi"
          />
          <input v-model="jeudi" required type="text" placeholder="Jeudi" />
          <input
            v-model="vendredi"
            required
            type="text"
            placeholder="Vendredi"
          />
          <input v-model="samedi" required type="text" placeholder="Samedi" />
          <input
            v-model="dimanche"
            required
            type="text"
            placeholder="Dimanche"
          />
        </div>
        <el-button
          @click="handleSubmit"
          style="margin-top: 10px"
          type="primary"
          size="large"
          class="colorButton"
          rounded
          >Faire la demande</el-button
        >
      </form>
    </el-dialog>
  </div>
</template>

<style scoped>
.dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: black;
}
.dialog input,
textarea {
  margin: 3px;
  padding: 3px;
}
.farmSchedule {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
