import { prisma } from "~/db/prisma";
import crypto from 'crypto';

export async function accountExists(email: string) {
  let user = await prisma.user.findUnique({
    where: { email: email },
    select: { id: true },
  });

  return Boolean(user);
}

export async function createUser(email: string, password: string) {
  
  let salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha256").toString("hex");

  return prisma.user.create({
    data: {
      email: email,
      Password: {
        create: { hash: hash, salt: salt },
      },
    }
  });
}

export async function emailExists(email: string) {
  let user = await prisma.user.findUnique({
    where: { email: email },
    select: { id: true },
  });

  return Boolean(user);
}