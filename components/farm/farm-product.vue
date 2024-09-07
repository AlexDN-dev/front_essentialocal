<script setup>
import { computed, ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../../services/productService";

const search = ref("");
const products = ref([]);
const variantes = ref([]);
const dialog = ref(false);
const selectedProduct = ref({
  id: "",
  name: "",
  desc: "",
  keywords: "",
  category: "",
  image: null,
});
const productVariantes = ref([
  { weight: "", price: "", stock: "" },
  { weight: "", price: "", stock: "" },
  { weight: "", price: "", stock: "" },
]);

const fileInput = ref(null);

const options = [
  {
    value: "Fruit",
    label: "Fruit",
  },
  {
    value: "Légume",
    label: "Légume",
  },
  {
    value: "Viande",
    label: "Viande",
  },
  {
    value: "Produit laitier",
    label: "Produit laitier",
  },
  {
    value: "Autre",
    label: "Autre",
  },
];

const validateWeight = (weight) => {
  const regex = /^[0-9]+(g|kg|litre)$/;
  return regex.test(weight);
};

onMounted(async () => {
  try {
    const data = await getProducts();
    products.value = data.product;
    variantes.value = data.variante;
  } catch (error) {
    console.error("Failed to load farms:", error);
  }
});

const handleImageChange = (event) => {
  const target = event.target;
  if (target.files && target.files[0]) {
    selectedProduct.value.image = target.files[0];
  }
};

const handleAddProduct = async () => {
  let response;

  // Validation des champs de poids
  for (const variant of productVariantes.value) {
    if (variant.weight && !validateWeight(variant.weight)) {
      ElMessage({
        message:
          "Le poids doit inclure une unité de mesure valide (g, kg ou litre).",
        type: "error",
        grouping: true,
        showClose: true,
      });
      return;
    }
  }

  if (
    selectedProduct.value.name === "" ||
    selectedProduct.value.desc === "" ||
    selectedProduct.value.category === "" ||
    productVariantes.value[0].weight === "" ||
    productVariantes.value[0].price === "" ||
    productVariantes.value[0].stock === ""
  ) {
    ElMessage({
      message:
        "Merci de renseigner au moins une image, un nom, une description, une catégorie et une variante au produit.",
      type: "error",
      grouping: true,
      showClose: true,
    });
    return;
  }
  if (selectedProduct.value.id) {
    response = await updateProduct(selectedProduct.value.id, {
      ...selectedProduct.value,
      variantes: productVariantes.value,
    });
  } else {
    response = await addProduct({
      ...selectedProduct.value,
      variantes: productVariantes.value,
    });
  }
  if (response.status === 400) {
    ElMessage({
      message: response.data.message,
      type: "error",
      grouping: true,
      showClose: true,
    });
  } else {
    ElMessage({
      message: response?.message || "Opération réussie",
      type: "success",
      grouping: true,
      showClose: true,
    });
    resetProductForm();
    dialog.value = false;
    reloadProducts();
  }
};

const resetProductForm = () => {
  selectedProduct.value = {
    id: "",
    name: "",
    desc: "",
    keywords: "",
    category: "",
    image: null,
  };
  productVariantes.value.forEach((variante) => {
    variante.weight = "";
    variante.price = "";
    variante.stock = "";
  });
  if (fileInput.value) {
    fileInput.value.value = ""; // Reset the file input
  }
};

const reloadProducts = async () => {
  try {
    const data = await getProducts();
    products.value = data.product;
    variantes.value = data.variante;
  } catch (error) {
    console.error("Failed to reload products:", error);
  }
};

const preparedData = computed(() => {
  return products.value.map((product) => {
    const productVariantes = variantes.value.filter(
      (variante) => variante.product === product.id
    );
    const variantesDescription = productVariantes
      .map((v) => `${v.weight} - ${v.price}€ - stock: ${v.stock}`)
      .join(", ");
    return {
      ...product,
      variantes: variantesDescription,
    };
  });
});

const filterTableData = computed(() => {
  return preparedData.value.filter((product) => {
    return (
      !search.value ||
      product.name.toLowerCase().includes(search.value.toLowerCase()) ||
      product.desc.toLowerCase().includes(search.value.toLowerCase()) ||
      product.variantes.toLowerCase().includes(search.value.toLowerCase())
    );
  });
});

const deleteProducts = async (row) => {
  await deleteProduct(row.id);
  reloadProducts();
};

// Édition d'un produit existant
const handleEdit = (row) => {
  dialog.value = true;
  selectedProduct.value = {
    id: row.id,
    name: row.name,
    desc: row.desc,
    keywords: row.keywords,
    category: row.category,
    image: null,
  };
  const rowVariantes = variantes.value.filter(
    (variante) => variante.product === row.id
  );
  productVariantes.value.forEach((variant, index) => {
    if (rowVariantes[index]) {
      variant.weight = rowVariantes[index].weight.toString();
      variant.price = rowVariantes[index].price.toString();
      variant.stock = rowVariantes[index].stock.toString();
    } else {
      variant.weight = "";
      variant.price = "";
      variant.stock = "";
    }
  });
};
</script>

<template>
  <div class="container farmProduct">
    <el-button
      @click="dialog = true"
      class="addProductButton colorButton"
      type="primary"
      rounded
    >
      Ajouter un produit
    </el-button>
    <h2>Les produits</h2>
    <el-table :data="filterTableData" style="width: stretch" height="625">
      <el-table-column label="Nom" prop="name" />
      <el-table-column label="Description" prop="desc" />
      <el-table-column label="Variantes" prop="variantes" />
      <el-table-column align="right">
        <template #header>
          <el-input width="100" v-model="search" placeholder="Rechercher" />
        </template>
        <template #default="scope">
          <el-button
            style="margin: 3px"
            size="small"
            @click="handleEdit(scope.row)"
          >
            Modifier
          </el-button>
          <el-button
            @click="deleteProducts(scope.row)"
            style="margin: 3px"
            size="small"
            type="danger"
            plain
          >
            Supprimer
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialog" width="375" @close="resetProductForm">
      <form class="dialogForm" @submit.prevent="handleAddProduct">
        <input
          ref="fileInput"
          type="file"
          name="picture"
          id="picture"
          @change="handleImageChange"
        />
        <input
          v-model="selectedProduct.name"
          type="text"
          placeholder="Nom du produit"
        />
        <input
          v-model="selectedProduct.keywords"
          type="text"
          placeholder="Mot clé"
        />
        <el-select
          v-model="selectedProduct.category"
          placeholder="Catégorie"
          style="width: 258px; height: 34px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <textarea
          v-model="selectedProduct.desc"
          name="desc"
          id="desc"
          placeholder="Description"
        ></textarea>
        <h2>Gestion du produit</h2>
        <span
          >Si vous avez moins de 3 variantes merci de laisser les champs
          vide.</span
        >
        <div v-for="(variant, index) in productVariantes" :key="index">
          <p>Variante {{ index + 1 }}</p>
          <input v-model="variant.weight" type="text" placeholder="Poids" />
          <input v-model="variant.price" type="text" placeholder="Prix" />
          <input v-model="variant.stock" type="text" placeholder="Stock" />
        </div>
        <el-button
          class="colorButton"
          @click="handleAddProduct"
          type="primary"
          size="large"
          rounded
          style="margin-top: 10px"
          >Ajouter le produit</el-button
        >
      </form>
    </el-dialog>
  </div>
</template>

<style scoped>
.farmProduct {
  display: flex;
  flex-direction: column;
  width: 750px;
  position: relative;
}
.addProductButton {
  width: 200px;
  position: absolute;
  left: 25px;
  top: 25px;
}
.tableButton button {
  margin: 2px;
}
.dialogForm {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.dialogForm p {
  font-size: 20px;
  font-weight: 500;
  margin: 20px 0;
  color: black;
}
.dialogForm h2 {
  margin-top: 20px;
  color: black;
}
.dialogForm span {
  margin-bottom: 10px;
  color: black;
}
.dialogForm input {
  margin: 3px;
  padding: 3px;
}
.dialogForm textarea {
  resize: none;
  margin: 3px;
}
.dialogForm div p {
  font-size: 18px;
  font-weight: 400px;
  margin: 5px 0;
}
.addProductDialogButton {
  margin-top: 20px;
}

@media (max-width: 1037px) {
  .farmProduct {
    width: stretch;
  }
}
@media (max-width: 640px) {
  .farmProduct {
    width: stretch;
  }
  .farmProduct h2 {
    display: none;
  }
}
</style>
