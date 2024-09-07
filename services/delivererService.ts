import Cookies from "js-cookie";

const config = useRuntimeConfig();
const serverAddress = config.public.serverAddress;

export const linkDeliverer = async (identificator: string) => {
  const response = await $fetch(serverAddress + `/orders/linkDeliverer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      identificator: identificator,
    },
  });
  return response;
};
export const setDeliverer = async (identificator: string, userId: number) => {
  const response = await $fetch(serverAddress + `/orders/setDeliverer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      identificator: identificator,
      userId: userId,
    },
  });
  return response;
};
