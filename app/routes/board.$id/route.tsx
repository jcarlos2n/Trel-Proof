import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { requireAuthCookie } from "~/auth/auth";
import { badRequest, notFound } from "~/http/bad-request";
import { createColumn, createSubTask, createTask, deleteSubTask, deleteTask, getBoardData, updateColumnName, updateTask } from "./queries";
import { useLoaderData } from "@remix-run/react";
import { NewColumn } from "./newColumn";
import { useRef } from "react";
import { Column } from "./column";

interface TaskData {
    id?: string;
    columnId: string;
    order: number;
    title: string;
    priority: number;
    content: string;
}

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
    let subTaskTitle = String(formData.get("subTaskTitle"));
    let subTaskContent = String(formData.get("subTaskContent"));
    let subTaskId = String(formData.get("subTaskId"))
    console.log("SWITCH -> ", intent);
    switch (intent) {

        case "createColumn": {
            console.log("create COLUMN")
            if (!columnName) throw badRequest("Bad request");
            await createColumn(boardId, columnName, userId);
            return { ok: true };
        }

        case "updateColumn": {
            console.log("update column")
            if (!columnId) throw badRequest("Missing boardId");
            await updateColumnName(columnId, columnName, userId);
            return { ok: true };
        }

        case "moveTask": {
            console.log("UPDATE")
            if (!columnId) throw badRequest("Missing columnId");
            await updateTask( taskId, columnId, orderTask, titleTask, priority, contentTask, userId);
            return { ok: true };
        }


        case "createTask": {
            console.log("create TASK")
            if (!columnId || !boardId) throw badRequest("Missing boardId or columnId");
            await createTask( boardId, columnId, orderTask, titleTask, priority, contentTask, userId);
            return { ok: true };
        }

        case "deleteTask": {
            console.log("Delete TASK")
            if (!taskId || !userId) throw badRequest("Missing taskId or userId");
            await deleteTask(taskId, userId);
            return { ok: true };
        }

        case "createSubTask": {
            console.log("CREATE")
            if (!taskId) throw badRequest("Missing taskId");
            await createSubTask(taskId, subTaskTitle, subTaskContent);
            return { ok: true };
        }

        case "deleteSubTask": {
            console.log("Delete")
            if (!subTaskId) throw badRequest("Missing subTaskId");
            await deleteSubTask(subTaskId);
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

    let scrollContainerRef = useRef<HTMLDivElement>(null);
    function scrollRight() {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
        } else {
            console.error("No scroll container");
        }
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: board.color }}>
            <h1 className="text-slate-700 text-4xl underline pl-6 pb-4">{board.name}</h1>
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