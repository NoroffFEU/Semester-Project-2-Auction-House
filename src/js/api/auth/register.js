import { API_AUTH_REGISTER } from "../../constants/endpoints.js";
import { headers } from "../../constants/header.js";

export async function registerUser(payload) {
  const res = await fetch(API_AUTH_REGISTER, {
    method: "POST",
    headers: headers({ auth: false }), // no Bearer on register
    body: JSON.stringify(payload),
  });

  const result = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(result?.errors?.[0]?.message || "Registration failed");
  }

  // Unwrap { data: {...} } if present
  return result?.data ?? result;
}
