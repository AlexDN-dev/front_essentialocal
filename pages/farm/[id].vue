<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import {
  getFarm,
  addFarmReview,
  getFarmReview,
  reportFarmReview,
} from "~/services/farmService";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faStar,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

const config = useRuntimeConfig();
const serverAddress = config.public.serverAddress;

const route = useRoute();
const id = ref(route.params.id); // Initialiser avec route.params.id
const loading = ref(false);
const farm = ref({});
const product = ref([]);
const schedule = ref([]);
const reviews = ref([]);
const review = ref({
  title: "",
  comment: "",
  rating: 0,
  farm: 0,
});
const average = ref(0);

const fetchFarmData = async (farmId) => {
  loading.value = true;
  try {
    const data = await getFarm(farmId);
    farm.value = data.farm;
    product.value = data.product;
    schedule.value = farm.value.schedule.split(",");
  } catch (error) {
    console.error("Failed to load farms:", error);
  } finally {
    loading.value = false;
  }
};

const reportReview = async (id) => {
  const response = await reportFarmReview(id);
  ElMessage({
    message: response.message,
    type: "success",
    grouping: true,
    showClose: true,
  });
};

const fetchReview = async (farmId) => {
  try {
    const data = await getFarmReview(farmId);
    reviews.value = data;
    console.log(reviews.value);
    if (data.length !== 0) {
      for (const r of data) {
        average.value = r.rating + average.value;
      }
      average.value = average.value / data.length;
    } else {
      average.value = 0;
    }
  } catch (error) {
    console.error("Failed to load farms:", error);
  }
};

const addReview = async () => {
  review.value.farm = parseInt(id.value);
  if (
    review.value.title !== "" &&
    review.value.comment !== "" &&
    review.value.rating !== 0
  ) {
    const response = await addFarmReview(review.value);
    ElMessage({
      message: response.message,
      type: "success",
      grouping: true,
      showClose: true,
    });
    review.value.title = "";
    review.value.comment = "";
    review.value.rating = 0;
    fetchReview(id.value);
  } else {
    ElMessage({
      message: "Merci de remplir tout les champs.",
      type: "error",
      grouping: true,
      showClose: true,
    });
  }
};

onMounted(() => {
  fetchFarmData(id.value);
  fetchReview(id.value);
});

watch(
  () => route.params.id,
  (newId) => {
    if (newId !== id.value) {
      id.value = newId;
      fetchFarmData(newId);
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="centerView">
    <Loader v-if="loading" />
    <div class="content" v-if="!loading">
      <div class="main">
        <img
          class="container"
          :src="serverAddress + `/pictures/farms/${id}.jpg`"
          alt="Image de produit"
        />
        <div class="container">
          <h2>{{ farm.name }}</h2>
          <h3>{{ farm.address }}</h3>
          <span style="margin: 10px 0; font-weight: 600"
            >Horaire d'ouverture</span
          >
          <p>Lundi: {{ schedule[0] }}</p>
          <p>Mardi : {{ schedule[1] }}</p>
          <p>Mercredi : {{ schedule[2] }}</p>
          <p>Jeudi : {{ schedule[3] }}</p>
          <p>Vendredi : {{ schedule[4] }}</p>
          <p>Samedi : {{ schedule[5] }}</p>
          <p>Dimanche : {{ schedule[6] }}</p>
        </div>
      </div>
      <div class="container description">
        <h2>Petit mot de la ferme...</h2>
        <p>{{ farm.desc }}</p>
      </div>
      <div class="container" style="flex-direction: column">
        <h2 style="text-align: center">Commentaire de la ferme</h2>
        <div class="reviewContainer">
          <div class="addReview">
            <div class="starContainer">
              <div
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 50%;
                "
              >
                <el-rate v-model="review.rating" size="large" />
              </div>

              <input type="text" placeholder="Titre" v-model="review.title" />
            </div>
            <textarea
              placeholder="Commentaire"
              v-model="review.comment"
            ></textarea>
            <div
              style="display: flex; justify-content: center; margin-top: 10px"
            >
              <el-button
                class="colorButton"
                type="primary"
                @click="addReview"
                round
                >Ajouter le commentaire</el-button
              >
            </div>
          </div>
          <div class="divider"></div>
          <div class="reviewList">
            <h2>
              Note générale: {{ average.toFixed(1) }}/5 <br /><span
                style="font-size: 14px"
                >({{ reviews.length }} commentaires)</span
              >
            </h2>
            <div class="reviewListContainer">
              <div v-for="r in reviews" class="container review">
                <div class="reviewHeader">
                  <p>{{ r.author }}</p>
                  <div>
                    <el-button
                      style="width: 25px; margin-right: 15px"
                      type="danger"
                      @click="reportReview(r.id)"
                    >
                      <FontAwesomeIcon
                        size="md"
                        color="#FFFFFF"
                        :icon="faTriangleExclamation"
                      />
                    </el-button>
                    <span>{{ r.rating }}</span>
                    <FontAwesomeIcon
                      style="margin-left: 5px"
                      size="lg"
                      color="#FFD43B"
                      :icon="faStar"
                    />
                  </div>
                </div>
                <h3>{{ r.title }}</h3>
                <p class="message">
                  {{ r.comment }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="separator"></div>
      <h2>Les produits de la ferme</h2>
      <div class="listProduct">
        <ProductCard
          v-for="p in product"
          :key="p.id"
          :picture="p.picture"
          :id="p.id"
          :productName="p.name"
        />
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
  flex-direction: column;
  align-items: center;
}
.container {
  width: stretch;
}
.main {
  display: flex;
  width: 100%;
}
.main img {
  width: 500px;
  height: 400px;
}
.main div {
  width: stretch;
  display: flex;
  flex-direction: column;
  justify-content: start;
  text-align: center;
  height: 400px;
}
.main div h2 {
  margin-bottom: 10px;
}
.main div h3 {
  font-size: 20px;
  font-weight: 400;
  margin-bottom: 10px;
}
.main div span {
  font-size: 18px;
}
.main div p {
  font-size: 17px;
  margin: 5px 0;
}
.description {
  display: flex;
  flex-direction: column;
}
.description h2 {
  margin-bottom: 10px;
  font-size: 24px;
  font-weight: 400;
}
.description p {
  font-size: 18px;
}
.separator {
  width: 100%;
  height: 2px;
  background-color: #1fa254;
  border-radius: 8px;
  margin: 50px 0;
}
.content h2 {
  font-size: 26px;
}
.content .listProduct {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.reviewContainer {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
.reviewContainer .addReview {
  display: flex;
  flex-direction: column;
  width: 48%;
}
.addReview div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.addReview div input {
  height: 28px;
  font-size: 14px;
  padding-left: 5px;
  border-radius: 4px;
  border: 1px solid lightgray;
}
.addReview div input:focus {
  transition: 0.2s;
  outline: none;
  border: 1px solid #1fa254;
}
.addReview textarea {
  resize: none;
  margin: 10px 0;
  height: 60%;
  padding: 5px;
  border-radius: 4px;
  border: 1px solid lightgray;
  font-size: 15px;
}
.addReview textarea:focus {
  transition: 0.2s;
  outline: none;
  border: 1px solid #1fa254;
}
.addReview button {
  width: fit-content;
  margin-top: 40px;
}
.reviewContainer .divider {
  width: 2px;
  background-color: #1fa254;
}
.reviewList {
  width: 48%;
}
.reviewListContainer {
  height: 300px;
  max-height: 300px;
  overflow-y: scroll;
}
.reviewList h2 {
  font-size: 18px;
  font-weight: 400;
  text-align: center;
}
.review {
  display: flex;
  flex-direction: column;
}
.review .reviewHeader {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.reviewHeader p {
  font-weight: 500;
}
.review .message {
  font-size: 14px;
}
.review h3 {
  font-weight: 600;
  margin-bottom: 5px;
}

@media (max-width: 875px) {
  .reviewContainer {
    flex-direction: column;
    align-items: center;
  }
  .reviewContainer .addReview {
    width: 90%;
  }
  .reviewContainer .reviewList {
    width: 90%;
  }
  .reviewContainer .divider {
    width: 90%;
    height: 2px;
    margin: 20px 0;
  }
}
@media (max-width: 500px) {
  .starContainer {
    display: flex;
    flex-direction: column;
  }
  .starContainer input {
    width: stretch;
  }
}
@media (max-width: 842px) {
  .main {
    flex-direction: column;
    align-items: center;
  }
}
@media (max-width: 563px) {
  .main img {
    width: 300px;
    height: 250px;
  }
}
</style>
