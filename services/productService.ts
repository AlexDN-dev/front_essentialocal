import Cookies from "js-cookie";

interface ApiResponse {
  message: string;
}

const config = useRuntimeConfig();
const serverAddress = config.public.serverAddress;

export const addProduct = async (product: any) => {
  const formData = new FormData();
  for (const key in product) {
    if (key !== "image" && product[key] != null) {
      formData.append(key, JSON.stringify(product[key])); // Pour les objets et tableaux
    } else if (key === "image" && product[key] != null) {
      formData.append("image", product[key]);
    }
  }

  const token = Cookies.get("authToken");
  if (token) {
    try {
      const response = await $fetch<ApiResponse>(
        serverAddress + `/product/add`,
        {
          method: "POST",
          body: formData, // Envoyer FormData
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (e) {
      return e;
    }
  }
};

export const getProducts = async () => {
  const token = Cookies.get("authToken");
  if (token) {
    const response = await $fetch(serverAddress + `/product/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
};

export const updateProduct = async (id: number, product: any) => {
  const formData = new FormData();
  for (const key in product) {
    if (key === "variantes" && product[key] != null) {
      formData.append(key, JSON.stringify(product[key]));
    } else if (key === "image" && product[key] instanceof File) {
      formData.append(key, product[key], product[key].name);
    } else if (key !== "image") {
      formData.append(key, product[key]);
    }
  }

  const token = Cookies.get("authToken");
  if (token) {
    const response = await $fetch<ApiResponse>(
      serverAddress + `/product/update/${id}`,
      {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } else {
    throw new Error("No authentication token available.");
  }
};

export const searchProduct = async (query = "", selectedCategories = []) => {
  const response = await $fetch<ApiResponse>(
    serverAddress + `/product/search/filter`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        query: query,
        categories: selectedCategories.join(","), // Convertir le tableau en une chaîne séparée par des virgules
      },
    }
  );
  return response;
};

export const getProductDetails = async (id: number) => {
  const response = await $fetch<ApiResponse>(serverAddress + `/product/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const deleteProduct = async (id: number) => {
  const token = Cookies.get("authToken");
  if (token) {
    const response = await $fetch<ApiResponse>(
      serverAddress + `/product/delete/${id}`,
      {
        method: "PUT",
        body: {
          productId: id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } else {
    throw new Error("No authentication token available.");
  }
};

export const getProductSuggestion = async (id: number) => {
  const response = await $fetch<ApiResponse>(
    serverAddress + `/product/suggestion/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};
