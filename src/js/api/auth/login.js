import { API_AUTH_LOGIN } from "../../constants/endpoints.js";
import { headers } from "../../constants/header.js";

export async function loginUser(userInfo) {
  const res = await fetch(API_AUTH_LOGIN, {
    method: "POST",
    headers: headers(false, true),
    body: JSON.stringify(userInfo),
  });

  const raw = await res.text();
  let result;
  try {
    result = JSON.parse(raw);
  } catch {
    result = { raw };
  }

  if (!res.ok) {
    throw new Error(
      result?.errors?.[0]?.message || `Login failed (${res.status})`
    );
  }

  const data = result?.data ?? result;
  if (!data?.accessToken)
    throw new Error("Server did not return an access token.");

  return data;
}
