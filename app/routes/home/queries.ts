import { prisma } from "~/db/prisma";

export async function deleteBoard(boardId: number, ownerId: string) {
  return prisma.board.delete({
    where: { id: boardId, ownerId: ownerId },
  });
}

export async function createBoard(ownerId: string, name: string, color: string) {
  return prisma.board.create({
    data: {
      name,
      color,
      owner: {
        connect: {
          id: ownerId,
        },
      },
    },
  });
}

export async function getBoardData(ownerId: string) {
  return prisma.board.findMany({
    where: {
      ownerId: ownerId,
    },
  });
}