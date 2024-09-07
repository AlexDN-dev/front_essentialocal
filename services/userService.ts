import Cookies from "js-cookie";

const config = useRuntimeConfig();
const serverAddress = config.public.serverAddress;

interface LoginResponse {
  token: string;
  type?: string;
  name?: string;
  abilities?: string[];
  lastUsedAt?: string | null;
  expiresAt?: string;
}

export const registerUser = async (user: Object) => {
  const response = await $fetch(serverAddress + `/auth/register`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const loginUser = async (user: Object) => {
  const response = await $fetch<LoginResponse>(serverAddress + `/auth/login`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });
  Cookies.set("authToken", response.token, { expires: 30, secure: true });
  return response;
};

export const getUser = async () => {
  const token = Cookies.get("authToken");
  if (token) {
    const response = await $fetch<LoginResponse>(serverAddress + `/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } else {
    throw new Error("Il faut être connecté pour effectuer cette action.");
  }
};
