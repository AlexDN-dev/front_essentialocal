import Cookies from "js-cookie";

const config = useRuntimeConfig();
const serverAddress = config.public.serverAddress;

const authMiddleware = async () => {
  const token = Cookies.get("authToken");
  if (!token) {
    return navigateTo("/auth/login");
  }

  try {
    const response = await fetch(serverAddress + `/auth/validateToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Token validation failed");
    }

    const data = await response.json();

    if (!data.valid) {
      throw new Error("Token is not valid");
    }
  } catch (error) {
    Cookies.remove("authToken");
    return navigateTo("/auth/login");
  }
};

export default authMiddleware;
