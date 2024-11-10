import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
  if (!token) {
    return true;
  }

  try {
    const decoded = jwtDecode(token);
    const now = Date.now()
    return decoded.date < now;
  } catch (error) {
    return true;
  }
};
