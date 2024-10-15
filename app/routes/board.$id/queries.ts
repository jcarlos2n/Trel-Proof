import { prisma } from "~/db/prisma";

export function deleteCard(id: string, ownerId: string) {
  return prisma.task.delete({ where: { id, Board: { ownerId } } });
}

export async function getBoardData(boardId: number, userId: string) {
  return prisma.board.findUnique({
    where: {
      id: boardId,
      ownerId: userId,
    },
    include: {
      tasks: true,
      columns: { orderBy: { order: "asc" } },
    },
  });
}

export async function updateBoardName(
  boardId: number,
  name: string,
  ownerId: string,
) {
  return prisma.board.update({
    where: { id: boardId, ownerId: ownerId },
    data: { name },
  });
}

export function upsertItem(
    id: string | null,
    boardId: number,
    columnId: string,
    order: number,
    title: string,
    priority: number,
    content: string | null,
    ownerId: string,
  ) {
    return prisma.task.upsert({
      where: {
        id: id || undefined,
        Board: {
          ownerId,
        },
      },
      create: {
        boardId,
        columnId,
        order,
        title,
        priority,
        content
      },
      update: {
        boardId,
        columnId,
        order,
        title,
        priority,
        content
      },
    });
  }

export async function updateColumnName(
  id: string,
  name: string,
  ownerId: string,
) {
  return prisma.column.update({
    where: { id, Board: { ownerId } },
    data: { name },
  });
}

export async function createColumn(
  boardId: number,
  name: string,
  id: string,
  ownerId: string,
) {
  let columnCount = await prisma.column.count({
    where: { boardId, Board: { ownerId } },
  });
  return prisma.column.create({
    data: {
      id,
      boardId,
      name,
      order: columnCount + 1,
    },
  });
}