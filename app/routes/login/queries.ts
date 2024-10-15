import crypto from "crypto";
import { prisma } from "~/db/prisma";

export async function loginUser(email: string, password: string) {
  let user = await prisma.user.findUnique({
    where: { email: email },
    include: { Password: true },
  });

  if (!user || !user.Password) {
    return false;
  }

  let hash = crypto
    .pbkdf2Sync(password, user.Password.salt, 1000, 64, "sha256")
    .toString("hex");

  if (hash !== user.Password.hash) {
    return false;
  }
  return user.id;
}