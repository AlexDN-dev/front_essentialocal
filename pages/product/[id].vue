<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  getProductDetails,
  getProductSuggestion,
} from "../../services/productService";
import { ElMessage } from "element-plus";

const config = useRuntimeConfig();
const serverAddress = config.public.serverAddress;

const route = useRoute();
const suggestionDialog = ref(false);
const product = ref({});
const variante = ref([]);
const productSuggestion = ref([]);
const selectedVariante = ref(null);
const value = ref(1);
const options = ref([
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "6", value: 6 },
  { label: "7", value: 7 },
  { label: "8", value: 8 },
  { label: "9", value: 9 },
  { label: "10", value: 10 },
]);

// Fonction pour obtenir le panier du local storage
const getCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

// Fonction pour sauvegarder le panier dans le local storage
const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const getProduct = async () => {
  const id = route.params.id;
  const data = await getProductDetails(id);
  if (data.product.length > 0) {
    product.value = data.product[0];
  }
  variante.value = data.variante || [];

  // Sélectionner la première variante par défaut
  if (variante.value.length > 0) {
    selectedVariante.value = variante.value[0];
  }
};

const selectVariante = (variante) => {
  selectedVariante.value = variante;
  value.value = 1;
};

const addToCart = async () => {
  const newProduct = {
    id: product.value.id,
    name: product.value.name,
    picture: product.value.picture,
    quantity: value.value,
    weight: selectedVariante.value.weight,
    price: selectedVariante.value.price * value.value,
  };

  let cart = getCart();

  const productIndex = cart.findIndex(
    (item) => item.id === newProduct.id && item.weight === newProduct.weight
  );

  if (productIndex > -1) {
    cart[productIndex] = newProduct;
  } else {
    cart.push(newProduct);
  }
  saveCart(cart);

  productSuggestion.value = await getProductSuggestion(product.value.id);
  suggestionDialog.value = true;

  ElMessage({
    message: "Le produit à bien été ajouté à votre panier !",
    type: "success",
    grouping: true,
    showClose: true,
  });
};

onMounted(async () => {
  try {
    await getProduct();
  } catch (error) {
    console.error("Failed to load product details:", error);
  }
});
</script>

<template>
  <div class="centerView">
    <div class="content" v-if="product.name">
      <img
        :src="serverAddress + '/pictures/product/' + product.picture"
        :alt="'Image de ' + product.name"
      />
      <div class="productDetails">
        <div>
          <h2>{{ product.name }} ({{ selectedVariante.weight }})</h2>
          <p>{{ product.desc }}</p>
        </div>
        <div>
          <el-button-group style="margin-bottom: 10px">
            <el-button
              class="colorButton"
              v-for="v in variante"
              :key="v.id"
              type="primary"
              @click="selectVariante(v)"
            >
              {{ v.weight }}
            </el-button>
          </el-button-group>
          <div class="addProduct">
            <p>Quantité :</p>
            <el-select
              v-model="value"
              placeholder="Select"
              style="width: 75px; margin-bottom: 10px"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div
            style="
              width: 300px;
              display: flex;
              align-items: center;
              justify-content: space-around;
            "
          >
            <p style="font-weight: 500; font-size: 20px">
              {{ selectedVariante ? selectedVariante.price * value : 0 }} €
            </p>
            <el-button
              class="colorButton"
              @click="addToCart"
              type="primary"
              size="large"
              >Ajouter au panier</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="suggestionDialog" width="500">
      <div class="suggestionContainer">
        <span> Ces produits pourraient vous intéressez également </span>
        <ProductCard
          v-for="p in productSuggestion"
          :key="p.id"
          :picture="p.picture"
          :id="p.id"
          :productName="p.name"
        />
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.centerView {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  min-height: 75vh;
}
.centerView .content {
  max-width: 1100px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  text-align: center;
}
.centerView .content img {
  width: 400px;
  height: 400px;
  border-radius: 25px;
}
.content .productDetails {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  position: relative;
  max-height: 400px;
}
.suggestionContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.suggestionContainer span {
  color: black;
  font-size: 20px;
  text-align: center;
  margin: 10px 0;
}
@media (max-width: 713px) {
  .content {
    flex-direction: column;
    align-items: center;
  }
  .content .productDetails {
    margin: 15px 0;
  }
}

@media (max-width: 410px) {
  .centerView .content img {
    width: 300px;
    height: 300px;
    border-radius: 25px;
  }
}
</style>
