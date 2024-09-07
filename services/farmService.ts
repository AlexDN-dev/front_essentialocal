import Cookies from "js-cookie";

const config = useRuntimeConfig();
const serverAddress = config.public.serverAddress;

export const farmRequest = async (farm: Object) => {
  const token = Cookies.get("authToken");
  if (token) {
    const response = await $fetch(serverAddress + `/farm/add`, {
      method: "POST",
      body: JSON.stringify(farm),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } else {
    return "Il faut être connecté pour effectuer cette action.";
  }
};
export const getAllFarm = async () => {
  const response = await $fetch(serverAddress + `/farm/getAll`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const searchFarm = async (city: String) => {
  const response = await $fetch(serverAddress + `/farm/search`, {
    method: "POST",
    body: JSON.stringify({ city }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const getFarm = async (id: number) => {
  const response = await $fetch(serverAddress + `/farm/getFarm/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const farmParams = async () => {
  const token = Cookies.get("authToken");
  if (token) {
    const response = await $fetch(serverAddress + `/farm/params`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } else {
    return "Vous n'avez pas de ferme.";
  }
};

export const updateFarm = async (formData: FormData, token: string) => {
  try {
    const response = await $fetch(serverAddress + "/farm/update", {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (e) {
    console.error("Error updating farm:", e);
    throw e;
  }
};
export const addFarmReview = async (review: Object) => {
  const token = Cookies.get("authToken");
  console.log(review);
  if (token) {
    const response = await $fetch(serverAddress + `/farmReview/add`, {
      method: "POST",
      body: JSON.stringify(review),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } else {
    return "Il faut être connecté pour effectuer cette action.";
  }
};
export const getFarmReview = async (farm: Number) => {
  console.log(farm);
  const response = await $fetch(serverAddress + `/farmReview/${farm}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};
export const reportFarmReview = async (id: Number) => {
  const response = await $fetch(serverAddress + `/farmReview/report/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const getStats = async (stat: number) => {
  const token = Cookies.get("authToken");
  if (token) {
    const response = await $fetch(serverAddress + `/farm/stats/${stat}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } else {
    return "Vous n'avez pas de ferme.";
  }
};
