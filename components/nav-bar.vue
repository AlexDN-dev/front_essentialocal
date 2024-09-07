<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCartShopping, faBars } from "@fortawesome/free-solid-svg-icons";

import Cookies from "js-cookie";

const userIsLoggedIn = computed(() => {
  return !!Cookies.get("authToken");
});

const accountLink = computed(() => {
  return userIsLoggedIn.value ? "/profile" : "/auth/login";
});

const searchQuery = ref("");
const router = useRouter();

function handleSubmit() {
  router.push(`/product/search?q=${encodeURIComponent(searchQuery.value)}`);
  searchQuery.value = "";
}

const isOpen = ref(false);

const openBurgerMenu = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <nav>
    <NuxtLink class="essentialocalLogo" to="/">
      <img src="../public/pictures/logo.jpg" alt="" />
    </NuxtLink>
    <FontAwesomeIcon
      style="margin-right: 20px"
      class="burger-icon"
      size="2xl"
      color="#000000"
      :icon="faBars"
      @click="openBurgerMenu"
    />
    <div class="burger-menu" :class="{ 'burger-menu-open': isOpen }">
      <NuxtLink to="/" @click="isOpen = false">
        <p>Accueil</p>
      </NuxtLink>
      <NuxtLink to="/farm/search" @click="isOpen = false">
        <p>Les fermes</p>
      </NuxtLink>
      <NuxtLink to="/products" @click="isOpen = false">
        <p>Les produits</p>
      </NuxtLink>
      <NuxtLink to="/support" @click="isOpen = false">
        <p>Nous contacter</p>
      </NuxtLink>
      <NuxtLink :to="accountLink" @click="isOpen = false">
        <p>Mon compte</p>
      </NuxtLink>
      <NuxtLink
        class="shoppingCart"
        @click="isOpen = false"
        to="/shopping-cart"
      >
        <FontAwesomeIcon size="lg" color="#000000" :icon="faCartShopping" />
      </NuxtLink>
    </div>
  </nav>
</template>

<style scoped>
.nav-button {
  display: flex;
  align-items: center;
}
nav img {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
  height: 100px;
}
nav div {
  display: flex;
}
nav div a {
  margin: 0 10px;
  text-decoration: none;
  font-size: 18px;
  padding: 0 20px;
  color: black;
}
nav div a p {
  margin: 8px 0;
}
nav div a:hover {
  border-radius: 8px;
  background-color: #1fa254;
  color: white;
}
.avatar-icon {
  outline: none;
  color: black;
  border: 2px solid black;
  padding: 5px;
  border-radius: 25px;
}
.dropdown a {
  text-decoration: none;
  color: black;
}
.burger-icon {
  display: none;
}
.searchBar {
  border: 1px solid #1fa254;
  border-radius: 25px;
  padding: 5px;
}
.searchBar input {
  padding: 4px 4px 4px 10px;
  margin-right: 10px;
  border: none;
  font-size: 15px;
  outline: none;
}
.shoppingCart {
  display: flex;
  justify-content: center;
  align-items: center;
}
.shoppingCart:hover svg {
  color: white;
}
@media (max-width: 1162px) {
  .essentialocalLogo {
    display: none;
  }
  nav {
    padding: 10px 10px;
  }
  nav div a {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .searchBar {
    display: flex;
  }
  .searchBar input {
    width: 250px;
  }
}
@media (max-width: 947px) {
  .burger-icon {
    display: block;
    position: absolute;
    right: 0;
    top: 30px;
  }
  nav {
    justify-content: space-between;
    padding: 15px;
    align-items: center;
    height: 60px;
  }
  .avatar-icon {
    margin-left: 20px;
  }
  .burger-menu {
    position: absolute;
    background-color: white;
    flex-direction: column;
    align-items: center;
    left: 0;
    top: -900px;
    width: 100%;
  }
  .burger-menu-open {
    top: 90px;
    z-index: 9999;
  }
  .shoppingCart {
    margin: 10px 0;
    height: 65px;
  }
  nav div a p {
    margin: 8px 0;
    padding: 2px 0;
  }
  .searchBar input {
    width: 200px;
  }
}
</style>
