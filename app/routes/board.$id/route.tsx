import { LoaderFunctionArgs } from "@remix-run/node";
import { requireAuthCookie } from "~/auth/auth";
import { notFound } from "~/http/bad-request";
import { getBoardData } from "./queries";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request, params }: LoaderFunctionArgs) {
    let userId = await requireAuthCookie(request);

    let boardId = Number(params.id);
    if (!boardId) {
        throw new Error("Missing board ID");
    }
    let board = await getBoardData(boardId, userId);
    if (!board) throw notFound();

    return { board };
}

export default function Board() {
    let { board } = useLoaderData<typeof loader>();
    // let getTaskById = new Map(board.Task.map(task) => [task.id, task])
    return (
        <div className="h-full">
            <h1>Board</h1>
            <div>{board.name}</div>
        </div>
    );
}