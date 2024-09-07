import Cookies from "js-cookie";

const config = useRuntimeConfig();
const serverAddress = config.public.serverAddress;

export const getTickets = async () => {
  const token = Cookies.get("authToken");
  if (token) {
    const response = await $fetch(serverAddress + `/support/tickets`, {
      method: "GET",
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
export const createTickets = async (ticket: Object) => {
  const token = Cookies.get("authToken");
  if (token) {
    const response = await $fetch(serverAddress + `/support/create`, {
      method: "POST",
      body: JSON.stringify(ticket),
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
export const getMessages = async (id: number) => {
  const token = Cookies.get("authToken");
  if (token) {
    const response = await $fetch(serverAddress + `/support/message/${id}`, {
      method: "GET",
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

export const closeTicket = async (id: number) => {
  const token = Cookies.get("authToken");
  if (token) {
    const response = await $fetch(serverAddress + `/support/close/${id}`, {
      method: "PUT",
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

export const sendMessage = async (ticket: Object) => {
  console.log(ticket);
  const token = Cookies.get("authToken");
  if (token) {
    const response = await $fetch(serverAddress + `/support/message`, {
      method: "POST",
      body: JSON.stringify(ticket),
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
