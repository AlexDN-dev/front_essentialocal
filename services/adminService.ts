const config = useRuntimeConfig();
const serverAddress = config.public.serverAddress;

export const getAllUsers = async () => {
  const response = await $fetch(serverAddress + `/admin/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};
export const banUser = async (id: number) => {
  console.log(id);
  const response = await $fetch(serverAddress + `/admin/ban`, {
    method: "PUT",
    body: {
      id: id,
    },
  });
  return response;
};
export const unbanUser = async (id: number) => {
  const response = await $fetch(serverAddress + `/admin/unban`, {
    method: "PUT",
    body: {
      id: id,
    },
  });
  return response;
};
export const promoteUser = async (id: number) => {
  const response = await $fetch(serverAddress + `/admin/promote`, {
    method: "PUT",
    body: {
      id: id,
    },
  });
  return response;
};
export const derankUser = async (id: number) => {
  const response = await $fetch(serverAddress + `/admin/derank`, {
    method: "PUT",
    body: {
      id: id,
    },
  });
  return response;
};
export const addDeliverer = async (id: number) => {
  const response = await $fetch(serverAddress + `/admin/addDeliverer`, {
    method: "POST",
    body: {
      id: id,
    },
  });
  return response;
};
export const removeDeliverer = async (id: number) => {
  const response = await $fetch(serverAddress + `/admin/removeDeliverer`, {
    method: "PUT",
    body: {
      id: id,
    },
  });
  return response;
};

// FARMS

export const getAllFarms = async () => {
  const response = await $fetch(serverAddress + `/admin/getFarms`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};
export const removeFarm = async (id: Number) => {
  const response = await $fetch(serverAddress + `/admin/removeFarm/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

//PRODUCTS

export const getAllProducts = async () => {
  const response = await $fetch(serverAddress + `/admin/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};
export const removeProduct = async (id: Number) => {
  const response = await $fetch(serverAddress + `/admin/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

//ORDERS
export const getAllOrders = async () => {
  const response = await $fetch(serverAddress + `/admin/orders`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};
export const getOrderDetails = async (id: Number) => {
  const response = await $fetch(serverAddress + `/admin/orders/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

//SUPPORT
export const getTickets = async () => {
  const response = await $fetch(serverAddress + "/admin/support", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};
export const getMessages = async (id: number) => {
  const response = await $fetch(serverAddress + `/admin/support/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};
export const openTicket = async (id: Number) => {
  const response = await $fetch(serverAddress + `/admin/support/open/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

//REVIEWS
export const getReviews = async () => {
  const response = await $fetch(serverAddress + `/admin/reviews`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};
export const deleteReview = async (id: Number) => {
  const response = await $fetch(serverAddress + `/admin/reviews/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

//STATS
export const getStats = async () => {
  const response = await $fetch(serverAddress + `/admin/stats`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};
