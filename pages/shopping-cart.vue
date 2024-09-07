<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { loadStripe } from "@stripe/stripe-js";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const config = useRuntimeConfig();
const serverAddress = config.public.serverAddress;

const stripePromise = loadStripe(
  "pk_test_51NGf5JGmSjjp9mudViylKKyTLJmd3NdIBcvM1p2a4WyC5pbzd80Di929lvDYPg9DtjOlj1vB9pfatEzth8KO4xwq00UyRiJmxo"
);

const dialog = ref(false);
const selfTake = ref(false);

const cartItems = ref([]);
const address = ref({
  rue: "",
  number: "",
  postalCode: "",
  city: "",
});

// Fonction pour obtenir le panier du local storage
const getCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

// Fonction pour sauvegarder le panier dans le local storage
const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Fonction pour supprimer un produit du panier
const removeProductFromCart = (index) => {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  cartItems.value = cart;
  ElMessage({
    message: "Le produit a bien été supprimé du panier.",
    type: "success",
    grouping: true,
    showClose: true,
  });
};

// Récupérer les produits du panier lors du montage du composant
onMounted(() => {
  cartItems.value = getCart();
  console.log(cartItems.value);
});

const handlePayment = async () => {
  try {
    const cart = getCart();
    const token = Cookies.get("authToken");
    if (!token) {
      ElMessage({
        message: "Merci de vous connectez pour effectuer la commande.",
        type: "error",
        grouping: true,
        showClose: true,
      });
      await navigateTo("/auth/login");
    }
    const response = await fetch(
      serverAddress + `/payment/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          selfDelivery: selfTake.value,
          address: address.value,
          amount: cart.reduce((total, item) => total + item.price, 0) * 100, // Stripe requires amount in cents
          currency: "eur",
          successUrl: "https://essentialocal.be/payment/success",
          cancelUrl: "https://essentialocal.be/payment/failed",
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            picture: item.picture,
            price: item.price * 100, // Convert to cents
            quantity: item.quantity,
            weight: item.weight,
          })),
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      ElMessage({
        message: errorData.message || "Une erreur s'est produite.",
        type: "error",
        grouping: true,
        showClose: true,
      });
      return;
    }

    const { id: sessionId } = await response.json();
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      console.error("Error redirecting to Stripe:", error);
      ElMessage({
        message: "Erreur lors de la redirection vers Stripe.",
        type: "error",
        grouping: true,
        showClose: true,
      });
    }
  } catch (error) {
    console.log(error);
    console.error("Error during checkout:", error);
    ElMessage({
      message: "Erreur lors du traitement de la commande.",
      type: "error",
      grouping: true,
      showClose: true,
    });
  }
};
</script>

<template>
  <div class="centerView">
    <div class="content">
      <div class="container shoppingCart">
        <h2>Panier</h2>
        <div class="cartList">
          <div
            class="product container"
            v-for="(item, index) in cartItems"
            :key="item.id"
          >
            <img
              :src="serverAddress + '/pictures/product/' + item.picture"
              :alt="'Image de ' + item.name"
            />
            <p>{{ item.name }}</p>
            <p>{{ item.weight }}</p>
            <p>{{ item.quantity }}x</p>
            <p>{{ item.price }}€</p>
            <el-button
              type="danger"
              rounded
              @click="removeProductFromCart(index)"
            >
              <FontAwesomeIcon size="xl" color="#ffffff" :icon="faXmark"
            /></el-button>
          </div>
        </div>
        <div class="separator"></div>
        <div class="cartCheck">
          <p>
            Prix total:
            {{
              cartItems
                .reduce((total, item) => total + item.price, 0)
                .toFixed(2)
            }}€
          </p>
          <el-button
            class="colorButton"
            @click="dialog = true"
            type="primary"
            size="large"
            rounded
            >Confirmer la commande</el-button
          >
        </div>
      </div>
    </div>
    <el-dialog v-model="dialog" width="350">
      <form class="dialog">
        <h2>Confirmation de la commande</h2>
        <p>
          Prix total:
          {{
            cartItems.reduce((total, item) => total + item.price, 0).toFixed(2)
          }}€
        </p>
        <el-checkbox
          v-model="selfTake"
          label="Je récupère la commande moi-même"
        />
        <div v-if="selfTake">
          <p>
            Les adresses des fermes vous seront envoyé par mail dès que la
            commande sera payée.
          </p>
        </div>
        <div class="delivery" v-else>
          <p>
            Les livraisons à domicile sont disponibles si vous habitez à moins
            de 30km de chaques fermes où vous commandez.
          </p>
          <input type="text" v-model="address.rue" placeholder="Rue" />
          <input type="text" v-model="address.number" placeholder="Numéro" />
          <input
            type="text"
            v-model="address.postalCode"
            placeholder="Code postal"
          />
          <input type="text" v-model="address.city" placeholder="Ville" />
        </div>
        <el-button
          @click="handlePayment"
          style="margin-top: 15px"
          class="colorButton"
          type="primary"
          size="large"
          rounded
          >Payer</el-button
        >
      </form>
    </el-dialog>
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
  justify-content: center;
  text-align: center;
}
.content .shoppingCart {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.cartList {
  width: 101%;
  height: 320px;
  overflow-y: auto;
}
.product {
  width: 1000px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.product img {
  width: 100px;
  height: 100px;
  border-radius: 4px;
}
.product p {
  font-size: 18px;
  width: 100px;
}
.separator {
  width: 100%;
  height: 2px;
  background-color: #1fa254;
  border-radius: 8px;
  margin: 50px 0;
}
.cartCheck {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cartCheck p {
  font-size: 22px;
}
.dialog {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: black;
}
.delivery input {
  margin: 3px;
  padding: 3px;
}

@media (max-width: 1129px) {
  .content .shoppingCart {
    width: 85%;
  }
  .product {
    width: auto;
  }
  .el-dialog {
    width: 400px;
  }
}
@media (max-width: 679px) {
  .product img {
    display: none;
  }
}
</style>
