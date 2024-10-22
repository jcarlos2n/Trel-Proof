import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { requireAuthCookie } from "~/auth/auth";
import { createBoard, deleteBoard, getBoardData } from "./queries";
import { Label, LabeledInput } from "~/components/input";
import { Button } from "~/components/button";
import { badRequest } from "~/http/bad-request";
import Board from "~/components/board";


export async function loader({ request }: LoaderFunctionArgs) {
  let userId = await requireAuthCookie(request);
  if (!userId) {
    return redirect("/")
  }
  let boards = await getBoardData(userId);
  return { boards };
}

export async function action({ request }: ActionFunctionArgs) {
  let userId = await requireAuthCookie(request);
  let formData = await request.formData();
  let intent = String(formData.get("intent"));

  switch (intent) {
    case "createBoard": {
      let name = String(formData.get("name") || "");
      let color = String(formData.get("color") || "");
      if (!name) throw badRequest("Bad request");
      let board = await createBoard(userId, name, color);
      return redirect(`/board/${board.id}`);
    }
    case "deleteBoard": {
      let boardId = formData.get("boardId");
      if (!boardId) throw badRequest("Missing boardId");
      await deleteBoard(Number(boardId), userId);
      return { ok: true };
    }
    default: {
      throw badRequest(`Unknown intent: ${intent}`);
    }
  }
}

export default function home() {
  return (
    <div className="h-full bg-slate-900">
      <CreateBoard />
      <Boards />
    </div>
  );
}



function Boards() {
  let { boards } = useLoaderData<typeof loader>();

  return (
    <div className="p-8">
      <h2 className="font-bold mb-2 text-xl">Boards</h2>
      <nav className="flex flex-wrap gap-8">
        {boards.map((board) => (
          <Board
            key={board.id}
            name={board.name}
            id={board.id}
            color={board.color}
          />
        ))}
      </nav>
    </div>
  );

}

function CreateBoard() {
  let navigation = useNavigation();
  let isCreating = navigation.formData?.get("intent") === "createBoard";

  return (
    <Form method="post" className="p-8 max-w-md">
      <input type="hidden" name="intent" value="createBoard" />
      <div>
        <h2 className="font-bold mb-2 text-xl">Crear nuevo tablero</h2>
        <LabeledInput label="Name" name="name" type="text" required />
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Label htmlFor="board-color">Color</Label>
          <input
            id="board-color"
            name="color"
            type="color"
            defaultValue="#cbd5e1"
            className="bg-transparent"
          />
        </div>
        <Button type="submit">{isCreating ? "Creating..." : "Create"}</Button>
      </div>
    </Form>
  );
}