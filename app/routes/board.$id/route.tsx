import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { requireAuthCookie } from "~/auth/auth";
import { badRequest, notFound } from "~/http/bad-request";
import { createColumn, createOrUpdateTask, deleteTask, getBoardData, updateColumnName } from "./queries";
import { useLoaderData } from "@remix-run/react";
import { NewColumn } from "./newColumn";
import { useRef } from "react";
import { Column } from "./column";

export async function action({ request }: ActionFunctionArgs) {
    let userId = await requireAuthCookie(request);
    let formData = await request.formData();
    let intent = String(formData.get("intent"));
    let boardId = Number(formData.get("boardId"));
    let columnId = String(formData.get("columnId"));
    let columnName = String(formData.get("name"));
    let taskId = String(formData.get("taskId"));
    let orderTask = Number(formData.get("order"));
    let titleTask = String(formData.get("title"));
    let priority = Number(formData.get('priority'));
    let contentTask = String(formData.get("content"));

    switch (intent) {
    
        case "createColumn": {
            let name = String(formData.get("name") || "");
            if (!name) throw badRequest("Bad request");
            await createColumn(boardId, name, userId);
            return { ok: true };
        }

        case "updateColumn": {
            if (!columnId) throw badRequest("Missing boardId");
            await updateColumnName(columnId, columnName, userId);
            return { ok: true };
        }

        case "createTask": {
            if (!columnId || !boardId) throw badRequest("Missing boardId or columnId");
            await createOrUpdateTask(taskId,boardId,columnId,orderTask,titleTask,priority,contentTask,userId);
            return { ok: true };
        }

        case "deleteTask": {
            if (!taskId || !userId) throw badRequest("Missing taskId or userId");
            await deleteTask(taskId, userId);
            return { ok: true };
        }

        default: {
            throw badRequest(`Unknown intent: ${intent}`);
        }
    }
}

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

    let scrollContainerRef = useRef<HTMLDivElement>(null);
    function scrollRight() {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
        } else {
            console.error("No scroll container");
        }
    }

    return (
        <div className="h-full" style={{ backgroundColor: board.color }}>
            <h1>{board.name}</h1>
            <div className="flex flex-grow min-h-0 h-full items-start gap-4 px-8 pb-4">
                {board.columns.map((column: any) => {
                    return (
                        <Column
                            boardId={board.id}
                            name={column.name}
                            columnId={column.id}
                            tasks={column.tasks}
                        />
                    );
                })}

                <NewColumn
                    boardId={board.id}
                    onAdd={scrollRight}
                    editInitially={board.columns.length === 0}
                />

                <div data-lol className="w-8 h-1 flex-shrink-0" />
            </div>
        </div>
    );
}