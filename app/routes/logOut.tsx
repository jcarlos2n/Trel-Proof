import { logOutAndClearCookie } from "~/auth/auth";

export async function action() {
  return await logOutAndClearCookie();
}